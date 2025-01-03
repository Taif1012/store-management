import React from 'react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

// Helper function to format currency in Turkish Lira
const formatLira = (valueInDinar) => {
  const exchangeRate = localStorage.getItem('exchangeRate') || 1;
  const valueInLira = valueInDinar * exchangeRate;
  return `${valueInLira.toLocaleString()} ₺`;
};

const Receipt = ({ order, onClose, theme }) => {
  const formatDate = (date) => {
    return format(new Date(date), 'dd MMMM yyyy', { locale: ar });
  };
  
  const receiptNumber = `INV-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center z-50 ${
        theme === 'dark' ? 'bg-black/80' : 'bg-black/75'
      }`}
      onClick={onClose}
    >
      <div 
        className={`w-96 p-8 rounded-lg shadow-xl transform transition-all duration-300 
          ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* رأس الإيصال */}
        <div className="text-center mb-6">
          <h2 className={`text-2xl font-bold mb-2 ${
            theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
          }`}>
            الطيف ستور
          </h2>
          <div className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
            للخدمات الرقمية والألعاب
          </div>
          <div className="border-b-2 border-dashed my-4"></div>
        </div>

        {/* تفاصيل الإيصال */}
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              رقم الإيصال:
            </span>
            <span className="font-medium">{receiptNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              التاريخ:
            </span>
            <span>{formatDate(order.date)}</span>
          </div>
          
          <div className="border-b border-dashed my-4"></div>
          
          <div className="space-y-2">
            <div className="flex justify-between font-medium">
              <span>المنتج:</span>
              <span>{order.productName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                السعر:
              </span>
              <div className="text-left">
                <div>{order.price.toLocaleString()} دينار عراقي</div>
                <div className="text-sm text-gray-500">{formatLira(order.price)}</div>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                طريقة الدفع:
              </span>
              <span>{order.paymentMethod}</span>
            </div>
          </div>
          
          <div className="border-b border-dashed my-4"></div>
          
          <div className="flex justify-between text-lg font-bold">
            <span>المجموع:</span>
            <div className="text-left">
              <div className={theme === 'dark' ? 'text-green-400' : 'text-green-600'}>
                {order.price.toLocaleString()} دينار عراقي
              </div>
              <div className="text-sm text-gray-500">
                {formatLira(order.price)}
              </div>
            </div>
          </div>

          {order.notes && (
            <div className="mt-4 text-sm">
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                ملاحظات:
              </span>
              <p className="mt-1">{order.notes}</p>
            </div>
          )}
        </div>

        {/* تذييل الإيصال */}
        <div className="mt-8 text-center">
          <div className="border-t-2 border-dashed pt-4">
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              شكراً لتعاملكم معنا
            </p>
            <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              @AlTaifStore
            </p>
          </div>
        </div>

        {/* أزرار التحكم */}
        <div className="mt-6 flex gap-3">
          <button 
            onClick={() => {
              window.print();
            }}
            className={`flex-1 py-2 px-4 rounded-lg ${
              theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            طباعة
          </button>
          <button 
            onClick={onClose}
            className={`flex-1 py-2 px-4 rounded-lg ${
              theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
