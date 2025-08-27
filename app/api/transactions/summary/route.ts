import { NextResponse } from 'next/server';
import { calculateSummary } from '../route';

// GET /api/transactions/summary
export async function GET() {
  try {
    const response = await fetch('http://localhost:3000/api/transactions');
    const transactions = await response.json();
    const summary = calculateSummary(transactions);
    
    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error fetching summary:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
