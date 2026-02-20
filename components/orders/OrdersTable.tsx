"use client";

import { useTransition } from "react";
import { cancelOrderAction } from "@/lib/actions/order.actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatPrice } from "@/lib/utils";
import { formatSymbol } from "@/lib/binance/symbols";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Order } from "@/types/order";

interface Props {
  orders: Order[];
}

const statusVariant: Record<string, string> = {
  OPEN: "bg-yellow-400/10 text-yellow-400",
  FILLED: "bg-up text-up",
  PARTIAL: "bg-yellow-400/10 text-yellow-400",
  CANCELLED: "bg-muted text-muted-foreground",
};

export function OrdersTable({ orders }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleCancel(orderId: string) {
    startTransition(async () => {
      const result = await cancelOrderAction(orderId);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Order cancelled");
        router.refresh();
      }
    });
  }

  if (!orders.length) {
    return (
      <div className="py-12 text-center text-muted-foreground text-sm">
        No orders found
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-brand-border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-brand-surface/60">
          <tr className="text-muted-foreground text-xs">
            <th className="text-left px-4 py-3 font-medium">Pair</th>
            <th className="text-left px-4 py-3 font-medium">Side</th>
            <th className="text-right px-4 py-3 font-medium">Price</th>
            <th className="text-right px-4 py-3 font-medium">Amount</th>
            <th className="text-right px-4 py-3 font-medium hidden sm:table-cell">Filled</th>
            <th className="text-right px-4 py-3 font-medium">Status</th>
            <th className="text-right px-4 py-3 font-medium hidden md:table-cell">Date</th>
            <th className="text-right px-4 py-3 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t border-brand-border hover:bg-brand-surface/40 transition-colors">
              <td className="px-4 py-3 font-medium">{formatSymbol(order.symbol)}</td>
              <td className="px-4 py-3">
                <span className={cn("text-xs font-medium", order.side === "BUY" ? "text-up" : "text-down")}>
                  {order.side}
                </span>
              </td>
              <td className="px-4 py-3 text-right font-mono">
                {order.price ? `$${formatPrice(order.price)}` : "MARKET"}
              </td>
              <td className="px-4 py-3 text-right font-mono">{parseFloat(order.quantity.toString()).toFixed(4)}</td>
              <td className="px-4 py-3 text-right font-mono text-muted-foreground hidden sm:table-cell">
                {parseFloat(order.filled.toString()).toFixed(4)}
              </td>
              <td className="px-4 py-3 text-right">
                <Badge variant="secondary" className={statusVariant[order.status] ?? ""}>
                  {order.status}
                </Badge>
              </td>
              <td className="px-4 py-3 text-right text-muted-foreground hidden md:table-cell">
                {formatDate(order.createdAt)}
              </td>
              <td className="px-4 py-3 text-right">
                {["OPEN", "PARTIAL"].includes(order.status) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
                    onClick={() => handleCancel(order.id)}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
