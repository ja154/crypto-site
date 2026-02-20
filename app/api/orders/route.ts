import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/supabase/getAuthenticatedUser";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { dbUser } = await getAuthenticatedUser();
  if (!dbUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const symbol = searchParams.get("symbol");

  const orders = await prisma.order.findMany({
    where: {
      userId: dbUser.id,
      ...(status ? { status: status as "OPEN" | "FILLED" | "PARTIAL" | "CANCELLED" } : {}),
      ...(symbol ? { symbol: symbol.toUpperCase() } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json(orders);
}
