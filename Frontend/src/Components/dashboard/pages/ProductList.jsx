import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import Select from "react-select";
import {
  FaTrash,
  FaPlus,
  FaSearch,
  FaBoxOpen,
  FaEdit,
  FaFilter,
} from "react-icons/fa";
import { Loader2 } from "lucide-react";
import {
  fetchProducts,
  deleteProduct,
  fetchCategories,
} from "../../../services/api";
import Pagination from "../../Pagination";

const PRODUCT_TYPES_OPTIONS = [
  { value: "mobile", label: "📱 موبایل و لوازم جانبی" },
  { value: "printer", label: "🖨️ پرینتر و ماشین اداری" },
  { value: "scrubber", label: "🧽 اسکاج و شوینده" },
];

const selectStyles = {
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  control: (base) => ({ ...base, borderRadius: "8px", minHeight: "42px" }),
};

const ProductList = ({ onAddNew, onEdit }) => {
  const { accessToken: token } = useSelector((state) => state.user);
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // استیت‌های فیلتر حرفه‌ای
  const [selectedType, setSelectedType] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null);

  // ✅ اصلاح شد: دریافت تمام دسته‌بندی‌ها برای کارکرد درست فیلترها
  const { data: catData } = useQuery({
    queryKey: ["categories", "allForFilter"], // کلید اختصاصی
    queryFn: () => fetchCategories(token, { page_size: 1000 }), // لغو محدودیت ۱۰ تایی
    enabled: !!token,
  });

  const categories = useMemo(
    () => (Array.isArray(catData) ? catData : catData?.results || []),
    [catData],
  );

  // ساخت گزینه‌های فیلتر
  const categoryOptions = useMemo(() => {
    if (!selectedType) return [];
    return categories
      .filter((c) => c.type === selectedType.value)
      .map((c) => ({ value: c.id, label: c.name, tools: c.tools }));
  }, [categories, selectedType]);

  const toolOptions = useMemo(() => {
    if (!selectedCategory) return [];
    return (selectedCategory.tools || []).map((t) => ({ value: t, label: t }));
  }, [selectedCategory]);

  // درخواست دریافت محصولات به همراه پارامترهای فیلتر
  const { data, isLoading } = useQuery({
    queryKey: [
      "products",
      currentPage,
      searchTerm,
      selectedCategory?.value,
      selectedTool?.value,
      selectedType?.value,
    ],
    queryFn: () =>
      fetchProducts(token, {
        page: currentPage,
        search: searchTerm,
        category: selectedCategory ? selectedCategory.value : undefined,
        tool: selectedTool ? selectedTool.value : undefined,
        product_type: selectedType ? selectedType.value : undefined,
      }),
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteProduct(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      Swal.fire("حذف شد", "محصول با موفقیت حذف گردید.", "success");
    },
    onError: () =>
      Swal.fire(
        "خطا",
        "امکان حذف محصول وجود ندارد (احتمالاً در فاکتورها استفاده شده است).",
        "error",
      ),
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "آیا مطمئن هستید؟",
      text: "این عمل قابل بازگشت نخواهد بود!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "بله، حذف کن",
      cancelButtonText: "انصراف",
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate(id);
    });
  };

  const handleResetFilters = () => {
    setSelectedType(null);
    setSelectedCategory(null);
    setSelectedTool(null);
    setSearchTerm("");
    setCurrentPage(1);
  };

  const products = data?.results || [];
  const totalPages = Math.ceil((data?.count || 0) / 10);

  return (
    <div className="p-4 sm:p-6 bg-white animate-fadeIn">
      {/* هدر و دکمه افزودن */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-gray-800">لیست محصولات سیستم</h2>
        <button
          onClick={onAddNew}
          className="w-full md:w-auto bg-cyan-700 hover:bg-cyan-800 text-white px-6 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg transition"
        >
          <FaPlus /> محصول جدید
        </button>
      </div>

      {/* بخش فیلترهای حرفه‌ای */}
      <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 mb-8">
        <div className="flex items-center gap-2 mb-4 font-bold text-gray-700">
          <FaFilter className="text-cyan-700" /> فیلترهای پیشرفته
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="relative">
            <label className="text-xs font-bold text-gray-500 mb-1 block">
              جستجوی نام یا SKU
            </label>
            <FaSearch className="absolute left-3 top-9 text-gray-400" />
            <input
              type="text"
              placeholder="جستجو..."
              value={searchTerm}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none transition"
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">
              نوع محصول
            </label>
            <Select
              options={PRODUCT_TYPES_OPTIONS}
              value={selectedType}
              onChange={(opt) => {
                setSelectedType(opt);
                setSelectedCategory(null);
                setSelectedTool(null);
                setCurrentPage(1);
              }}
              placeholder="همه..."
              isClearable
              styles={selectStyles}
              menuPortalTarget={document.body}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">
              کمپنی / برند
            </label>
            <Select
              options={categoryOptions}
              value={selectedCategory}
              onChange={(opt) => {
                setSelectedCategory(opt);
                setSelectedTool(null);
                setCurrentPage(1);
              }}
              placeholder="همه برندها..."
              isDisabled={!selectedType}
              isClearable
              styles={selectStyles}
              menuPortalTarget={document.body}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">
              ابزار (Tool)
            </label>
            <Select
              options={toolOptions}
              value={selectedTool}
              onChange={(opt) => {
                setSelectedTool(opt);
                setCurrentPage(1);
              }}
              placeholder="همه ابزارها..."
              isDisabled={!selectedCategory}
              isClearable
              styles={selectStyles}
              menuPortalTarget={document.body}
            />
          </div>
        </div>
        {(selectedType || selectedCategory || selectedTool || searchTerm) && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleResetFilters}
              className="text-xs text-red-500 font-bold hover:underline"
            >
              پاک کردن فیلترها
            </button>
          </div>
        )}
      </div>

      <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm bg-white">
        <table className="w-full text-center text-sm">
          <thead className="bg-slate-900 text-white font-bold">
            <tr>
              <th className="px-5 py-4">SKU</th>
              <th className="px-5 py-4">نام کامل</th>
              <th className="px-5 py-4">نوع (Tool)</th>
              <th className="px-5 py-4">وضعیت</th>
              <th className="px-5 py-4 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan="5" className="p-12">
                  <Loader2 className="animate-spin mx-auto w-8 h-8 text-cyan-700" />
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-12 text-gray-400">
                  <FaBoxOpen className="mx-auto mb-2 text-4xl opacity-20" />
                  <p>محصولی یافت نشد.</p>
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-gray-50 border-b border-gray-200 transition"
                >
                  <td className="px-5 py-4 font-mono font-bold text-cyan-700">
                    {p.sku}
                  </td>
                  <td className="px-5 py-4 font-bold text-gray-800">
                    {p.full_name}
                  </td>
                  <td className="px-5 py-4 text-gray-600">{p.tool}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black ${
                        p.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {p.is_active ? "فعال" : "غیرفعال"}
                    </span>
                  </td>
                  <td className="px-5 py-4 flex justify-center gap-2">
                    <button
                      onClick={() => onEdit(p)}
                      className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition shadow-sm"
                      title="ویرایش محصول"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition shadow-sm"
                      title="حذف محصول"
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

      <div className="mt-8 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default ProductList;
