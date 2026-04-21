import React, { useState, useMemo, useEffect } from "react";
import { ChevronDown, Loader2, SlidersHorizontal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom"; 
import { fetchWebProducts, fetchWebCategories } from "../../services/api";
import ProductList from "../../Components/ProductPage/ProductList";
import FilterSidebar from "../../Components/ProductPage/FilterSidebar";

const ProductPage = () => {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

  const [filters, setFilters] = useState({
    search: "",
    categories: categoryFromUrl ? [categoryFromUrl] : [],
    minPrice: 0,
    maxPrice: 2000000,
    stockStatus: "all",
    sortBy: "latest",
  });

  const [viewMode, setViewMode] = useState("grid");

  // ۱. دریافت دسته‌بندی‌ها
  const { data: catData } = useQuery({
    queryKey: ["webCategories"],
    queryFn: fetchWebCategories,
  });

  const categories = useMemo(() => {
    return Array.isArray(catData) ? catData : catData?.results || [];
  }, [catData]);

  // ۲. همگام‌سازی فیلتر با URL (وقتی کاربر در منوی بالا کلیک می‌کند)
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      categories: categoryFromUrl ? [categoryFromUrl] : [],
      // بازنشانی سایر فیلترها هنگام تغییر دسته از منوی اصلی
      search: "",
      minPrice: 0,
      maxPrice: 2000000,
    }));
  }, [categoryFromUrl]);

  // ۳. دریافت محصولات
  const {
    data: prodData,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["webProducts", filters],
    queryFn: () =>
      fetchWebProducts({
        search: filters.search,
        category: filters.categories.length > 0 ? filters.categories.join(",") : "", 
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
  });

  const allProducts = useMemo(() => {
    if (!prodData) return [];
    return Array.isArray(prodData) ? prodData : (prodData.results || []);
  }, [prodData]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [filters]);

  return (
    <div className="min-h-screen mt-20 md:mt-[135px] bg-white " dir="rtl">
      <div className=" mx-auto px-6 py-10">
        <div className="md:flex gap-5">
          {/* سایدبار فیلتر */}
          <aside className="w-full md:w-1/4 lg:w-1/5 shrink-0">
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              categories={categories}
              onApplyFilters={(newFilters) => setFilters(newFilters)}
            />
          </aside>

          {/* محتوای محصولات */}
          <main className="flex-1 mt-5 md:mt-0">
            <div className="bg-gray-100 border border-gray-200 rounded-md p-5 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-full text-red-600 shadow-sm">
                  <SlidersHorizontal size={20} />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-800">
                    لیست محصولات{" "}
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

            {/* لیست نهایی */}
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

export default ProductPage;