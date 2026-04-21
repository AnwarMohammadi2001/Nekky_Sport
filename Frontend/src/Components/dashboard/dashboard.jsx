// src/apps/dashboard/Dashboard.jsx

import React, { useState } from "react";
import { FaSyncAlt, FaDollarSign, FaShoppingCart, FaChartLine, FaArchive } from "react-icons/fa";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";

// --- کامپوننت‌های مورد نیاز را وارد کنید ---
import { fetchComprehensiveReport } from "../../services/api";
import SalesChart from "./pages/charts/SalesChart";
import TopProductsTable from "./pages/charts/TopProductsTable";
import StatCard from "./pages/charts/StatCard";
import ReportingFilters from "./pages/ReportingFilters"; 

const Dashboard = () => {
  const queryClient = useQueryClient();
  
  const [filters, setFilters] = useState({});

  // --- >> useQuery اکنون فیلترها را به عنوان بخشی از کلید و پارامترها دریافت می‌کند << ---
  const { data: report, isLoading, isError, error } = useQuery({
    queryKey: ["dashboardReport", filters], // کلید کوئری اکنون شامل فیلترهاست
    queryFn: () => fetchComprehensiveReport(filters), // فیلترها به API ارسال می‌شوند
    staleTime: 5 * 60 * 1000,
  });
  
  const profitReport = report?.profit_report || {};
  const salesReport = report?.sales_report || {};
  const inventoryReport = report?.inventory_report || {};

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["dashboardReport", filters] });
  };

  if (isError) {
    return <div className="p-6 text-center text-red-500">خطا: {error.message}</div>;
  }
  
  return (
    <motion.div 
      className="p-6 bg-gray-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      dir="rtl"
    >
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-800">نمای کلی داشبورد</h1>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          <FaSyncAlt className={`${isLoading ? "animate-spin" : ""}`} />
          تازه‌سازی
        </button>
      </div>

      {/* --- >> کامپوننت فیلترها اینجا اضافه شد << --- */}
      <ReportingFilters onFilterChange={setFilters} />

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<FaChartLine />} title="درآمد کل" value={salesReport.total_revenue} prefix="$" loading={isLoading} />
        <StatCard icon={<FaDollarSign />} title="سود خالص شرکت" value={profitReport.total_company_profit} prefix="$" loading={isLoading} />
        <StatCard icon={<FaShoppingCart />} title="تعداد کل فروشات" value={salesReport.total_sales_count} loading={isLoading} />
        <StatCard icon={<FaArchive />} title="ارزش موجودی" value={inventoryReport.total_inventory_value} prefix="$" loading={isLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white p-5 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">درآمد فروش در طول زمان</h2>
          <SalesChart data={salesReport.sales_details} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-2 bg-white p-5 rounded-lg shadow-md">
          <TopProductsTable title="پرفروش‌ترین محصولات (بر اساس درآمد)" data={salesReport.sales_details} isLoading={isLoading} />
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;