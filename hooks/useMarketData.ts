"use client";

import { useState, useCallback } from "react";
import useSWR from "swr";
import { useWebSocket } from "./useWebSocket";
import { BINANCE_WS_BASE } from "@/lib/binance/symbols";
import type { BinanceMiniTicker, MarketPair, ConnectionState } from "@/types/market";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useMarketData() {
  const [wsData, setWsData] = useState<Map<string, MarketPair>>(new Map());
  const [wsActive, setWsActive] = useState(false);

  // Polling fallback via SWR — only active when WS is unavailable
  const { data: restData, isLoading } = useSWR<MarketPair[]>(
    !wsActive ? "/api/market/pairs" : null,
    fetcher,
    { refreshInterval: 30_000, revalidateOnFocus: true }
  );

  const handleMessage = useCallback((messages: BinanceMiniTicker[]) => {
    setWsActive(true);
    setWsData((prev) => {
      const next = new Map(prev);
      messages.forEach((t) => {
        next.set(t.s, {
          symbol: t.s,
          lastPrice: t.c,
          priceChangePercent: (
            ((parseFloat(t.c) - parseFloat(t.o)) / parseFloat(t.o)) * 100
          ).toFixed(2),
          highPrice: t.h,
          lowPrice: t.l,
          volume: t.v,
          quoteVolume: t.q,
        });
      });
      return next;
    });
  }, []);

  const fallbackPollFn = useCallback(async () => {
    setWsActive(false);
  }, []);

  const { connectionState } = useWebSocket<BinanceMiniTicker[]>({
    url: `${BINANCE_WS_BASE}/ws/!miniTicker@arr`,
    onMessage: handleMessage,
    fallbackPollFn,
    fallbackInterval: 30_000,
  });

  const pairs: MarketPair[] = wsActive
    ? Array.from(wsData.values())
    : restData ?? [];

  return { pairs, connectionState, isLoading: isLoading && !wsActive };
}

export function useTickerData(symbol: string) {
  const [wsData, setWsData] = useState<MarketPair | null>(null);
  const [wsActive, setWsActive] = useState(false);

  const { data: restData } = useSWR<MarketPair>(
    !wsActive ? `/api/market/ticker/${symbol}` : null,
    fetcher,
    { refreshInterval: 5_000 }
  );

  const handleMessage = useCallback((ticker: { c: string; P: string; h: string; l: string; v: string; q: string; o: string }) => {
    setWsActive(true);
    setWsData({
      symbol,
      lastPrice: ticker.c,
      priceChangePercent: ticker.P,
      highPrice: ticker.h,
      lowPrice: ticker.l,
      volume: ticker.v,
      quoteVolume: ticker.q,
    });
  }, [symbol]);

  const fallbackPollFn = useCallback(async () => {
    setWsActive(false);
  }, []);

  const { connectionState } = useWebSocket<{ c: string; P: string; h: string; l: string; v: string; q: string; o: string }>({
    url: `${BINANCE_WS_BASE}/ws/${symbol.toLowerCase()}@ticker`,
    onMessage: handleMessage,
    fallbackPollFn,
    fallbackInterval: 5_000,
  });

  const ticker = wsActive ? wsData : restData ?? null;
  return { ticker, connectionState };
}
