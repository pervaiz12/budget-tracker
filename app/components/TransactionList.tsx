'use client';

import { useState } from 'react';
import { Transaction, TransactionType } from '../types';
import { TrashIcon } from '@heroicons/react/24/outline';
import { deleteTransaction, updateTransaction } from '../lib/api';
import { toast } from '../lib/toast';

interface TransactionListProps {
  transactions: Transaction[];
  onTransactionDeleted: () => void;
  onTransactionUpdated?: () => void;
}

export default function TransactionList({ transactions, onTransactionDeleted, onTransactionUpdated }: TransactionListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ title: string; amount: number; type: TransactionType; category: string }>({
    title: '',
    amount: 0,
    type: 'expense',
    category: 'Other',
  });

  const categories = [
    'Food', 'Transportation', 'Housing', 'Entertainment', 'Shopping', 'Salary', 'Freelance', 'Other'
  ];

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      setError('');
      await deleteTransaction(id);
      onTransactionDeleted();
      toast.success('Transaction deleted');
    } catch (err) {
      setError('Failed to delete transaction. Please try again.');
      toast.error('Failed to delete transaction');
      console.error('Error deleting transaction:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const startEdit = (tx: Transaction) => {
    setEditingId(tx.id);
    setEditForm({
      title: tx.title,
      amount: tx.amount,
      type: tx.type,
      category: tx.category,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id: string) => {
    try {
      setError('');
      // Map frontend fields to backend payload
      await updateTransaction(id, {
        description: editForm.title,
        amount: editForm.amount * (editForm.type === 'expense' ? -1 : 1),
        category: editForm.category,
        type: editForm.type,
      });
      setEditingId(null);
      onTransactionUpdated?.();
      toast.success('Transaction updated');
    } catch (err) {
      setError('Failed to update transaction. Please try again.');
      toast.error('Failed to update transaction');
      console.error('Error updating transaction:', err);
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
                  {editingId === transaction.id ? (
                    <div className="space-y-2">
                      <input
                        className="w-full border rounded px-2 py-1"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      />
                      <div className="space-x-4 text-sm">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            checked={editForm.type === 'expense'}
                            onChange={() => setEditForm({ ...editForm, type: 'expense' })}
                            className="h-4 w-4 text-blue-600"
                          />
                          <span className="ml-2">Expense</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            checked={editForm.type === 'income'}
                            onChange={() => setEditForm({ ...editForm, type: 'income' })}
                            className="h-4 w-4 text-blue-600"
                          />
                          <span className="ml-2">Income</span>
                        </label>
                      </div>
                    </div>
                  ) : (
                    <>
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
                    </>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === transaction.id ? (
                    <div className="flex items-center">
                      <span className="mr-1">$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        className="w-28 border rounded px-2 py-1"
                        value={editForm.amount}
                        onChange={(e) => setEditForm({ ...editForm, amount: Number(e.target.value) })}
                      />
                    </div>
                  ) : (
                    <div className={`text-sm ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    } font-medium`}>
                      {transaction.type === 'expense' ? '-' : ''}${transaction.amount.toFixed(2)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {editingId === transaction.id ? (
                    <select
                      className="border rounded px-2 py-1"
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  ) : (
                    transaction.category
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.date ? new Date(transaction.date).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {editingId === transaction.id ? (
                    <div className="space-x-2">
                      <button
                        onClick={() => saveEdit(transaction.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Save
                      </button>
                      <button onClick={cancelEdit} className="text-gray-600 hover:text-gray-900">Cancel</button>
                    </div>
                  ) : (
                    <div className="space-x-3">
                      <button
                        onClick={() => startEdit(transaction)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => transaction.id && handleDelete(transaction.id)}
                        disabled={deletingId === transaction.id}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <TrashIcon className="h-5 w-5 inline" aria-hidden="true" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

