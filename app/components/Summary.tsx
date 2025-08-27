'use client';

import { SummaryData } from '../types';

interface SummaryProps {
  data: SummaryData;
}

export default function Summary({ data }: SummaryProps) {
  const { totalIncome = 0, totalExpenses = 0, balance = 0 } = data;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
  const budgetUsed = totalIncome > 0 ? (totalExpenses / (totalIncome * 0.7)) * 100 : 0;

  const StatCard = ({ 
    title, 
    value, 
    icon, 
    color,
    trend,
    trendText
  }: { 
    title: string; 
    value: number;
    icon: React.ReactNode;
    color: string;
    trend?: 'up' | 'down' | 'neutral';
    trendText?: string;
  }) => {
    const trendColors = {
      up: 'text-green-500',
      down: 'text-red-500',
      neutral: 'text-gray-400'
    };

    const trendIcons = {
      up: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      ),
      down: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      ),
      neutral: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
        </svg>
      )
    };

    return (
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 w-full">
        <div className="flex items-start">
          <div className={`p-2.5 rounded-lg ${color.replace('text', 'bg').replace('-600', '-50')} ${color} bg-opacity-20 flex-shrink-0 mr-3`}>
            {icon}
          </div>
          <div className="min-w-0 flex-1 overflow-hidden">
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <p className={`mt-1 text-xl font-bold ${color} break-words`}>
              ${Math.abs(value).toLocaleString('en-US', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              })}
            </p>
            {trend && (
              <div className="mt-1">
                <span className={`inline-flex items-center ${trendColors[trend]} text-xs`}>
                  {trendIcons[trend]}
                  <span className="ml-1">{trendText}</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const getTrend = (current: number, previous: number) => {
    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'neutral';
  };

  return (
    <div className="space-y-5 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        <StatCard 
          title="Total Income" 
          value={totalIncome}
          color="text-emerald-600"
          trend={getTrend(totalIncome, 0)}
          trendText="This month"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        
        <StatCard 
          title="Total Expenses" 
          value={totalExpenses}
          color="text-rose-600"
          trend={getTrend(totalExpenses, 0)}
          trendText="This month"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        
        <StatCard 
          title="Balance" 
          value={balance}
          color={balance >= 0 ? 'text-blue-600' : 'text-amber-600'}
          trend={balance >= 0 ? 'up' : 'down'}
          trendText={`${Math.abs(savingsRate).toFixed(1)}% ${balance >= 0 ? 'saved' : 'overspent'}`}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
      </div>
      
      <div className="bg-white p-4 rounded-xl border border-gray-100 w-full">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h3 className="text-sm font-medium text-gray-700 whitespace-nowrap">Monthly Budget</h3>
          <div className="flex items-center text-sm font-medium">
            <span className="text-gray-900 whitespace-nowrap">
              ${totalExpenses.toLocaleString('en-US', {minimumFractionDigits: 2})}
            </span>
            <span className="text-gray-400 mx-1">/</span>
            <span className="text-gray-500 whitespace-nowrap">
              ${(totalIncome * 0.7).toLocaleString('en-US', {minimumFractionDigits: 2})}
            </span>
          </div>
        </div>
        
        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden mb-1.5">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              budgetUsed > 100 
                ? 'bg-gradient-to-r from-red-500 to-red-600' 
                : 'bg-gradient-to-r from-blue-500 to-indigo-600'
            }`}
            style={{ 
              width: `${Math.min(100, Math.max(0, budgetUsed))}%`,
            }}
          ></div>
        </div>
        
        <div className="flex justify-between text-xs text-gray-500">
          <span className="whitespace-nowrap">0%</span>
          <span className={`font-medium ${budgetUsed > 100 ? 'text-red-600' : 'text-blue-600'} mx-2 text-center flex-1`}>
            {budgetUsed > 100 
              ? `Over by ${(budgetUsed - 100).toFixed(1)}%` 
              : `${Math.round(budgetUsed)}% Used`}
          </span>
          <span className="whitespace-nowrap">100%</span>
        </div>
      </div>
      
    </div>
  );
}
