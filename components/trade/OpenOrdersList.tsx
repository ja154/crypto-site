"use client";

import { useEffect, useState, useTransition } from "react";
import { cancelOrderAction } from "@/lib/actions/order.actions";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import type { Order } from "@/types/order";

interface Props {
  symbol: string;
}

export function OpenOrdersList({ symbol }: Props) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  async function fetchOrders() {
    if (!user) return;
    const res = await fetch(`/api/orders?status=OPEN&symbol=${symbol}`);
    if (res.ok) setOrders(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    fetchOrders();
  }, [user, symbol]);

  function handleCancel(orderId: string) {
    startTransition(async () => {
      const result = await cancelOrderAction(orderId);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Order cancelled");
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
      }
    });
  }

  if (!user) return null;

  return (
    <div className="mt-4">
      <h3 className="text-xs font-medium text-muted-foreground mb-2">Open Orders</h3>
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
        </div>
      ) : orders.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">No open orders</p>
      ) : (
        <div className="space-y-1">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between text-xs p-2 rounded bg-brand-surface-hover"
            >
              <div>
                <Badge
                  variant="secondary"
                  className={order.side === "BUY" ? "bg-up text-up text-[10px]" : "bg-down text-down text-[10px]"}
                >
                  {order.side}
                </Badge>
                <span className="ml-2 font-mono">{order.quantity} @ {order.price ? `$${formatPrice(order.price)}` : "MKT"}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-[10px] text-muted-foreground hover:text-destructive"
                onClick={() => handleCancel(order.id)}
                disabled={isPending}
              >
                Cancel
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
