"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/supabase/getAuthenticatedUser";
import { isSupportedSymbol, getBaseAsset, getQuoteAsset } from "@/lib/binance/symbols";

export async function placeOrderAction(formData: FormData) {
  const { dbUser } = await getAuthenticatedUser();
  if (!dbUser) redirect("/login");

  const symbol = (formData.get("symbol") as string)?.toUpperCase();
  const side = formData.get("side") as "BUY" | "SELL";
  const type = formData.get("type") as "LIMIT" | "MARKET";
  const priceStr = formData.get("price") as string;
  const quantityStr = formData.get("quantity") as string;

  if (!isSupportedSymbol(symbol)) {
    return { error: "Invalid trading pair" };
  }

  const price = priceStr ? parseFloat(priceStr) : null;
  const quantity = parseFloat(quantityStr);

  if (isNaN(quantity) || quantity <= 0) {
    return { error: "Invalid quantity" };
  }
  if (type === "LIMIT" && (price === null || isNaN(price) || price <= 0)) {
    return { error: "Limit orders require a valid price" };
  }

  const baseAsset = getBaseAsset(symbol);
  const quoteAsset = getQuoteAsset(symbol);

  // For BUY: lock quote currency (e.g. USDT); for SELL: lock base currency (e.g. BTC)
  const lockCurrency = side === "BUY" ? quoteAsset : baseAsset;
  const lockAmount = side === "BUY" ? (price ?? 0) * quantity : quantity;

  try {
    await prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({
        where: { userId_currency: { userId: dbUser.id, currency: lockCurrency } },
      });

      if (!wallet || Number(wallet.balance) < lockAmount) {
        throw new Error(`Insufficient ${lockCurrency} balance`);
      }

      await tx.order.create({
        data: {
          userId: dbUser.id,
          symbol,
          side,
          type,
          price: price !== null ? price : undefined,
          quantity,
          status: "OPEN",
        },
      });

      await tx.wallet.update({
        where: { userId_currency: { userId: dbUser.id, currency: lockCurrency } },
        data: {
          balance: { decrement: lockAmount },
          lockedBalance: { increment: lockAmount },
        },
      });
    });

    revalidatePath("/orders");
    revalidatePath("/wallet");
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to place order" };
  }
}

export async function cancelOrderAction(orderId: string) {
  const { dbUser } = await getAuthenticatedUser();
  if (!dbUser) redirect("/login");

  try {
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id: orderId } });

      if (!order) throw new Error("Order not found");
      if (order.userId !== dbUser.id) throw new Error("Unauthorized");
      if (!["OPEN", "PARTIAL"].includes(order.status)) {
        throw new Error("Only open or partial orders can be cancelled");
      }

      const baseAsset = getBaseAsset(order.symbol);
      const quoteAsset = getQuoteAsset(order.symbol);
      const releaseCurrency = order.side === "BUY" ? quoteAsset : baseAsset;

      // Amount still locked: original - already filled
      const filledQty = Number(order.filled);
      const totalQty = Number(order.quantity);
      const price = order.price ? Number(order.price) : 0;
      const remainingLock =
        order.side === "BUY"
          ? (totalQty - filledQty) * price
          : totalQty - filledQty;

      await tx.order.update({
        where: { id: orderId },
        data: { status: "CANCELLED" },
      });

      if (remainingLock > 0) {
        await tx.wallet.update({
          where: {
            userId_currency: { userId: dbUser.id, currency: releaseCurrency },
          },
          data: {
            balance: { increment: remainingLock },
            lockedBalance: { decrement: remainingLock },
          },
        });
      }
    });

    revalidatePath("/orders");
    revalidatePath("/wallet");
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to cancel order" };
  }
}
