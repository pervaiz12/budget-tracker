export type TransactionType = 'income' | 'expense';

// Frontend transaction type
export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: Date;
}

// Backend transaction type
export interface BackendTransaction {
  _id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface SummaryData {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export interface CategoryData {
  name: string;
  amount: number;
  value?: number; // For backward compatibility with charts
  color?: string;
}
