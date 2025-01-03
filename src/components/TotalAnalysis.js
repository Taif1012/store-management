import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
const TotalAnalysis = ({ orders }) => {
  const [period, setPeriod] = useState('daily');
  const exchangeRate = localStorage.getItem('exchangeRate') || 1;

  const formatCurrency = (valueInDinar) => {
    // Convert from Iraqi Dinar to Turkish Lira using the exchange rate
    const valueInLira = valueInDinar * exchangeRate;
    return `${valueInLira.toLocaleString()} ₺`;
  };

  const aggregateData = (data, periodType) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const aggregated = data.reduce((acc, order) => {
      const date = new Date(order.date);
      date.setHours(0, 0, 0, 0);
      let key = null;
      
      switch (periodType) {
        case 'daily':
          // Only include today's data
          if (date.getTime() === today.getTime()) {
            key = order.date;
          }
          break;
          
        case 'weekly': {
          // Get start of current week (Sunday)
          const currentWeekStart = new Date(today);
          currentWeekStart.setDate(today.getDate() - today.getDay());
          
          // Get start of order's week
          const orderWeekStart = new Date(date);
          orderWeekStart.setDate(date.getDate() - date.getDay());
          
          // Include if order is from current week
          if (orderWeekStart.getTime() === currentWeekStart.getTime()) {
            key = orderWeekStart.toISOString().split('T')[0];
          }
          break;
        }
          
        case 'monthly': {
          // Get start of current month
          const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
          
          // Get start of order's month
          const orderMonthStart = new Date(date.getFullYear(), date.getMonth(), 1);
          
          // Include if order is from current month
          if (orderMonthStart.getTime() === currentMonthStart.getTime()) {
            key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          }
          break;
        }
          
        default:
          key = order.date;
      }

      if (!key) return acc;

      if (!acc[key]) {
        acc[key] = {
          date: key,
          spending: 0,
          revenue: 0,
          profit: 0
        };
      }

      // Store values in Iraqi Dinar
      const cost = Number(order.cost);
      const price = Number(order.price);
      acc[key].spending += cost;
      acc[key].revenue += price;
      acc[key].profit += price - cost;

      return acc;
    }, {});

    return Object.values(aggregated).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const data = aggregateData(orders, period);
  const hasData = data.length > 0;

  const periodOptions = [
    { value: 'daily', label: 'تحليل يومي' },
    { value: 'weekly', label: 'تحليل أسبوعي' },
    { value: 'monthly', label: 'تحليل شهري' }
  ];

  return (
    <Card className="dark:bg-gray-800">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl dark:text-white">التحليل الكلي</CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              {periodOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setPeriod(option.value)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    period === option.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 mb-6">
          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/50 dark:to-red-800/50 p-4 rounded-xl">
            <div className="text-sm text-red-800 dark:text-red-200">إجمالي الإنفاق</div>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(data.reduce((sum, item) => sum + item.spending, 0))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 p-4 rounded-xl">
            <div className="text-sm text-blue-800 dark:text-blue-200">إجمالي المبيعات</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(data.reduce((sum, item) => sum + item.revenue, 0))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/50 dark:to-green-800/50 p-4 rounded-xl">
            <div className="text-sm text-green-800 dark:text-green-200">صافي الأرباح</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(data.reduce((sum, item) => sum + item.profit, 0))}
            </div>
          </div>
        </div>

        {!hasData && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-4">
            {period === 'daily' && 'لا توجد مبيعات اليوم'}
            {period === 'weekly' && 'لا توجد مبيعات الأسبوع السابق'}
            {period === 'monthly' && 'لا توجد مبيعات الشهر السابق'}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TotalAnalysis;
