"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

interface Props {
  symbol: string; // e.g. "BTCUSDT"
}

declare global {
  interface Window {
    TradingView: {
      widget: new (config: Record<string, unknown>) => unknown;
    };
  }
}

export function TradingViewChart({ symbol }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  function initWidget() {
    if (!containerRef.current || !window.TradingView) return;
    containerRef.current.innerHTML = "";
    new window.TradingView.widget({
      autosize: true,
      symbol: `BINANCE:${symbol}`,
      interval: "15",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      toolbar_bg: "#16171B",
      enable_publishing: false,
      allow_symbol_change: false,
      container_id: containerRef.current.id,
      hide_side_toolbar: false,
      backgroundColor: "#0B0C0E",
      gridColor: "rgba(37,41,48,0.5)",
    });
  }

  useEffect(() => {
    if (window.TradingView) {
      initWidget();
    }
  }, [symbol]);

  return (
    <>
      <Script
        src="https://s3.tradingview.com/tv.js"
        strategy="lazyOnload"
        onLoad={initWidget}
      />
      <div
        ref={containerRef}
        id={`tv-chart-${symbol}`}
        className="w-full h-full min-h-[400px]"
      />
    </>
  );
}
