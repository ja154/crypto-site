"use client";

import { useState, useCallback } from "react";
import useSWR from "swr";
import { useWebSocket } from "./useWebSocket";
import { BINANCE_WS_BASE } from "@/lib/binance/symbols";
import type { BinanceTrade, BinanceWsTrade, ConnectionState } from "@/types/market";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useTrades(symbol: string) {
  const [wsTrades, setWsTrades] = useState<BinanceTrade[]>([]);
  const [wsActive, setWsActive] = useState(false);

  const { data: restData } = useSWR<BinanceTrade[]>(
    !wsActive ? `/api/market/trades/${symbol}` : null,
    fetcher,
    { refreshInterval: 5_000 }
  );

  const handleMessage = useCallback((trade: BinanceWsTrade) => {
    setWsActive(true);
    setWsTrades((prev) => {
      const newTrade: BinanceTrade = {
        id: trade.t,
        price: trade.p,
        qty: trade.q,
        quoteQty: (parseFloat(trade.p) * parseFloat(trade.q)).toFixed(8),
        time: trade.T,
        isBuyerMaker: trade.m,
        isBestMatch: trade.M,
      };
      return [newTrade, ...prev].slice(0, 50);
    });
  }, []);

  const fallbackPollFn = useCallback(async () => {
    setWsActive(false);
  }, []);

  const { connectionState } = useWebSocket<BinanceWsTrade>({
    url: `${BINANCE_WS_BASE}/ws/${symbol.toLowerCase()}@trade`,
    onMessage: handleMessage,
    fallbackPollFn,
    fallbackInterval: 5_000,
  });

  const trades = wsActive ? wsTrades : restData ?? [];
  return { trades, connectionState };
}
