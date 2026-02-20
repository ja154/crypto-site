export interface Wallet {
  id: string;
  userId: string;
  currency: string;
  balance: string;
  lockedBalance: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TransactionType = "DEPOSIT" | "WITHDRAWAL";
export type TransactionStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  currency: string;
  amount: string;
  status: TransactionStatus;
  txHash: string | null;
  createdAt: Date;
  updatedAt: Date;
}
