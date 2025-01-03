import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import EnhancedAnalytics from './EnhancedAnalytics';
import Receipt from './Receipt';
import CurrencyConverter from './CurrencyConverter';
import { useThemeMode } from '../hooks/useThemeMode';
import { PRESET_PRODUCTS, CATEGORIES, PRODUCT_STATUS, PAYMENT_METHODS, CAPITAL_WARNING_THRESHOLD } from '../constants/data';

const StoreManagement = () => {
  const [theme, toggleTheme] = useThemeMode();
  const [capital, setCapital] = useState(() => {
    const savedCapital = localStorage.getItem('capital');
    return savedCapital ? Number(savedCapital) : 10000;
  });
  
  const [orders, setOrders] = useState(() => {
    try {
      const savedOrders = localStorage.getItem('orders');
      return savedOrders ? JSON.parse(savedOrders) : [];
    } catch (error) {
      console.error('Error parsing saved orders:', error);
      return [];
    }
  });
  const [isCustomProduct, setIsCustomProduct] = useState(() => {
    const savedIsCustom = localStorage.getItem('isCustomProduct');
    return savedIsCustom === 'true';
  });
  const [selectedProduct, setSelectedProduct] = useState(() => {
    const savedProduct = localStorage.getItem('selectedProduct');
    return savedProduct || '';
  });
  const [selectedCategory, setSelectedCategory] = useState(() => {
    const savedCategory = localStorage.getItem('selectedCategory');
    return savedCategory || 'all';
  });
  const [editingOrder, setEditingOrder] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(() => {
    const savedShowAnalytics = localStorage.getItem('showAnalytics');
    return savedShowAnalytics === 'true';
  });
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [newOrder, setNewOrder] = useState({
    date: new Date().toISOString().split('T')[0],
    productName: '',
    cost: 0,
    price: 0,
    category: '',
    status: PRODUCT_STATUS.NEW,
    notes: '',
    deliveryDate: '',
    paymentMethod: Object.values(PAYMENT_METHODS)[0]
  });

  const [showCapitalWarning, setShowCapitalWarning] = useState(false);

  // حفظ البيانات عند كل تغيير
  useEffect(() => {
    try {
      localStorage.setItem('capital', capital.toString());
      localStorage.setItem('orders', JSON.stringify(orders));

      // تنبيه رأس المال المنخفض
      if (calculateStats().remainingCapital < CAPITAL_WARNING_THRESHOLD) {
        setShowCapitalWarning(true);
        setTimeout(() => setShowCapitalWarning(false), 5000); // إخفاء بعد 5 ثواني
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }

    // تنظيف وحفظ البيانات عند إغلاق المكون
    return () => {
      try {
        localStorage.setItem('capital', capital.toString());
        localStorage.setItem('orders', JSON.stringify(orders));
      } catch (error) {
        console.error('Error saving data on cleanup:', error);
      }
    };
  }, [capital, orders]);

  // تنسيق التاريخ بالعربية
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ar-IQ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleProductSelect = (product) => {
    if (product === 'custom') {
      setIsCustomProduct(true);
      localStorage.setItem('isCustomProduct', 'true');
      localStorage.setItem('selectedProduct', product);
      setNewOrder({
        ...newOrder,
        productName: '',
        cost: 0,
        price: 0,
        category: ''
      });
    } else {
      const selectedPreset = PRESET_PRODUCTS.find(p => p.name === product);
      setIsCustomProduct(false);
      localStorage.setItem('isCustomProduct', 'false');
      localStorage.setItem('selectedProduct', product);
      setNewOrder({
        ...newOrder,
        productName: selectedPreset.name,
        cost: selectedPreset.defaultCost,
        price: selectedPreset.defaultPrice,
        category: selectedPreset.category
      });
    }
    setSelectedProduct(product);
  };

  const calculateStats = () => {
    const totalProfit = orders.reduce((sum, order) => 
      sum + (Number(order.price) - Number(order.cost)), 0);
    const totalCosts = orders.reduce((sum, order) => sum + Number(order.cost), 0);
    const remainingCapital = Number(capital) - totalCosts;
    
    return {
      totalProfit,
      totalCosts,
      remainingCapital
    };
  };

  const handleAddOrder = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const profit = Number(newOrder.price) - Number(newOrder.cost);
      const orderWithDate = {
        ...newOrder,
        profit,
        createdAt: new Date().toISOString()
      };

      if (editingOrder !== null) {
        const updatedOrders = orders.map((order, index) => 
          index === editingOrder ? orderWithDate : order
        );
        setOrders(updatedOrders);
        setEditingOrder(null);
      } else {
        setOrders([...orders, orderWithDate]);
      }

      setNewOrder({
        date: new Date().toISOString().split('T')[0],
        productName: '',
        cost: 0,
        price: 0,
        category: '',
        status: PRODUCT_STATUS.NEW,
        notes: '',
        deliveryDate: '',
        paymentMethod: Object.values(PAYMENT_METHODS)[0]
      });
      setSelectedProduct('');
      setIsCustomProduct(false);
      localStorage.removeItem('selectedProduct');
      localStorage.removeItem('isCustomProduct');
    } catch (error) {
      console.error('Error adding order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditOrder = (index) => {
    setEditingOrder(index);
    setNewOrder(orders[index]);
    setSelectedProduct(orders[index].productName);
    setIsCustomProduct(!PRESET_PRODUCTS.find(p => p.name === orders[index].productName));
  };

  const handleDeleteOrder = async (index) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
      setIsLoading(true);
      try {
        const updatedOrders = orders.filter((_, i) => i !== index);
        setOrders(updatedOrders);
      } catch (error) {
        console.error('Error deleting order:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleStatusChange = async (index, newStatus) => {
    setIsLoading(true);
    try {
      const updatedOrders = orders.map((order, i) => 
        i === index ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowReceipt = (order) => {
    setSelectedReceipt(order);
  };

  const filteredOrders = selectedCategory === 'all' 
    ? orders 
    : orders.filter(order => {
        const product = PRESET_PRODUCTS.find(p => p.name === order.productName);
        return product?.category === selectedCategory;
      });

  const stats = calculateStats();
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="p-4 max-w-7xl mx-auto space-y-6">
        {/* محول العملات */}
        <CurrencyConverter />
        
        {/* زر تبديل المظهر */}
        <button
          onClick={toggleTheme}
          className="fixed bottom-4 right-4 bg-gray-200 dark:bg-gray-700 p-3 rounded-full shadow-lg z-50 hover-scale"
          aria-label="تبديل المظهر"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {/* رأس المال */}
        <Card className="card-transition hover-card-shadow dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-800 dark:text-blue-200">إدارة رأس المال</CardTitle>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(new Date())}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative">
                <input
                  type="number"
                  value={capital}
                  onChange={(e) => setCapital(Number(e.target.value))}
                  className="input-style"
                  placeholder="أدخل رأس المال"
                />
              </div>
              <div className={`text-xl font-bold p-3 rounded-lg ${
                stats.remainingCapital < CAPITAL_WARNING_THRESHOLD 
                  ? 'bg-red-50 text-red-700 dark:bg-red-900/50 dark:text-red-200'
                  : 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200'
              }`}>
                رأس المال المتبقي: {stats.remainingCapital.toLocaleString()} دينار عراقي
              </div>
            </div>
          </CardContent>
        </Card>

        {/* إضافة طلب جديد */}
        <Card className="card-transition hover-card-shadow dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl text-purple-800 dark:text-purple-200">
              {editingOrder !== null ? 'تعديل الطلب' : 'إضافة طلب جديد'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddOrder} className="space-y-6">
              {/* تصنيفات المنتجات */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">الفئة</label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.values(CATEGORIES).map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(category);
                          localStorage.setItem('selectedCategory', category);
                        }}
                        className={`button-animation ${
                          selectedCategory === category
                            ? 'bg-purple-600 text-white dark:bg-purple-500'
                            : 'bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/50 dark:text-purple-200'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* المنتجات */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">المنتج</label>
                  <div className="grid grid-cols-2 gap-2">
                    {PRESET_PRODUCTS
                      .filter(product => selectedCategory === 'all' || product.category === selectedCategory)
                      .map((product) => (
                      <button
                        key={product.name}
                        type="button"
                        onClick={() => handleProductSelect(product.name)}
                        className={`button-animation ${
                          selectedProduct === product.name
                            ? 'bg-purple-600 text-white dark:bg-purple-500'
                            : 'bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/50 dark:text-purple-200'
                        }`}
                      >
                        {product.name}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleProductSelect('custom')}
                      className={`button-animation ${
                        isCustomProduct
                          ? 'bg-purple-600 text-white dark:bg-purple-500'
                          : 'bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/50 dark:text-purple-200'
                      }`}
                    >
                      منتج مخصص +
                    </button>
                  </div>
                </div>
              </div>

              {/* تفاصيل الطلب */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="date"
                    value={newOrder.date}
                    onChange={(e) => setNewOrder({...newOrder, date: e.target.value})}
                    className="input-style"
                    required
                  />
                </div>
                
                {isCustomProduct && (
                  <div>
                    <input
                      type="text"
                      value={newOrder.productName}
                      onChange={(e) => setNewOrder({...newOrder, productName: e.target.value})}
                      className="input-style"
                      placeholder="اسم المنتج"
                      required
                    />
                  </div>
                )}
                
                <div>
                  <input
                    type="number"
                    value={newOrder.cost}
                    onChange={(e) => setNewOrder({...newOrder, cost: e.target.value})}
                    className="input-style"
                    placeholder="تكلفة المنتج"
                    required
                  />
                </div>
                
                <div>
                  <input
                    type="number"
                    value={newOrder.price}
                    onChange={(e) => setNewOrder({...newOrder, price: e.target.value})}
                    className="input-style"
                    placeholder="سعر البيع"
                    required
                  />
                </div>

                <div>
                  <select
                    value={newOrder.paymentMethod}
                    onChange={(e) => setNewOrder({...newOrder, paymentMethod: e.target.value})}
                    className="input-style"
                    required
                  >
                    {Object.values(PAYMENT_METHODS).map(method => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <select
                    value={newOrder.status}
                    onChange={(e) => setNewOrder({...newOrder, status: e.target.value})}
                    className="input-style"
                  >
                    {Object.values(PRODUCT_STATUS).map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <textarea
                    value={newOrder.notes}
                    onChange={(e) => setNewOrder({...newOrder, notes: e.target.value})}
                    className="input-style"
                    placeholder="ملاحظات إضافية"
                    rows="3"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full primary-button"
                disabled={isLoading}
              >
                {isLoading ? 'جاري المعالجة...' : (editingOrder !== null ? 'تحديث الطلب' : 'إضافة الطلب')}
              </button>
            </form>
          </CardContent>
        </Card>

        {/* التحليل المالي */}
        <Card className="card-transition hover-card-shadow dark:bg-gray-800">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-2xl text-green-800 dark:text-green-200">التحليل المالي</CardTitle>
            <button
              onClick={() => {
                const newValue = !showAnalytics;
                setShowAnalytics(newValue);
                localStorage.setItem('showAnalytics', newValue.toString());
              }}
              className="secondary-button"
            >
              {showAnalytics ? 'إخفاء التحليلات' : 'عرض التحليلات'}
            </button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow dark:bg-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-300">إجمالي الأرباح</div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.totalProfit.toLocaleString()} دينار عراقي
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow dark:bg-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-300">إجمالي التكاليف</div>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {stats.totalCosts.toLocaleString()} دينار عراقي
                </div>
              </div>
            </div>

            {showAnalytics && <EnhancedAnalytics orders={orders} />}

            <div className="h-80 bg-white p-4 rounded-lg shadow dark:bg-gray-700">
              <ResponsiveContainer>
                <LineChart data={orders.map(order => ({
                  date: formatDate(order.date),
                  ربح: order.price - order.cost,
                  تكلفة: order.cost
                }))}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="ربح" 
                    stroke="#10b981" 
                    strokeWidth={2} 
                    name="الربح" 
                    dot={{ fill: '#10b981' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="تكلفة" 
                    stroke="#f43f5e" 
                    strokeWidth={2} 
                    name="التكلفة"
                    dot={{ fill: '#f43f5e' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* سجل الطلبات */}
        <Card className="card-transition hover-card-shadow dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800 dark:text-gray-200">سجل الطلبات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto" style={{ maxHeight: '600px' }}>
              <table className="table-styles w-full">
                <thead>
                  <tr>
                    <th>التاريخ</th>
                    <th>المنتج</th>
                    <th>التكلفة</th>
                    <th>سعر البيع</th>
                    <th>الربح</th>
                    <th>طريقة الدفع</th>
                    <th>الحالة</th>
                    <th>إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, index) => (
                    <tr key={index}>
                      <td data-label="التاريخ">{formatDate(order.date)}</td>
                      <td data-label="المنتج">{order.productName}</td>
                      <td data-label="التكلفة">{order.cost.toLocaleString()} د.ع</td>
                      <td data-label="سعر البيع">{order.price.toLocaleString()} د.ع</td>
                      <td data-label="الربح" className="font-medium text-green-600 dark:text-green-400">
                        {(order.price - order.cost).toLocaleString()} د.ع
                      </td>
                      <td data-label="طريقة الدفع">{order.paymentMethod}</td>
                      <td data-label="الحالة">
                        <span className={`status-badge ${
                          order.status === PRODUCT_STATUS.NEW ? 'status-new' :
                          order.status === PRODUCT_STATUS.COMPLETED ? 'status-completed' :
                          'status-cancelled'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleShowReceipt(order)}
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors button-animation"
                          >
                            الإيصال
                          </button>
                          <button
                            onClick={() => handleEditOrder(index)}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors button-animation"
                          >
                            تعديل
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(index)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors button-animation"
                          >
                            حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* مكون الإيصال */}
        {selectedReceipt && (
          <Receipt
            order={selectedReceipt}
            onClose={() => setSelectedReceipt(null)}
            theme={theme}
          />
        )}

        {/* تنبيه رأس المال المنخفض */}
        {showCapitalWarning && (
          <div className="notification notification-warning">
            تنبيه: رأس المال منخفض!
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreManagement;
