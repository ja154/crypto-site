import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { Transaction } from "@/types/wallet";

interface Props {
  transactions: Transaction[];
}

const statusColors = {
  COMPLETED: "bg-up text-up",
  PENDING: "bg-yellow-400/10 text-yellow-400",
  FAILED: "bg-down text-down",
};

export function TransactionTable({ transactions }: Props) {
  if (!transactions.length) {
    return (
      <div className="py-12 text-center text-muted-foreground text-sm">
        No transactions yet
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-brand-border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-brand-surface/60">
          <tr className="text-muted-foreground text-xs">
            <th className="text-left px-4 py-3 font-medium">Type</th>
            <th className="text-left px-4 py-3 font-medium">Currency</th>
            <th className="text-right px-4 py-3 font-medium">Amount</th>
            <th className="text-right px-4 py-3 font-medium hidden sm:table-cell">Status</th>
            <th className="text-right px-4 py-3 font-medium hidden md:table-cell">Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="border-t border-brand-border">
              <td className="px-4 py-3">{tx.type}</td>
              <td className="px-4 py-3 font-medium">{tx.currency}</td>
              <td className="px-4 py-3 text-right font-mono">{parseFloat(tx.amount.toString()).toFixed(6)}</td>
              <td className="px-4 py-3 text-right hidden sm:table-cell">
                <Badge variant="secondary" className={statusColors[tx.status] ?? ""}>
                  {tx.status}
                </Badge>
              </td>
              <td className="px-4 py-3 text-right text-muted-foreground hidden md:table-cell">
                {formatDate(tx.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
