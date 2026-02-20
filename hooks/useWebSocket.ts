"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { ConnectionState } from "@/types/market";

const MAX_ATTEMPTS = 5;
const BASE_DELAY_MS = 1000;
const MAX_DELAY_MS = 30_000;

interface UseWebSocketOptions<T> {
  url: string;
  onMessage: (data: T) => void;
  fallbackPollFn?: () => Promise<void>;
  fallbackInterval?: number;
  enabled?: boolean;
}

export function useWebSocket<T>({
  url,
  onMessage,
  fallbackPollFn,
  fallbackInterval = 10_000,
  enabled = true,
}: UseWebSocketOptions<T>) {
  const [connectionState, setConnectionState] = useState<ConnectionState>("connecting");
  const wsRef = useRef<WebSocket | null>(null);
  const attemptsRef = useRef(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedRef = useRef(true);

  const stopPolling = useCallback(() => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }, []);

  const startPolling = useCallback(() => {
    if (!fallbackPollFn || pollTimerRef.current) return;
    setConnectionState("polling_fallback");
    fallbackPollFn(); // immediate first call
    pollTimerRef.current = setInterval(fallbackPollFn, fallbackInterval);
  }, [fallbackPollFn, fallbackInterval]);

  const connect = useCallback(() => {
    if (!mountedRef.current || !enabled) return;

    if (wsRef.current) {
      wsRef.current.onopen = null;
      wsRef.current.onmessage = null;
      wsRef.current.onerror = null;
      wsRef.current.onclose = null;
      wsRef.current.close();
      wsRef.current = null;
    }

    setConnectionState(attemptsRef.current === 0 ? "connecting" : "reconnecting");

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!mountedRef.current) return;
        attemptsRef.current = 0;
        setConnectionState("open");
        stopPolling();
      };

      ws.onmessage = (event) => {
        if (!mountedRef.current) return;
        try {
          const data: T = JSON.parse(event.data);
          onMessage(data);
        } catch {
          // ignore parse errors
        }
      };

      ws.onerror = () => {
        // onclose will always follow onerror
      };

      ws.onclose = () => {
        if (!mountedRef.current) return;
        attemptsRef.current += 1;

        if (attemptsRef.current >= MAX_ATTEMPTS) {
          setConnectionState("polling_fallback");
          startPolling();
          return;
        }

        const jitter = Math.floor(Math.random() * 1000) - 500;
        const delay = Math.min(BASE_DELAY_MS * 2 ** (attemptsRef.current - 1), MAX_DELAY_MS) + jitter;

        setConnectionState("reconnecting");
        reconnectTimerRef.current = setTimeout(connect, delay);
      };
    } catch {
      attemptsRef.current += 1;
      if (attemptsRef.current >= MAX_ATTEMPTS) {
        startPolling();
      } else {
        const delay = Math.min(BASE_DELAY_MS * 2 ** (attemptsRef.current - 1), MAX_DELAY_MS);
        reconnectTimerRef.current = setTimeout(connect, delay);
      }
    }
  }, [url, enabled, onMessage, startPolling, stopPolling]);

  useEffect(() => {
    mountedRef.current = true;
    attemptsRef.current = 0;

    if (enabled) {
      connect();
    }

    return () => {
      mountedRef.current = false;
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      stopPolling();
      if (wsRef.current) {
        wsRef.current.onopen = null;
        wsRef.current.onmessage = null;
        wsRef.current.onerror = null;
        wsRef.current.onclose = null;
        wsRef.current.close();
      }
    };
  }, [url, enabled]); // re-run only when url or enabled changes

  return { connectionState };
}
