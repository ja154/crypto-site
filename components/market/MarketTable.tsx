"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useMarketData } from "@/hooks/useMarketData";
import { ConnectionStatus } from "@/components/layout/ConnectionStatus";
import { formatPrice, formatPercent, formatVolume, priceClass } from "@/lib/utils";
import { formatSymbol } from "@/lib/binance/symbols";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { MarketPair } from "@/types/market";

type SortKey = "volume" | "change" | "price";
type SortDir = "asc" | "desc";

export function MarketTable() {
  const { pairs, connectionState, isLoading } = useMarketData();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("volume");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const INITIAL_COUNT = 10;
  const LOAD_MORE_COUNT = 10;
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const filtered = useMemo(() => {
    let data = pairs.filter((p) =>
      p.symbol.toLowerCase().includes(search.toLowerCase()) ||
      formatSymbol(p.symbol).toLowerCase().includes(search.toLowerCase())
    );

    data.sort((a, b) => {
      let av = 0, bv = 0;
      if (sortKey === "volume") { av = parseFloat(a.quoteVolume); bv = parseFloat(b.quoteVolume); }
      if (sortKey === "change") { av = parseFloat(a.priceChangePercent); bv = parseFloat(b.priceChangePercent); }
      if (sortKey === "price") { av = parseFloat(a.lastPrice); bv = parseFloat(b.lastPrice); }
      return sortDir === "desc" ? bv - av : av - bv;
    });

    return data;
  }, [pairs, search, sortKey, sortDir]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
    setVisibleCount(INITIAL_COUNT);
  }

  function SortBtn({ k, label }: { k: SortKey; label: string }) {
    return (
      <button
        onClick={() => toggleSort(k)}
        className={cn(
          "text-xs font-medium flex items-center gap-1 hover:text-foreground transition-colors",
          sortKey === k ? "text-foreground" : "text-muted-foreground"
        )}
      >
        {label}
        <span className="text-[10px]">{sortKey === k ? (sortDir === "desc" ? "↓" : "↑") : ""}</span>
      </button>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Input
          placeholder="Search pair…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setVisibleCount(INITIAL_COUNT); }}
          className="max-w-xs bg-brand-surface border-brand-border"
        />
        <div className="flex gap-2 ml-auto">
          <SortBtn k="volume" label="Volume" />
          <SortBtn k="change" label="Change" />
          <SortBtn k="price" label="Price" />
        </div>
        <ConnectionStatus state={connectionState} />
      </div>

      <div className="rounded-lg border border-brand-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-brand-surface/60">
            <tr className="text-muted-foreground text-xs">
              <th className="text-left px-4 py-3 font-medium">Pair</th>
              <th className="text-right px-4 py-3 font-medium">Last Price</th>
              <th className="text-right px-4 py-3 font-medium">24h Change</th>
              <th className="text-right px-4 py-3 font-medium hidden md:table-cell">24h High</th>
              <th className="text-right px-4 py-3 font-medium hidden md:table-cell">24h Low</th>
              <th className="text-right px-4 py-3 font-medium hidden lg:table-cell">Volume</th>
              <th className="text-right px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-t border-brand-border">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <Skeleton className="h-4 w-20" />
                      </td>
                    ))}
                  </tr>
                ))
              : visible.map((pair) => (
                  <tr
                    key={pair.symbol}
                    className="border-t border-brand-border hover:bg-brand-surface/60 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium">{formatSymbol(pair.symbol)}</td>
                    <td className="px-4 py-3 text-right font-mono">
                      ${formatPrice(pair.lastPrice)}
                    </td>
                    <td className={cn("px-4 py-3 text-right", priceClass(pair.priceChangePercent))}>
                      {formatPercent(pair.priceChangePercent)}
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground hidden md:table-cell">
                      ${formatPrice(pair.highPrice)}
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground hidden md:table-cell">
                      ${formatPrice(pair.lowPrice)}
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground hidden lg:table-cell">
                      ${formatVolume(pair.quoteVolume)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/trade/${pair.symbol}`}>
                        <Button size="sm" variant="outline" className="text-xs h-7">
                          Trade
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>

        {!isLoading && filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground text-sm">
            No pairs match &ldquo;{search}&rdquo;
          </div>
        )}
      </div>

      {!isLoading && hasMore && (
        <div className="pt-4 text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setVisibleCount((c) => c + LOAD_MORE_COUNT)}
          >
            Load More 
          </Button>
        </div>
      )}
    </div>
  );
}
