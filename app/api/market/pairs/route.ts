import { binanceFetch } from "@/lib/binance/client";
import { SUPPORTED_SYMBOLS } from "@/lib/binance/symbols";
import type { BinanceTicker, MarketPair } from "@/types/market";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Fetch only our supported symbols — avoids pulling the 2MB+ full ticker list
    const symbolsParam = encodeURIComponent(JSON.stringify([...SUPPORTED_SYMBOLS]));
    const tickers = await binanceFetch<BinanceTicker[]>(
      `/api/v3/ticker/24hr?symbols=${symbolsParam}`,
      { next: { revalidate: 30 } }
    );

    const pairs: MarketPair[] = tickers.map((t) => ({
      symbol: t.symbol,
      lastPrice: t.lastPrice,
      priceChangePercent: t.priceChangePercent,
      highPrice: t.highPrice,
      lowPrice: t.lowPrice,
      volume: t.volume,
      quoteVolume: t.quoteVolume,
    }));

    return Response.json(pairs, {
      headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" },
    });
  } catch {
    return Response.json({ error: "Failed to fetch market data" }, { status: 502 });
  }
}
