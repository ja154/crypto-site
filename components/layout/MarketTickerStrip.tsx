"use client";

import { useMarketData } from "@/hooks/useMarketData";
import { formatPrice, formatPercent, priceClass } from "@/lib/utils";
import { formatSymbol } from "@/lib/binance/symbols";
import Link from "next/link";

export function MarketTickerStrip() {
  const { pairs } = useMarketData();

  if (!pairs.length) return null;

  const items = [...pairs, ...pairs]; // duplicate for seamless loop

  return (
    <div className="overflow-hidden border-b border-brand-border bg-brand-surface/60 py-2">
      <div className="ticker-strip flex gap-8 whitespace-nowrap w-max">
        {items.map((pair, i) => (
          <Link
            key={`${pair.symbol}-${i}`}
            href={`/trade/${pair.symbol}`}
            className="inline-flex items-center gap-2 text-sm hover:opacity-80"
          >
            <span className="font-medium">{formatSymbol(pair.symbol)}</span>
            <span>{formatPrice(pair.lastPrice)}</span>
            <span className={priceClass(pair.priceChangePercent)}>
              {formatPercent(pair.priceChangePercent)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
