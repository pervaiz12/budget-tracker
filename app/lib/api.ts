import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// Create axios instance with credentials so httpOnly cookies are sent
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: basic interceptor to surface 401s
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      // Let caller handle redirect to /login
    }
    return Promise.reject(error);
  }
);

// Transactions API
export type TxFilters = {
  category?: string;
  type?: 'income' | 'expense';
  startDate?: string; // ISO
  endDate?: string;   // ISO
  minAmount?: number;
  maxAmount?: number;
  q?: string;
};

export const getTransactions = async (filters?: TxFilters) => {
  try {
    const response = await api.get('/transactions', { params: filters });
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

export const updateTransaction = async (
  id: string,
  transactionData: {
    description?: string;
    amount?: number;
    category?: string;
    type?: 'income' | 'expense';
  }
) => {
  try {
    const response = await api.put(`/transactions/${id}`, transactionData);
    return response.data;
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
};

// Auth API helpers
export const requestOtp = async (email: string) => {
  const res = await api.post('/auth/request-otp', { email });
  return res.data;
};

export const verifyOtp = async (email: string, code: string, name?: string) => {
  const res = await api.post('/auth/verify-otp', { email, code, name });
  return res.data;
};

export const getMe = async () => {
  const res = await api.get('/auth/me');
  return res.data.user as { id: string; email: string; name?: string } | null;
};

export const logout = async () => {
  const res = await api.post('/auth/logout');
  return res.data;
};

export { api };
