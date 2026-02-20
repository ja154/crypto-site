import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/supabase/getAuthenticatedUser";
import prisma from "@/lib/prisma";

export async function GET() {
  const { dbUser } = await getAuthenticatedUser();
  if (!dbUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const wallets = await prisma.wallet.findMany({
    where: { userId: dbUser.id },
    orderBy: { currency: "asc" },
  });

  return NextResponse.json(wallets);
}
