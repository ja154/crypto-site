import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatPercent, priceClass } from "@/lib/utils";
import { formatSymbol } from "@/lib/binance/symbols";
import type { MarketPair } from "@/types/market";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
  pair: MarketPair;
}

export function MarketCard({ pair }: Props) {
  const pct = parseFloat(pair.priceChangePercent);

  return (
    <Link href={`/trade/${pair.symbol}`}>
      <Card className="hover:border-primary/40 transition-colors cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="font-semibold">{formatSymbol(pair.symbol)}</p>
              <p className="text-xs text-muted-foreground">{pair.symbol.replace("USDT", "")}</p>
            </div>
            <Badge
              variant="secondary"
              className={cn(
                "text-xs font-medium",
                pct >= 0
                  ? "bg-up text-up"
                  : "bg-down text-down"
              )}
            >
              {formatPercent(pair.priceChangePercent)}
            </Badge>
          </div>
          <p className="text-xl font-bold">${formatPrice(pair.lastPrice)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Vol: ${formatVolume(pair.quoteVolume)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

function formatVolume(v: string) {
  const n = parseFloat(v);
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  return `${(n / 1e3).toFixed(1)}K`;
}
