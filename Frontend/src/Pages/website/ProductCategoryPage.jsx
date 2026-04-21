// ProductCategoryPage.jsx
import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  ChevronDown,
  LayoutGrid,
  List,
  Loader2,
  SlidersHorizontal,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchWebProducts, fetchWebCategories } from "../../services/api";
import ProductList from "../../Components/ProductPage/ProductList";
import FilterSidebar from "../../Components/ProductPage/FilterSidebar";

const ProductCategoryPage = () => {
  const { categoryId } = useParams(); // دریافت ID دسته از URL
  const [filters, setFilters] = useState({
    search: "",
    categories: [],
    minPrice: 0,
    maxPrice: 2000000,
    stockStatus: "all",
    sortBy: "latest",
  });

  const [viewMode, setViewMode] = useState("grid");

  // دریافت اطلاعات همه دسته‌ها
  const { data: catData, isLoading: catLoading } = useQuery({
    queryKey: ["webCategories"],
    queryFn: fetchWebCategories,
  });

  // پردازش دسته‌ها
  const categories = useMemo(() => {
    const raw = Array.isArray(catData) ? catData : catData?.results || [];
    return raw;
  }, [catData]);

  // پیدا کردن دسته جاری
  const currentCategory = useMemo(() => {
    if (!categories.length || !categoryId) return null;
    return categories.find(
      (cat) => cat.id === parseInt(categoryId) || cat.id === categoryId,
    );
  }, [categories, categoryId]);

  // تنظیم فیلتر دسته‌بندی هنگام لود صفحه
  React.useEffect(() => {
    if (currentCategory) {
      setFilters((prev) => ({
        ...prev,
        categories: [currentCategory.id], // فقط دسته جاری
      }));
    }
  }, [currentCategory]);

  // دریافت محصولات با فیلتر دسته‌بندی
  const {
    data: prodData,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["webProducts", filters, categoryId],
    queryFn: () =>
      fetchWebProducts({
        search: filters.search,
        category: filters.categories.join(","),
        price_min: filters.minPrice,
        price_max: filters.maxPrice,
        in_stock:
          filters.stockStatus === "available"
            ? "true"
            : filters.stockStatus === "unavailable"
              ? "false"
              : "",
        ordering:
          filters.sortBy === "expensive"
            ? "-price"
            : filters.sortBy === "cheapest"
              ? "price"
              : "-created_at",
      }),
    keepPreviousData: true,
    enabled: !!categoryId, // فقط وقتی categoryId وجود دارد اجرا شود
  });

  // پردازش محصولات
  const allProducts = useMemo(() => {
    if (!prodData) return [];
    if (Array.isArray(prodData)) return prodData;
    if (prodData.results && Array.isArray(prodData.results))
      return prodData.results;
    return [];
  }, [prodData]);

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // اگر دسته پیدا نشد
  if (!currentCategory && !catLoading) {
    return (
      <div className="min-h-screen mt-20 md:mt-[135px] bg-white" dir="rtl">
        <div className="container mx-auto px-6 py-10 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            دسته‌بندی مورد نظر یافت نشد
          </h1>
          <p className="text-gray-600">
            لطفاً از لیست دسته‌بندی‌ها یک دسته را انتخاب کنید.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-20 md:mt-[135px] bg-white" dir="rtl">
      {/* هدر دسته‌بندی با تصویر پس‌زمینه */}
      {currentCategory && (
        <div
          className="relative h-[300px] md:h-[400px] bg-cover bg-center"
          style={{
            backgroundImage: `url(${currentCategory.image || "/default-category-bg.jpg"})`,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative h-full flex flex-col justify-center items-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {currentCategory.name}
            </h1>
            <p className="text-lg md:text-xl mb-6 text-gray-200 max-w-2xl text-center">
              {currentCategory.description ||
                `محصولات دسته ${currentCategory.name}`}
            </p>
            <span className="px-6 py-2.5 bg-white text-gray-900 rounded-full font-semibold shadow-lg">
              {allProducts.length} محصول
            </span>
          </div>
        </div>
      )}

      <div className="container mx-auto px-6 py-10">
        <div className="md:flex gap-5">
          {/* سایدبار فیلتر */}
          <aside className="w-full md:w-1/4 lg:w-1/5 shrink-0">
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              categories={categories}
              onApplyFilters={handleApplyFilters}
              selectedCategoryId={currentCategory?.id} // ارسال ID دسته جاری
              disableCategoryChange={true} // جلوگیری از تغییر دسته جاری
            />
          </aside>

          {/* بخش محصولات */}
          <main className="flex-1 mt-5 md:mt-0">
            {/* Toolbar پالا */}
            <div className="bg-gray-100 border border-gray-200 rounded-md p-5 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-full text-red-600 shadow-sm">
                  <SlidersHorizontal size={20} />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-800">
                    محصولات {currentCategory?.name}{" "}
                    <span className="bg-red-600 text-white px-2 py-0.5 rounded-lg text-xs">
                      {allProducts.length}
                    </span>
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold">
                    بروزرسانی بر اساس آخرین تغییرات
                  </p>
                </div>
                {isFetching && (
                  <Loader2 className="w-4 h-4 animate-spin text-red-600 ml-2" />
                )}
              </div>

              <div className="flex items-center gap-4">
                {/* تغییر چیدمان */}
                {/* <div className="hidden lg:flex bg-white p-1 rounded-md border border-gray-200">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2.5 rounded-xl transition ${
                      viewMode === "grid"
                        ? "bg-black text-white shadow-lg"
                        : "text-gray-400"
                    }`}
                  >
                    <LayoutGrid size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2.5 rounded-xl transition ${
                      viewMode === "list"
                        ? "bg-black text-white shadow-lg"
                        : "text-gray-400"
                    }`}
                  >
                    <List size={20} />
                  </button>
                </div> */}

                {/* مرتب‌سازی */}
                <div className="relative">
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      setFilters({ ...filters, sortBy: e.target.value })
                    }
                    className="appearance-none bg-white border border-gray-200 rounded-md py-3 pr-10 pl-6 text-sm font-black text-gray-700 cursor-pointer focus:ring-2 focus:ring-red-500 outline-none shadow-sm"
                  >
                    <option value="latest">جدیدترین‌ها</option>
                    <option value="cheapest">ارزان‌ترین</option>
                    <option value="expensive">گران‌ترین</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* لیست نهایی محصولات */}
            <ProductList
              products={allProducts}
              isLoading={isLoading}
              viewMode={viewMode}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductCategoryPage;
