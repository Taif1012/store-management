import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl min-w-[200px] transform transition-all">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-900 rounded-full animate-pulse"></div>
            <div className="absolute top-0 left-0 w-16 h-16">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>

          <div className="text-center space-y-2">
            <div className="text-gray-600 dark:text-gray-300 font-medium">
              جاري المعالجة...
            </div>
            <div className="w-48 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full animate-progressBar"></div>
            </div>
          </div>

          <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            الرجاء الانتظار...
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
