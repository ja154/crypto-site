import { notFound } from "next/navigation";
import { isSupportedSymbol, formatSymbol } from "@/lib/binance/symbols";
import { binanceFetch } from "@/lib/binance/client";
import { formatPrice, formatPercent, priceClass } from "@/lib/utils";
import { TradingViewChart } from "@/components/trade/TradingViewChart";
import { OrderBook } from "@/components/trade/OrderBook";
import { OrderForm } from "@/components/trade/OrderForm";
import { OpenOrdersList } from "@/components/trade/OpenOrdersList";
import type { BinanceTicker } from "@/types/market";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ symbol: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { symbol } = await params;
  return { title: `${formatSymbol(symbol.toUpperCase())} — Fynor` };
}

export default async function TradePage({ params }: Props) {
  const { symbol: rawSymbol } = await params;
  const symbol = rawSymbol.toUpperCase();

  if (!isSupportedSymbol(symbol)) notFound();

  let ticker: BinanceTicker | null = null;
  try {
    ticker = await binanceFetch<BinanceTicker>(
      `/api/v3/ticker/24hr?symbol=${symbol}`,
      { next: { revalidate: 5 } }
    );
  } catch {
    // continue without ticker
  }

  const lastPrice = ticker?.lastPrice ?? "0";
  const pctChange = ticker?.priceChangePercent ?? "0";

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Symbol header bar */}
      <div className="flex items-center gap-6 px-4 py-2 border-b border-brand-border bg-brand-surface/60 text-sm">
        <span className="font-bold text-base">{formatSymbol(symbol)}</span>
        <span className="font-mono font-semibold text-lg">${formatPrice(lastPrice)}</span>
        <span className={cn("text-sm", priceClass(pctChange))}>
          {formatPercent(pctChange)}
        </span>
        {ticker && (
          <>
            <span className="text-muted-foreground hidden md:inline">
              24h High: <span className="text-foreground">${formatPrice(ticker.highPrice)}</span>
            </span>
            <span className="text-muted-foreground hidden md:inline">
              24h Low: <span className="text-foreground">${formatPrice(ticker.lowPrice)}</span>
            </span>
            <span className="text-muted-foreground hidden lg:inline">
              Volume: <span className="text-foreground">{parseFloat(ticker.volume).toLocaleString()} {symbol.replace("USDT", "")}</span>
            </span>
          </>
        )}
      </div>

      {/* Main 3-column layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Order Book */}
        <aside className="w-56 shrink-0 border-r border-brand-border p-3 overflow-y-auto hidden md:block">
          <OrderBook symbol={symbol} />
        </aside>

        {/* Center: Chart */}
        <div className="flex-1 overflow-hidden">
          <TradingViewChart symbol={symbol} />
        </div>

        {/* Right: Order form + open orders */}
        <aside className="w-72 shrink-0 border-l border-brand-border p-4 overflow-y-auto">
          <OrderForm symbol={symbol} lastPrice={lastPrice} />
          <OpenOrdersList symbol={symbol} />
        </aside>
      </div>
    </div>
  );
}
