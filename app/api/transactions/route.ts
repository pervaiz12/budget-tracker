import { NextResponse } from 'next/server';
import { Transaction } from '../../types';

// In-memory storage for demo purposes
let transactions: Transaction[] = [];

// Helper function to calculate summary
export function calculateSummary(transactions: Transaction[]) {
  const summary = transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === 'income') {
        acc.totalIncome += transaction.amount;
      } else {
        acc.totalExpenses += transaction.amount;
      }
      return acc;
    },
    { totalIncome: 0, totalExpenses: 0, balance: 0 }
  );

  summary.balance = summary.totalIncome - summary.totalExpenses;
  return summary;
}

// GET /api/transactions
export async function GET() {
  return NextResponse.json(transactions);
}

// POST /api/transactions
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.amount || !data.type || !data.category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate amount is a positive number
    const amount = Number(data.amount);
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be a positive number' },
        { status: 400 }
      );
    }

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      title: data.title,
      amount: parseFloat(amount.toFixed(2)),
      type: data.type,
      category: data.category,
      date: new Date().toISOString(),
    };

    transactions.push(newTransaction);
    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/transactions/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const initialLength = transactions.length;
    transactions = transactions.filter(transaction => transaction.id !== id);

    if (transactions.length === initialLength) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
