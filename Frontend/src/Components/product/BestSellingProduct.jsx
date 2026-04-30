import React, { useState, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { MdArrowForwardIos, MdArrowBackIos } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { fetchWebProducts } from "../../services/api";
import BestSellingProductCart from "./BestSellingProductCart";
import { Loader2 } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import { Link } from "react-router-dom";

const BestSellingProduct = () => {
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["webProducts", "home-bestsellers"],
    queryFn: () => fetchWebProducts({ is_bestseller: "true" }),
    staleTime: 1000 * 60 * 5,
  });

  const products = useMemo(() => {
    if (!data) return [];
    return Array.isArray(data) ? data : data.results || [];
  }, [data]);

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-red-600" size={40} />
      </div>
    );

  if (products.length === 0) return null;

  return (
    <div className="relative w-full pb-10 mt-10" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="bg-red-50 text-red-600 border border-red-100 shadow-sm text-sm rounded-lg w-fit px-6 py-2 font-black">
          پر فروش‌ترین‌های هفته
        </p>

        <Link
          to="products"
          className="text-sm text-red-500 font-semibold hover:underline transition-all"
        >
          مشاهده همه
        </Link>
      </div>

      {/* Swiper */}
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation={{ prevEl, nextEl }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop
        spaceBetween={20}
        breakpoints={{
          0: { slidesPerView: 1 },
          480: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
        className="px-2"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id} className="flex justify-center">
            <BestSellingProductCart product={product} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons */}
      <button
        ref={(node) => setPrevEl(node)}
        className="absolute -left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white border shadow hover:bg-black hover:text-white transition-all"
      >
        <MdArrowBackIos size={18} />
      </button>

      <button
        ref={(node) => setNextEl(node)}
        className="absolute -right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white border shadow hover:bg-black hover:text-white transition-all"
      >
        <MdArrowForwardIos size={18} />
      </button>
    </div>
  );
};

export default BestSellingProduct;
