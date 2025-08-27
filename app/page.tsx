'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Transaction, SummaryData, CategoryData } from './types';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Summary from './components/Summary';
import CategoryChart from './components/CategoryChart';

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<SummaryData>({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
  });
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      setError('');
      const [transactionsRes, summaryRes, categoriesRes] = await Promise.all([
        axios.get<Transaction[]>('/api/transactions'),
        axios.get<SummaryData>('/api/transactions/summary'),
        axios.get<CategoryData[]>('/api/transactions/categories'),
      ]);

      setTransactions(transactionsRes.data);
      setSummary(summaryRes.data);
      setCategoryData(categoriesRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleTransactionAdded = () => {
    fetchTransactions();
  };

  const handleTransactionDeleted = () => {
    fetchTransactions();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your budget data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Budget Tracker
          </h1>
          <p className="text-gray-600 text-lg">Manage your finances with ease</p>
          <div className="mt-2 h-1 w-20 bg-gradient-to-r from-blue-400 to-indigo-500 mx-auto rounded-full"></div>
        </header>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-md shadow-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* First Row - Financial Summary */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-100">
            Financial Summary
          </h2>
          <Summary data={summary} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-full">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-100">
                Add New Transaction
              </h2>
              <TransactionForm onTransactionAdded={handleTransactionAdded} />
            </div>
          </div>

          {/* Middle column - Chart */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-full">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-100">
                Expense Breakdown
              </h2>
              <div className="h-80">
                <CategoryChart data={categoryData} />
              </div>
            </div>
          </div>

          {/* Right column - Transactions */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800">Recent Transactions</h2>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {transactions.length} total
                </span>
              </div>
              <div className="overflow-hidden">
                <TransactionList 
                  transactions={transactions} 
                  onTransactionDeleted={handleTransactionDeleted} 
                />
              </div>
            </div>
         
          </div>
        </div>

        <footer className="mt-16 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Budget Tracker. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
