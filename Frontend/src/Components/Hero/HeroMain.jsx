import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { MdArrowForwardIos, MdArrowBackIos } from "react-icons/md";
import {
  contentContainer,
  contentItem,
} from "../../utils/framermotion/variants";
import { motion } from "framer-motion";
import axios from "axios";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const HeroMain = () => {
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/website/sliders/`);

        // اصلاح مهم: مانند کامپوننت WebSliderManager از res.data.results استفاده می‌کنیم
        const sliderData = res.data;
        const slidesArray = Array.isArray(sliderData)
          ? sliderData
          : sliderData.results || sliderData.data || [];

        setSliders(slidesArray);
      } catch (error) {
        console.error("Failed to load sliders:", error);
        // در صورت خطا، اسلایدرهای پیش‌فرض را نمایش می‌دهیم
        setSliders([
          {
            id: 1,
            title: "Push Your Limits",
            desc: "Achieve your fitness goals with modern equipment and expert trainers guiding you.",
            image: "/slider/1.jpg",
          },
          {
            id: 2,
            title: "Stay Fit, Stay Healthy",
            desc: "Join our community and take your fitness journey to the next level.",
            image: "/slider/3.png",
          },
          {
            id: 3,
            title: "Stay Fit, Stay Healthy",
            desc: "Join our community and take your fitness journey to the next level.",
            image: "/slider/4.png",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSliders();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-[50vh] mt-[70px] md:mt-80 md:h-[400px] lg:h-[590px] bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Loading slider...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-[50vh] mt-[70px] md:mt-[153px] md:h-[400px] lg:h-[620px] relative group">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        autoplay={{ delay: 5000 }}
        slidesPerView={1}
        loop={true}
        spaceBetween={0}
        speed={1500}
        navigation={{
          prevEl,
          nextEl,
        }}
        grabCursor={true}
        className="overflow-hidden shadow-lg cursor-pointer h-full relative"
      >
        {sliders.map((slide, index) => (
          <SwiperSlide key={slide.id || index}>
            <motion.div
              variants={contentContainer}
              initial="hidden"
              animate="show"
              className="w-full h-full md:h-[400px] lg:h-[620px] bg-cover bg-center relative flex pt-28 md:pt-0 items-center justify-center"
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* لایه تاریک برای خوانایی بهتر متن */}
              <div className="absolute inset-0 bg-black/20"></div>

              <motion.div
                variants={contentContainer}
                initial="hidden"
                animate="show"
                className="relative z-10 px-6 md:px-16 text-white flex flex-col items-center space-y-4 max-w-2xl text-center"
              ></motion.div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation buttons */}
      <div className="absolute bottom-[40px] md:bottom-[190px] md:top-2/3 right-1/2 translate-x-1/2 md:right-16 md:translate-x-0 z-20 flex md:flex-col gap-10 group">
        <button
          ref={(node) => setNextEl(node)}
          onMouseDown={(e) => e.preventDefault()}
          aria-label="Next Slide"
          className="p-3 items-center justify-center rounded-full border border-white text-white shadow-md cursor-pointer flex hover:bg-white hover:text-black transition"
        >
          <MdArrowForwardIos size={24} />
        </button>

        <button
          ref={(node) => setPrevEl(node)}
          onMouseDown={(e) => e.preventDefault()}
          aria-label="Previous Slide"
          className="p-3 items-center flex justify-center rounded-full border border-white text-white shadow-md cursor-pointer hover:bg-white hover:text-black transition"
        >
          <MdArrowBackIos size={24} />
        </button>
      </div>
    </div>
  );
};

export default HeroMain;
