import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import {
  Archive, ShoppingCart, TrendingUp, HandCoins,
  Package, DollarSign, AlertTriangle, Store, Smartphone, Laptop, FileDown, Truck, User
} from "lucide-react";
import ReportingFilters from "./ReportingFilters";
import { fetchComprehensiveReport } from "../../../services/api";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://127.0.0.1:8000";

const Reporting = ({ activityType = "general" }) => {
  const { accessToken: token, currentUser, profile } = useSelector((state) => state.user);
  
  // ✅ تشخیص دقیق ادمین
  const isStrictAdmin = currentUser?.is_superuser === true || currentUser?.role === "ADMIN" || profile?.role === "ADMIN";

  const isMobile = activityType === "mobile";
  const themeBorder = isMobile ? "border-indigo-600" : "border-slate-800";
  const btnColor = isMobile ? "bg-indigo-700" : "bg-slate-900";
  const activeTabColor = isMobile ? "bg-indigo-700 text-white" : "bg-slate-900 text-white";

  const tabs = useMemo(() => {
      const baseTabs = [
          { id: "inventory", name: "موجودی کالاها", icon: <Archive size={16} /> },
          { id: "sales", name: "گزارش فروشات", icon: <ShoppingCart size={16} /> },
          { id: "debt", name: "وضعیت بدهی", icon: <HandCoins size={16} /> },
          { id: "profit", name: "سود و زیان واقعی", icon: <TrendingUp size={16} /> },
      ];
      // ✅ فقط ادمین تب عملکرد شعب را می‌بیند
      if (isStrictAdmin) {
          baseTabs.push({ id: "branches", name: "عملکرد شعبات", icon: <Store size={16} /> });
      }
      return baseTabs;
  }, [isStrictAdmin]);

  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [filters, setFilters] = useState({});

  const { data: report, isLoading } = useQuery({
    queryKey: ["comprehensiveReport", filters, activityType],
    queryFn: () => fetchComprehensiveReport(token, { ...filters, activity_type: activityType }),
    enabled: !!token,
  });

  const handleExport = (type, format = 'csv') => {
      const q = new URLSearchParams({...filters, activity_type: activityType, token}).toString();
      window.open(`${BASE_URL}/api/v1/reporting/exports/${type}-${format}/?${q}`, "_blank");
  };

  const renderContent = () => {
    if (!report) return <div className="py-20 text-center text-gray-400 font-bold">دیتا یافت نشد.</div>;
    switch (activeTab) {
      case "inventory": return <InventoryTab data={report.inventory_report} isMobile={isMobile} />;
      case "sales": return <SalesTab data={report.sales_report} isMobile={isMobile} isHQ={isStrictAdmin} />;
      case "debt": return <DebtTab data={report.debt_report} />;
      case "branches": return <BranchTab data={report.branch_report} />;
      case "profit": return <ProfitTab data={report.profit_report} isMobile={isMobile} isHQ={isStrictAdmin} />;
      default: return null;
    }
  };

  return (
    <div className={`bg-white rounded-md p-6 border-t-4 shadow-sm ${themeBorder}`} dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 pb-4 border-b gap-4">
        <div className="flex items-center gap-4">
          <div className={`${btnColor} text-white p-3 rounded-xl shadow-lg`}>
              {isMobile ? <Smartphone size={32} /> : <Laptop size={32} />}
          </div>
          <div>
            <h1 className="text-2xl font-black">{isMobile ? "گزارشات اختصاصی بخش موبایل" : "گزارش عمومی (ماشین اداری و اسکاج)"}</h1>
            <p className="text-sm text-gray-500 mt-1">{isStrictAdmin ? "تحلیل کل شرکت" : "تحلیل عملکرد شعبه شما"}</p>
          </div>
        </div>
        {isStrictAdmin && (
            <button onClick={() => handleExport('master-report', 'pdf')} className={`flex items-center gap-2 text-white px-5 py-2 rounded-md font-bold text-sm ${isMobile ? 'bg-indigo-600' : 'bg-slate-800'}`}>
                <FileDown size={18} /> دانلود PDF جامع
            </button>
        )}
      </div>

      <ReportingFilters onFilterChange={setFilters} activityType={activityType} />

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-bold border transition-all ${activeTab === tab.id ? activeTabColor : "bg-white text-gray-500 hover:border-gray-400"}`}>
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
          {isLoading ? <div className="h-64 bg-gray-50 rounded-xl animate-pulse" /> : renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const Card = ({ title, value, icon, color = "text-black" }) => (
  <div className="bg-gray-50 border border-gray-100 p-5 rounded-xl">
    <div className="flex justify-between items-start mb-2">
      <span className="text-gray-400 text-[9px] font-black uppercase tracking-tighter">{title}</span>
      <span className="text-slate-300">{icon}</span>
    </div>
    <div  className={`text-lg font-black ${color}`}>{(value || 0).toLocaleString()}</div>
  </div>
);

const InventoryTab = ({ data, isMobile }) => (
  <div className="animate-fadeIn">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card title="ارزش موجودی (فی خرید)" value={`$${Number(data?.total_inventory_value || 0)}`} icon={<DollarSign size={18}/>} color="text-green-600" />
      <Card title="تعداد کل کالاها" value={data?.total_quantity_in_stock} icon={<Archive size={18}/>} color={isMobile ? 'text-indigo-600' : 'text-slate-700'} />
      <Card title="وضعیت" value="در انبار" icon={<Package size={18}/>} color="text-blue-500" />
    </div>
    <div className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm">
        <table className="w-full text-center text-sm">
            <thead className="bg-slate-50 text-gray-500 font-bold uppercase text-[10px]">
                <tr><th className="px-5 py-3">نام محصول</th><th className="px-5 py-3">انبار</th><th className="px-5 py-3">تعداد</th><th className="px-5 py-3">ارزش</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
                {(data?.stock_details || []).map((s, i) => (
                    <tr key={i} className="hover:bg-gray-50"><td className="px-5 py-3 font-bold text-gray-800">{s.product_full_name}</td><td className="px-5 py-3 text-xs text-gray-500">{s.warehouse_name}</td><td className="px-5 py-3 font-bold text-blue-600">{s.quantity}</td><td className="px-5 py-3 font-bold text-green-600">${(Number(s.value) || 0).toLocaleString()}</td></tr>
                ))}
            </tbody>
        </table>
    </div>
  </div>
);

const SalesTab = ({ data, isMobile, isHQ }) => (
    <div className="animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card title="مجموع فروشات" value={`$${Number(data?.total_revenue || 0)}`} icon={<TrendingUp size={18}/>} color="text-green-600" />
        {isHQ ? (
            <>
                <Card title="فروش مستقیم مرکز" value={`$${Number(data?.direct_hq_sales || 0)}`} icon={<User size={18}/>} color="text-blue-600" />
                <Card title="ارزش توزیع به شعب" value={`$${Number(data?.total_transfer_value || 0)}`} icon={<Truck size={18}/>} color="text-orange-600" />
            </>
        ) : (
            <Card title="فروش شعبه" value={`$${Number(data?.branch_sales || 0)}`} icon={<Store size={18}/>} color="text-blue-600" />
        )}
        <Card title="تعداد فاکتورها" value={data?.total_sales_count} icon={<ShoppingCart size={18}/>} color={isMobile ? 'text-indigo-600' : 'text-slate-700'} />
      </div>
      <div className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm">
          <table className="w-full text-center text-sm">
              <thead className="bg-slate-50 text-gray-600 font-bold uppercase text-[10px]">
                  <tr><th className="px-5 py-3">شرح کالا</th><th className="px-5 py-3">تاریخ</th><th className="px-5 py-3">تعداد</th><th className="px-5 py-3">ارزش</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                  {(data?.sales_details || []).map((s, i) => (
                      <tr key={i} className="hover:bg-gray-50"><td className="px-5 py-3 font-bold text-gray-800">{s.product_full_name}</td><td className="px-5 py-3 text-xs">{s.due_date}</td><td className="px-5 py-3 font-bold">{s.quantity}</td><td className="px-5 py-3 font-bold text-green-600">${(Number(s.revenue) || 0).toLocaleString()}</td></tr>
                  ))}
              </tbody>
          </table>
      </div>
    </div>
);

const ProfitTab = ({ data, isMobile, isHQ }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
      {isMobile ? (
          <div className="md:col-span-3 bg-indigo-700 text-white p-10 rounded-2xl shadow-xl text-center">
              <p className="text-indigo-200 text-xs font-black mb-2 uppercase tracking-widest">سود حاصل از بخش موبایل</p>
              <p className="text-5xl font-black text-white">${(Number(data?.total_gross_profit) || 0).toLocaleString()}</p>
          </div>
      ) : (
          <>
            <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl border-b-4 border-green-500">
                <p className="text-gray-400 text-xs font-bold mb-2 uppercase tracking-widest">{isHQ ? "سود خالص کل شرکت" : "سود خالص شعبه"}</p>
                <p className="text-3xl font-black text-green-400">${(Number(data?.total_combined_profit) || 0).toLocaleString()}</p>
            </div>
            <Card title="سود ناخالص عملیاتی" value={`$${Number(data?.total_gross_profit || 0)}`} icon={<DollarSign size={18}/>} color="text-blue-600" />
            <Card title="مجموع مخارج" value={`-$${Number(data?.total_expenses || 0)}`} icon={<AlertTriangle size={18}/>} color="text-red-600" />
          </>
      )}
    </div>
);

const BranchTab = ({ data }) => (
    <div className="space-y-4 animate-fadeIn">
      {(data || []).map((b, i) => (
        <div key={i} className="bg-white border rounded-xl p-6 flex justify-between items-center hover:shadow-md transition-shadow">
            <div>
                <h3 className="font-black text-lg text-slate-800">{b.warehouse_name}</h3>
                <p className="text-xs text-gray-500">مدیر شعبه: {b.manager}</p>
            </div>
            <div className="flex gap-10 text-center">
                <div><p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">بدهی بار</p><p className="font-black text-red-600 text-lg">${Number(b.remaining_debt).toLocaleString()}</p></div>
                <div><p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">سود عملیاتی</p><p className="font-black text-green-600 text-lg">${Number(b.net_income).toLocaleString()}</p></div>
            </div>
        </div>
      ))}
    </div>
);

const DebtTab = ({ data }) => (
    <div className="border border-red-100 rounded-xl overflow-hidden bg-white shadow-sm animate-fadeIn">
        <div className="p-4 bg-red-50 flex justify-between items-center border-b border-red-100"><span className="text-red-700 font-black text-sm">مجموع طلب در این بخش:</span><span className="text-red-700 font-black text-2xl">${(Number(data?.total_outstanding_debt) || 0).toLocaleString()}</span></div>
        <table className="w-full text-center text-sm">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px]"><tr><th className="p-3">مشتری</th><th className="p-3">تماس</th><th className="p-3">بدهی</th></tr></thead>
            <tbody className="divide-y divide-gray-50">
                {(data?.debt_details || []).map((d, i) => (
                    <tr key={i} className="hover:bg-red-50/30 transition"><td className="p-3 font-bold text-gray-800">{d.customer_name}</td><td className="p-3 font-mono text-gray-500 text-xs">{d.phone}</td><td className="p-3 font-black text-red-600">${(Number(d.debt) || 0).toLocaleString()}</td></tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default Reporting;