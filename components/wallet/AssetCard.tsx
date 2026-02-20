import { Card, CardContent } from "@/components/ui/card";
import type { Wallet } from "@/types/wallet";

const CURRENCY_ICONS: Record<string, string> = {
  BTC: "₿",
  ETH: "Ξ",
  USDT: "$",
};

interface Props {
  wallet: Wallet;
}

export function AssetCard({ wallet }: Props) {
  const available = parseFloat(wallet.balance.toString());
  const locked = parseFloat(wallet.lockedBalance.toString());
  const total = available + locked;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-9 w-9 rounded-full bg-brand-surface-hover flex items-center justify-center text-brand-yellow font-bold text-sm">
            {CURRENCY_ICONS[wallet.currency] ?? wallet.currency[0]}
          </div>
          <div>
            <p className="font-semibold">{wallet.currency}</p>
            <p className="text-xs text-muted-foreground">
              {wallet.currency === "BTC" ? "Bitcoin" : wallet.currency === "ETH" ? "Ethereum" : "Tether"}
            </p>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Available</span>
            <span className="font-mono">{available.toFixed(wallet.currency === "USDT" ? 2 : 6)}</span>
          </div>
          {locked > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">In orders</span>
              <span className="font-mono text-muted-foreground">{locked.toFixed(wallet.currency === "USDT" ? 2 : 6)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-medium pt-1 border-t border-brand-border mt-2">
            <span>Total</span>
            <span className="font-mono">{total.toFixed(wallet.currency === "USDT" ? 2 : 6)} {wallet.currency}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
