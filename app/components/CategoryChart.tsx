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
  if (!data || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">No expense data available to display</p>
      </div>
    );
  }

  return (
    <div className="h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`$${Math.abs(value).toFixed(2)}`, 'Amount']}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
