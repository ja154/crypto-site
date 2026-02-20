import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/supabase/getAuthenticatedUser";
import prisma from "@/lib/prisma";
import { OrdersTable } from "@/components/orders/OrdersTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata = { title: "Orders — Fynor" };

export default async function OrdersPage() {
  const { dbUser } = await getAuthenticatedUser();
  if (!dbUser) redirect("/login?redirectTo=/orders");

  const [openOrders, historyOrders] = await Promise.all([
    prisma.order.findMany({
      where: { userId: dbUser.id, status: { in: ["OPEN", "PARTIAL"] } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.findMany({
      where: { userId: dbUser.id, status: { in: ["FILLED", "CANCELLED"] } },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  function serialize(orders: typeof openOrders) {
    return orders.map((o) => ({
      ...o,
      price: o.price?.toString() ?? null,
      quantity: o.quantity.toString(),
      filled: o.filled.toString(),
    }));
  }

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      <Tabs defaultValue="open">
        <TabsList className="mb-4">
          <TabsTrigger value="open">
            Open Orders
            {openOrders.length > 0 && (
              <span className="ml-1.5 rounded-full bg-primary/10 px-1.5 text-[10px] font-medium text-primary">
                {openOrders.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="history">Order History</TabsTrigger>
        </TabsList>
        <TabsContent value="open">
          <OrdersTable orders={serialize(openOrders) as any} />
        </TabsContent>
        <TabsContent value="history">
          <OrdersTable orders={serialize(historyOrders) as any} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
