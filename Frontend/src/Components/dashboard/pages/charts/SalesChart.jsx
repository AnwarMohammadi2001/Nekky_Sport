// src/apps/dashboard/pages/charts/SalesChart.jsx

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Skeleton from 'react-loading-skeleton';

const SalesChart = ({ data, isLoading }) => {
  if (isLoading) {
    return <Skeleton height={300} />;
  }
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-[300px] text-gray-500">داده‌ای برای نمایش وجود ندارد.</div>;
  }
  
  // پردازش داده‌ها: تجمیع درآمد بر اساس ماه
  const monthlyData = data.reduce((acc, sale) => {
    const month = new Date(sale.due_date).toLocaleString('fa-AF', { month: 'short', year: 'numeric' });
    if (!acc[month]) {
      acc[month] = { month, revenue: 0 };
    }
    acc[month].revenue += Number(sale.revenue);
    return acc;
  }, {});
  
  const chartData = Object.values(monthlyData).sort((a, b) => new Date(a.month) - new Date(b.month));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" fontSize={12} />
        <YAxis fontSize={12} tickFormatter={(value) => `$${value.toLocaleString()}`} />
        <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
        <Legend />
        <Line type="monotone" dataKey="revenue" name="درآمد" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SalesChart;