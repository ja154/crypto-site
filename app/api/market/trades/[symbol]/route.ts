import { binanceFetch } from "@/lib/binance/client";
import { isSupportedSymbol } from "@/lib/binance/symbols";
import type { BinanceTrade } from "@/types/market";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const upperSymbol = symbol.toUpperCase();

  if (!isSupportedSymbol(upperSymbol)) {
    return Response.json({ error: "Unsupported symbol" }, { status: 400 });
  }

  try {
    const trades = await binanceFetch<BinanceTrade[]>(
      `/api/v3/trades?symbol=${upperSymbol}&limit=50`,
      { next: { revalidate: 5 } }
    );
    return Response.json(trades, {
      headers: { "Cache-Control": "public, s-maxage=5, stale-while-revalidate=10" },
    });
  } catch {
    return Response.json({ error: "Failed to fetch trades" }, { status: 502 });
  }
}
