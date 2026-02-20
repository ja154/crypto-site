import { MarketTable } from "@/components/market/MarketTable";
import { SUPPORTED_SYMBOLS } from "@/lib/binance/symbols";

export const metadata = { title: "Markets — Fynor" };

export default function MarketPage() {
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Markets</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Real-time prices for {SUPPORTED_SYMBOLS.length} trading pairs
        </p>
      </div>
      <MarketTable />
    </div>
  );
}
