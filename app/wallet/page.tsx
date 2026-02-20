import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/supabase/getAuthenticatedUser";
import prisma from "@/lib/prisma";
import { AssetCard } from "@/components/wallet/AssetCard";
import { TransactionTable } from "@/components/wallet/TransactionTable";

export const metadata = { title: "Wallet — Fynor" };

export default async function WalletPage() {
  const { dbUser } = await getAuthenticatedUser();
  if (!dbUser) redirect("/login?redirectTo=/wallet");

  const [wallets, transactions] = await Promise.all([
    prisma.wallet.findMany({ where: { userId: dbUser.id }, orderBy: { currency: "asc" } }),
    prisma.transaction.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  const serializedWallets = wallets.map((w) => ({
    ...w,
    balance: w.balance.toString(),
    lockedBalance: w.lockedBalance.toString(),
  }));

  const serializedTx = transactions.map((tx) => ({
    ...tx,
    amount: tx.amount.toString(),
  }));

  return (
    <div className="mx-auto max-w-screen-lg px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Wallet</h1>

      <section className="mb-8">
        <h2 className="text-sm font-medium text-muted-foreground mb-3">Your Assets</h2>
        {serializedWallets.length === 0 ? (
          <p className="text-muted-foreground text-sm">No wallets found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {serializedWallets.map((w) => (
              <AssetCard key={w.id} wallet={w as any} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-sm font-medium text-muted-foreground mb-3">Transaction History</h2>
        <TransactionTable transactions={serializedTx as any} />
      </section>
    </div>
  );
}
