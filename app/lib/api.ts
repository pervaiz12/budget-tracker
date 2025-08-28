import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Transactions API
export const getTransactions = async () => {
  try {
    const response = await api.get('/transactions');
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

export const addTransaction = async (transactionData: {
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
}) => {
  try {
    const response = await api.post('/transactions', transactionData);
    return response.data;
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
};

export const deleteTransaction = async (id: string) => {
  try {
    await api.delete(`/transactions/${id}`);
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};
