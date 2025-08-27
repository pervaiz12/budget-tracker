export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id?: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date?: string;
}

export interface SummaryData {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
}
