import React, { useState, useMemo, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import Select from "react-select";
import Swal from "sweetalert2";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaPlus, FaTrash, FaTimes, FaReceipt, FaShoppingCart,
  FaFilter, FaEye, FaWarehouse, FaPrint,
} from "react-icons/fa";
import { Search, FileText, Loader2, User } from "lucide-react";
import axios from "axios";

// import های کامپوننت‌های کمکی
import SubmitBtn from "../../../utils/SubmitBtn";
import Pagination from "../../Pagination";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://127.0.0.1:8000";

// --- API Calls ---
const fetchStocks = async (token) => {
    const { data } = await axios.get(`${BASE_URL}/api/v1/inventory/stocks/`, { headers: { Authorization: `Bearer ${token}` } });
    return data;
};
const fetchCustomers = async (token) => {
    const { data } = await axios.get(`${BASE_URL}/api/v1/customers/customers/`, { headers: { Authorization: `Bearer ${token}` } });
    return data;
};
const fetchWarehouses = async (token) => {
    const { data } = await axios.get(`${BASE_URL}/api/v1/inventory/warehouses/`, { headers: { Authorization: `Bearer ${token}` } });
    return data;
};
const fetchCategories = async (token) => {
    const { data } = await axios.get(`${BASE_URL}/api/v1/categories/categories/`, { headers: { Authorization: `Bearer ${token}` } });
    return data;
};
const fetchInvoices = async (token, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const { data } = await axios.get(`${BASE_URL}/api/v1/inventory/invoices/?${queryString}`, { headers: { Authorization: `Bearer ${token}` } });
    return data;
};
const createInvoice = async (token, data) => {
    const response = await axios.post(`${BASE_URL}/api/v1/inventory/invoices/`, data, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
};
const deleteInvoice = async (token, id) => {
    const response = await axios.delete(`${BASE_URL}/api/v1/inventory/invoices/${id}/`, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
};

// --- Constants ---
const productTypes = [
  { value: "mobile", label: "📱 موبایل و لوازم جانبی" },
  { value: "printer", label: "🖨️ پرینتر و ماشین اداری" },
  { value: "scrubber", label: "🧽 اسکاج و شوینده" },
];

// --- Hooks ---
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
};

// ==========================================
// 1. Invoice Receipt Component (Print View)
// ==========================================
// ==========================================
// 1. Invoice Receipt Component (Professional Bill View)
// ==========================================
const InvoiceReceipt = ({ invoice, onClose }) => {
  const printRef = useRef();

  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const win = window.open("", "", "height=900,width=850");
    win.document.write(`
      <html>
        <head>
          <title>Invoice - ${invoice.id}</title>
          <style>
            @font-face { font-family: 'Tahoma'; }
            body { font-family: 'Tahoma', sans-serif; direction: rtl; padding: 20px; color: #333; }
            .bill-container { border: 1px solid #eee; padding: 30px; border-radius: 10px; position: relative; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
            .info-box h3 { margin: 0 0 10px 0; font-size: 14px; color: #777; border-bottom: 1px solid #eee; }
            .info-box p { margin: 5px 0; font-size: 13px; font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #f8f9fa; border: 1px solid #dee2e6; padding: 12px; text-align: center; font-size: 12px; }
            td { border: 1px solid #dee2e6; padding: 12px; text-align: center; font-size: 13px; }
            .total-section { margin-top: 30px; display: flex; flex-direction: column; align-items: flex-end; }
            .total-row { display: flex; width: 250px; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .grand-total { font-size: 18px; font-weight: 900; color: #000; border-bottom: 2px double #333; margin-top: 10px; }
            .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 100px; font-weight: bold; opacity: 0.1; pointer-events: none; }
            .footer { margin-top: 50px; text-align: center; font-size: 10px; color: #aaa; border-top: 1px dashed #ccc; pt: 10px; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="bill-container">
            ${content}
          </div>
          <script>window.onload = function() { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
    win.document.close();
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-center items-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-w-4xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-1 overflow-y-auto bg-white p-10 custom-scrollbar" ref={printRef}>
          {/* Watermark */}
          <div className={`watermark ${invoice.payment_status === 'paid' ? 'text-green-500' : 'text-red-500'}`}>
            {invoice.payment_status === 'paid' ? 'پرداخت شد' : 'قرض'}
          </div>

          {/* Header */}
          <div className="flex justify-between items-start border-b-4 border-gray-800 pb-6 mb-8">
            <div>
              <h1 className="text-4xl font-black tracking-tighter text-gray-900">SAADAT GROUP</h1>
              <p className="text-gray-500 font-bold mt-1 uppercase tracking-widest text-xs">Trading & Logistics System</p>
            </div>
            <div className="text-left">
              <h2 className="text-3xl font-black text-gray-400">INVOICE</h2>
              <p className="font-mono text-lg font-bold">#INV-{invoice.id.toString().slice(0, 8).toUpperCase()}</p>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-12 mb-10">
            <div className="space-y-2">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b pb-1">فروشنده</h3>
              <p className="text-sm font-black">گروه تجارتی سعادت</p>
              <p className="text-xs text-gray-600">مرکز توزیع: {invoice.warehouse_name || "انبار مرکزی"}</p>
              <p className="text-xs text-gray-600">تاریخ صدور: {new Date(invoice.created_at || Date.now()).toLocaleDateString('fa-IR')}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b pb-1">خریدار</h3>
              <p className="text-sm font-black">{invoice.customer_name || "مشتری عمومی"}</p>
              <p className="text-xs text-gray-600">وضعیت پرداخت: 
                <span className={`mr-2 font-bold ${invoice.payment_status === 'paid' ? 'text-green-600' : 'text-red-600'}`}>
                  {invoice.payment_status === 'paid' ? 'نقدی (تصفیه)' : 'نسیه (باقی‌دار)'}
                </span>
              </p>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-900 text-white uppercase text-[10px] tracking-widest">
                <th className="p-4 border border-gray-800 w-12">#</th>
                <th className="p-4 border border-gray-800 text-right">شرح کالا</th>
                <th className="p-4 border border-gray-800 w-24">تعداد</th>
                <th className="p-4 border border-gray-800 text-left">فی واحد ($)</th>
                <th className="p-4 border border-gray-800 text-left">جمع کل ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoice.items.map((item, idx) => (
                <tr key={idx} className="text-sm">
                  <td className="p-4 text-center font-mono text-gray-400">{idx + 1}</td>
                  <td className="p-4 text-right font-bold text-gray-800">{item.product_name}</td>
                  <td className="p-4 text-center font-black">{item.quantity}</td>
                  <td className="p-4 text-left font-mono">${Number(item.selling_price_per_unit).toLocaleString()}</td>
                  <td className="p-4 text-left font-black text-gray-900">${Number(item.subtotal).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals Section */}
          <div className="mt-10 flex flex-col items-end">
            <div className="w-72 space-y-3">
              <div className="flex justify-between text-gray-500 text-sm">
                <span>جمع جزء:</span>
                <span className="font-mono">${Number(invoice.total_amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-500 text-sm">
                <span>تخفیف:</span>
                <span className="font-mono">$0.00</span>
              </div>
              <div className="flex justify-between py-4 border-t-4 border-gray-900 mt-4">
                <span className="text-lg font-black">قابل پرداخت:</span>
                <span className="text-2xl font-black text-indigo-700 font-mono">
                  ${Number(invoice.total_amount).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-2 gap-20">
            <div className="border-t border-gray-300 pt-4 text-center italic text-gray-400 text-xs">محل امضا خریدار</div>
            <div className="border-t border-gray-300 pt-4 text-center italic text-gray-400 text-xs">مهر و امضا فروشگاه</div>
          </div>

          <div className="mt-12 text-center text-[10px] text-gray-400 uppercase tracking-widest border-t pt-4">
            This is a system generated document and valid without physical signature.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-100 border-t p-6 flex justify-end gap-4 no-print">
          <button 
            onClick={onClose} 
            className="px-8 py-3 bg-white border border-gray-300 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition shadow-sm"
          >
            بستن
          </button>
          <button 
            onClick={handlePrint} 
            className="px-10 py-3 bg-gray-900 text-white rounded-xl flex items-center gap-3 font-bold shadow-xl hover:bg-black transition-all transform hover:-translate-y-1"
          >
            <FaPrint size={18} /> چاپ و صدور فاکتور
          </button>
        </div>
      </motion.div>
    </div>
  );
};
const SalesManagement = () => {
  const { accessToken: token, currentUser } = useSelector((state) => state.user);
  const queryClient = useQueryClient();
  
  // تشخیص دقیق ادمین
  const isAdmin = currentUser?.is_superuser || currentUser?.role === "ADMIN";
  const today = new Date().toISOString().split("T")[0];

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [viewingInvoice, setViewingInvoice] = useState(null);
  const [userWarehouse, setUserWarehouse] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [billItems, setBillItems] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState("paid");

  const [selectedType, setSelectedType] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data: stockData } = useQuery({
    queryKey: ["stocks", "all"],
    queryFn: () => fetchStocks(token, { page_size: 5000 }),
    enabled: !!token,
  });
  const { data: customerData } = useQuery({
    queryKey: ["customers", "all"],
    queryFn: () => fetchCustomers(token, { page_size: 5000 }),
    enabled: !!token,
  });
  const { data: warehouseData } = useQuery({
    queryKey: ["warehouses", "all"],
    queryFn: () => fetchWarehouses(token, { page_size: 500 }),
    enabled: !!token,
  });
  const { data: categoryData } = useQuery({
    queryKey: ["categories", "all"],
    queryFn: () => fetchCategories(token, { page_size: 500 }),
    enabled: !!token,
  });
  const { data: invoiceData, isLoading: invoicesLoading } = useQuery({
    queryKey: ["invoices", currentPage, debouncedSearch],
    queryFn: () => fetchInvoices(token, { page: currentPage, search: debouncedSearch }),
    enabled: !!token
  });

  const stocks = useMemo(() => (Array.isArray(stockData) ? stockData : stockData?.results || []), [stockData]);
  const customers = useMemo(() => Array.isArray(customerData) ? customerData : customerData?.results || [], [customerData]);
  const warehouses = useMemo(() => Array.isArray(warehouseData) ? warehouseData : warehouseData?.results || [], [warehouseData]);
  const invoices = useMemo(() => Array.isArray(invoiceData) ? invoiceData : invoiceData?.results || [], [invoiceData]);
  const categories = useMemo(() => Array.isArray(categoryData) ? categoryData : categoryData?.results || [], [categoryData]);
  const totalPages = Math.ceil((invoiceData?.count || 0) / 10);

  // فیلتر کردن انواع کالا: ادمین همه را می‌بیند، فروشنده پرینتر را نمی‌بیند
  const filteredProductTypes = useMemo(() => {
    if (isAdmin) return productTypes;
    return productTypes.filter(t => t.value !== "printer");
  }, [isAdmin]);

  useEffect(() => {
    if (!warehouses.length) return;
    let myWh = isAdmin ? warehouses.find(w => w.warehouse_type === "main") : warehouses.find(w => w.manager === currentUser.id);
    setUserWarehouse(myWh || warehouses[0]);
  }, [warehouses, isAdmin, currentUser]);

  // منطق اصلاح شده دراپ‌داون محصولات برای جلوگیری از NaN و نمایش درست قیمت
  const availableProductsOptions = useMemo(() => {
    if (!userWarehouse || !selectedType || !selectedCategory) return [];
    return stocks
      .filter((stock) => {
        const prod = stock.product_details || {};
        return String(stock.warehouse) === String(userWarehouse.id) && stock.quantity > 0 && 
               prod.product_type === selectedType.value && String(prod.category) === String(selectedCategory.value);
      })
      .map((stock) => {
        if (isAdmin) {
          return {
            value: stock.product,
            full_name: stock.product_name,
            maxQty: stock.quantity,
            label: `${stock.product_name} (موجود: ${stock.quantity}) - بازه: $${stock.min_selling_price || 0} تا $${stock.max_selling_price || 0}`,
            minPrice: Number(stock.min_selling_price || 0),
            maxPrice: Number(stock.max_selling_price || 0)
          };
        } else {
          return {
            value: stock.product,
            full_name: stock.product_name,
            maxQty: stock.quantity,
            label: `${stock.product_name} (موجود: ${stock.quantity})`,
            costFromWarehouse: Number(stock.sell_price_per_unit || 0) // قیمت خرید فروشنده از مرکز
          };
        }
      });
  }, [stocks, userWarehouse, selectedType, selectedCategory, isAdmin]);

  const categoryOptions = useMemo(() => {
    if (!selectedType) return [];
    return categories.filter(c => c.type === selectedType.value).map(c => ({ value: c.id, label: c.name }));
  }, [categories, selectedType]);

  const handleAddItem = () => {
    if (!selectedProduct || Number(quantity) <= 0 || !price) return Swal.fire("خطا", "اطلاعات ناقص است.", "warning");
    if (Number(quantity) > selectedProduct.maxQty) return Swal.fire("خطا", "موجودی کافی نیست.", "error");

    const priceNum = Number(price);
    // ولیدیشن بازه قیمت فقط برای ادمین
    if (isAdmin && (priceNum < selectedProduct.minPrice || priceNum > selectedProduct.maxPrice)) {
         return Swal.fire("خطا", `قیمت خارج از بازه مجاز ادمین ($${selectedProduct.minPrice}-$${selectedProduct.maxPrice}) است.`, "error");
    }

    const exists = billItems.find((item) => item.product === selectedProduct.value);
    if (exists) return Swal.fire("توجه", "این کالا قبلاً اضافه شده است.", "info");

    setBillItems([...billItems, {
        product: selectedProduct.value,
        product_name: selectedProduct.full_name,
        quantity: Number(quantity),
        selling_price_per_unit: priceNum,
        subtotal: Number(quantity) * priceNum,
      }]);
    setSelectedProduct(null); setQuantity(1); setPrice("");
  };

  const createInvoiceMutation = useMutation({
    mutationFn: (data) => createInvoice(token, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["invoices"]); queryClient.invalidateQueries(["stocks"]);
      setIsFormModalOpen(false); setBillItems([]); 
      Swal.fire("موفق", "فاکتور ثبت شد.", "success");
    },
    onError: (err) => Swal.fire("خطا", err.response?.data?.detail || "خطا در ثبت", "error"),
  });

  const handleSubmit = () => {
    if (!userWarehouse || billItems.length === 0) return Swal.fire("خطا", "سبد خالی است.", "warning");
    createInvoiceMutation.mutate({ customer: selectedCustomer?.value || null, warehouse: userWarehouse.id, payment_status: paymentStatus, due_date: today, items: billItems });
  };

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteInvoice(token, id),
    onSuccess: () => { queryClient.invalidateQueries(["invoices"]); queryClient.invalidateQueries(["stocks"]); Swal.fire("حذف شد", "موجودی به انبار برگشت.", "success"); },
  });

  const selectStyles = {
    menuPortal: base => ({ ...base, zIndex: 9999 }),
    control: base => ({ ...base, borderRadius: '8px', padding: '2px' })
  };

  return (
    <div className="p-6 bg-white rounded-md" dir="rtl">
      {viewingInvoice && (
        <InvoiceReceipt
          invoice={viewingInvoice}
          onClose={() => setViewingInvoice(null)}
        />
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <FaShoppingCart /> مدیریت فروش
          </h1>
          <p className="text-sm text-green-600 font-bold mt-1">
            شعبه فعال: {userWarehouse?.name || "..."}
          </p>
        </div>
        <button
          onClick={() => setIsFormModalOpen(true)}
          className="bg-cyan-700 hover:bg-cyan-800 text-white px-6 py-3 rounded-md font-bold shadow-lg"
        >
          {" "}
          افزودن فروش جدید
        </button>
      </div>

      <AnimatePresence>
        {isFormModalOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-[100] flex justify-center items-center p-4 backdrop-blur-sm"
            onClick={() => setIsFormModalOpen(false)}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white rounded-md w-full max-w-6xl h-[85vh] flex overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex-1 p-8 overflow-y-auto">
                <div className="flex justify-between mb-6 border-b pb-4">
                  <h2 className="text-xl font-bold flex gap-2">
                    <FaReceipt /> جزئیات فروش
                  </h2>
                  <button
                    onClick={() => setIsFormModalOpen(false)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>

                <div className="mb-6">
                  <label className="text-xs font-bold block mb-1 text-gray-500">
                    انتخاب مشتری
                  </label>
                  <Select
                    options={customers.map((c) => ({
                      value: c.id,
                      label: `${c.full_name} (${c.phone_number})`,
                    }))}
                    value={selectedCustomer}
                    onChange={setSelectedCustomer}
                    placeholder="جستجو..."
                    isClearable
                    styles={selectStyles}
                    menuPortalTarget={document.body}
                  />
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="text-xs font-bold mb-1 block">
                        نوع کالا
                      </label>
                      <Select
                        options={filteredProductTypes}
                        value={selectedType}
                        onChange={(e) => {
                          setSelectedType(e);
                          setSelectedCategory(null);
                          setSelectedProduct(null);
                        }}
                        placeholder="انتخاب..."
                        styles={selectStyles}
                        menuPortalTarget={document.body}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold mb-1 block">
                        برند
                      </label>
                      <Select
                        options={categoryOptions}
                        value={selectedCategory}
                        onChange={(e) => {
                          setSelectedCategory(e);
                          setSelectedProduct(null);
                        }}
                        placeholder="انتخاب..."
                        isDisabled={!selectedType}
                        styles={selectStyles}
                        menuPortalTarget={document.body}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold mb-1 block">
                        نام کالا
                      </label>
                      <Select
                        options={availableProductsOptions}
                        value={selectedProduct}
                        onChange={(opt) => {
                          setSelectedProduct(opt);
                          setPrice("");
                        }}
                        placeholder="جستجو..."
                        isDisabled={!selectedCategory}
                        noOptionsMessage={() => "یافت نشد"}
                        styles={selectStyles}
                        menuPortalTarget={document.body}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 items-end">
                    <div className="w-24">
                      <label className="text-xs font-bold block mb-1">
                        تعداد
                      </label>
                      <input
                        type="number"
                        className="w-full p-2.5 border rounded-lg text-center font-bold"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs font-bold block mb-1">
                        قیمت فروش ($)
                        {selectedProduct && (
                          <span className="text-[10px] block font-normal mt-1">
                            {isAdmin
                              ? `(بازه مجاز: $${(selectedProduct.minPrice || 0).toLocaleString()} - $${(selectedProduct.maxPrice || 0).toLocaleString()})`
                              : `(فی خرید شما از گدام مرکزی: $${(selectedProduct.costFromWarehouse || 0).toLocaleString()})`}
                          </span>
                        )}
                      </label>
                      <input
                        type="number"
                        className="w-full p-2.5 border rounded-lg font-bold text-green-700"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                    <button
                      onClick={handleAddItem}
                      className="bg-black text-white px-8 py-2.5 rounded-lg font-bold shadow-md hover:bg-gray-800 transition"
                    >
                      افزودن +
                    </button>
                  </div>
                </div>
              </div>

              <div className="w-[380px] bg-gray-50 border-r p-6 flex flex-col shadow-inner">
                <h3 className="font-bold text-lg mb-4 flex gap-2 items-center">
                  <FaShoppingCart /> سبد خرید
                </h3>
                <div className="flex-1 overflow-y-auto space-y-3">
                  {billItems.map((item, i) => (
                    <div
                      key={i}
                      className="bg-white p-4 rounded-xl border flex justify-between items-center shadow-sm"
                    >
                      <div className="text-xs">
                        <div className="font-bold text-gray-800">
                          {item.product_name}
                        </div>
                        <div className="text-gray-500 mt-1">
                          {item.quantity} عدد × ${item.selling_price_per_unit}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-black">
                          ${item.subtotal}
                        </span>
                        <button
                          onClick={() =>
                            setBillItems(
                              billItems.filter((_, idx) => idx !== i),
                            )
                          }
                          className="text-red-400 hover:text-red-600"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-6 border-t mt-4">
                  <div className="flex justify-between text-xl font-black mb-6">
                    <span>جمع کل:</span>
                    <span className="text-green-600">
                      $
                      {billItems
                        .reduce((a, b) => a + b.subtotal, 0)
                        .toLocaleString()}
                    </span>
                  </div>
                  <div className="mb-4">
                    <label className="text-xs font-bold block mb-1">
                      نوع پرداخت
                    </label>
                    <select
                      className="w-full p-3 border rounded-lg bg-white font-bold"
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value)}
                    >
                      <option value="paid">✅ نقدی</option>
                      <option value="unpaid">⏳ نسیه</option>
                    </select>
                  </div>
                  <SubmitBtn
                    onClick={handleSubmit}
                    title="ثبت نهایی فاکتور"
                    className="w-full py-4 text-lg"
                    isLoading={createInvoiceMutation.isPending}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="rounded-md  overflow-hidden border border-gray-100">
        <table className="w-full text-center text-sm">
          <thead className="bg-slate-900 text-white font-bold">
            <tr>
              <th className="px-5 py-3">شماره</th>
              <th className="px-5 py-3">مشتری</th>
              <th className="px-5 py-3">مبلغ کل</th>
              <th className="px-5 py-3">وضعیت</th>
              <th className="px-5 py-3">تاریخ</th>
              <th className="px-5 py-3">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {invoices.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-12 text-gray-400">
                  فاکتوری یافت نشد.
                </td>
              </tr>
            ) : (
              invoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="hover:bg-gray-100 odd:bg-gray-100 even:bg-white border-b border-gray-200 transition"
                >
                  <td className="px-5 py-3 font-mono text-gray-500">
                    #{inv.id.toString().slice(0, 6)}
                  </td>
                  <td className="px-5 py-3 font-bold">
                    {inv.customer_name || "مشتری عمومی"}
                  </td>
                  <td className="px-5 py-3 font-semibold  text-green-700">
                    ${Number(inv.total_amount).toLocaleString()}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${inv.payment_status === "paid" ? " text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                      {inv.payment_status === "paid" ? "پرداخت شده" : "قرض"}
                    </span>
                  </td>
                  <td className="px-5 py-3 dir-ltr font-mono">
                    {inv.due_date}
                  </td>
                  <td className="px-5 py-3 flex justify-center gap-2">
                    <button
                      onClick={() => setViewingInvoice(inv)}
                      className="bg-gray-100 p-2 rounded-lg hover:bg-gray-200"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() =>
                        Swal.fire({
                          title: "حذف فاکتور؟",
                          text: "موجود برمیگردد.",
                          icon: "warning",
                          showCancelButton: true,
                        }).then((r) => {
                          if (r.isConfirmed) deleteMutation.mutate(inv.id);
                        })
                      }
                      className="bg-red-50 text-red-500 p-2 rounded-lg hover:bg-red-100"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="p-4 border-t bg-gray-50">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default SalesManagement;