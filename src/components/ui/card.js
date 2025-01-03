import React from 'react';

export const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className = '' }) => {
  return (
    <h3 className={`text-xl font-bold ${className}`}>
      {children}
    </h3>
  );
};

export const CardContent = ({ children, className = '' }) => {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
};