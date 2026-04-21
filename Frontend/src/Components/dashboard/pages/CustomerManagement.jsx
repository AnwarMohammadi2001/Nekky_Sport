import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import Select from "react-select";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaListAlt,
  FaPlus,
  FaSearch,
  FaRegEdit,
  FaTrash,
  FaWallet,
  FaFileInvoiceDollar,
  FaMoneyBillWave,
} from "react-icons/fa";
import {
  Loader2,
  Users,
  CreditCard,
  History,
  X,
  Phone,
  MapPin,
  HandCoins,
} from "lucide-react";

import {
  fetchCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  fetchPayments,
  createPayment,
} from "../../../services/api";
import SubmitBtn from "../../../utils/SubmitBtn";
import CancelBtn from "../../../utils/CancelBtn";
import Pagination from "../../Pagination";

// --- Tab Components ---
const TABS = [
  { id: "list", label: "لیست مشتریان", icon: <FaListAlt /> },
  { id: "payments", label: "دریافت پول از مشتری", icon: <FaMoneyBillWave /> },
  { id: "debt", label: "لیست قرضداران", icon: <FaFileInvoiceDollar /> },
];

const CustomerManagement = ({ setActiveComponent }) => {
  const { accessToken: token } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("list");

  return (
    <div className=" bg-gray-50 min-h-screen" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-black text-gray-700 flex items-center gap-2">
          <Users className="text-cyan-700" /> مدیریت حساب مشتریان
        </h1>
        <div className="bg-white p-1.5 rounded-md shadow-sm border border-gray-200 flex gap-2 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? "bg-black text-white shadow-md" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-md  border  border-gray-200 min-h-[500px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {activeTab === "list" && (
              <CustomerListTab
                token={token}
                setActiveComponent={setActiveComponent}
              />
            )}
            {activeTab === "payments" && <PaymentsTab token={token} />}
            {activeTab === "debt" && <DebtListTab token={token} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// ==========================================
// 1. Tab: Customer List (CRUD)
// ==========================================
const CustomerListTab = ({ token, setActiveComponent }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  // State برای فرم
  const [formData, setFormData] = useState({
    name: "",
    last_name: "",
    phone_number: "",
    location: "",
  });

  // Fetch List
  const { data, isLoading } = useQuery({
    queryKey: ["customers", page, searchTerm],
    queryFn: () => fetchCustomers(token, { page, search: searchTerm }),
    keepPreviousData: true,
  });

  const customers = data?.results || [];
  const totalPages = Math.ceil((data?.count || 0) / 10);

  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: (d) => createCustomer(token, d),
    onSuccess: () => {
      queryClient.invalidateQueries(["customers"]);
      setShowForm(false);
      Swal.fire("موفق", "مشتری ثبت شد", "success");
    },
    onError: (err) =>
      Swal.fire(
        "خطا",
        err.response?.data?.phone_number ? "شماره تکراری است" : "خطا در ثبت",
        "error",
      ),
  });
  const updateMutation = useMutation({
    mutationFn: (d) => updateCustomer(token, editingCustomer.id, d),
    onSuccess: () => {
      queryClient.invalidateQueries(["customers"]);
      setShowForm(false);
      Swal.fire("موفق", "ویرایش شد", "success");
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteCustomer(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries(["customers"]);
      Swal.fire("حذف شد", "", "success");
    },
  });

  // هندلر دکمه سابمیت (مستقیم)
  const handleSubmit = () => {
    if (!formData.name || !formData.last_name || !formData.phone_number) {
      return Swal.fire(
        "خطا",
        "لطفاً نام، تخلص و شماره تماس را وارد کنید.",
        "warning",
      );
    }
    if (editingCustomer) updateMutation.mutate(formData);
    else createMutation.mutate(formData);
  };

  const handleEdit = (c) => {
    setEditingCustomer(c);
    setFormData({
      name: c.name,
      last_name: c.last_name,
      phone_number: c.phone_number,
      location: c.location,
    });
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingCustomer(null);
    setFormData({ name: "", last_name: "", phone_number: "", location: "" });
    setShowForm(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <div className="relative w-[350px]">
          <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="جستجو..."
            className="input-field pl-10"
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <button
          onClick={handleAdd}
          className="bg-cyan-700 hover:bg-cyan-800 text-white px-4 py-2 rounded-md font-bold flex items-center gap-2 shadow-md transition"
        >
          <FaPlus /> مشتری جدید
        </button>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-md w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                {editingCustomer ? "ویرایش مشتری" : "ثبت مشتری جدید"}
              </h2>
              <button onClick={() => setShowForm(false)}>
                <X className="text-gray-400 hover:text-red-500" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="نام *"
                className="input-field"
              />
              <input
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
                placeholder="تخلص *"
                className="input-field"
              />
              <input
                value={formData.phone_number}
                onChange={(e) =>
                  setFormData({ ...formData, phone_number: e.target.value })
                }
                placeholder="شماره تماس *"
                className="input-field"
              />
              <input
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="آدرس"
                className="input-field"
              />
              <div className="flex justify-center gap-2 pt-4 border-t">
                <CancelBtn onClick={() => setShowForm(false)} title="انصراف" />
                <SubmitBtn
                  onClick={handleSubmit}
                  title="ثبت"
                  isLoading={
                    createMutation.isPending || updateMutation.isPending
                  }
                  type="button"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto border border-gray-100 rounded-t-md">
        <table className="w-full text-center">
          <thead className="bg-slate-900 text-gray-100 font-bold border-b">
            <tr>
              <th className="px-5 py-3">شماره</th>
              <th className="px-5 py-3">نام کامل</th>
              <th className="px-5 py-3">شماره</th>
              <th className="px-5 py-3">آدرس</th>
              <th className="px-5 py-3 text-center">وضعیت حساب</th>
              <th className="px-5 py-3 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr>
                <td colSpan="5" className="p-8 text-center">
                  <Loader2 className="animate-spin mx-auto" />
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-400">
                  مشتری یافت نشد.
                </td>
              </tr>
            ) : (
              customers.map((c, index) => (
                <tr
                  key={c.id}
                  className="hover:bg-gray-100 border-b odd:bg-gray-100 even:bg-white border-gray-200 transition"
                >
                  <td className="px-5 py-3 font-bold">{index + 1}</td>
                  <td className="px-5 py-3  text-gray-700">{c.full_name}</td>
                  <td className="px-5 py-3 dir-ltr  font-mono text-gray-600">
                    {c.phone_number}
                  </td>
                  <td className="px-5 py-3 text-gray-500">
                    {c.location || "-"}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${Number(c.total_debt) > 0 ? " text-red-700 border-red-100" : "bg-green-50 text-green-700 border-green-100"}`}
                    >
                      {Number(c.total_debt) > 0
                        ? `${Number(c.total_debt).toLocaleString()} بدهکار`
                        : "تسویه"}
                    </span>
                  </td>
                  <td className="px-5 py-3 flex justify-center gap-2">
                    <button
                      onClick={() => {
                        localStorage.setItem("selectedCustomerId", c.id);
                        setActiveComponent("customer_wallet");
                      }}
                      className="bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-100"
                      title="کیف پول"
                    >
                      <FaWallet />
                    </button>
                    <button
                      onClick={() => handleEdit(c)}
                      className="bg-amber-50 text-amber-600 p-2 rounded-lg hover:bg-amber-100"
                    >
                      <FaRegEdit />
                    </button>
                    <button
                      onClick={() =>
                        Swal.fire({
                          title: "حذف؟",
                          icon: "warning",
                          showCancelButton: true,
                        }).then((r) => {
                          if (r.isConfirmed) deleteMutation.mutate(c.id);
                        })
                      }
                      className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

// ==========================================
// 2. Tab: Payments Center (Form Fixed)
// ==========================================
const PaymentsTab = ({ token }) => {
  const [amount, setAmount] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [remarks, setRemarks] = useState("");

  const queryClient = useQueryClient();

  // Fetch Payments
  const { data: paymentsData } = useQuery({
    queryKey: ["payments"],
    queryFn: () => fetchPayments(token),
  });
  // Fetch ALL Customers for Select (Important!)
  const { data: allCustomersData } = useQuery({
    queryKey: ["customersAll"],
    queryFn: () => fetchCustomers(token, { page_size: 1000 }),
  });

  const payments = paymentsData?.results || [];
  const customerOptions = (allCustomersData?.results || []).map((c) => ({
    value: c.id,
    label: `${c.full_name} (بدهی: ${Number(c.total_debt).toLocaleString()})`,
  }));

  const createMutation = useMutation({
    mutationFn: (data) => createPayment(token, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["payments"]);
      queryClient.invalidateQueries(["customers"]);
      setAmount("");
      setRemarks("");
      setSelectedCustomer(null);
      Swal.fire("ثبت شد", "مبلغ دریافت شد.", "success");
    },
    onError: (err) => Swal.fire("خطا", "مشکلی پیش آمد", "error"),
  });

  const handleSubmit = () => {
    if (!selectedCustomer || !amount)
      return Swal.fire("خطا", "لطفا مشتری و مبلغ را وارد کنید", "warning");
    createMutation.mutate({
      customer: selectedCustomer.value,
      amount,
      payment_date: date,
      remarks,
    });
  };

  return (
    <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 bg-gray-100 p-6 rounded-md border border-gray-200 h-fit">
        <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-cyan-700">
          <CreditCard /> دریافت پول از مشتری
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">
              مشتری
            </label>
            <Select
              options={customerOptions}
              value={selectedCustomer}
              onChange={setSelectedCustomer}
              placeholder="جستجو..."
              className="text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">
              مبلغ ($)
            </label>
            <input
              type="number"
              className="input-field text-center font-bold text-green-700 "
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">
              تاریخ
            </label>
            <input
              type="date"
              className="input-field text-center"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">
              توضیحات
            </label>
            <textarea
              className="input-field h-20 resize-none"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="بابت..."
            />
          </div>
          <div className="flex items-center justify-center">
            <SubmitBtn
              onClick={handleSubmit}
              title="ثبت دریافت"
              className=""
              isLoading={createMutation.isPending}
              type="button"
            />
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-700">
          <History /> آخرین پرداختی ها
        </h3>
        <div className="border border-gray-100 rounded-md overflow-hidden bg-white shadow-sm">
          <table className="w-full text-center">
            <thead className="bg-slate-900 text-gray-100 font-bold">
              <tr>
                <th className="p-3">شماره</th>
                <th className="p-3">مشتری</th>
                <th className="p-3 text-center">مبلغ</th>
                <th className="p-3 text-center">تاریخ</th>
                <th className="p-3">توضیحات</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-400">
                    هنوز دریافتی ثبت نشده است.
                  </td>
                </tr>
              ) : (
                payments.map((p  , index) => (
                  <tr key={p.id} className="hover:bg-gray-100 border-b border-gray-200 odd:bg-gray-100 even:bg-white transition">
                    <td className="p-3 ">
                      {index + 1}
                    </td>
                    <td className="p-3 font-bold">
                      {p.customer_details?.full_name}
                    </td>
                    <td className="p-3 text-center  text-sm text-green-600 font-bold">
                      ${Number(p.amount).toLocaleString()}
                    </td>
                    <td className="p-3 text-center dir-ltr text-xs text-gray-500">
                      {p.payment_date}
                    </td>
                    <td className="p-3 text-gray-500 text-xs">
                      {p.remarks || "-"}
                    </td>
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
// 3. Tab: Debt List
// ==========================================
const DebtListTab = ({ token }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["customersAll"],
    queryFn: () => fetchCustomers(token, { page_size: 1000 }),
  });

  const debtors = (data?.results || [])
    .filter((c) => Number(c.total_debt) > 0)
    .sort((a, b) => b.total_debt - a.total_debt);
  const totalDebt = debtors.reduce((sum, c) => sum + Number(c.total_debt), 0);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6 bg-gray-200 p-4 rounded-md border">
        <div>
          <h3 className="font-bold text-red-800 text-lg flex items-center gap-2">
            <HandCoins /> لیست قرضداران
          </h3>
          <p className="text-red-600 text-sm mt-1">
            مشتریانی که  از سیستم قرضدار هستند 
          </p>
        </div>
        <div className="text-left">
          <p className="text-xs text-red-500 font-bold mb-1">مجموع کل طلب:</p>
          <p className="text-2xl font-black text-red-700">
            ${totalDebt.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto  rounded-md">
        <table className="w-full text-center">
          <thead className="bg-slate-900 text-white font-bold">
            <tr>
              <th className="px-5 py-3">شماره</th>
              <th className="px-5 py-3">نام مشتری</th>
              <th className="px-5 py-3">شماره تماس</th>
              <th className="px-5 py-3">آخرین آدرس</th>
              <th className="px-5 py-3 ">مبلغ بدهی</th>
            </tr>
          </thead>
          <tbody className="divide-y border ">
            {isLoading ? (
              <tr>
                <td colSpan="5" className="p-8 text-center">
                  <Loader2 className="animate-spin mx-auto" />
                </td>
              </tr>
            ) : debtors.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="p-8 text-center text-green-600 font-bold"
                >
                  عالی! هیچ مشتری بدهکاری ندارید.
                </td>
              </tr>
            ) : (
              debtors.map((c, index) => (
                <tr key={c.id} className=" border-b border-gray-200 odd:bg-gray-100 hover:bg-gray-100 transition">
                  <td className="px-5 py-3 font-bold ">{index + 1}</td>
                  <td className="px-5 py-3  font-bold text-gray-800">{c.full_name}</td>
                  <td className="px-5 py-3  font-mono text-gray-600 dir-ltr ">
                    {c.phone_number}
                  </td>
                  <td className="px-5 py-3  text-gray-500 text-xs">
                    {c.location || "-"}
                  </td>
                  <td className="px-5 py-3  font-semibold   text-red-600">
                    ${Number(c.total_debt).toLocaleString()}
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

export default CustomerManagement;
