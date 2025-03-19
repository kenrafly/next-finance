export interface WalletRecord {
  _id: string;
  userId: string;
  date: string; // ✅ Always use string (ISO format)
  title: string;
  amount: number;
}
