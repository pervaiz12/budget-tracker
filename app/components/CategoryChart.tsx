'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CategoryData } from '../types';

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', 
  '#A4DE6C', '#D0ED57', '#8884D8', '#FF6B6B',
  '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'
];

interface CategoryChartProps {
  data: CategoryData[];
}

export default function CategoryChart({ data }: CategoryChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-gray-500">No expense data available to display</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <h2 className="text-lg font-semibold mb-4">Expense by Category</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={70}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent = 0 }) => 
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            <Legend />
            <Tooltip 
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
