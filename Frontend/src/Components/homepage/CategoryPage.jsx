import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../../api/api";
import { Package, ChevronLeft, TrendingUp } from "lucide-react";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});

  // Helper function to get image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;

    if (imagePath.startsWith("http")) return imagePath;

    let normalizedPath = imagePath.replace(/\\/g, "/");
    normalizedPath = normalizedPath.replace(/\/+/g, "/");

    if (normalizedPath.startsWith("uploads/")) {
      return `http://localhost:5000/${normalizedPath}`;
    }

    if (normalizedPath.startsWith("/uploads/")) {
      return `http://localhost:5000${normalizedPath}`;
    }

    return `http://localhost:5000/uploads/${normalizedPath}`;
  };

  const handleImageError = (categoryId) => {
    setImageErrors((prev) => ({ ...prev, [categoryId]: true }));
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();

        // Extract categories from response
        let categoriesArray = [];

        if (response?.data && Array.isArray(response.data)) {
          categoriesArray = response.data;
        } else if (Array.isArray(response)) {
          categoriesArray = response;
        } else if (response?.data?.data && Array.isArray(response.data.data)) {
          categoriesArray = response.data.data;
        } else if (
          response?.data?.results &&
          Array.isArray(response.data.results)
        ) {
          categoriesArray = response.data.results;
        }

        // Sort by name
        const sortedCategories = [...categoriesArray].sort((a, b) => {
          if (a.order !== undefined && b.order !== undefined) {
            return a.order - b.order;
          }
          return a.name.localeCompare(b.name);
        });

        setCategories(sortedCategories);
      } catch (error) {
        console.error("Failed to load categories:", error);
        // Fallback categories
        setCategories([
          {
            id: 1,
            name: "موبایل",
            description: "انواع موبایل و تبلت",
          },
          {
            id: 2,
            name: "پرینتر",
            description: "چاپگرها و اسکنرها",
          },
          {
            id: 3,
            name: "لوازم جانبی موبایل",
            description: "کیف، محافظ صفحه، پاوربانک",
          },
          {
            id: 4,
            name: "لوازم جانبی پرینتر",
            description: "کارتریج، تونر، کاغذ",
          },
          {
            id: 5,
            name: "سیم ظرفشویی",
            description: "اسکاچ و سیم ظرفشویی",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 sm:px-6 lg:px-8 mt-[100px] md:mt-[155px]">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="text-center mb-12">
            <div className="h-12 w-64 bg-gray-200 rounded-lg mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 w-96 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
            <div className="w-24 h-1 bg-gray-200 rounded-full mx-auto mt-6 animate-pulse"></div>
          </div>

          {/* Categories Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-6 animate-pulse"
              >
                <div className="w-28 h-28 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-7 w-32 bg-gray-200 rounded mx-auto mb-3"></div>
                <div className="h-4 w-48 bg-gray-200 rounded mx-auto mb-4"></div>
                <div className="h-4 w-24 bg-gray-200 rounded mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8 mt-[100px] mb-10 md:mb-0 md:mt-[155px]"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <Package className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            دسته‌بندی محصولات
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            انواع محصولات و تجهیزات ورزشی را بر اساس دسته‌بندی مرور کنید
          </p>
          <div className="w-24 h-1 bg-red-500 rounded-full mx-auto mt-6"></div>
        </div>

        {/* Categories Grid */}
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl 
                  transition-all duration-300 overflow-hidden border border-gray-100
                  hover:border-red-200 transform hover:-translate-y-1"
              >
                <div className="p-6 text-center">
                  {/* Image Container */}
                  <div className="relative mb-4 inline-block">
                    <div
                      className="absolute inset-0 bg-red-100 rounded-full blur-xl opacity-0 
                      group-hover:opacity-30 transition-opacity duration-300"
                    ></div>
                    <div
                      className="relative w-32 h-32 mx-auto rounded-full bg-gradient-to-br 
                      from-red-50 to-amber-50 group-hover:from-red-100 group-hover:to-amber-100 
                      transition-all duration-300 flex items-center justify-center p-1"
                    >
                      {!imageErrors[category.id] && category.image ? (
                        <img
                          src={getImageUrl(category.image)}
                          alt={category.name}
                          className="w-28 h-28 rounded-full object-cover border-4 border-white
                            group-hover:scale-110 transition-transform duration-300 shadow-md"
                          onError={() => handleImageError(category.id)}
                        />
                      ) : (
                        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-red-200 to-pink-200 flex items-center justify-center">
                          <span className="text-4xl font-bold text-red-600">
                            {category.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Decorative Badge for Product Count */}
                    {category.productCount && (
                      <span
                        className="absolute -top-2 -left-2 bg-red-500 text-white 
                        text-xs font-bold px-2 py-1 rounded-full shadow-md"
                      >
                        {category.productCount}
                      </span>
                    )}
                  </div>

                  {/* Category Name */}
                  <h3
                    className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 
                    transition-colors duration-300"
                  >
                    {category.name}
                  </h3>

                  {/* Description */}
                  {category.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {category.description}
                    </p>
                  )}

                  {/* View Products Link */}
                  <div
                    className="flex items-center justify-center text-red-600 
                    group-hover:text-red-700 mt-4"
                  >
                    <span className="text-sm font-medium">مشاهده محصولات</span>
                    <ChevronLeft
                      size={16}
                      className="mr-1 group-hover:-translate-x-1 transition-transform"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          // Empty State
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              هیچ دسته‌بندی یافت نشد
            </h3>
            <p className="text-gray-600">
              در حال حاضر دسته‌بندی برای نمایش وجود ندارد
            </p>
          </div>
        )}

        {/* Popular Categories Section */}
        {categories.length > 0 && (
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                دسته‌های پرطرفدار
              </h2>
              <div className="w-20 h-0.5 bg-red-500 mx-auto"></div>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.slice(0, 8).map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.id}`}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              به دنبال محصول خاصی هستید؟
            </h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              تیم پشتیبانی نیکی اسپورت آماده راهنمایی شما در انتخاب بهترین محصول
              است
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-6 py-3 
                bg-red-600 hover:bg-red-700 text-white font-medium 
                rounded-xl transition-colors duration-300 shadow-lg 
                hover:shadow-xl"
            >
              <span>تماس با ما</span>
              <ChevronLeft size={20} className="mr-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
