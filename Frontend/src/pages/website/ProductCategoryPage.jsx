import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  LayoutGrid,
  List,
  Loader2,
  SlidersHorizontal,
  Package,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getCategories, searchProducts } from "../../api/api";
import ProductList from "../../Components/ProductPage/ProductList";
import FilterSidebar from "../../Components/ProductPage/FilterSidebar";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const ProductCategoryPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: "",
    categoryId: "",
    minPrice: 0,
    maxPrice: 2000000,
    stockStatus: "all",
    sortBy: "latest",
    page: 1,
    limit: 20,
  });

  const [viewMode, setViewMode] = useState("grid");

  // دریافت اطلاعات همه دسته‌ها
  const { data: categoriesData, isLoading: catLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // پردازش دسته‌ها
  const categories = useMemo(() => {
    if (!categoriesData?.data) return [];
    return Array.isArray(categoriesData.data) ? categoriesData.data : [];
  }, [categoriesData]);

  // پیدا کردن دسته جاری
  const currentCategory = useMemo(() => {
    if (!categories.length || !categoryId) return null;
    return categories.find((cat) => cat.id === parseInt(categoryId));
  }, [categories, categoryId]);

  // Helper function to get image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;

    let normalizedPath = imagePath.replace(/\\/g, "/");
    normalizedPath = normalizedPath.replace(/\/+/g, "/");

    if (normalizedPath.startsWith("uploads/")) {
      return `${BASE_URL}/${normalizedPath}`;
    }
    if (normalizedPath.startsWith("/uploads/")) {
      return `${BASE_URL}${normalizedPath}`;
    }
    return `${BASE_URL}/uploads/${normalizedPath}`;
  };

  // تنظیم فیلتر دسته‌بندی هنگام لود صفحه
  useEffect(() => {
    if (currentCategory) {
      setFilters((prev) => ({
        ...prev,
        categoryId: currentCategory.id.toString(),
        page: 1,
      }));
    }
  }, [currentCategory]);

  // دریافت محصولات با فیلتر دسته‌بندی
  const {
    data: productsResponse,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["products", filters, categoryId],
    queryFn: () =>
      searchProducts({
        categoryId: filters.categoryId,
        minPrice: filters.minPrice > 0 ? filters.minPrice : undefined,
        maxPrice: filters.maxPrice < 2000000 ? filters.maxPrice : undefined,
        sortBy: filters.sortBy === "latest" ? "createdAt" : "price",
        sortOrder:
          filters.sortBy === "cheapest"
            ? "ASC"
            : filters.sortBy === "expensive"
              ? "DESC"
              : "DESC",
        limit: filters.limit,
        page: filters.page,
      }),
    keepPreviousData: true,
    enabled: !!categoryId && !!filters.categoryId,
  });

  // پردازش محصولات
  const allProducts = useMemo(() => {
    if (!productsResponse) return [];

    if (productsResponse.data && Array.isArray(productsResponse.data)) {
      return productsResponse.data;
    }
    if (
      productsResponse.data &&
      productsResponse.data.data &&
      Array.isArray(productsResponse.data.data)
    ) {
      return productsResponse.data.data;
    }
    if (Array.isArray(productsResponse)) {
      return productsResponse;
    }
    if (productsResponse.results) {
      return productsResponse.results;
    }
    return [];
  }, [productsResponse]);

  // Pagination info
  const pagination = useMemo(() => {
    if (productsResponse?.pagination) return productsResponse.pagination;
    if (productsResponse?.data?.pagination)
      return productsResponse.data.pagination;
    return null;
  }, [productsResponse]);

  const handleApplyFilters = (newFilters) => {
    setFilters({ ...newFilters, page: 1 });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // اگر دسته پیدا نشد
  if (!currentCategory && !catLoading) {
    return (
      <div className="min-h-screen mt-20 md:mt-[135px] bg-white" dir="rtl">
        <div className="container mx-auto px-6 py-10 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
            <Package className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            دسته‌بندی مورد نظر یافت نشد
          </h1>
          <p className="text-gray-600 mb-8">
            لطفاً از لیست دسته‌بندی‌ها یک دسته را انتخاب کنید.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition"
          >
            مشاهده همه محصولات
          </button>
        </div>
      </div>
    );
  }

  if (catLoading) {
    return (
      <div
        className="min-h-screen mt-20 md:mt-[135px] bg-white flex items-center justify-center"
        dir="rtl"
      >
        <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-20 md:mt-[135px] bg-white" dir="rtl">
      {/* هدر دسته‌بندی با تصویر پس‌زمینه */}
      {currentCategory && (
        <div
          className="relative h-[300px] md:h-[350px] bg-cover bg-center"
          style={{
            backgroundImage: currentCategory.image
              ? `url(${getImageUrl(currentCategory.image)})`
              : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50"></div>
          <div className="relative h-full flex flex-col justify-center items-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {currentCategory.name}
            </h1>
            <p className="text-lg md:text-xl mb-6 text-gray-200 max-w-2xl text-center">
              {currentCategory.description ||
                `جدیدترین محصولات دسته ${currentCategory.name} با بهترین قیمت و کیفیت`}
            </p>
            <div className="flex gap-4">
              <span className="px-6 py-2.5 bg-red-600 text-white rounded-full font-semibold shadow-lg">
                {allProducts.length} محصول
              </span>
            </div>
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
              selectedCategoryId={currentCategory?.id}
              disableCategoryChange={true}
            />
          </aside>

          {/* بخش محصولات */}
          <main className="flex-1 mt-5 md:mt-0">
            {/* Toolbar */}
            <div className="bg-gray-100 border border-gray-200 rounded-xl p-5 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
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
                {/* View mode toggle */}
                <div className="hidden lg:flex bg-white p-1 rounded-md border border-gray-200">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2.5 rounded-xl transition ${
                      viewMode === "grid"
                        ? "bg-red-600 text-white shadow-lg"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <LayoutGrid size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2.5 rounded-xl transition ${
                      viewMode === "list"
                        ? "bg-red-600 text-white shadow-lg"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <List size={20} />
                  </button>
                </div>

                {/* مرتب‌سازی */}
                <div className="relative">
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        sortBy: e.target.value,
                        page: 1,
                      })
                    }
                    className="appearance-none bg-white border border-gray-200 rounded-xl py-3 pr-10 pl-6 text-sm font-black text-gray-700 cursor-pointer focus:ring-2 focus:ring-red-500 outline-none shadow-sm"
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

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                <button
                  onClick={() => handlePageChange(filters.page - 1)}
                  disabled={filters.page === 1}
                  className="px-3 py-2 border border-gray-300 rounded-md text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                >
                  قبلی
                </button>

                <div className="flex gap-1">
                  {[...Array(Math.min(5, pagination.totalPages))].map(
                    (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (filters.page <= 3) {
                        pageNum = i + 1;
                      } else if (filters.page >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = filters.page - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-2 border rounded-md transition ${
                            filters.page === pageNum
                              ? "bg-red-600 text-white border-red-600"
                              : "border-gray-300 text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    },
                  )}
                </div>

                <button
                  onClick={() => handlePageChange(filters.page + 1)}
                  disabled={filters.page === pagination.totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-md text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                >
                  بعدی
                </button>
              </div>
            )}

            {/* No results message */}
            {!isLoading && allProducts.length === 0 && (
              <div className="text-center py-20">
                <div className="text-gray-400 text-lg mb-2">
                  محصولی یافت نشد
                </div>
                <p className="text-gray-400 text-sm">
                  لطفاً فیلترهای دیگری را امتحان کنید
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductCategoryPage;
