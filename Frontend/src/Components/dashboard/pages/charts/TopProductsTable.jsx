// src/apps/dashboard/pages/charts/TopProductsTable.jsx

import React from 'react';
import Skeleton from 'react-loading-skeleton';

const TopProductsTable = ({ title, data, isLoading }) => {
  if (isLoading) {
    return (
      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">{title}</h2>
        <Skeleton count={5} height={40} />
      </div>
    );
  }
  
  if (!data || data.length === 0) {
    return <div className="text-center py-10 text-gray-500">داده‌ای برای نمایش وجود ندارد.</div>;
  }

  // پردازش داده‌ها: تجمیع درآمد برای هر محصول و مرتب‌سازی
  const productPerformance = data.reduce((acc, sale) => {
    const key = sale.product_sku;
    if (!acc[key]) {
      acc[key] = {
        name: sale.product_full_name,
        sku: sale.product_sku,
        totalRevenue: 0,
      };
    }
    acc[key].totalRevenue += Number(sale.revenue);
    return acc;
  }, {});

  const topProducts = Object.values(productPerformance)
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5); // نمایش ۵ محصول برتر

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-700 mb-4">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3">محصول</th>
              <th scope="col" className="px-4 py-3 text-right">درآمد کل</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map((product) => (
              <tr key={product.sku} className="bg-white border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-xs text-gray-400">{product.sku}</p>
                </td>
                <td className="px-4 py-3 text-right font-bold text-green-600">
                  ${Number(product.totalRevenue).toLocaleString(undefined, {minimumFractionDigits: 2})}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopProductsTable;