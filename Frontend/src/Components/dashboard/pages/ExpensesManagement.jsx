import React, { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import Select from "react-select";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaMoneyBillWave,
  FaPlus,
  FaTrash,
  FaTimes,
  FaGlobe,
  FaHome,
} from "react-icons/fa";
import { Loader2, PlusCircle } from "lucide-react";
import {
  fetchExpenses,
  createExpense,
  deleteExpense,
  fetchExpenseCategories,
  createExpenseCategory,
  fetchWarehouses,
} from "../../../services/api";
import SubmitBtn from "../../../utils/SubmitBtn";
import Pagination from "../../Pagination";

const ExpensesManagement = () => {
  const { accessToken: token, currentUser } = useSelector(
    (state) => state.user,
  );
  const queryClient = useQueryClient();
  const isAdmin = currentUser?.is_superuser || currentUser?.role === "ADMIN";
  const today = new Date().toISOString().split("T")[0];

  // --- States ---
  const [activeTab, setActiveTab] = useState("local"); // 'local' or 'general'
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);

  // Form Inputs
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(today);
  const [isGeneral, setIsGeneral] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [newCatName, setNewCatName] = useState("");

  // --- Queries ---

  // 1. دریافت لیست هزینه‌ها (با ارسال نوع تب و صفحه به بک‌اند)
  const { data: expensesData, isLoading: expensesLoading } = useQuery({
    queryKey: ["expenses", activeTab, currentPage],
    queryFn: () =>
      fetchExpenses(token, {
        page: currentPage,
        type: activeTab,
      }),
    enabled: !!token,
  });

  // 2. سایر دیتاها
  const { data: catData } = useQuery({
    queryKey: ["expenseCategories", "all"],
    queryFn: () => fetchExpenseCategories(token, { page_size: 500 }),
    enabled: !!token,
  });
  const { data: whData } = useQuery({
    queryKey: ["warehouses", "all"],
    queryFn: () => fetchWarehouses(token, { page_size: 500 }),
    enabled: !!token,
  });

  // ✅ استخراج ایمن دیتا (حل مشکل map is not a function)
  const expenses = useMemo(
    () =>
      Array.isArray(expensesData) ? expensesData : expensesData?.results || [],
    [expensesData],
  );
  const totalCount = expensesData?.count || 0;
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const categories = useMemo(
    () => (Array.isArray(catData) ? catData : catData?.results || []),
    [catData],
  );
  const warehouses = useMemo(
    () => (Array.isArray(whData) ? whData : whData?.results || []),
    [whData],
  );

  // انتخاب انبار پیش‌فرض برای فروشنده
  useEffect(() => {
    if (!isAdmin && warehouses.length > 0) {
      const myWh = warehouses[0];
      setSelectedWarehouse({ value: myWh.id, label: myWh.name });
    }
  }, [warehouses, isAdmin]);

  // --- Mutations ---
  const createMutation = useMutation({
    mutationFn: (data) => createExpense(token, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["expenses"]);
      setShowForm(false);
      setAmount("");
      setDescription("");
      setIsGeneral(false);
      if (isAdmin) setSelectedWarehouse(null);
      Swal.fire("موفق", "هزینه ثبت شد", "success");
    },
    onError: (err) =>
      Swal.fire("خطا", err.response?.data?.detail || "خطا در ثبت", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteExpense(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries(["expenses"]);
      Swal.fire("حذف شد", "", "success");
    },
  });

  const createCatMutation = useMutation({
    mutationFn: (data) => createExpenseCategory(token, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["expenseCategories"]);
      setNewCatName("");
      Swal.fire("موفق", "دسته بندی اضافه شد", "success");
    },
  });

  // --- Handlers ---
  const handleSubmit = (e) => {
    e.preventDefault();

    // اعتبارسنجی فرانت
    if (!selectedCategory || !amount)
      return Swal.fire("خطا", "اطلاعات ناقص است", "warning");
    if (!isGeneral && !selectedWarehouse)
      return Swal.fire("خطا", "شعبه را انتخاب کنید", "warning");

    const payload = {
      amount: amount,
      description: description,
      date: date,
      category: selectedCategory.value,
      expense_type: isGeneral ? "general" : "local",
      warehouse: isGeneral ? null : selectedWarehouse.value,
    };
    createMutation.mutate(payload);
  };

  const handleCreateCategory = () => {
    if (!newCatName) return;
    createCatMutation.mutate({ name: newCatName });
  };

  // Options
  const catOptions = categories.map((c) => ({ value: c.id, label: c.name }));
  const whOptions = warehouses.map((w) => ({ value: w.id, label: w.name }));

  // Styles
  const selectStyles = {
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    control: (base) => ({ ...base, borderRadius: "12px", padding: "2px" }),
  };

  return (
    <div className="p-6 bg-white rounded-md " dir="rtl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-3">
          <FaMoneyBillWave className="text-black" /> مدیریت مصارف
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-black text-white px-6 py-2.5 rounded-md font-bold flex items-center gap-2 hover:bg-gray-800 transition"
        >
          <FaPlus /> ثبت مصرف جدید
        </button>
      </div>

      {/* Tabs for Filtering */}
      <div className="flex bg-white p-1.5 items-center gap-x-4 rounded-md shadow-sm border border-gray-200 w-fit mb-6">
        <button
          onClick={() => {
            setActiveTab("local");
            setCurrentPage(1);
          }}
          className={`px-6 py-2.5 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${activeTab === "local" ? "bg-black text-white shadow-md" : "text-gray-500 hover:bg-gray-200"}`}
        >
          <FaHome /> مصارف داخلی (شعبات)
        </button>
        <button
          onClick={() => {
            setActiveTab("general");
            setCurrentPage(1);
          }}
          className={`px-6 py-2.5 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${activeTab === "general" ? "bg-black text-white shadow-md" : "text-gray-500 hover:bg-gray-200"}`}
        >
          <FaGlobe /> مصارف عمومی (دریافتی از مرکز)
        </button>
      </div>

      {/* List Table */}
      <div className="bg-white rounded-md shadow-md border border-gray-100  overflow-hidden min-h-[400px]">
        <div className="p-6 border-b bg-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-700 flex items-center gap-2">
            {activeTab === "local"
              ? "لیست هزینه‌های ثبت شده در شعبه"
              : "سهم هزینه‌های عمومی مرکز"}
          </h3>
          <span className="bg-white border px-3 py-1 rounded-full text-xs text-gray-500 font-bold">
            تعداد کل: {totalCount}
          </span>
        </div>

        <div className="overflow-x-auto ">
          <table className="w-full text-center text-sm">
            <thead className="bg-slate-900 font-bold text-gray-100">
              <tr>
                <th className="px-5 py-3">عنوان / دسته‌بندی</th>
                <th className="px-5 py-3 text-center">نوع</th>
                <th className="px-5 py-3">شعبه مربوطه</th>
                <th className="px-5 py-3 text-center">مبلغ</th>
                <th className="px-5 py-3 text-center">تاریخ</th>
                <th className="px-5 py-3">ثبت کننده</th>
                <th className="px-5 py-3 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {expensesLoading ? (
                <tr>
                  <td colSpan="7" className="p-10 text-center">
                    <Loader2 className="animate-spin mx-auto text-indigo-600" />
                  </td>
                </tr>
              ) : expenses.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-10 text-center text-gray-400">
                    موردی یافت نشد.
                  </td>
                </tr>
              ) : (
                expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-gray-100 border-b border-gray-200 odd:bg-gray-100 transition">
                    <td className="px-5 py-3 font-bold text-gray-800">
                      {exp.category_name} <br />
                      {/* <span className="text-xs text-gray-400 font-normal">
                        {exp.description || "-"}
                      </span> */}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${exp.expense_type === "general" ? "bg-blue-50 text-blue-700 border-blue-100" : "bg-gray-100 text-gray-600 border-gray-200"}`}
                      >
                        {exp.expense_type === "general"
                          ? " عمومی"
                          : " داخلی"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs font-bold text-gray-600">
                      {exp.warehouse_name || "---"}
                    </td>
                    <td className="px-5 py-3 text-center font-bold text-red-600 text-base">
                      ${Number(exp.amount).toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-center dir-ltr text-xs font-mono">
                      {exp.date}
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-500">
                      {exp.created_by_name}
                    </td>
                    <td className="px-5 py-3 text-center">
                      {/* فقط ادمین یا اگر هزینه لوکال باشد قابل حذف است */}
                      {(isAdmin || exp.expense_type === "local") && (
                        <button
                          onClick={() =>
                            Swal.fire({
                              title: "حذف؟",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonColor: "#d33",
                            }).then((r) => {
                              if (r.isConfirmed) deleteMutation.mutate(exp.id);
                            })
                          }
                          className="text-red-400 hover:text-red-600 bg-red-50 p-2 rounded-lg transition"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t bg-gray-50">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Modal Form */}
      <AnimatePresence>
        {showForm && (
          <div
            className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white w-full max-w-2xl rounded-md p-8 shadow-2xl overflow-visible"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-xl font-bold">ثبت هزینه جدید</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {isAdmin && (
                  <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-md border border-blue-100">
                    <input
                      type="checkbox"
                      id="generalExp"
                      checked={isGeneral}
                      onChange={(e) => {
                        setIsGeneral(e.target.checked);
                        if (e.target.checked) setSelectedWarehouse(null);
                      }}
                      className="w-5 h-5 accent-black cursor-pointer"
                    />
                    <label
                      htmlFor="generalExp"
                      className="font-bold text-sm select-none cursor-pointer text-gray-700"
                    >
                      این یک{" "}
                      <span className="text-blue-600 font-black">
                        هزینه عمومی
                      </span>{" "}
                      است (تقسیم بین تمام انبارها)
                    </label>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold mb-1 block text-gray-600">
                      دسته‌بندی
                    </label>
                    <div className="flex flex-col gap-2">
                      <Select
                        options={catOptions}
                        value={selectedCategory}
                        onChange={setSelectedCategory}
                        placeholder="انتخاب..."
                        className="text-sm"
                        styles={selectStyles}
                        menuPortalTarget={document.body}
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="دسته جدید..."
                          className="flex-1 p-3 border rounded-lg text-xs"
                          value={newCatName}
                          onChange={(e) => setNewCatName(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={handleCreateCategory}
                          className="bg-green-600 text-white px-3 rounded-lg text-xs font-bold"
                        >
                          <PlusCircle size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold mb-1 block text-gray-600">
                      شعبه / انبار
                    </label>
                    <Select
                      options={whOptions}
                      value={selectedWarehouse}
                      onChange={setSelectedWarehouse}
                      placeholder="انتخاب شعبه..."
                      isDisabled={isGeneral || !isAdmin}
                      className="text-sm"
                      styles={selectStyles}
                      menuPortalTarget={document.body}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold mb-1 block text-gray-600">
                      مبلغ ($)
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full p-2.5 border rounded-md font-bold text-cyan-600 text-lg text-center"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold mb-1 block text-gray-600">
                      تاریخ
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full p-2.5 border rounded-md text-center"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold mb-1 block text-gray-600">
                    توضیحات
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 border rounded-md h-24 resize-none"
                    placeholder="بابت..."
                  ></textarea>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={createMutation.isPending}
                  className="w-full py-3 rounded-md font-bold text-white bg-black hover:bg-gray-800 shadow-lg"
                >
                  {createMutation.isPending ? (
                    <Loader2 className="animate-spin mx-auto" />
                  ) : (
                    "ثبت هزینه"
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExpensesManagement;
