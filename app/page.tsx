import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MarketTickerStrip } from "@/components/layout/MarketTickerStrip";
import { binanceFetch } from "@/lib/binance/client";
import { SUPPORTED_SYMBOLS, formatSymbol } from "@/lib/binance/symbols";
import { formatPrice, formatPercent, priceClass } from "@/lib/utils";
import type { BinanceTicker, MarketPair } from "@/types/market";
import { cn } from "@/lib/utils";

export default async function HomePage() {
  let topPairs: MarketPair[] = [];
  try {
    const symbolsParam = encodeURIComponent(JSON.stringify([...SUPPORTED_SYMBOLS]));
    const tickers = await binanceFetch<BinanceTicker[]>(
      `/api/v3/ticker/24hr?symbols=${symbolsParam}`,
      { next: { revalidate: 30 } }
    );
    topPairs = tickers
      .map((t) => ({
        symbol: t.symbol,
        lastPrice: t.lastPrice,
        priceChangePercent: t.priceChangePercent,
        highPrice: t.highPrice,
        lowPrice: t.lowPrice,
        volume: t.volume,
        quoteVolume: t.quoteVolume,
      }))
      .sort((a, b) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume))
      .slice(0, 4);
  } catch {
    // fall back to empty state
  }

  return (
    <>
      <MarketTickerStrip />

      {/* Hero */}
      <section className="mx-auto max-w-screen-xl px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-brand-surface px-4 py-1.5 text-xs text-muted-foreground mb-8">
          <span className="size-1.5 rounded-full bg-brand-success" />
          Live market data via Binance
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-3xl mx-auto">
          Trade crypto with{" "}
          <span className="text-brand-yellow">real-time</span> market data
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10">
          Access live order books, streaming prices, and a fully functional
          trading interface — powered by Binance WebSocket streams.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button size="lg" className="bg-brand-yellow text-brand-dark hover:bg-brand-yellow/90 font-semibold" asChild>
            <Link href="/market">Explore Markets</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/register">Create Account</Link>
          </Button>
        </div>
      </section>

      {/* Top pairs */}
      {topPairs.length > 0 && (
        <section className="mx-auto max-w-screen-xl px-4 pb-16">
          <h2 className="text-lg font-semibold mb-4">Top Markets</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {topPairs.map((pair) => (
              <Link
                key={pair.symbol}
                href={`/trade/${pair.symbol}`}
                className="rounded-xl border border-brand-border bg-brand-surface p-4 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-sm">{formatSymbol(pair.symbol)}</span>
                  <span className={cn("text-xs font-medium", priceClass(pair.priceChangePercent))}>
                    {formatPercent(pair.priceChangePercent)}
                  </span>
                </div>
                <p className="text-xl font-bold">${formatPrice(pair.lastPrice)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Features */}
      <section className="border-t border-brand-border bg-brand-surface/40">
        <div className="mx-auto max-w-screen-xl px-4 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Real-time WebSocket",
                desc: "Prices stream directly from Binance WebSocket feeds with automatic reconnection and polling fallback.",
                icon: "⚡",
              },
              {
                title: "Live Order Book",
                desc: "Full depth-of-market with 100ms updates so you always see the true bid/ask spread.",
                icon: "📊",
              },
              {
                title: "Secure Auth",
                desc: "Supabase Auth with email/password and Google OAuth. Sessions managed server-side.",
                icon: "🔐",
              },
            ].map((f) => (
              <div key={f.title} className="space-y-2">
                <div className="text-3xl">{f.icon}</div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
