"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { placeOrderAction } from "@/lib/actions/order.actions";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Props {
  symbol: string;
  lastPrice: string;
}

export function OrderForm({ symbol, lastPrice }: Props) {
  const { user } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [orderType, setOrderType] = useState<"LIMIT" | "MARKET">("LIMIT");
  const [price, setPrice] = useState(lastPrice);
  const [amount, setAmount] = useState("");
  const [sliderPct, setSliderPct] = useState(0);

  function handleSlider(pct: number) {
    setSliderPct(pct);
    // For simplicity, show percentage in amount field
    // In production you'd calculate from wallet balance
    setAmount(pct > 0 ? (pct / 100).toFixed(4) : "");
  }

  function submitOrder(side: "BUY" | "SELL") {
    if (!user) return;
    const fd = new FormData();
    fd.set("symbol", symbol);
    fd.set("side", side);
    fd.set("type", orderType);
    if (orderType === "LIMIT") fd.set("price", price);
    fd.set("quantity", amount);

    startTransition(async () => {
      const result = await placeOrderAction(fd);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(`${side} order placed`);
        setAmount("");
        setSliderPct(0);
      }
    });
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
        <p className="text-sm text-muted-foreground">Sign in to trade</p>
        <Button size="sm" className="bg-brand-yellow text-brand-dark hover:bg-brand-yellow/90" asChild>
          <Link href="/login">Sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <Tabs defaultValue="BUY">
      <TabsList className="w-full mb-4">
        <TabsTrigger value="BUY" className="flex-1 data-[state=active]:text-up data-[state=active]:bg-up">
          Buy
        </TabsTrigger>
        <TabsTrigger value="SELL" className="flex-1 data-[state=active]:text-down data-[state=active]:bg-down">
          Sell
        </TabsTrigger>
      </TabsList>

      {(["BUY", "SELL"] as const).map((side) => (
        <TabsContent key={side} value={side} className="space-y-4 mt-0">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Order type</Label>
            <Select value={orderType} onValueChange={(v) => setOrderType(v as "LIMIT" | "MARKET")}>
              <SelectTrigger className="bg-brand-surface border-brand-border text-sm h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LIMIT">Limit</SelectItem>
                <SelectItem value="MARKET">Market</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {orderType === "LIMIT" && (
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Price (USDT)</Label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="bg-brand-surface border-brand-border font-mono text-sm h-9"
                step="0.01"
                min="0"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Amount ({symbol.replace("USDT", "")})</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-brand-surface border-brand-border font-mono text-sm h-9"
              step="0.0001"
              min="0"
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Slider
              value={[sliderPct]}
              onValueChange={([v]) => handleSlider(v)}
              min={0}
              max={100}
              step={25}
              className="mt-1"
            />
            <div className="flex justify-between text-[11px] text-muted-foreground">
              {[0, 25, 50, 75, 100].map((p) => (
                <button key={p} onClick={() => handleSlider(p)} className={cn("hover:text-foreground", sliderPct === p && "text-primary")}>
                  {p}%
                </button>
              ))}
            </div>
          </div>

          {amount && price && orderType === "LIMIT" && (
            <div className="flex justify-between text-xs text-muted-foreground border-t border-brand-border pt-3">
              <span>Total</span>
              <span className="font-mono">
                ${(parseFloat(price) * parseFloat(amount) || 0).toFixed(2)} USDT
              </span>
            </div>
          )}

          <Button
            className={cn(
              "w-full font-semibold",
              side === "BUY"
                ? "bg-brand-success hover:bg-brand-success/90 text-brand-dark"
                : "bg-brand-danger hover:bg-brand-danger/90 text-white"
            )}
            onClick={() => submitOrder(side)}
            disabled={isPending || !amount}
          >
            {isPending ? "Placing…" : `${side === "BUY" ? "Buy" : "Sell"} ${symbol.replace("USDT", "")}`}
          </Button>
        </TabsContent>
      ))}
    </Tabs>
  );
}
