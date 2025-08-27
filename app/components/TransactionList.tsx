'use client';

import { useState } from 'react';
import { Transaction, TransactionType } from '../types';
import { TrashIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

interface TransactionListProps {
  transactions: Transaction[];
  onTransactionDeleted: () => void;
}

export default function TransactionList({ transactions, onTransactionDeleted }: TransactionListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      setError('');
      await axios.delete(`/api/transactions/${id}`);
      onTransactionDeleted();
    } catch (err) {
      setError('Failed to delete transaction. Please try again.');
      console.error('Error deleting transaction:', err);
    } finally {
      setDeletingId(null);
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No transactions yet. Add one to get started!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
      
      <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{transaction.title}</div>
                  <div className="text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.type === 'income' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  } font-medium`}>
                    {transaction.type === 'expense' ? '-' : ''}${transaction.amount.toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.date ? new Date(transaction.date).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => transaction.id && handleDelete(transaction.id)}
                    disabled={deletingId === transaction.id}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <TrashIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
