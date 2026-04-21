import React, { useState, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { MdArrowForwardIos, MdArrowBackIos } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { fetchWebProducts } from "../../services/api";
import BestSellingProductCart from "./BestSellingProductCart";
import "swiper/css";
import "swiper/css/navigation";
import { Link } from "react-router-dom";

const Printer_Slider = () => {
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["webProducts", "printer-access"],
    queryFn: () => fetchWebProducts({ search: "پرنتر" }),
  });

  const products = useMemo(() => {
    if (!data) return [];
    return Array.isArray(data) ? data : data.results || [];
  }, [data]);

  if (isLoading || products.length === 0) return null;

  return (
    <div className="relative w-full pb-5 mt-8">
      <div className="flex items-center justify-between mb-5">
        <p className="bg-gray-200 text-gray-800 border border-gray-300 shadow text-sm rounded-md w-fit px-5 py-1 font-bold">
          لوازم جانبی پرنتر
        </p>
        <Link
          to="products"
          className="text-sm text-red-500 font-semibold hover:underline transition-all"
        >
          مشاهده همه
        </Link>
      </div>

      <Swiper
        modules={[Navigation, Autoplay]}
        navigation={{ prevEl, nextEl }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop
        spaceBetween={20}
        breakpoints={{
          0: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 5 },
        }}
        className="px-2"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id} className="flex justify-center">
            <BestSellingProductCart product={product} />
          </SwiperSlide>
        ))}
      </Swiper>

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

export default Printer_Slider;
