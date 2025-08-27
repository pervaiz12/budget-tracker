import { NextResponse } from 'next/server';

// Color palette for categories
const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', 
  '#A4DE6C', '#D0ED57', '#8884D8', '#FF6B6B',
  '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'
];

// GET /api/transactions/categories
export async function GET() {
  try {
    const response = await fetch('http://localhost:3000/api/transactions');
    const transactions = await response.json();
    
    // Filter only expenses and group by category
    const expenseCategories = transactions
      .filter((t: any) => t.type === 'expense')
      .reduce((acc: any[], transaction: any) => {
        const existingCategory = acc.find(cat => cat.name === transaction.category);
        if (existingCategory) {
          existingCategory.value += transaction.amount;
        } else {
          acc.push({
            name: transaction.category,
            value: transaction.amount,
            color: COLORS[acc.length % COLORS.length]
          });
        }
        return acc;
      }, []);
    
    return NextResponse.json(expenseCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
