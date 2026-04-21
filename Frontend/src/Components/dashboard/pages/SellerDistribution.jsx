import React, { useState, useMemo, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import Select from "react-select";
import { AnimatePresence, motion } from "framer-motion";
import { 
    FaTruckLoading, FaListUl, FaCheckCircle, 
    FaFilter, FaPlus, FaTrash, FaHistory, FaEye, FaPrint
} from "react-icons/fa";
import { Loader2, Search } from "lucide-react"; 
import { 
    fetchWarehouses, fetchStocks, distributeStock, 
    fetchCategories, fetchDistributionHistory 
} from "../../../services/api";
import Pagination from "../../Pagination";

const PRODUCT_TYPES_OPTIONS = [
    { value: 'mobile', label: '📱 موبایل و لوازم جانبی' },
    // { value: 'printer', label: '🖨️ پرینتر' }, // حذف پرینتر از فیلتر چون قابل انتقال نیست
    { value: 'scrubber', label: '🧽 شوینده و اسکاج' },
];

const selectStyles = {
    menuPortal: base => ({ ...base, zIndex: 9999 }),
    control: base => ({ ...base, fontSize: '14px', borderRadius: '12px', padding: '2px' })
};

const LOGO_URL = "../../../../public/sdf.png";

// ==========================================
// 1. Transfer Invoice Receipt
// ==========================================
const TransferInvoiceReceipt = ({ order, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex justify-center items-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col overflow-hidden h-[90vh]" onClick={(e) => e.stopPropagation()}>
        
        <div className="bg-gray-100 border-b px-6 py-4 flex justify-between items-center">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">📄 جزئیات حواله انتقال</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-red-500 font-bold text-2xl transition">&times;</button>
        </div>

        <div className="flex-1 overflow-y-auto bg-white p-10 custom-scrollbar" style={{ direction: 'rtl' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #333', paddingBottom: '20px', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#333' }}>حواله خروج کالا</h1>
                    <p style={{ margin: '5px 0 0', fontSize: '14px', color: '#666' }}>Stock Transfer Note</p>
                </div>
                <img src={LOGO_URL} alt="Logo" style={{ height: '60px', objectFit: 'contain' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '40px', marginBottom: '40px' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#888', borderBottom: '1px solid #eee', paddingBottom: '5px', marginBottom: '10px' }}>مشخصات سند</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}><span style={{ color: '#666' }}>شماره حواله:</span> <span style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>TRF-{order.id.toString().slice(0, 8).toUpperCase()}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}><span style={{ color: '#666' }}>تاریخ:</span> <span style={{ fontWeight: 'bold' }}>{new Date(order.created_at).toLocaleDateString('fa-IR')}</span></div>
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#888', borderBottom: '1px solid #eee', paddingBottom: '5px', marginBottom: '10px' }}>فرستنده</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}><span style={{ color: '#666' }}>انبار:</span> <span style={{ fontWeight: 'bold' }}>{order.source_name}</span></div>
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#888', borderBottom: '1px solid #eee', paddingBottom: '5px', marginBottom: '10px' }}>گیرنده</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}><span style={{ color: '#666' }}>شعبه:</span> <span style={{ fontWeight: 'bold' }}>{order.target_name}</span></div>
                </div>
            </div>

            {/* ✅ جدول اصلاح شده: قیمت خرید حذف شد تا شعبه نداند ادمین چند خریده، فقط قیمت تحویلی مهم است */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginBottom: '30px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #ddd' }}>
                        <th style={{ padding: '12px', textAlign: 'right', color: '#555' }}>#</th>
                        <th style={{ padding: '12px', textAlign: 'right', color: '#555', width: '50%' }}>شرح کالا</th>
                        <th style={{ padding: '12px', textAlign: 'center', color: '#555' }}>تعداد</th>
                        <th style={{ padding: '12px', textAlign: 'right', color: '#555' }}>فی تحویلی (به شعبه)</th>
                        <th style={{ padding: '12px', textAlign: 'right', color: '#555' }}>مبلغ کل</th>
                    </tr>
                </thead>
                <tbody>
                    {order.items.map((item, idx) => (
                        <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#fdfdfd' }}>
                            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{idx + 1}</td>
                            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                                <strong>{item.product_details.full_name}</strong>
                                <div style={{ fontSize: '10px', color: '#888', marginTop: '2px' }}>{item.product_details.sku}</div>
                            </td>
                            <td style={{ padding: '12px', borderBottom: '1px solid #eee', textAlign: 'center', fontWeight: 'bold' }}>{item.quantity}</td>
                            <td style={{ padding: '12px', borderBottom: '1px solid #eee', textAlign: 'right', fontFamily: 'monospace' }}>${Number(item.sell_price).toLocaleString()}</td>
                            <td style={{ padding: '12px', borderBottom: '1px solid #eee', textAlign: 'right', fontFamily: 'monospace', fontWeight: 'bold' }}>${(item.quantity * item.sell_price).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ width: '250px', backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '13px' }}>
                        <span style={{ color: '#666' }}>جمع اقلام:</span>
                        <span style={{ fontWeight: 'bold' }}>{order.total_items} عدد</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #333', marginTop: '10px', paddingTop: '10px', fontSize: '16px', fontWeight: '900' }}>
                        <span>جمع کل (بدهی شعبه):</span>
                        <span>${Number(order.total_value).toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '60px', paddingTop: '20px', borderTop: '1px dashed #ccc', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666' }}>
                <div style={{ textAlign: 'center', width: '150px' }}>
                    <div style={{ borderBottom: '1px solid #000', height: '40px', marginBottom: '5px' }}></div>
                    <span>امضاء تحویل دهنده</span>
                </div>
                <div style={{ textAlign: 'center', width: '150px' }}>
                    <div style={{ borderBottom: '1px solid #000', height: '40px', marginBottom: '5px' }}></div>
                    <span>امضاء تحویل گیرنده</span>
                </div>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '10px', color: '#aaa' }}>
                گروه تجاری سعادت
            </div>
        </div>

        <div className="bg-gray-50 border-t p-4 flex justify-end">
          <button onClick={onClose} className="bg-gray-800 hover:bg-black text-white px-8 py-2.5 rounded-lg font-bold transition shadow-md">
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};
// ==========================================
// 2. New Distribution Form
// ==========================================
const NewDistribution = () => {
    const { accessToken: token } = useSelector((state) => state.user);
    const queryClient = useQueryClient();

    const [selectedBranch, setSelectedBranch] = useState(null); 
    const [mainWarehouse, setMainWarehouse] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedTool, setSelectedTool] = useState(null);
    const [selectedStock, setSelectedStock] = useState(null);   
    const [quantity, setQuantity] = useState("");
    const [sellPrice, setSellPrice] = useState("");
    const [distributionList, setDistributionList] = useState([]); 
    const [loading, setLoading] = useState(false);

    const { data: whData } = useQuery({
      queryKey: ["warehouses", "all"],
      queryFn: () => fetchWarehouses(token, { page_size: 500 }),
      enabled: !!token,
    });
    const { data: catData } = useQuery({
      queryKey: ["categories", "all"],
      queryFn: () => fetchCategories(token, { page_size: 500 }),
      enabled: !!token,
    });
    // دریافت موجودی انبار مرکزی
    const { data: stockData } = useQuery({ 
        queryKey: ["stocks", "main"], 
        queryFn: () => fetchStocks(token, { warehouse: mainWarehouse?.id, page_size: 1000 }), 
        enabled: !!token && !!mainWarehouse
    });

    const warehouses = useMemo(() => Array.isArray(whData) ? whData : (whData?.results || []), [whData]);
    const stocks = useMemo(() => Array.isArray(stockData) ? stockData : (stockData?.results || []), [stockData]);
    const categories = useMemo(() => Array.isArray(catData) ? catData : (catData?.results || []), [catData]);

    useEffect(() => {
        if (warehouses.length > 0) {
            const main = warehouses.find(w => w.warehouse_type === 'main');
            setMainWarehouse(main);
        }
    }, [warehouses]);

    const branchOptions = useMemo(() => warehouses.filter(w => w.warehouse_type !== 'main').map(w => ({ value: w.id, label: `👤 ${w.manager_name || 'بدون مدیر'} - ${w.name}` })), [warehouses]);

    const categoryOptions = useMemo(() => {
        if (!selectedType) return [];
        return categories.filter(c => c.type === selectedType.value).map(c => ({ value: c.id, label: c.name, tools: c.tools }));
    }, [categories, selectedType]);

    const toolOptions = useMemo(() => {
        if (!selectedCategory) return [];
        return (selectedCategory.tools || []).map(t => ({ value: t, label: t }));
    }, [selectedCategory]);

    // ✅ اصلاح حیاتی: فیلتر کردن موجودی برای نمایش صحیح و حذف پرینتر
    const availableStockOptions = useMemo(() => {
        if (!mainWarehouse || !selectedType || !selectedCategory) return [];
        
        return stocks.filter(s => {
            const details = s.product_details || {};
            
            // 1. فقط کالاهای انبار مرکزی
            const isMain = String(s.warehouse) === String(mainWarehouse.id);
            
            // 2. ⛔ حذف پرینترها از لیست انتقال
            const isPrinter = details.product_type === 'printer';
            
            const hasQty = s.quantity > 0;
            const typeMatch = details.product_type === selectedType.value;
            const catMatch = String(details.category) === String(selectedCategory.value);
            const toolMatch = selectedTool ? details.tool === selectedTool.value : true;
            const notAdded = !distributionList.some(item => item.product_id === s.product);
            
            return isMain && !isPrinter && hasQty && typeMatch && catMatch && toolMatch && notAdded;
        }).map(s => ({
            value: s.product, // ID محصول که به بک‌اند می‌فرستیم
            label: `${s.product_name} | موجود: ${s.quantity}`,
            fullData: s,
            maxQty: s.quantity,
            buyPrice: s.purchase_price_per_unit
        }));
    }, [stocks, mainWarehouse, selectedType, selectedCategory, selectedTool, distributionList]);

    const handleAddToList = () => {
        if (!selectedStock || !quantity || !sellPrice) return Swal.fire("خطا", "اطلاعات کامل نیست.", "warning");
        if (Number(quantity) <= 0 || Number(quantity) > selectedStock.maxQty) return Swal.fire("خطا", "تعداد نامعتبر است.", "error");
        
        setDistributionList([...distributionList, {
            id: Date.now(),
            product_id: selectedStock.value,
            product_name: selectedStock.fullData.product_details.full_name,
            sku: selectedStock.fullData.product_details.sku,
            quantity: Number(quantity),
            sell_price: Number(sellPrice),
            buy_price: selectedStock.buyPrice,
        }]);
        setQuantity(""); setSellPrice(""); setSelectedStock(null);
    };

    const handleRemoveItem = (id) => setDistributionList(distributionList.filter(item => item.id !== id));

    const handleSubmitAll = async () => {
        if (!selectedBranch) return Swal.fire("خطا", "شعبه مقصد را انتخاب کنید.", "warning");
        if (distributionList.length === 0) return Swal.fire("خطا", "لیست خالی است.", "warning");

        setLoading(true);
        try {
            await distributeStock(token, {
                source_warehouse_id: mainWarehouse.id,
                target_warehouse_id: selectedBranch.value,
                items: distributionList.map(item => ({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    sell_price: item.sell_price
                }))
            });
            Swal.fire("موفق", "ارسال انجام شد.", "success");
            queryClient.invalidateQueries(["stocks"]);
            queryClient.invalidateQueries(["distHistory"]);
            setDistributionList([]);
            setSelectedBranch(null);
        } catch (error) {
            Swal.fire("خطا", error.response?.data?.error || "خطا در ارسال", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-fadeIn">
            <div className="xl:col-span-1 space-y-6">
                <div className="bg-gray-100 p-6 rounded-md shadow-lg border border-gray-100">
                    <label className="text-sm font-bold text-gray-700 mb-3 block">۱. انتخاب شعبه </label>
                    <Select options={branchOptions} value={selectedBranch} onChange={setSelectedBranch} placeholder="گیرنده..." isDisabled={distributionList.length > 0} styles={selectStyles} menuPortalTarget={document.body} />
                </div>

                <div className="bg-white p-6 rounded-md shadow-lg border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-5 text-sm flex items-center gap-2"><FaFilter className="text-indigo-500"/> ۲. انتخاب کالا</h3>
                    <div className="space-y-4">
                        <Select options={PRODUCT_TYPES_OPTIONS} value={selectedType} onChange={opt => { setSelectedType(opt); setSelectedCategory(null); setSelectedTool(null); setSelectedStock(null); }} placeholder="نوع محصول..." styles={selectStyles} menuPortalTarget={document.body} />
                        <Select options={categoryOptions} value={selectedCategory} onChange={opt => { setSelectedCategory(opt); setSelectedTool(null); setSelectedStock(null); }} placeholder="برند..." isDisabled={!selectedType} styles={selectStyles} menuPortalTarget={document.body} />
                        <Select options={toolOptions} value={selectedTool} onChange={opt => { setSelectedTool(opt); setSelectedStock(null); }} placeholder="ابزار..." isDisabled={!selectedCategory} isClearable styles={selectStyles} menuPortalTarget={document.body} />
                        <Select options={availableStockOptions} value={selectedStock} onChange={setSelectedStock} placeholder="نام کالا (موجودی انبار مرکزی)..." isDisabled={!selectedCategory} noOptionsMessage={() => "موجودی قابل انتقال یافت نشد"} styles={selectStyles} menuPortalTarget={document.body} />
                    </div>

                    <AnimatePresence>
                        {selectedStock && (
                            <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="mt-6 pt-4 border-t border-gray-100">
                                <div className="bg-indigo-50 p-4 rounded-xl mb-4 text-xs text-indigo-900 border border-indigo-100 shadow-inner flex justify-between">
                                    <span>موجودی: <strong>{selectedStock.maxQty}</strong></span>
                                    <span>خرید: <strong className="text-green-700">${Number(selectedStock.buyPrice).toLocaleString()}</strong></span>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <input type="number" value={quantity} onChange={e=>setQuantity(e.target.value)} className="w-full p-2.5 border rounded-xl text-center font-bold" placeholder="تعداد" />
                                    <input type="number" value={sellPrice} onChange={e=>setSellPrice(e.target.value)} className="w-full p-2.5 border rounded-xl text-center font-bold text-green-600" placeholder="فی فروش (شعبه)" />
                                </div>
                                <button onClick={handleAddToList} className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 rounded-xl font-bold hover:shadow-lg flex justify-center items-center gap-2"><FaPlus/> افزودن</button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="xl:col-span-2 bg-gray-100 rounded-md shadow-md border border-gray-100 overflow-hidden flex flex-col min-h-[600px]">
                <div className="p-6 border-b bg-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2"><FaListUl className="text-cyan-600"/> پیش‌ نمایش بیل انتقال</h3>
                    <span className="bg-white border px-4 py-2 rounded-xl text-sm font-bold text-indigo-600">{distributionList.length} قلم</span>
                </div>
                <div className="flex-1 overflow-y-auto  custom-scrollbar">
                    {distributionList.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60"><FaTruckLoading size={64} className="mb-4"/><p>لیست خالی است.</p></div>
                    ) : (
                        <table className="w-full text-center">
                            <thead className="bg-slate-900 text-gray-100 font-bold text-xs uppercase"><tr><th className="p-4">کالا</th><th className="p-4 text-center">تعداد</th><th className="p-4 text-center">فی فروش</th><th className="p-4 text-center">ارزش کل</th><th className="p-4 text-center">حذف</th></tr></thead>
                            <tbody>
                                {distributionList.map(item => (
                                    <tr key={item.id} className="hover:bg-gray-50 border-b">
                                        <td className="p-4 font-bold">{item.product_name}<br/><span className="text-xs text-gray-500 font-normal">{item.sku}</span></td>
                                        <td className="p-4 text-center"><span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-bold">{item.quantity}</span></td>
                                        <td className="p-4 text-center text-gray-600">${item.sell_price.toLocaleString()}</td>
                                        <td className="p-4 text-center font-bold text-green-600">${(item.quantity * item.sell_price).toLocaleString()}</td>
                                        <td className="p-4 text-center"><button onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg"><FaTrash/></button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                <div className="p-6 border-t bg-gray-50 flex justify-between items-center">
                    <div className="text-gray-600 text-sm">جمع کل: <strong className="text-black text-lg ml-2">${distributionList.reduce((acc, item) => acc + (item.quantity * item.sell_price), 0).toLocaleString()}</strong></div>
                    <button onClick={handleSubmitAll} disabled={loading || distributionList.length === 0} className="px-8 py-4 rounded-xl font-bold text-white bg-cyan-700 hover:bg-cyan-800 shadow-lg disabled:bg-gray-400 flex items-center gap-3">
                        {loading ? <Loader2 className="animate-spin"/> : <><FaCheckCircle/> ارسال نهایی</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// 3. Distribution History List (Paginated & Filtered)
// ==========================================
const DistributionHistory = () => {
    const { accessToken: token } = useSelector((state) => state.user);
    const [page, setPage] = useState(1);
    const [viewingOrder, setViewingOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    
    // دریافت تاریخچه به صورت صفحه‌بندی شده
    const { data: historyData, isLoading } = useQuery({ 
        queryKey: ["distHistory", page], 
        queryFn: () => fetchDistributionHistory(token, { page }), 
        enabled: !!token
    });

    const history = useMemo(() => Array.isArray(historyData) ? historyData : (historyData?.results || []), [historyData]);
    const totalPages = Math.ceil((historyData?.count || 0) / 10);

    // فیلتر کلاینت ساید برای جستجوی نام شعبه
    const filteredHistory = history.filter(order => 
        order.target_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        order.id.toString().includes(searchTerm)
    );

    if (isLoading) return <div className="flex justify-center h-64 items-center"><Loader2 className="animate-spin w-10 h-10 text-indigo-600"/></div>;

    return (
      <div className="bg-white rounded-md shadow-xl overflow-hidden border border-gray-100">
        {viewingOrder && <TransferInvoiceReceipt order={viewingOrder} onClose={() => setViewingOrder(null)} />}
        
        <div className="p-6 border-b bg-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <h3 className="font-bold text-gray-700 flex items-center gap-2">
            <FaHistory /> تاریخچه انتقالات اجناس به شعبه ها
          </h3>
          <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4"/>
              <input 
                type="text" 
                placeholder="جستجو (نام شعبه، شماره)..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className=" py-2.5 px-4 rounded-md w-72 pl-10"
              />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full  text-center text-sm">
            <thead className="bg-slate-900 font-bold text-gray-100">
              <tr>
                <th className="px-5 py-3">شماره</th>
                <th className="px-5 py-3">مبدا</th>
                <th className="px-5 py-3">مقصد</th>
                <th className="px-5 py-3"> تعداد اجناس</th>
                <th className="px-5 py-3">ارزش</th>
                <th className="px-5 py-3">تاریخ</th>
                <th className="px-5 py-3">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredHistory.map((order) => (
                <tr key={order.id} className="hover:bg-gray-100 border-b border-gray-200 odd:bg-gray-100 even:bg-white  transition">
                  <td className="p-4 font-mono text-indigo-600">
                    TRF-{order.id.toString().slice(0, 6)}
                  </td>
                  <td className="px-5 py-3 text-gray-500">{order.source_name}</td>
                  <td className="px-5 py-3 font-bold">{order.target_name}</td>
                  <td className="px-5 py-3">{order.total_items}</td>
                  <td className="px-5 py-3 text-green-700">
                    ${Number(order.total_value).toLocaleString()}
                  </td>
                  <td className="px-5 py-3 dir-ltr">
                    {new Date(order.created_at).toLocaleDateString("fa-IR")}
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => setViewingOrder(order)}
                      className="text-white bg-cyan-700 p-2 rounded-lg hover:bg-cyan-800"
                    >
                      <FaEye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t bg-gray-50">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    );
};

const SellerDistribution = () => {
    const [activeTab, setActiveTab] = useState("new");
    return (
      <div className="p-6 bg-gray-50 min-h-screen rounded-md" dir="rtl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-3">
            <FaTruckLoading className="text-ذمشزن" /> مدیریت  انتقال اجناس به شعبه ها
          </h1>
          <div className="flex bg-white p-1 rounded-md items-center gap-x-2 shadow-sm border border-gray-200">
            <button
              onClick={() => setActiveTab("new")}
              className={`px-6 py-2 rounded-md text-sm font-bold ${activeTab === "new" ? "bg-black text-white" : "text-gray-500 hover:bg-gray-200"}`}
            >
              انتقال جدید به شعبه
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-6 py-2 rounded-md text-sm font-bold ${activeTab === "history" ? "bg-black text-white" : "text-gray-500 hover:bg-gray-200"}`}
            >
              تاریخچه انتقالات
            </button>
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "new" ? (
              <NewDistribution />
            ) : (
              <DistributionHistory />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    );
};

export default SellerDistribution;