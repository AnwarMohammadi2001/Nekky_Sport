import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/website/categories/`);

        // استخراج آرایه از پاسخ API
        const categoryData = res.data;
        let categoriesArray = [];

        if (Array.isArray(categoryData)) {
          categoriesArray = categoryData;
        } else if (categoryData && categoryData.results) {
          categoriesArray = categoryData.results;
        } else if (categoryData && categoryData.data) {
          categoriesArray = categoryData.data;
        }

        // فیلتر کردن دسته‌های اصلی (بدون والد)
        const mainCategories = categoriesArray.filter((cat) => !cat.parent);
        setCategories(mainCategories);
      } catch (error) {
        console.error("Failed to load categories:", error);
        // دسته‌های پیش‌فرض در صورت خطا
        setCategories([
          {
            id: 1,
            name: "موبایل",
            image: "cat/mobile.png",
            description: "انواع موبایل و تبلت",
            productCount: 156,
          },
          {
            id: 2,
            name: "پرنتر",
            image: "cat/printer.png",
            description: "چاپگرها و اسکنرها",
            productCount: 89,
          },
          {
            id: 3,
            name: "لوازم جانبی موبایل",
            image: "cat/mb.png",
            description: "کیف، محافظ صفحه، پاوربانک",
            productCount: 234,
          },
          {
            id: 4,
            name: "لوازم جانبی پرنتر",
            image: "cat/acces.jpg",
            description: "کارتریج، تونر، کاغذ",
            productCount: 67,
          },
          {
            id: 5,
            name: "سیم ظرفشویی",
            image: "cat/scotch.avif",
            description: "اسکاچ و سیم ظرفشویی",
            productCount: 45,
          },
          {
            id: 6,
            name: "دستگاه فتوکاپی",
            image: "cat/photocopy.png",
            description: "دستگاه‌های کپی و اداری",
            productCount: 34,
          },
          {
            id: 7,
            name: "لوازم تحریر",
            image: "cat/stationery.jpg",
            description: "نوشت‌افزار و ملزومات اداری",
            productCount: 178,
          },
          {
            id: 8,
            name: "اسکاچ",
            image: "cat/scotch.avif",
            description: "انواع اسکاچ و محصولات نظافتی",
            productCount: 23,
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
      <div className="min-h-screen bg-gray-50  px-4 sm:px-6 lg:px-8 ">
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
          <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-4">
            دسته‌بندی محصولات
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            انواع محصولات و خدمات سعادت گروپ را بر اساس دسته‌بندی مرور کنید
          </p>
          <div className="w-24 h-1 bg-red-500 rounded-full mx-auto mt-6"></div>
        </div>

        {/* Categories Grid */}
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
            {categories.map((category) => (
              <a
                key={category.id}
                href={`/category/${category.id}`}
                className="group bg-white rounded-md shadow-lg hover:shadow-2xl 
                  transition-all duration-300 overflow-hidden border border-gray-100
                  hover:border-red-200 transform hover:-translate-y-1"
              >
                <div className="p-6 text-center">
                  {/* Image Container with Decorative Elements */}
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
                      <img
                        src={
                          category.image ||
                          "https://via.placeholder.com/128x128/f0f0f0/666666?text=No+Image"
                        }
                        alt={category.name}
                        className="w-28 h-28 rounded-full object-cover border-4 border-white
                          group-hover:scale-110 transition-transform duration-300 shadow-md"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/128x128/f0f0f0/666666?text=No+Image";
                        }}
                      />
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
                    group-hover:text-red-700"
                  >
                    <span className="text-sm font-medium">مشاهده محصولات</span>
                    <svg
                      className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </div>
                </div>
              </a>
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

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div
            className="bg-gray-200 rounded-md p-8 
           "
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              به دنبال محصول خاصی هستید؟
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              تیم پشتیبانی سعادت گروپ آماده راهنمایی شما در انتخاب بهترین محصول
              است
            </p>
            <Link
              to="/support"
              className="inline-flex items-center justify-center px-6 py-3 
                bg-red-600 hover:bg-red-700 text-white font-medium 
                rounded-xl transition-colors duration-300 shadow-lg 
                hover:shadow-xl"
            >
              <span>تماس با ما</span>
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
