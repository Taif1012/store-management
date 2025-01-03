import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CATEGORIES, PRESET_PRODUCTS } from '../constants/data';  // إضافة استيراد PRESET_PRODUCTS

const AdvancedStats = ({ orders, capital }) => {
  // تحليل المنتجات الأكثر ربحاً
  const topProducts = React.useMemo(() => {
    const productStats = orders.reduce((acc, order) => {
      if (!acc[order.productName]) {
        acc[order.productName] = {
          name: order.productName,
          totalProfit: 0,
          totalSales: 0,
          averageProfit: 0
        };
      }
      
      const profit = Number(order.price) - Number(order.cost);
      acc[order.productName].totalProfit += profit;
      acc[order.productName].totalSales += 1;
      acc[order.productName].averageProfit = 
        acc[order.productName].totalProfit / acc[order.productName].totalSales;
      
      return acc;
    }, {});

    return Object.values(productStats)
      .sort((a, b) => b.totalProfit - a.totalProfit)
      .slice(0, 5);
  }, [orders]);

  // تحليل الأداء حسب الفئة
  const categoryPerformance = React.useMemo(() => {
    const catStats = Object.values(CATEGORIES).reduce((acc, cat) => {
      acc[cat] = { name: cat, profit: 0, sales: 0 };
      return acc;
    }, {});

    orders.forEach(order => {
      const presetProduct = PRESET_PRODUCTS.find(p => p.name === order.productName);
      const category = presetProduct ? presetProduct.category : 'أخرى';
      const profit = Number(order.price) - Number(order.cost);
      
      if (!catStats[category]) {
        catStats[category] = { name: category, profit: 0, sales: 0 };
      }
      
      catStats[category].profit += profit;
      catStats[category].sales += 1;
    });

    return Object.values(catStats);
  }, [orders]);

  // حساب نسبة النمو
  const calculateGrowth = () => {
    if (orders.length < 2) return 0;
    
    const currentMonth = new Date().getMonth();
    const currentMonthOrders = orders.filter(
      order => new Date(order.date).getMonth() === currentMonth
    );
    const lastMonthOrders = orders.filter(
      order => new Date(order.date).getMonth() === currentMonth - 1
    );

    const currentProfit = currentMonthOrders.reduce(
      (sum, order) => sum + (Number(order.price) - Number(order.cost)), 0
    );
    const lastProfit = lastMonthOrders.reduce(
      (sum, order) => sum + (Number(order.price) - Number(order.cost)), 0
    );

    return lastProfit ? ((currentProfit - lastProfit) / lastProfit) * 100 : 0;
  };

  const growthRate = calculateGrowth();

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-indigo-50 to-white">
        <CardHeader>
          <CardTitle className="text-2xl text-indigo-800">المنتجات الأكثر ربحاً</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer>
              <BarChart data={topProducts}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalProfit" fill="#6366f1" name="إجمالي الربح" />
                <Bar dataKey="averageProfit" fill="#a5b4fc" name="متوسط الربح" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-emerald-50 to-white">
        <CardHeader>
          <CardTitle className="text-2xl text-emerald-800">أداء الفئات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer>
              <BarChart data={categoryPerformance}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="profit" fill="#059669" name="الربح" />
                <Bar dataKey="sales" fill="#34d399" name="المبيعات" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-amber-50 to-white">
        <CardHeader>
          <CardTitle className="text-2xl text-amber-800">مؤشرات الأداء</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm text-gray-600">معدل النمو الشهري</div>
              <div className={`text-2xl font-bold ${growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {growthRate.toFixed(1)}%
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm text-gray-600">متوسط الربح لكل طلب</div>
              <div className="text-2xl font-bold text-blue-600">
                {orders.length ? (orders.reduce((sum, order) => 
                  sum + (Number(order.price) - Number(order.cost)), 0) / orders.length).toFixed(2) : 0}
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm text-gray-600">عدد الطلبات</div>
              <div className="text-2xl font-bold text-purple-600">{orders.length}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedStats;