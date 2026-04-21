import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import Select from "react-select";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  CreditCard,
  Plus,
  Calendar,
  User,
  DollarSign,
  FileText,
  TrendingUp,
  History,
  Search,
  Store,
} from "lucide-react";
import {
  fetchCustomers,
  fetchPayments,
  createPayment,
  fetchWarehouses,
} from "../../../services/api"; // fetchWarehouses اضافه شد
import SubmitBtn from "../../../utils/SubmitBtn";
import CancelBtn from "../../../utils/CancelBtn";

const PaymentCenter = () => {
  const { accessToken: token, currentUser } = useSelector(
    (state) => state.user,
  );
  const queryClient = useQueryClient();
  const isAdmin = currentUser?.is_superuser || currentUser?.role === "ADMIN";
  const today = new Date().toISOString().split("T")[0];

  // --- States ---
  const [activeTab, setActiveTab] = useState("customer"); // 'customer' or 'branch'
  const [showForm, setShowForm] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    customer: null,
    warehouse: null, // برای دریافت از شعبه
    amount: "",
    payment_date: today,
    remarks: "",
  });

  // --- Queries ---
  const { data: customerData } = useQuery({
    queryKey: ["customers"],
    queryFn: () => fetchCustomers(token),
    enabled: !!token,
  });
  const { data: warehouseData } = useQuery({
    queryKey: ["warehouses"],
    queryFn: () => fetchWarehouses(token),
    enabled: !!token && isAdmin,
  });
  const { data: paymentData, isLoading: paymentsLoading } = useQuery({
    queryKey: ["payments"],
    queryFn: () => fetchPayments(token),
    enabled: !!token,
  });

  // استخراج دیتا
  const customers = useMemo(
    () =>
      Array.isArray(customerData) ? customerData : customerData?.results || [],
    [customerData],
  );
  const warehouses = useMemo(
    () =>
      Array.isArray(warehouseData)
        ? warehouseData
        : warehouseData?.results || [],
    [warehouseData],
  );
  const payments = useMemo(
    () =>
      Array.isArray(paymentData) ? paymentData : paymentData?.results || [],
    [paymentData],
  );

  // --- Options ---
  const customerOptions = customers.map((c) => ({
    value: c.id,
    label: `${c.full_name} (${c.phone_number})`,
    debt: c.total_debt,
  }));
  const warehouseOptions = warehouses
    .filter((w) => w.warehouse_type !== "main")
    .map((w) => ({ value: w.id, label: w.name }));

  // --- Mutation ---
  const createMutation = useMutation({
    mutationFn: (data) => createPayment(token, data),
    onSuccess: () => {
      Swal.fire({ title: "موفق", text: "دریافت وجه ثبت شد", icon: "success" });
      queryClient.invalidateQueries(["payments"]);
      setFormData({ ...formData, amount: "", remarks: "" });
    },
    onError: (err) =>
      Swal.fire("خطا", err.response?.data?.detail || "ثبت ناموفق بود", "error"),
  });

  // --- Handlers ---
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.amount)
      return Swal.fire("خطا", "مبلغ را وارد کنید", "warning");

    const payload = {
      amount: formData.amount,
      payment_date: formData.payment_date,
      remarks: formData.remarks,
    };

    if (activeTab === "customer") {
      if (!formData.customer)
        return Swal.fire("خطا", "مشتری را انتخاب کنید", "warning");
      payload.customer = formData.customer.value;
    } else {
      if (!formData.warehouse)
        return Swal.fire("خطا", "شعبه را انتخاب کنید", "warning");
      payload.from_warehouse = formData.warehouse.value;
    }

    createMutation.mutate(payload);
  };

  // فیلتر کردن لیست بر اساس تب فعال
  const filteredPayments = payments.filter((p) => {
    const matchesSearch = (
      p.customer_details?.full_name ||
      p.warehouse_details?.name ||
      ""
    )
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (activeTab === "customer") {
      return matchesSearch && p.customer !== null; // فقط پرداخت‌های مشتری
    } else {
      return matchesSearch && p.from_warehouse !== null; // فقط پرداخت‌های شعبه
    }
  });

  const totalAmount = filteredPayments.reduce(
    (acc, curr) => acc + Number(curr.amount),
    0,
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <CreditCard className="text-green-600" /> مرکز دریافت پول
          </h1>
          <p className="text-gray-500 text-sm mr-9 mt-1">
            مدیریت تمام ورودی‌های مالی به سیستم
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white p-1 rounded-md border border-gray-200 flex">
          <button
            onClick={() => {
              setActiveTab("customer");
              setShowForm(true);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition ${activeTab === "customer" ? "bg-black text-white" : "text-gray-500 hover:bg-gray-50"}`}
          >
            <User size={16} /> از مشتری
          </button>
          {isAdmin && (
            <button
              onClick={() => {
                setActiveTab("branch");
                setShowForm(true);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition ${activeTab === "branch" ? "bg-black text-white" : "text-gray-500 hover:bg-gray-50"}`}
            >
              <Store size={16} /> از شعبه (تسویه حساب)
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-200 p-5 rounded-md  shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-xs font-bold">
              مجموع دریافتی (این بخش)
            </p>
            <p className="text-2xl font-black text-green-600">
              ${totalAmount.toLocaleString()}
            </p>
          </div>
          <div className="bg-green-50 p-3 rounded-xl text-green-600">
            <TrendingUp />
          </div>
        </div>
        <div className="bg-gray-200 p-5 rounded-md  shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-xs font-bold">تعداد تراکنش</p>
            <p className="text-2xl font-black text-gray-800">
              {filteredPayments.length}
            </p>
          </div>
          <div className="bg-gray-100 p-3 rounded-xl text-gray-600">
            <History />
          </div>
        </div>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 overflow-visible"
          >
            <div className="bg-white rounded-md shadow-lg border border-gray-100 p-6">
              <div className="flex justify-between mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Plus className="text-cyan-700" />
                  ثبت دریافت جدید ({activeTab === "customer" ? "مشتری" : "شعبه"}
                  )
                </h3>
              </div>

              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-4 gap-6 align-bottom"
              >
                {/* انتخاب کننده داینامیک */}
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold mb-1">
                    {activeTab === "customer"
                      ? "انتخاب مشتری"
                      : "انتخاب شعبه پرداخت کننده"}
                  </label>
                  {activeTab === "customer" ? (
                    <Select
                      options={customerOptions}
                      value={formData.customer}
                      onChange={(opt) =>
                        setFormData({ ...formData, customer: opt })
                      }
                      placeholder="جستجوی مشتری..."
                      className="text-sm"
                    />
                  ) : (
                    <Select
                      options={warehouseOptions}
                      value={formData.warehouse}
                      onChange={(opt) =>
                        setFormData({ ...formData, warehouse: opt })
                      }
                      placeholder="انتخاب شعبه..."
                      className="text-sm"
                    />
                  )}
                </div>

                <div className="md:col-span-1">
                  <label className="block text-xs font-bold mb-1">
                    مبلغ دریافتی ($)
                  </label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg font-bold text-green-600 dir-ltr"
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="block text-xs font-bold mb-1">تاریخ</label>
                  <input
                    type="date"
                    value={formData.payment_date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        payment_date: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded-lg text-center"
                  />
                </div>

                <div className="md:col-span-1 flex items-end">
                  <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="w-full bg-black text-white py-2.5 rounded-lg font-bold hover:bg-gray-800 transition"
                  >
                    {createMutation.isPending ? (
                      <Loader2 className="animate-spin mx-auto" />
                    ) : (
                      "ثبت دریافت"
                    )}
                  </button>
                </div>

                <div className="md:col-span-4">
                  <label className="block text-xs font-bold mb-1">
                    توضیحات (بابت)
                  </label>
                  <input
                    type="text"
                    value={formData.remarks}
                    onChange={(e) =>
                      setFormData({ ...formData, remarks: e.target.value })
                    }
                    className="w-full px-3 py-4 bg-gray-200 border rounded-md"
                    placeholder="مثال: تسویه حساب فاکتور شماره ..."
                  />
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      <div className="bg-white rounded-md shadow-md px-2 border border-gray-100 overflow-hidden">
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-700">لیست ثبت معاملات</h3>
          <div className="relative w-80">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="جستجو..."
              className="w-full pr-10 pl-4 py-2.5 bg-gray-200 border rounded-md text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <table className="w-full text-center text-sm">
          <thead className="bg-slate-900 font-bold text-gray-100">
            <tr>
              <th className="px-5 py-3">شماره</th>
              <th className="px-5 py-3">پرداخت کننده</th>
              <th className="px-5 py-3 text-center">نوع</th>
              <th className="px-5 py-3 text-center">مبلغ</th>
              <th className="px-5 py-3 text-center">تاریخ</th>
              <th className="px-5 py-3">توضیحات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-400">
                  موردی یافت نشد.
                </td>
              </tr>
            ) : (
              filteredPayments.map((pay, index) => (
                <tr key={pay.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-bold text-gray-800">{index + 1}</td>
                  <td className="px-5 py-3 font-bold text-gray-800">
                    {pay.customer_details
                      ? pay.customer_details.full_name
                      : pay.warehouse_details?.name || "ناشناس"}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs ${pay.customer ? "bg-blue-50 text-blue-700" : "bg-orange-50 text-orange-700"}`}
                    >
                      {pay.customer ? "مشتری" : "شعبه"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center font-bold text-green-600">
                    ${Number(pay.amount).toLocaleString()}
                  </td>
                  <td className="p-4 text-center dir-ltr text-xs">
                    {pay.payment_date}
                  </td>
                  <td className="px-5 py-3 text-gray-500 text-xs">
                    {pay.remarks || "-"}
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

export default PaymentCenter;
