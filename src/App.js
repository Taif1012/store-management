import React from 'react';
import StoreManagement from './components/StoreManagement';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 shadow-lg">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-center">نظام إدارة المتجر</h1>
        </div>
      </header>
      <main className="container mx-auto py-8 px-4">
        <StoreManagement />
      </main>
    </div>
  );
}

export default App;