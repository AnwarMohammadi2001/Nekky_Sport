import React, { useState, useMemo, useEffect } from "react";
import { Loader2, SlidersHorizontal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getCategories, searchProducts, getProducts } from "../../api/api";
import ProductList from "../../Components/ProductPage/ProductList";
import FilterSidebar from "../../Components/ProductPage/FilterSidebar";

const ProductPage = () => {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category");
  const searchQueryFromUrl = searchParams.get("search");

  const [filters, setFilters] = useState({
    search: searchQueryFromUrl || "",
    categoryId: categoryFromUrl || "",
    sortBy: "latest",
    page: 1,
    limit: 20,
  });

  const [viewMode, setViewMode] = useState("grid");

  // 1. Fetch categories
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const categories = useMemo(() => {
    if (!categoriesData?.data) return [];
    return Array.isArray(categoriesData.data) ? categoriesData.data : [];
  }, [categoriesData]);

  // 2. Sync filters with URL
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      categoryId: categoryFromUrl || "",
      search: searchQueryFromUrl || "",
      page: 1, // Reset to first page when filters change
    }));
  }, [categoryFromUrl, searchQueryFromUrl]);

  // 3. Fetch products based on filters
  const {
    data: productsResponse,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["products", filters],
    queryFn: () => {
      // Use searchProducts if there's a search query or filters
      if (
        filters.search ||
        filters.categoryId
      ) {
        return searchProducts({
          search: filters.search,
          categoryId: filters.categoryId,
          sortBy: "createdAt",
          sortOrder: "DESC",
          limit: filters.limit,
          page: filters.page,
        });
      }
      // Otherwise get all products
      return getProducts();
    },
    keepPreviousData: true,
  });

  // Extract products from response
  const allProducts = useMemo(() => {
    if (!productsResponse) return [];

    // Handle different response structures
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
    if (productsResponse.results && Array.isArray(productsResponse.results)) {
      return productsResponse.results;
    }
    if (productsResponse.data && productsResponse.data.results) {
      return productsResponse.data.results;
    }
    return [];
  }, [productsResponse]);

  // Get pagination info
  const pagination = useMemo(() => {
    if (productsResponse?.pagination) return productsResponse.pagination;
    if (productsResponse?.data?.pagination)
      return productsResponse.data.pagination;
    return null;
  }, [productsResponse]);

  // Reset to first page when filters change
  const handleFilterChange = (newFilters) => {
    setFilters({ ...newFilters, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [filters.page]);

  // Get active category name
  const activeCategoryName = useMemo(() => {
    if (!filters.categoryId) return "همه محصولات";
    const category = categories.find((c) => c.id == filters.categoryId);
    return category?.name || "دسته انتخاب شده";
  }, [filters.categoryId, categories]);

  return (
    <div className="min-h-screen mt-20 md:mt-[135px] bg-white" dir="rtl">
      <div className="mx-auto px-6 py-10">
        <div className="md:flex gap-5">
          {/* Filter Sidebar */}
          <aside className="w-full md:w-1/4 lg:w-1/5 shrink-0">
            <FilterSidebar
              filters={filters}
              setFilters={handleFilterChange}
              categories={categories}
              onApplyFilters={(newFilters) => handleFilterChange(newFilters)}
            />
          </aside>

          {/* Products Content */}
          <main className="flex-1 mt-5 md:mt-0">
            <div className="bg-gray-100 border border-gray-200 rounded-md p-5 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-full text-red-600 shadow-sm">
                  <SlidersHorizontal size={20} />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-800">
                    {activeCategoryName}{" "}
                    <span className="bg-red-600 text-white px-2 py-0.5 rounded-lg text-xs">
                      {allProducts.length}
                    </span>
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold">
                    {filters.search
                      ? `نتایج جستجو: "${filters.search}"`
                      : "بروزرسانی بر اساس آخرین تغییرات"}
                  </p>
                </div>
                {isFetching && (
                  <Loader2 className="w-4 h-4 animate-spin text-red-600 ml-2" />
                )}
              </div>

              <div className="flex items-center gap-4">
                {/* View mode toggle */}
                {/* <div className="flex gap-2 bg-white border border-gray-200 rounded-md p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition ${viewMode === "grid" ? "bg-red-500 text-white" : "text-gray-500"}`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM13 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2zM13 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition ${viewMode === "list" ? "bg-red-500 text-white" : "text-gray-500"}`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM13 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2zM13 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z" />
                    </svg>
                  </button>
                </div> */}
              </div>
            </div>

            {/* Product List */}
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
                              ? "bg-red-500 text-white border-red-500"
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
                  لطفاً فیلترهای دیگری را امتحان کنید یا عبارت جستجو را تغییر
                  دهید
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
