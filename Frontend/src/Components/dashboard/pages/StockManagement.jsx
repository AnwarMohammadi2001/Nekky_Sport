import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FaTrash,
  FaWarehouse,
  FaSearch,
  FaMobileAlt,
  FaPrint,
  FaBroom,
  FaBoxOpen,
  FaFilter,
} from "react-icons/fa";
import { Loader2, Package, DollarSign, TrendingUp, Layers, ShieldCheck } from "lucide-react";
import Pagination from "../../Pagination";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://127.0.0.1:8000";

const fetchStocks = async (token, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const { data } = await axios.get(
    `${BASE_URL}/api/v1/inventory/stocks/?${queryString}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

const fetchWarehouses = async (token) => {
  const { data } = await axios.get(`${BASE_URL}/api/v1/inventory/warehouses/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

const PRODUCT_TABS = [
  { id: "", label: "همه محصولات", icon: <Layers className="w-4 h-4" /> },
  { id: "mobile", label: " موبایل و پرزه جات آن", icon: <FaMobileAlt className="w-4 h-4" /> },
  { id: "printer", label: "پرنتر و پرزه جات آن", icon: <FaPrint className="w-4 h-4" /> },
  { id: "scrubber", label: "اسکاج و شوینده", icon: <FaBroom className="w-4 h-4" /> },
];

const StockManagement = () => {
  const { accessToken: token, currentUser } = useSelector((state) => state.user);
  const isAdminHQ = currentUser?.role === "ADMIN" || currentUser?.is_superuser;
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterWarehouse, setFilterWarehouse] = useState("");
  const [activeTypeFilter, setActiveTypeFilter] = useState("");

  const { data: whData } = useQuery({
    queryKey: ["warehouses"],
    queryFn: () => fetchWarehouses(token),
    enabled: !!token,
  });

  const warehouses = useMemo(() => (Array.isArray(whData) ? whData : whData?.results || []), [whData]);

  // ✅ اصلاح پیدا کردن انبار فروشنده
  useEffect(() => {
    if (warehouses.length > 0 && currentUser?.id) {
      if (isAdminHQ) {
        const mainWh = warehouses.find(w => w.warehouse_type === 'main');
        if (mainWh) setFilterWarehouse(mainWh.id);
      } else {
        // پیدا کردن انبار با مقایسه دقیق آی‌دی (تبدیل به String برای اطمینان)
        const myWh = warehouses.find(w => String(w.manager) === String(currentUser.id));
        if (myWh) setFilterWarehouse(myWh.id);
      }
    }
  }, [warehouses, isAdminHQ, currentUser]);

  const { data: stockData, isLoading: stocksLoading } = useQuery({
    queryKey: ["stocks", currentPage, searchTerm, filterWarehouse],
    queryFn: () =>
      fetchStocks(token, {
        page: currentPage,
        search: searchTerm,
        warehouse: filterWarehouse || undefined,
      }),
    enabled: !!token, // ✅ تغییر کرد: حالا کوئری همیشه مجاز است چون بک‌اِند هوشمند عمل می‌کند
    keepPreviousData: true,
  });

  const stocks = useMemo(() => (Array.isArray(stockData) ? stockData : stockData?.results || []), [stockData]);
  const totalCount = stockData?.count || 0;
  const totalPages = Math.ceil(totalCount / 10);

  const displayedStocks = useMemo(() => {
    if (!activeTypeFilter) return stocks;
    return stocks.filter(stock => stock.product_details?.product_type === activeTypeFilter);
  }, [stocks, activeTypeFilter]);

  const stats = useMemo(() => {
    return displayedStocks.reduce((acc, s) => {
        const costBasis = isAdminHQ ? parseFloat(s.purchase_price_per_unit || 0) : parseFloat(s.sell_price_per_unit || 0);
        return { count: acc.count + s.quantity, value: acc.value + (s.quantity * costBasis) };
      }, { count: 0, value: 0 }
    );
  }, [displayedStocks, isAdminHQ]);

  const deleteMutation = useMutation({
    mutationFn: (id) => axios.delete(`${BASE_URL}/api/v1/inventory/stocks/${id}/`, { headers: { Authorization: `Bearer ${token}` } }),
    onSuccess: () => { Swal.fire("حذف شد", "رکورد حذف شد.", "success"); queryClient.invalidateQueries(["stocks"]); },
  });

  return (
    <div className="bg-white rounded-md p-4 sm:p-6" dir="rtl">
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3"><FaWarehouse /> {isAdminHQ ? "موجودی کالا (انبار مرکزی)" : "موجودی شعبه شما"}</h1>
            <p className="text-gray-500 mt-1 text-sm">{isAdminHQ ? "مدیریت موجودی مرکز" : "لیست کالاهای موجود در انبار شما"}</p>
          </div>
          {isAdminHQ && <div className="bg-cyan-50 text-cyan-700 px-4 py-2 rounded-lg border border-cyan-100 flex items-center gap-2 text-xs font-bold"><ShieldCheck size={16}/> وضعیت: انبار مرکزی</div>}
        </div>
        <div className="bg-gray-50 p-1.5 rounded-md flex flex-wrap gap-2 w-fit border border-gray-200">
          {PRODUCT_TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTypeFilter(tab.id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-bold transition-all ${activeTypeFilter === tab.id ? "bg-white text-cyan-700 shadow-md border border-cyan-700" : "text-gray-500 hover:bg-gray-200"}`}>{tab.icon} {tab.label}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-200 p-5 rounded-md shadow-md flex justify-between">
          <div><p className="text-xs font-bold text-gray-700 mb-1">تعداد اقلام موجود</p><p className="text-2xl font-black">{stats.count}</p></div>
          <div className="bg-white p-2 rounded-lg text-blue-700"><Package /></div>
        </div>
        <div className="bg-gray-200 p-5 rounded-md shadow-md flex justify-between">
          <div><p className="text-xs font-bold text-gray-700 mb-1">{isAdminHQ ? "تخمین سرمایه در گردش" : "ارزش بار دریافتی"}</p><p className="text-2xl font-black">${stats.value.toLocaleString()}</p></div>
          <div className="bg-white p-2 rounded-lg text-green-700"><DollarSign /></div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6 bg-gray-200 p-4 rounded-md">
        <div className="relative flex-1"><FaSearch className="absolute left-3 top-3.5 text-gray-400" /><input type="text" placeholder="جستجو..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-md focus:outline-none" /></div>
        <div className="relative w-full md:w-72"><FaFilter className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" /><select value={filterWarehouse} disabled className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-md font-bold appearance-none">{warehouses.map((w) => (<option key={w.id} value={w.id}>{w.warehouse_type === 'main' ? `🏠 ${w.name}` : `🏪 ${w.name}`}</option>))}</select></div>
      </div>

      <div className="border border-gray-200 rounded-md overflow-hidden bg-white shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-center text-sm">
            <thead className="bg-slate-900 text-white font-bold">
              <tr>
                <th className="px-5 py-4">شماره</th>
                <th className="px-5 py-4">مشخصات کالا</th>
                <th className="px-5 py-4 text-center">تعداد موجود</th>
                {!isAdminHQ && <th className="px-5 py-4 text-center">فی خرید (از مرکز)</th>}
                <th className="px-5 py-4 text-center">{isAdminHQ ? "بازه قیمت فروش مجاز (شعب)" : "فی فروش نهایی"}</th>
                {isAdminHQ && <th className="px-5 py-4 text-center">عملیات</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stocksLoading ? (
                <tr><td colSpan="6" className="p-12 text-center"><Loader2 className="animate-spin mx-auto w-8 h-8 text-gray-400" /></td></tr>
              ) : displayedStocks.length === 0 ? (
                <tr><td colSpan="6" className="p-12 text-center text-gray-400"><FaBoxOpen size={40} className="mx-auto mb-2 opacity-20" /><p>کالایی یافت نشد.</p></td></tr>
              ) : (
                displayedStocks.map((stock, index) => (
                  <tr key={stock.id} className="hover:bg-gray-50 border-b border-gray-200 transition">
                    <td className="px-5 py-4 font-bold ">{index + 1 + (currentPage - 1) * 10}</td>
                    <td className="px-5 py-4"><div className="font-bold text-gray-900">{stock.product_details?.full_name}</div><div className="text-[10px] text-gray-400 mt-1">{stock.product_details?.sku}</div></td>
                    <td className="px-5 py-4 text-center"><span className={`px-3 py-1 rounded-lg font-bold text-sm ${stock.quantity > 0 ? "text-cyan-700 bg-cyan-50" : "bg-red-50 text-red-700"}`}>{stock.quantity}</span></td>
                    {!isAdminHQ && <td className="px-5 py-4 text-center text-gray-700 font-bold">${Number(stock.sell_price_per_unit).toLocaleString()}</td>}
                    <td className="px-5 py-4 text-center font-bold text-green-600">{isAdminHQ ? `$${Number(stock.min_selling_price).toLocaleString()} - $${Number(stock.max_selling_price).toLocaleString()}` : `$${Number(stock.sell_price_per_unit).toLocaleString()}`}</td>
                    {isAdminHQ && <td className="px-5 py-4 text-center"><button onClick={() => { Swal.fire({ title: "حذف؟", icon: "warning", showCancelButton: true }).then((r) => { if (r.isConfirmed) deleteMutation.mutate(stock.id); }); }} className="text-red-400 bg-red-50 p-2 rounded-lg hover:bg-red-100 transition"><FaTrash /></button></td>}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-6"><Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} /></div>
    </div>
  );
};

export default StockManagement;