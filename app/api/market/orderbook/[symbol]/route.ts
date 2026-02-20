import { binanceFetch } from "@/lib/binance/client";
import { isSupportedSymbol } from "@/lib/binance/symbols";
import type { OrderBook } from "@/types/market";

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
    const orderBook = await binanceFetch<OrderBook>(
      `/api/v3/depth?symbol=${upperSymbol}&limit=20`,
      { next: { revalidate: 3 } }
    );
    return Response.json(orderBook, {
      headers: { "Cache-Control": "public, s-maxage=3, stale-while-revalidate=6" },
    });
  } catch {
    return Response.json({ error: "Failed to fetch order book" }, { status: 502 });
  }
}
