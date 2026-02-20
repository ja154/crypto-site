"use client";

import { useState, useCallback } from "react";
import useSWR from "swr";
import { useWebSocket } from "./useWebSocket";
import { BINANCE_WS_BASE } from "@/lib/binance/symbols";
import type { OrderBook, ConnectionState } from "@/types/market";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface WsDepthUpdate {
  lastUpdateId: number;
  bids: [string, string][];
  asks: [string, string][];
}

export function useOrderBook(symbol: string) {
  const [wsData, setWsData] = useState<OrderBook | null>(null);
  const [wsActive, setWsActive] = useState(false);

  const { data: restData } = useSWR<OrderBook>(
    !wsActive ? `/api/market/orderbook/${symbol}` : null,
    fetcher,
    { refreshInterval: 3_000 }
  );

  const handleMessage = useCallback((update: WsDepthUpdate) => {
    setWsActive(true);
    setWsData({
      lastUpdateId: update.lastUpdateId,
      bids: update.bids,
      asks: update.asks,
    });
  }, []);

  const fallbackPollFn = useCallback(async () => {
    setWsActive(false);
  }, []);

  const { connectionState } = useWebSocket<WsDepthUpdate>({
    url: `${BINANCE_WS_BASE}/ws/${symbol.toLowerCase()}@depth20@100ms`,
    onMessage: handleMessage,
    fallbackPollFn,
    fallbackInterval: 3_000,
  });

  const orderBook = wsActive ? wsData : restData ?? null;
  return { orderBook, connectionState };
}
