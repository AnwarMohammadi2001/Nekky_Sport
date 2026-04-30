import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { MdArrowForwardIos, MdArrowBackIos } from "react-icons/md";
import { Link } from "react-router-dom";
import Mobile_AccessSliderCart from "./Mobile_AccessSliderCart";
import { useProductsByCategoryName } from "../../services/api";

import "swiper/css";
import "swiper/css/navigation";

const Mobile_AccessSlider = ({
  title = "لوازم جانبی موبایل",
  categoryName = "لوازم جانبی موبایل",
  bgIconColor = "red",
}) => {
  const { products, loading } = useProductsByCategoryName(categoryName);

  if (loading || products.length === 0) return null;

  return (
    <div className="relative w-full pb-5 mt-10" dir="rtl">
      <div className="flex items-center justify-between mb-4">
        <p className="bg-gray-200 text-gray-800 border border-gray-300 shadow text-sm rounded-md w-fit px-5 py-1.5 font-bold">
          {title}
        </p>
        <Link
          to="products"
          className={`text-sm font-bold hover:underline ${
            bgIconColor === "blue"
              ? "text-blue-500"
              : bgIconColor === "green"
                ? "text-green-500"
                : "text-red-500"
          }`}
        >
          مشاهده همه
        </Link>
      </div>

      <Swiper
        modules={[Navigation, Autoplay]}
        navigation={{
          prevEl: ".mobile-prev",
          nextEl: ".mobile-next",
        }}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        loop={products.length > 5}
        spaceBetween={20}
        breakpoints={{
          0: { slidesPerView: 1.5, spaceBetween: 10 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
        className="px-2 pt-3"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id} className="flex justify-center">
            <Mobile_AccessSliderCart product={product} />
          </SwiperSlide>
        ))}
      </Swiper>

      <button className="mobile-prev absolute -left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white border shadow-xl hover:bg-black hover:text-white transition-all">
        <MdArrowBackIos size={18} />
      </button>
      <button className="mobile-next absolute -right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white border shadow-xl hover:bg-black hover:text-white transition-all">
        <MdArrowForwardIos size={18} />
      </button>
    </div>
  );
};

export default Mobile_AccessSlider;
