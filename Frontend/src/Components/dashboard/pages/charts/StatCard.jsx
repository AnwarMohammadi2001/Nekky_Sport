// src/apps/dashboard/pages/charts/StatCard.jsx

import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const StatCard = ({ title, value, icon, loading, prefix = '', suffix = '' }) => (
  <div className="bg-white p-5 rounded-xl shadow-lg border flex items-start justify-between">
    <div>
      <p className="text-sm font-semibold text-gray-600">{title}</p>
      {loading ? (
        <Skeleton width={120} height={32} className="mt-2" />
      ) : (
        <p className="text-3xl font-bold text-gray-900 mt-2">
          {prefix}{Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}{suffix}
        </p>
      )}
    </div>
    <div className="bg-gray-100 p-3 rounded-lg text-blue-600">{icon}</div>
  </div>
);

export default StatCard;