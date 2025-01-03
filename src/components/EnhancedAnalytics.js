import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

const EnhancedAnalytics = ({ orders }) => {
  // تحليل اتجاهات المبيعات اليومية
  const dailyTrends = React.useMemo(() => {
    const dailyStats = orders.reduce((acc, order) => {
      const date = order.date;
      if (!acc[date]) {
        acc[date] = {
          date,
          revenue: 0,
          profit: 0,
          orders: 0
        };
      }
      acc[date].revenue += Number(order.price);
      acc[date].profit += Number(order.price) - Number(order.cost);
      acc[date].orders += 1;
      return acc;
    }, {});

    return Object.values(dailyStats).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [orders]);

  // حساب معدلات النمو
  const calculateGrowthMetrics = () => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const todayData = dailyTrends.find(day => day.date === today) || { revenue: 0, profit: 0, orders: 0 };
    const yesterdayData = dailyTrends.find(day => day.date === yesterdayStr) || { revenue: 0, profit: 0, orders: 0 };

    const calculateGrowth = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    return {
      revenue: calculateGrowth(todayData.revenue, yesterdayData.revenue),
      profit: calculateGrowth(todayData.profit, yesterdayData.profit),
      orders: calculateGrowth(todayData.orders, yesterdayData.orders)
    };
  };

  const growthMetrics = calculateGrowthMetrics();

  return (
    <div className="space-y-6">
      {/* اتجاهات النمو */}
      <Card className="dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl dark:text-white">اتجاهات النمو اليومية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800 p-4 rounded-xl">
              <div className="text-sm text-blue-800 dark:text-blue-200">نمو الإيرادات</div>
              <div className={`text-2xl font-bold ${
                growthMetrics.revenue >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {growthMetrics.revenue.toFixed(1)}%
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900 dark:to-green-800 p-4 rounded-xl">
              <div className="text-sm text-green-800 dark:text-green-200">نمو الأرباح</div>
              <div className={`text-2xl font-bold ${
                growthMetrics.profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {growthMetrics.profit.toFixed(1)}%
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900 dark:to-purple-800 p-4 rounded-xl">
              <div className="text-sm text-purple-800 dark:text-purple-200">نمو الطلبات</div>
              <div className={`text-2xl font-bold ${
                growthMetrics.orders >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {growthMetrics.orders.toFixed(1)}%
              </div>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer>
              <AreaChart data={dailyTrends}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" fillOpacity={1} fill="url(#colorRevenue)" name="الإيرادات" />
                <Area type="monotone" dataKey="profit" stroke="#34d399" fillOpacity={1} fill="url(#colorProfit)" name="الأرباح" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* توزيع المبيعات */}
      <Card className="dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl dark:text-white">توزيع المبيعات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer>
              <BarChart data={dailyTrends}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#8884d8" name="عدد الطلبات" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedAnalytics;
