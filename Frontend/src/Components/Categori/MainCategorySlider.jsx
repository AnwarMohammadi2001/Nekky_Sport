import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { MdArrowForwardIos, MdArrowBackIos } from "react-icons/md";
import axios from "axios";
import "swiper/css";
import "swiper/css/navigation";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const MainCategorySlider = () => {
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/website/categories/`);

        // استخراج آرایه از پاسخ API (مطابق با ساختار کامپوننت WebCategoryManager)
        const categoryData = res.data;
        let categoriesArray = [];

        if (Array.isArray(categoryData)) {
          categoriesArray = categoryData;
        } else if (categoryData && categoryData.results) {
          categoriesArray = categoryData.results;
        } else if (categoryData && categoryData.data) {
          categoriesArray = categoryData.data;
        }

        // فقط دسته‌های اصلی (parent = null یا type = 'main') را بگیرید
        // یا اگر می‌خواهید همه دسته‌ها را نمایش دهید، می‌توانید فیلتر کنید
        const filteredCategories = categoriesArray
          .filter((cat) => !cat.parent) // فقط دسته‌های اصلی (بدون والد)
          .filter((cat) => cat.image) // فقط دسته‌هایی که عکس دارند
          .slice(0, 10); // محدود کردن به 10 آیتم

        setCategories(filteredCategories);
      } catch (error) {
        console.error("Failed to load categories:", error);
        // در صورت خطا، دسته‌های پیش‌فرض نمایش داده می‌شوند
        setCategories([
          {
            id: 1,
            name: "مبایل",
            path: "/mobile",
            image: "cat/mobile.png",
          },
          {
            id: 2,
            name: "پرنتر",
            path: "/printer",
            image: "cat/printer.png",
          },
          {
            id: 3,
            name: "لوازم جانبی مبایل",
            path: "/accessories-mobile",
            image: "cat/mb.png",
          },
          {
            id: 4,
            name: "لوازم جانبی پرنتر",
            path: "/accessories-printer",
            image: "cat/acces.jpg",
          },
          {
            id: 5,
            name: "سیم ظرف شویی",
            path: "/scotch",
            image: "cat/scotch.avif",
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
      <div className="relative w-full max-w-5xl mx-auto py-10">
        <div className="flex justify-center space-x-4 px-6">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center
              bg-gradient-to-br from-rose-50 via-white to-rose-50
              border border-rose-200
              rounded-3xl p-4 h-[140px] w-[140px] md:h-[170px] md:w-[170px]
              animate-pulse"
            >
              <div
                className="h-[80px] w-[80px] md:h-[90px] md:w-[90px]
                rounded-full bg-gray-200"
              ></div>
              <div className="mt-3 h-4 w-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return null; // یا می‌توانید یک پیام خالی نمایش دهید
  }

  return (
    <div className="relative w-full max-w-5xl mx-auto py-10 overflow-hidden">
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation={{ prevEl, nextEl }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop
        grabCursor
        spaceBetween={20}
        slidesPerView={2} // 👈 موبایل پیش‌فرض
        breakpoints={{
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
        }}
        className="px-6"
      >
        {categories.map((category, index) => (
          <SwiperSlide key={category.id || index}>
            <a
              href={`/category/${category.id}`}
              className="flex flex-col items-center justify-center
              bg-gradient-to-br from-rose-50 via-white to-rose-50
              border border-rose-200 hover:border-rose-400
              rounded-3xl p-4 h-[140px] w-[140px] md:h-[170px] md:w-[170px]
              transition-all duration-300 hover:shadow-xl group"
            >
              <img
                src={
                  category.image ||
                  "https://via.placeholder.com/100x100/f0f0f0/666666?text=No+Image"
                }
                alt={category.name}
                className="h-[80px] w-[80px] md:h-[90px] md:w-[90px]
                object-cover rounded-full p-2 border border-rose-100
                group-hover:scale-105 transition-all"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/100x100/f0f0f0/666666?text=No+Image";
                }}
              />
              <span className="mt-3 text-sm md:text-base text-gray-700 group-hover:text-rose-500 text-center">
                {category.name}
              </span>
            </a>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Left Button */}
      <button
        ref={(node) => setPrevEl(node)}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20
        p-1.5 rounded-full border border-rose-300 bg-white
        hover:bg-rose-500 hover:text-white transition shadow-md"
      >
        <MdArrowBackIos size={20} />
      </button>

      {/* Right Button */}
      <button
        ref={(node) => setNextEl(node)}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20
        p-1.5 rounded-full border border-rose-300 bg-white
        hover:bg-rose-500 hover:text-white transition shadow-md"
      >
        <MdArrowForwardIos size={20} />
      </button>
    </div>
  );
};

export default MainCategorySlider;
