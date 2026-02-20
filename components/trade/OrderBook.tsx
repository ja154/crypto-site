"use client";

import { useOrderBook } from "@/hooks/useOrderBook";
import { ConnectionStatus } from "@/components/layout/ConnectionStatus";
import { formatPrice } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  symbol: string;
}

export function OrderBook({ symbol }: Props) {
  const { orderBook, connectionState } = useOrderBook(symbol);

  const maxQty = orderBook
    ? Math.max(
        ...orderBook.bids.slice(0, 12).map(([, q]) => parseFloat(q)),
        ...orderBook.asks.slice(0, 12).map(([, q]) => parseFloat(q))
      )
    : 1;

  function DepthBar({
    side,
    qty,
  }: {
    side: "bid" | "ask";
    qty: number;
  }) {
    const pct = Math.min((qty / maxQty) * 100, 100);
    return (
      <div
        className="absolute inset-y-0 right-0 opacity-15 pointer-events-none"
        style={{
          width: `${pct}%`,
          backgroundColor: side === "bid" ? "#0ECB81" : "#F6465D",
        }}
      />
    );
  }

  if (!orderBook) {
    return (
      <div className="space-y-1">
        {Array.from({ length: 20 }).map((_, i) => (
          <Skeleton key={i} className="h-5 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="text-xs">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-muted-foreground font-medium text-[11px]">Order Book</span>
        <ConnectionStatus state={connectionState} />
      </div>

      {/* Header */}
      <div className="grid grid-cols-2 text-muted-foreground px-1 pb-1 text-[11px]">
        <span>Price (USDT)</span>
        <span className="text-right">Amount</span>
      </div>

      {/* Asks (sell orders) — red, shown top-to-bottom highest to lowest */}
      <div className="space-y-0.5 mb-1">
        {[...orderBook.asks].slice(0, 12).reverse().map(([price, qty], i) => (
          <div key={i} className="relative grid grid-cols-2 px-1 py-[2px] rounded-sm overflow-hidden">
            <DepthBar side="ask" qty={parseFloat(qty)} />
            <span className="text-down font-mono relative z-10">{formatPrice(price)}</span>
            <span className="text-right font-mono relative z-10 text-muted-foreground">
              {parseFloat(qty).toFixed(4)}
            </span>
          </div>
        ))}
      </div>

      {/* Spread */}
      <div className="py-1.5 px-1 text-center text-muted-foreground text-[11px] border-y border-brand-border my-1">
        {orderBook.asks[0] && orderBook.bids[0]
          ? `Spread: $${(parseFloat(orderBook.asks[0][0]) - parseFloat(orderBook.bids[0][0])).toFixed(2)}`
          : "—"}
      </div>

      {/* Bids (buy orders) — green */}
      <div className="space-y-0.5">
        {orderBook.bids.slice(0, 12).map(([price, qty], i) => (
          <div key={i} className="relative grid grid-cols-2 px-1 py-[2px] rounded-sm overflow-hidden">
            <DepthBar side="bid" qty={parseFloat(qty)} />
            <span className="text-up font-mono relative z-10">{formatPrice(price)}</span>
            <span className="text-right font-mono relative z-10 text-muted-foreground">
              {parseFloat(qty).toFixed(4)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
