import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import Select from "react-select";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaUserPlus,
  FaUsers,
  FaTrash,
  FaSearch,
  FaMoneyBillWave,
  FaListAlt,
  FaFileInvoiceDollar,
  FaStore,
  FaUserShield,
  FaEdit,
  FaTimes,
  FaEnvelope,
} from "react-icons/fa";
import {
  Loader2,
  CreditCard,
  History,
  Calculator,
  HandCoins,
} from "lucide-react";
import {
  createSeller,
  updateSeller, // اضافه شد
  fetchSellers,
  deleteSeller,
  toggleSellerStatus,
  fetchDistributionHistory,
  fetchPayments,
  createPayment,
  fetchExpenses,
  fetchWarehouses,
} from "../../../services/api";
import SubmitBtn from "../../../utils/SubmitBtn";
import CancelBtn from "../../../utils/CancelBtn";

const TABS = [
  { id: "list", label: "لیست کارمندان", icon: <FaListAlt /> },
  { id: "payments", label: "تصفیه حساب شعب", icon: <FaMoneyBillWave /> },
  { id: "debt", label: "تراز مالی شعب", icon: <FaFileInvoiceDollar /> },
];

// ==========================================
// 1. Tab: Seller List (با قابلیت ویرایش)
// ==========================================
const SellerListTab = ({ token }) => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // States برای فرم
  const [editId, setEditId] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isHqManager, setIsHqManager] = useState(false);

  const { data: sellersData, isLoading } = useQuery({
    queryKey: ["sellers"],
    queryFn: () => fetchSellers(token),
    enabled: !!token,
  });

  const sellers = useMemo(
    () => Array.isArray(sellersData) ? sellersData : sellersData?.results || [],
    [sellersData],
  );

  const mutation = useMutation({
    mutationFn: (data) => editId ? updateSeller(token, editId, data) : createSeller(token, data),
    onSuccess: () => {
      Swal.fire({ title: "موفق", text: editId ? "اطلاعات بروزرسانی شد." : "کاربر جدید ایجاد شد.", icon: "success", timer: 2000 });
      resetForm();
      queryClient.invalidateQueries(["sellers"]);
    },
    onError: (err) => Swal.fire("خطا", err.response?.data?.error || "عملیات ناموفق بود", "error"),
  });

  const resetForm = () => {
    setFirstName(""); setLastName(""); setEmail(""); setPassword("");
    setIsHqManager(false); setShowForm(false); setEditId(null);
  };

  const handleEditClick = (s) => {
      setEditId(s.id);
      setFirstName(s.first_name);
      setLastName(s.last_name);
      setEmail(s.email);
      setIsHqManager(s.is_hq_manager || false);
      setPassword(""); // برای امنیت رمز قبلی را نشان نمی‌دهیم
      setShowForm(true);
  };

  const handleFormSubmit = (e) => {
    if (e) e.preventDefault();
    if (!firstName || !lastName || !email || (!editId && !password))
      return Swal.fire("هشدار", "فیلدهای ستاره‌دار الزامی است.", "warning");
    
    const payload = { first_name: firstName, last_name: lastName, email, is_hq_manager: isHqManager };
    if (password) payload.password = password; // فقط اگر رمز وارد شده باشد ارسال کن
    
    mutation.mutate(payload);
  };

  const toggleMutation = useMutation({
    mutationFn: (id) => toggleSellerStatus(token, id),
    onSuccess: () => queryClient.invalidateQueries(["sellers"]),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteSeller(token, id),
    onSuccess: () => { Swal.fire("حذف شد", "", "success"); queryClient.invalidateQueries(["sellers"]); },
  });

  const filteredSellers = sellers.filter((s) =>
    (s.first_name + " " + s.last_name + " " + s.email)
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-80">
          <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
          <input type="text" placeholder="جستجو (نام یا ایمیل)..." className="input-field pl-10" onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-black text-white px-6 py-2.5 rounded-md font-bold flex items-center gap-2 shadow-lg hover:bg-gray-800 transition">
          <FaUserPlus /> کارمند جدید
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={resetForm}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white p-8 rounded-md w-full max-w-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                  <h2 className="text-2xl font-black flex items-center gap-2">
                    {editId ? <FaEdit className="text-amber-500" /> : <FaUserShield className="text-cyan-700" />} 
                    {editId ? "ویرایش اطلاعات کارمند" : "اضافه کردن کارمند جدید"}
                  </h2>
                  {editId && <button onClick={resetForm} className="text-gray-400 hover:text-red-500"><FaTimes size={20}/></button>}
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="input-field" placeholder="نام *" />
                  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="input-field" placeholder="تخلص *" />
                </div>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field text-left" placeholder="ایمیل / نام کاربری *" dir="ltr" />
                <div className="relative">
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" placeholder={editId ? "رمز عبور جدید (در صورت نیاز به تغییر)" : "رمز عبور *"} />
                    {editId && <p className="text-[10px] text-gray-400 mt-1 mr-1">اگر نمی‌خواهید رمز تغییر کند، این فیلد را خالی بگذارید.</p>}
                </div>
                <div className="bg-indigo-50 p-4 rounded-md border-2 border-indigo-100">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={isHqManager} onChange={(e) => setIsHqManager(e.target.checked)} className="w-6 h-6 accent-indigo-600" />
                    <div>
                      <p className="font-black text-indigo-900 text-sm">انتساب به عنوان "مدیر مرکز"</p>
                      <p className="text-[10px] text-indigo-500">دسترسی به انبار مرکزی بدون رویت قیمت خرید اصلی ادمین.</p>
                    </div>
                  </label>
                </div>
                <div className="flex justify-center gap-2 pt-4 border-t">
                  <CancelBtn onClick={resetForm} title="انصراف" />
                  <SubmitBtn onClick={handleFormSubmit} title={editId ? "بروزرسانی اطلاعات" : "تایید و ساخت کارمند"} isLoading={mutation.isPending} />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-t-md overflow-hidden border border-gray-200">
        <table className="w-full text-center">
          <thead className="bg-slate-900 text-gray-100 font-bold uppercase text-sm">
            <tr>
              <th className="px-5 py-4 w-16">#</th>
              <th className="px-5 py-4">نام و تخلص</th>
              <th className="px-5 py-4">ایمیل / کاربری</th>
              <th className="px-5 py-4">نقش دسترسی</th>
              <th className="px-5 py-4">وضعیت</th>
              <th className="px-5 py-4">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr><td colSpan="6" className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-indigo-600" /></td></tr>
            ) : filteredSellers.length === 0 ? (
              <tr><td colSpan="6" className="p-10 text-gray-400">کارمندی یافت نشد.</td></tr>
            ) : (
              filteredSellers.map((s, index) => (
                <tr key={s.id} className="hover:bg-gray-50 border-b border-gray-200 odd:bg-gray-100 transition-all">
                  <td className="px-5 py-3 font-bold text-gray-500">{index + 1}</td>
                  <td className="px-5 py-3 font-black text-gray-800">{s.first_name} {s.last_name}</td>
                  {/* ✅ نمایش ایمیل در لیست */}
                  <td className="px-5 py-3 text-xs text-gray-500 font-mono" dir="ltr">{s.email}</td>
                  <td className="px-5 py-3">
                    {s.is_hq_manager ? (
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-[10px] font-black"><FaUserShield className="inline ml-1" /> مدیر مرکز</span>
                    ) : (
                      <span className="text-cyan-700 px-3 py-1 rounded-lg text-xs font-bold">فروشنده شعبه</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <button onClick={() => toggleMutation.mutate(s.id)} className={`px-3 py-1 rounded-lg text-[10px] font-black border-2 ${s.is_active ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                      {s.is_active ? "فعال" : "مسدود"}
                    </button>
                  </td>
                  <td className="px-5 py-3 flex justify-center gap-2">
                    {/* ✅ دکمه ویرایش اضافه شد */}
                    <button onClick={() => handleEditClick(s)} className="text-amber-500 hover:bg-amber-50 p-2 rounded-lg transition" title="ویرایش">
                      <FaEdit />
                    </button>
                    <button onClick={() => Swal.fire({ title: "حذف کاربر؟", icon: "warning", showCancelButton: true }).then((r) => { if (r.isConfirmed) deleteMutation.mutate(s.id); })} className="text-red-400 hover:text-red-600 p-2 rounded-lg" title="حذف">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==========================================
// 2. Tab: Seller Payments (بدون تغییر منطقی طبق قانون)
// ==========================================
const SellerPaymentsTab = ({ token }) => {
  const [amount, setAmount] = useState("");
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [remarks, setRemarks] = useState("");
  const queryClient = useQueryClient();

  const { data: distData } = useQuery({ queryKey: ["distHistory"], queryFn: () => fetchDistributionHistory(token) });
  const { data: payData } = useQuery({ queryKey: ["payments"], queryFn: () => fetchPayments(token) });
  const { data: expensesData } = useQuery({ queryKey: ["expenses"], queryFn: () => fetchExpenses(token) });
  const { data: whData } = useQuery({ queryKey: ["warehouses"], queryFn: () => fetchWarehouses(token) });

  const warehouses = useMemo(() => (Array.isArray(whData) ? whData : whData?.results || []), [whData]);

  const sellerDebtInfo = useMemo(() => {
    if (!selectedSeller) return null;
    const wid = selectedSeller.value;
    const distributions = Array.isArray(distData) ? distData : distData?.results || [];
    const payments = Array.isArray(payData) ? payData : payData?.results || [];
    const expenses = Array.isArray(expensesData) ? expensesData : expensesData?.results || [];

    const totalReceived = distributions.filter((d) => d.target_warehouse === wid).reduce((acc, d) => acc + Number(d.total_value), 0);
    const totalPaid = payments.filter((p) => p.from_warehouse === wid).reduce((acc, p) => acc + Number(p.amount), 0);
    const sharePerBranch = expenses.filter((e) => e.expense_type === "general" && e.warehouse === wid).reduce((acc, e) => acc + Number(e.amount), 0);
    const currentBalance = totalReceived + sharePerBranch - totalPaid;
    return { totalReceived, sharePerBranch, totalPaid, currentBalance };
  }, [selectedSeller, distData, payData, expensesData]);

  const filteredHistory = useMemo(() => {
    const allPayments = (Array.isArray(payData) ? payData : payData?.results || []).filter((p) => p.from_warehouse);
    return selectedSeller ? allPayments.filter((p) => p.from_warehouse === selectedSeller.value) : allPayments;
  }, [payData, selectedSeller]);

  const createMutation = useMutation({
    mutationFn: (data) => createPayment(token, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["payments"]);
      setAmount(""); setRemarks(""); setSelectedSeller(null);
      Swal.fire("موفق", "دریافت وجه با موفقیت ثبت شد.", "success");
    },
  });

  const handleFormSubmit = () => {
    if (!selectedSeller || !amount) return Swal.fire("خطا", "اطلاعات ناقص است", "warning");
    createMutation.mutate({ from_warehouse: selectedSeller.value, amount, payment_date: date, remarks });
  };

  return (
    <div className="p-2 grid grid-cols-1 lg:grid-cols-3 gap-5 border rounded-md bg-white">
      <div className="lg:col-span-1 space-y-6">
        <div className="p-8 rounded-md border-2 border-gray-100 shadow-xl h-fit">
          <h3 className="font-black text-xl mb-8 flex items-center gap-2 text-gray-700"><CreditCard /> دریافت پول از شعبات</h3>
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-gray-400 mb-2 block uppercase">انتخاب فروشنده / شعبه</label>
              <Select options={warehouses.filter((w) => w.warehouse_type === "branch").map((w) => ({ value: w.id, label: w.name }))} value={selectedSeller} onChange={setSelectedSeller} placeholder="جستجو..." />
            </div>
            <AnimatePresence>
              {sellerDebtInfo && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-700 p-6 rounded-md text-white">
                  <p className="text-[10px] font-bold text-gray-100 mb-4 uppercase flex items-center gap-2"><Calculator size={14} /> وضعیت حساب شعبه:</p>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs"><span>اجناس دریافتی:</span><span className="font-black text-blue-400">${sellerDebtInfo.totalReceived.toLocaleString()}</span></div>
                    <div className="flex justify-between text-xs"><span>سهم مصارف عمومی:</span><span className="font-black text-orange-400">${sellerDebtInfo.sharePerBranch.toLocaleString()}</span></div>
                    <div className="flex justify-between text-xs border-b border-white/10 pb-2"><span>کل پرداختی:</span><span className="font-black text-green-400">${sellerDebtInfo.totalPaid.toLocaleString()}</span></div>
                    <div className="flex justify-between text-lg font-black pt-2"><span>باقی مانده:</span><span className="text-red-400">${sellerDebtInfo.currentBalance.toLocaleString()}</span></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div>
              <label className="text-[10px] font-black text-gray-400 mb-2 block uppercase">مبلغ دریافتی ($)</label>
              <input type="number" className="input-field text-center font-black text-green-700 " value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 mb-2 block uppercase">تاریخ و توضیحات</label>
              <input type="date" className="input-field text-center mb-4" value={date} onChange={(e) => setDate(e.target.value)} />
              <textarea className="input-field h-24" value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="توضیحات تراکنش..." />
            </div>
            <div className="flex items-center justify-center">
              <SubmitBtn onClick={handleFormSubmit} title="تایید و ثبت دریافتی" isLoading={createMutation.isPending} />
            </div>
          </div>
        </div>
      </div>
      <div className="lg:col-span-2">
        <h3 className="font-black text-xl mb-6 pt-2 flex items-center gap-2 text-gray-700"><History /> آخرین تسویه حساب‌ها</h3>
        <div className="border rounded-md overflow-hidden shadow-2xl bg-white">
          <table className="w-full text-center">
            <thead className="bg-slate-900 text-gray-100 font-black uppercase text-sm">
              <tr>
                <th className="px-5 py-4">شعبه</th>
                <th className="px-5 py-4">مبلغ</th>
                <th className="px-5 py-4">تاریخ</th>
                <th className="px-5 py-4">توضیحات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredHistory.length === 0 ? (
                <tr><td colSpan="4" className="p-20 text-center text-gray-400 font-bold">معامله‌ای یافت نشد.</td></tr>
              ) : (
                filteredHistory.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-100 border-b border-gray-200 odd:bg-gray-100 transition-colors">
                    <td className="px-5 py-3 font-black flex items-center gap-2"><FaStore className="text-gray-300" /> {p.warehouse_details?.name}</td>
                    <td className="px-5 py-3 text-center font-black text-green-600">${Number(p.amount).toLocaleString()}</td>
                    <td className="px-5 py-3 text-center text-gray-400 font-mono text-xs">{p.payment_date}</td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{p.remarks || "---"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. Tab: Seller Debt (بدون تغییر منطقی طبق قانون)
// ==========================================
const SellerDebtTab = ({ token }) => {
  const { data: distData } = useQuery({ queryKey: ["distHistory"], queryFn: () => fetchDistributionHistory(token) });
  const { data: payData } = useQuery({ queryKey: ["payments"], queryFn: () => fetchPayments(token) });
  const { data: expensesData } = useQuery({ queryKey: ["expenses"], queryFn: () => fetchExpenses(token) });
  const { data: whData } = useQuery({ queryKey: ["warehouses"], queryFn: () => fetchWarehouses(token) });

  const warehouses = useMemo(() => (Array.isArray(whData) ? whData : whData?.results || []), [whData]);

  const sellerStats = useMemo(() => {
    const branches = warehouses.filter((w) => w.warehouse_type === "branch");
    const distributions = Array.isArray(distData) ? distData : distData?.results || [];
    const payments = Array.isArray(payData) ? payData : payData?.results || [];
    const expenses = Array.isArray(expensesData) ? expensesData : expensesData?.results || [];

    return branches
      .map((w) => {
        const received = distributions.filter((d) => d.target_warehouse === w.id).reduce((acc, d) => acc + Number(d.total_value), 0);
        const paid = payments.filter((p) => p.from_warehouse === w.id).reduce((acc, p) => acc + Number(p.amount), 0);
        const share = expenses.filter((e) => e.expense_type === "general" && e.warehouse === w.id).reduce((acc, e) => acc + Number(e.amount), 0);
        return { ...w, received, share, paid, debt: received + share - paid };
      })
      .sort((a, b) => b.debt - a.debt);
  }, [warehouses, distData, payData, expensesData]);

  const totalSystemDebt = sellerStats.reduce((acc, s) => acc + s.debt, 0);

  return (
    <div className="">
      <div className="flex justify-between items-center mb-8 bg-gray-200 p-10 rounded-md overflow-hidden relative">
        <div className="z-10"><h3 className="font-black text-xl flex items-center gap-3"><HandCoins /> باقییات فروشنده‌ها از مرکز</h3></div>
        <div className="z-10 text-left space-y-2">
          <p className="text-xs font-bold opacity-70 uppercase tracking-widest">مجموع کل بدهی شعب</p>
          <p className="text-3xl font-black">${totalSystemDebt.toLocaleString()}</p>
        </div>
      </div>
      <div className="overflow-x-auto border border-gray-200 rounded-md bg-white">
        <table className="w-full text-center">
          <thead className="bg-gray-900 text-white font-black uppercase text-sm">
            <tr>
              <th className="px-5 py-4 w-16">#</th>
              <th className="px-5 py-4">نام شعبه / مدیر</th>
              <th className="px-5 py-4 text-center">ارزش اجناس</th>
              <th className="px-5 py-4 text-center">سهم هزینه‌ها</th>
              <th className="px-5 py-4 text-center">مجموع پرداختی</th>
              <th className="px-5 py-4 text-left">باقیداری</th>
            </tr>
          </thead>
          <tbody>
            {sellerStats.map((s, index) => (
              <tr key={s.id} className="border-b border-gray-200 odd:bg-gray-100 even:bg-white hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 font-bold text-gray-500">{index + 1}</td>
                <td className="px-5 py-3 font-black text-slate-900 ">{s.name}</td>
                <td className="px-5 py-3 text-center font-bold text-cyan-700">${s.received.toLocaleString()}</td>
                <td className="px-5 py-3 text-center font-bold text-orange-600">${s.share.toLocaleString()}</td>
                <td className="px-5 py-3 text-center font-bold text-green-600">${s.paid.toLocaleString()}</td>
                <td className={`px-5 py-3 text-left font-black ${s.debt > 0 ? "text-red-600" : "text-green-600"}`}>${s.debt.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==========================================
// Main Component
// ==========================================
const SellerManager = () => {
  const { accessToken: token } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("list");
  return (
    <div className=" bg-gray-50 min-h-screen" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
        <div>
          <h1 className="text-xl font-black text-gray-900 flex items-center gap-4">
            <FaUsers className="text-cyan-700" /> مدیریت کارمندان و شعبات
          </h1>
          <p className="text-sm text-gray-500 font-bold mt-1">کنترل نقش‌ها، دسترسی‌ها و تراز مالی سیستم</p>
        </div>
        <div className="bg-white p-1.5 rounded-md shadow-sm flex gap-2 border border-gray-200">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-2.5 rounded-md text-sm font-black transition-all ${activeTab === tab.id ? "bg-black text-white shadow-xl" : "text-gray-500 hover:bg-gray-100"}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>
      <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="min-h-[650px] overflow-hidden">
        {activeTab === "list" && <SellerListTab token={token} />}
        {activeTab === "payments" && <SellerPaymentsTab token={token} />}
        {activeTab === "debt" && <SellerDebtTab token={token} />}
      </motion.div>
    </div>
  );
};

export default SellerManager;