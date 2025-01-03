import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TotalAnalysis = ({ orders }) => {
  const [period, setPeriod] = useState('daily');
  const [showIQD, setShowIQD] = useState(true);
  const exchangeRate = localStorage.getItem('exchangeRate') || 1;

  const formatCurrency = (value) => {
    const amount = showIQD ? value : value / exchangeRate;
    return `${amount.toLocaleString()} ${showIQD ? 'د.ع' : '$'}`;
  };

  const aggregateData = (data, periodType) => {
    const aggregated = data.reduce((acc, order) => {
      let key;
      const date = new Date(order.date);
      
      switch (periodType) {
        case 'daily':
          key = order.date;
          break;
        case 'weekly':
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = weekStart.toISOString().split('T')[0];
          break;
        case 'monthly':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        default:
          key = order.date;
      }

      if (!acc[key]) {
        acc[key] = {
          date: key,
          spending: 0,
          revenue: 0,
          profit: 0
        };
      }

      acc[key].spending += Number(order.cost);
      acc[key].revenue += Number(order.price);
      acc[key].profit += Number(order.price) - Number(order.cost);

      return acc;
    }, {});

    return Object.values(aggregated).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const data = aggregateData(orders, period);

  const periodOptions = [
    { value: 'daily', label: 'تحليل يومي' },
    { value: 'weekly', label: 'تحليل أسبوعي' },
    { value: 'monthly', label: 'تحليل شهري' }
  ];

  const formatDate = (date) => {
    const d = new Date(date);
    switch (period) {
      case 'daily':
        return d.toLocaleDateString('ar-IQ');
      case 'weekly':
        return `أسبوع ${d.toLocaleDateString('ar-IQ')}`;
      case 'monthly':
        return d.toLocaleDateString('ar-IQ', { year: 'numeric', month: 'long' });
      default:
        return date;
    }
  };

  return (
    <Card className="dark:bg-gray-800">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl dark:text-white">التحليل الكلي</CardTitle>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowIQD(!showIQD)}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
            >
              {showIQD ? '$' : 'د.ع'}
            </button>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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

        <div className="h-80">
          <ResponsiveContainer>
            <LineChart data={data}>
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
              />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip 
                formatter={(value) => formatCurrency(value)}
                labelFormatter={formatDate}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="spending" 
                stroke="#ef4444" 
                name="الإنفاق"
                strokeWidth={2}
                dot={{ fill: '#ef4444' }}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3b82f6" 
                name="المبيعات"
                strokeWidth={2}
                dot={{ fill: '#3b82f6' }}
              />
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke="#10b981" 
                name="الأرباح"
                strokeWidth={2}
                dot={{ fill: '#10b981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TotalAnalysis;
