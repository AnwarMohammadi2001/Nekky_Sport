import React, { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import Select from "react-select";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaPlus,
  FaCheckCircle,
  FaTrash,
  FaHistory,
  FaShoppingCart,
  FaFilter,
  FaWarehouse,
  FaClipboardList,
  FaClock,
  FaFileInvoice,
  FaEdit,
  FaSave,
  FaPrint,
} from "react-icons/fa";
import { Loader2 } from "lucide-react";

import {
  fetchPurchaseOrders,
  createPurchaseOrder,
  confirmPurchaseOrder,
  fetchProducts,
  fetchWarehouses,
  fetchCategories,
  updatePurchaseOrder,
} from "../../../services/api";

// وارد کردن کامپوننت صفحه‌بندی
import Pagination from "../../Pagination";

const PRODUCT_TYPES_OPTIONS = [
  { value: "mobile", label: "📱 موبایل و لوازم جانبی" },
  { value: "printer", label: "🖨️ پرینتر و ماشین اداری" },
  { value: "scrubber", label: "🧽 اسکاج و شوینده" },
];

const selectStyles = {
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  control: (base) => ({ ...base, borderRadius: "12px", padding: "2px" }),
};

const LOGO_URL = "/sdf.png";

const getDaysPassed = (dateString) => {
  const createdDate = new Date(dateString);
  const today = new Date();
  const diffTime = Math.abs(today - createdDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays - 1;
};

const PurchaseInvoiceReceipt = ({ order, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-[100] flex justify-center items-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gray-50 border-b px-6 py-3 flex justify-between items-center no-print">
          <div className="flex items-center gap-2 text-gray-600">
            <FaFileInvoice className="text-indigo-600" />
            <span className="font-bold text-sm">پیش‌نمایش سند خرید</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition-colors text-2xl"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-white p-8 custom-scrollbar relative print:p-0">
          {order.status === "confirmed" && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-green-200 text-green-100 text-6xl font-black rounded-full p-10 rotate-12 pointer-events-none uppercase opacity-20">
              CONFIRMED
            </div>
          )}

          <div className="flex justify-between items-start mb-8 border-b-2 border-gray-900 pb-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">
                Purchase Order
              </h1>
              <p className="text-gray-500 text-xs font-medium">
                سیستم مدیریت هوشمند تدارکات
              </p>
            </div>
            <div className="text-left">
              <img
                src={LOGO_URL}
                alt="Logo"
                className="h-14 w-auto mb-2 object-contain"
              />
              <div className="text-[10px] text-gray-400 font-mono italic">
                ID: {order.id.toUpperCase()}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
            <div className="space-y-2">
              <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest border-b border-indigo-100 pb-1">
                اطلاعات فاکتور
              </h3>
              <div className="flex justify-between">
                <span className="text-gray-500">شماره سند:</span>{" "}
                <span className="font-mono font-bold uppercase text-gray-800">
                  PO-{order.id.slice(0, 8)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">تاریخ ثبت:</span>{" "}
                <span className="font-bold text-gray-800">
                  {new Date(order.created_at).toLocaleDateString("fa-IR")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">وضعیت:</span>
                <span
                  className={`font-bold ${order.status === "confirmed" ? "text-green-600" : "text-orange-600"}`}
                >
                  {order.status.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest border-b border-indigo-100 pb-1">
                مقصد تحویل
              </h3>
              <div className="flex justify-between">
                <span className="text-gray-500">نام انبار:</span>{" "}
                <span className="font-bold text-gray-800">
                  {order.warehouse_name || "انبار مرکزی"}
                </span>
              </div>
              <div className="flex justify-between overflow-hidden leading-tight text-xs">
                <span className="text-gray-500 flex-shrink-0 ml-2">
                  یادداشت:
                </span>
                <span className="text-gray-600 italic truncate">
                  {order.note || "---"}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 overflow-hidden mb-8">
            <table className="w-full text-right text-xs">
              <thead className="bg-gray-900 text-white font-bold uppercase">
                <tr>
                  <th className="p-3 text-center w-10">ردیف</th>
                  <th className="p-3">شرح کالا</th>
                  <th className="p-3 text-center">تعداد</th>
                  <th className="p-3 text-left">فی خرید ($)</th>
                  <th className="p-3 text-left">جمع کل ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 text-center text-gray-400 font-mono">
                      {idx + 1}
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-gray-800">
                        {item.product_name}
                      </div>
                      <div className="text-[9px] text-indigo-500 mt-1 font-bold">
                        بازه فروش مجاز: ${item.min_selling_price} - $
                        {item.max_selling_price}
                      </div>
                    </td>
                    <td className="p-3 text-center font-black bg-gray-50/50">
                      {item.quantity}
                    </td>
                    <td className="p-3 text-left font-mono">
                      ${Number(item.unit_cost).toLocaleString()}
                    </td>
                    <td className="p-3 text-left font-black text-gray-900 font-mono">
                      ${(item.quantity * item.unit_cost).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pr-4">
            <div className="w-64 space-y-2">
              <div className="flex justify-between py-3 border-t-2 border-gray-900 text-lg font-black text-indigo-700">
                <span>مبلغ کل:</span>
                <span className="font-mono">
                  ${Number(order.total_cost).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-dashed border-gray-200 grid grid-cols-2 gap-4">
            <div className="text-[9px] text-gray-400 leading-relaxed italic">
              * این فاکتور به صورت سیستمی صادر شده و معتبر می‌باشد.
              <br />* هرگونه تغییر دستی در ارقام فاکتور باعث ابطال اعتبار آن
              می‌گردد.
            </div>
            <div className="flex flex-col items-end gap-2 pr-4">
              <div className="w-24 h-24 border border-gray-100 rounded bg-gray-50 flex items-center justify-center text-[10px] text-gray-300 italic">
                محل مهر و امضا
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t flex justify-end gap-3 no-print">
          <button
            onClick={() => window.print()}
            className="bg-white border border-gray-300 text-gray-700 px-5 py-2 rounded-xl text-xs font-bold hover:bg-gray-100 flex items-center gap-2 transition-all"
          >
            <FaPrint /> چاپ مستقیم
          </button>
          <button
            onClick={onClose}
            className="bg-gray-900 text-white px-8 py-2 rounded-xl text-xs font-bold hover:bg-black transition-all"
          >
            بستن پنجره
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const NewPurchase = ({ editingOrder, onFinish }) => {
  const { accessToken: token } = useSelector((state) => state.user);
  const queryClient = useQueryClient();

  const [mainWarehouse, setMainWarehouse] = useState(null);
  const [note, setNote] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedType, setSelectedType] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [unitCost, setUnitCost] = useState("");
  const [minSellPrice, setMinSellPrice] = useState("");
  const [maxSellPrice, setMaxSellPrice] = useState("");

  const { data: prodData } = useQuery({
    queryKey: ["products", "allForPurchase"],
    queryFn: () => fetchProducts(token, { page_size: 2000 }),
    enabled: !!token,
  });
  const { data: catData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(token),
    enabled: !!token,
  });
  const { data: whData } = useQuery({
    queryKey: ["warehouses"],
    queryFn: () => fetchWarehouses(token),
    enabled: !!token,
  });

  const products = useMemo(
    () => (Array.isArray(prodData) ? prodData : prodData?.results || []),
    [prodData],
  );
  const categories = useMemo(
    () => (Array.isArray(catData) ? catData : catData?.results || []),
    [catData],
  );
  const warehouses = useMemo(
    () => (Array.isArray(whData) ? whData : whData?.results || []),
    [whData],
  );

  useEffect(() => {
    if (editingOrder) {
      setNote(editingOrder.note || "");
      // ✅ اصلاح منطق بارگذاری اقلام جهت ویرایش
      const mappedItems = editingOrder.items.map((item) => ({
        id: Math.random(), // شناسه موقت برای مدیریت در لیست فرانت
        product_id: item.product,
        product_name: item.product_name,
        sku: item.sku || "N/A",
        quantity: item.quantity,
        unit_cost: parseFloat(item.unit_cost),
        min_selling_price: parseFloat(item.min_selling_price),
        max_selling_price: parseFloat(item.max_selling_price),
        total_line: item.quantity * parseFloat(item.unit_cost),
      }));
      setCartItems(mappedItems);
    } else {
      setCartItems([]);
      setNote("");
    }
  }, [editingOrder]);

  useEffect(() => {
    if (warehouses.length > 0) {
      const foundMain = warehouses.find((w) => w.warehouse_type === "main");
      setMainWarehouse(foundMain || null);
    }
  }, [warehouses]);

  const categoryOptions = useMemo(() => {
    if (!selectedType) return [];
    return categories
      .filter((c) => c.type === selectedType.value)
      .map((c) => ({ value: c.id, label: c.name }));
  }, [categories, selectedType]);

  const productOptions = useMemo(() => {
    if (!selectedCategory) return [];
    return products
      .filter(
        (p) =>
          String(p.category) === String(selectedCategory.value) &&
          p.product_type === selectedType.value,
      )
      .map((p) => ({
        value: p.id,
        label: `${p.full_name} (${p.sku})`,
        fullData: p,
      }));
  }, [products, selectedCategory, selectedType]);

  const handleAddItem = () => {
    if (
      !selectedProduct ||
      !quantity ||
      !unitCost ||
      !minSellPrice ||
      !maxSellPrice
    )
      return Swal.fire("خطا", "تمام فیلدها و بازه قیمت را پر کنید.", "warning");
    if (cartItems.find((item) => item.product_id === selectedProduct.value))
      return Swal.fire("تکراری", "این کالا قبلاً در لیست موجود است.", "info");

    setCartItems([
      ...cartItems,
      {
        id: Date.now(),
        product_id: selectedProduct.value,
        product_name: selectedProduct.fullData.full_name,
        sku: selectedProduct.fullData.sku,
        quantity: parseInt(quantity),
        unit_cost: parseFloat(unitCost),
        min_selling_price: parseFloat(minSellPrice),
        max_selling_price: parseFloat(maxSellPrice),
        total_line: parseInt(quantity) * parseFloat(unitCost),
      },
    ]);
    setQuantity("");
    setUnitCost("");
    setMinSellPrice("");
    setMaxSellPrice("");
    setSelectedProduct(null);
  };

  const handleSubmit = async () => {
    if (!mainWarehouse)
      return Swal.fire("خطا", "انبار مرکزی یافت نشد.", "error");
    if (cartItems.length === 0)
      return Swal.fire("خطا", "لیست خرید خالی است.", "warning");

    setLoading(true);
    const payload = {
      target_warehouse: mainWarehouse.id,
      note: note,
      items: cartItems.map((item) => ({
        product: item.product_id,
        quantity: item.quantity,
        unit_cost: item.unit_cost,
        min_selling_price: item.min_selling_price,
        max_selling_price: item.max_selling_price,
      })),
    };

    try {
      if (editingOrder) {
        await updatePurchaseOrder(token, editingOrder.id, payload);
        Swal.fire("بروزرسانی", "تغییرات فاکتور با موفقیت اعمال شد.", "success");
      } else {
        await createPurchaseOrder(token, payload);
        Swal.fire("موفق", "سفارش خرید با موفقیت ثبت شد.", "success");
      }
      queryClient.invalidateQueries(["purchaseOrders"]);
      if (onFinish) onFinish();
    } catch (error) {
      Swal.fire("خطا", "عملیات با خطا مواجه شد.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-fadeIn">
      <div className="xl:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm uppercase">
            <FaWarehouse className="text-indigo-600" /> مقصد:{" "}
            {mainWarehouse?.name || "..."}
          </h3>
          <div className="mt-4">
            <label className="text-xs font-bold text-gray-400 mb-1 block">
              توضیحات سفارش
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-2 border rounded-lg text-sm bg-gray-50 outline-none focus:ring-1 focus:ring-indigo-500 transition"
              rows="3"
              placeholder="یادداشت اختیاری..."
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-5 text-sm flex items-center gap-2">
            <FaFilter className="text-indigo-500" /> انتخاب کالا
          </h3>
          <div className="space-y-4">
            <Select
              options={PRODUCT_TYPES_OPTIONS}
              value={selectedType}
              onChange={(e) => setSelectedType(e)}
              placeholder="نوع محصول..."
              styles={selectStyles}
            />
            <Select
              options={categoryOptions}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e)}
              placeholder="برند..."
              isDisabled={!selectedType}
              styles={selectStyles}
            />
            <Select
              options={productOptions}
              value={selectedProduct}
              onChange={setSelectedProduct}
              placeholder="جستجوی کالا..."
              isDisabled={!selectedCategory}
              styles={selectStyles}
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="p-2 border rounded-lg text-center font-bold"
                placeholder="تعداد"
              />
              <input
                type="number"
                value={unitCost}
                onChange={(e) => setUnitCost(e.target.value)}
                className="p-2 border rounded-lg text-center font-bold"
                placeholder="فی خرید $"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={minSellPrice}
                onChange={(e) => setMinSellPrice(e.target.value)}
                className="p-2 border rounded-lg text-center text-xs text-orange-600 font-bold"
                placeholder="حداقل فروش"
              />
              <input
                type="number"
                value={maxSellPrice}
                onChange={(e) => setMaxSellPrice(e.target.value)}
                className="p-2 border rounded-lg text-center text-xs text-green-600 font-bold"
                placeholder="حداکثر فروش"
              />
            </div>
          </div>
          <button
            onClick={handleAddItem}
            className="w-full mt-6 bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition flex justify-center items-center gap-2 shadow-lg"
          >
            <FaPlus size={12} /> افزودن به سبد
          </button>
        </div>
      </div>
      <div className="xl:col-span-2 bg-white rounded-xl shadow border border-gray-100 overflow-hidden flex flex-col min-h-[600px]">
        <div className="p-5 border-b bg-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <FaShoppingCart className="text-indigo-600" /> اقلام خرید
          </h3>
          <span className="bg-white border px-3 py-1 rounded-full text-[10px] font-black text-indigo-600 tracking-widest">
            {cartItems.length} ITEMS
          </span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-300 opacity-50 space-y-4">
              <FaClipboardList size={64} />
              <p className="font-bold">لیست سفارش شما خالی است</p>
            </div>
          ) : (
            <table className="w-full text-center text-xs">
              <thead className="bg-slate-900 text-gray-100 uppercase sticky top-0">
                <tr>
                  <th className="p-4 text-right">کالا</th>
                  <th className="p-4">تعداد</th>
                  <th className="p-4">فی</th>
                  <th className="p-4">بازه فروش</th>
                  <th className="p-4">مجموع</th>
                  <th className="p-4">حذف</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {cartItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-indigo-50/50 transition-colors"
                  >
                    <td className="p-4 text-right font-bold text-gray-800">
                      {item.product_name}
                      <br />
                      <span className="text-[10px] text-gray-400 font-normal">
                        {item.sku}
                      </span>
                    </td>
                    <td className="p-4 font-black text-indigo-700">
                      {item.quantity}
                    </td>
                    <td className="p-4 font-mono text-gray-600">
                      ${item.unit_cost.toLocaleString()}
                    </td>
                    <td className="p-4 font-bold text-gray-400 font-mono">
                      ${item.min_selling_price}-${item.max_selling_price}
                    </td>
                    <td className="p-4 font-black text-gray-900 font-mono">
                      ${item.total_line.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() =>
                          setCartItems(
                            cartItems.filter((x) => x.id !== item.id),
                          )
                        }
                        className="text-red-400 hover:text-red-600 transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="p-6 border-t bg-gray-50 flex justify-between items-center">
          <div className="text-gray-500 text-sm font-bold uppercase">
            جمع کل:{" "}
            <span className="text-2xl font-black text-gray-900 ml-2 font-mono">
              $
              {cartItems.reduce((a, b) => a + b.total_line, 0).toLocaleString()}
            </span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading || cartItems.length === 0}
            className="px-10 py-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl disabled:bg-gray-300 flex items-center gap-3 transition-all"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : editingOrder ? (
              <>
                <FaSave /> بروزرسانی
              </>
            ) : (
              <>
                <FaCheckCircle /> ثبت نهایی
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const PurchaseHistory = ({ onEdit }) => {
  const { accessToken: token } = useSelector((state) => state.user);
  const queryClient = useQueryClient();
  const [viewingOrder, setViewingOrder] = useState(null);

  // ✅ اضافه کردن استیت صفحه
  const [page, setPage] = useState(1);

  const { data: orderData, isLoading } = useQuery({
    queryKey: ["purchaseOrders", page], // اضافه کردن صفحه به کلید
    queryFn: () => fetchPurchaseOrders(token, { page }),
    enabled: !!token,
    keepPreviousData: true,
  });

  const orders = useMemo(
    () => (Array.isArray(orderData) ? orderData : orderData?.results || []),
    [orderData],
  );
  // ✅ محاسبه تعداد صفحات
  const totalPages = Math.ceil((orderData?.count || 0) / 10);

  const confirmMutation = useMutation({
    mutationFn: (id) => confirmPurchaseOrder(token, id),
    onSuccess: () => {
      Swal.fire("موفقیت", "موجودی وارد انبار مرکزی شد.", "success");
      queryClient.invalidateQueries(["purchaseOrders"]);
    },
  });

  if (isLoading)
    return (
      <div className="flex justify-center h-64 items-center">
        <Loader2 className="animate-spin w-10 h-10 text-indigo-600" />
      </div>
    );

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
      {viewingOrder && (
        <PurchaseInvoiceReceipt
          order={viewingOrder}
          onClose={() => setViewingOrder(null)}
        />
      )}

      <div className="p-6 border-b bg-gray-100 flex items-center gap-2">
        <FaHistory className="text-gray-500" />{" "}
        <span className="font-bold text-gray-700">تاریخچه سفارشات خرید</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-center text-sm">
          <thead className="bg-slate-900 font-bold text-gray-100 text-xs">
            <tr>
              <th className="px-5 py-4">شناسه</th>
              <th className="px-5 py-4">مبلغ نهایی</th>
              <th className="px-5 py-4">وضعیت</th>
              <th className="px-5 py-4">تاریخ ثبت</th>
              <th className="px-5 py-4 text-center">مدت انتظار</th>
              <th className="px-5 py-4 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => {
              const days = getDaysPassed(order.created_at);
              return (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-5 py-4 font-mono text-indigo-600 font-bold uppercase tracking-tighter">
                    PO-{order.id.slice(0, 8)}
                  </td>
                  <td className="px-5 py-4 font-black text-gray-800 font-mono">
                    ${Number(order.total_cost).toLocaleString()}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase ${order.status === "confirmed" ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}
                    >
                      {order.status === "confirmed" ? "تکمیل شده" : "در انتظار"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-500 font-medium">
                    {new Date(order.created_at).toLocaleDateString("fa-IR")}
                  </td>
                  <td className="px-5 py-4">
                    {order.status === "pending" ? (
                      <div
                        className={`flex items-center justify-center gap-1 font-bold text-[11px] ${days > 5 ? "text-red-600" : "text-gray-400"}`}
                      >
                        <FaClock size={12} />{" "}
                        {days === 0 ? "امروز" : `${days} روز`}
                      </div>
                    ) : (
                      <span className="text-green-500 text-[10px] font-bold">
                        دریافت شد
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-center flex justify-center gap-2">
                    <button
                      onClick={() => setViewingOrder(order)}
                      className="p-2.5 text-indigo-500 bg-indigo-50 rounded-lg hover:bg-indigo-100 shadow-sm transition-all"
                      title="مشاهده فاکتور"
                    >
                      <FaFileInvoice />
                    </button>
                    {order.status === "pending" && (
                      <>
                        <button
                          onClick={() => onEdit(order)}
                          className="p-2.5 text-orange-500 bg-orange-50 rounded-lg hover:bg-orange-100 shadow-sm"
                          title="ویرایش"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => confirmMutation.mutate(order.id)}
                          disabled={confirmMutation.isPending}
                          className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-black hover:bg-green-700 shadow-md flex items-center gap-1 transition-all"
                        >
                          {confirmMutation.isPending ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <FaCheckCircle size={10} />
                          )}{" "}
                          تایید ورود
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* ✅ اضافه کردن صفحه‌بندی در پایین جدول */}
      <div className="p-4 border-t bg-gray-50">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

const PurchaseManagement = () => {
  const [activeTab, setActiveTab] = useState("new");
  const [editingOrder, setEditingOrder] = useState(null);

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen" dir="rtl">
      <div className="max-full mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4 border-b pb-6">
          <div className="space-y-1 text-right">
            <h1 className="text-2xl font-black text-gray-900 flex items-center gap-3">
              <div className="p-3 bg-black text-white rounded-2xl shadow-xl">
                <FaShoppingCart size={20} />
              </div>
              مدیریت خرید و تدارکات
            </h1>
            <p className="text-gray-400 text-sm font-medium pr-14 tracking-tighter">
              سامانه متمرکز تامین موجودی انبار مرکزی
            </p>
          </div>

          <nav className="flex items-center gap-x-2 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
            <button
              onClick={() => {
                setActiveTab("new");
                setEditingOrder(null);
              }}
              className={`px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === "new" ? "bg-gray-900 text-white shadow-lg" : "text-gray-400 hover:text-gray-900"}`}
            >
              <FaPlus size={12} />{" "}
              {editingOrder ? "در حال ویرایش" : "خرید جدید"}
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === "history" ? "bg-gray-900 text-white shadow-lg" : "text-gray-400 hover:text-gray-900"}`}
            >
              <FaHistory size={12} /> تاریخچه کل
            </button>
          </nav>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + (editingOrder?.id || "")}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "new" ? (
              <NewPurchase
                editingOrder={editingOrder}
                onFinish={() => {
                  setActiveTab("history");
                  setEditingOrder(null);
                }}
              />
            ) : (
              <PurchaseHistory
                onEdit={(order) => {
                  setEditingOrder(order);
                  setActiveTab("new");
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PurchaseManagement;
