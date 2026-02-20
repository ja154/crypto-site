import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/supabase/getAuthenticatedUser";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { dbUser } = await getAuthenticatedUser();
  if (!dbUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20"), 100);
  const offset = parseInt(searchParams.get("offset") ?? "0");

  const transactions = await prisma.transaction.findMany({
    where: { userId: dbUser.id },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });

  return NextResponse.json(transactions);
}
