import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { MdArrowForwardIos, MdArrowBackIos } from "react-icons/md";
import { contentContainer } from "../../utils/framermotion/variants";
import { motion } from "framer-motion";

const BASE_URL = import.meta.env.VITE_BASE_URL;
import { getSliders } from "../../api/api";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// چون API baseURL = http://localhost:5000/api است
// برای تصاویر باید root دامنه را جدا بگیریم


const HeroMain = () => {
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FIX IMAGE URL - Handle backslashes and different formats
  // =========================
  const getImageUrl = (img) => {
    if (!img) return "/fallback.jpg";

    // If it's already a full URL
    if (img.startsWith("http")) return img;

    // Replace backslashes with forward slashes
    let normalizedPath = img.replace(/\\/g, "/");

    // Remove any duplicate slashes
    normalizedPath = normalizedPath.replace(/\/+/g, "/");

    // Remove 'uploads/' if it's already in the path to avoid double
    let cleanPath = normalizedPath;

    // If path already starts with 'uploads/', use as is
    if (cleanPath.startsWith("uploads/")) {
      return `${BASE_URL}/${cleanPath}`;
    }

    // If path starts with '/uploads/', remove leading slash
    if (cleanPath.startsWith("/uploads/")) {
      return `${BASE_URL}${cleanPath}`;
    }

    // Default: assume it's a relative path from uploads folder
    return `${BASE_URL}/uploads/${cleanPath}`;
  };

  // Debug function to log image URLs
  const logImageInfo = (slider) => {
    console.log("Slider:", slider.id);
    console.log("Raw image path:", slider.image);
    console.log("Processed URL:", getImageUrl(slider.image));
  };

  // =========================
  // FETCH SLIDERS FROM API
  // =========================
  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const res = await getSliders();
        console.log("API Response:", res);

        // Handle different response structures
        let slidesArray = [];

        if (res.data && Array.isArray(res.data)) {
          slidesArray = res.data;
        } else if (res.data && res.data.data && Array.isArray(res.data.data)) {
          slidesArray = res.data.data;
        } else if (
          res.data &&
          res.data.results &&
          Array.isArray(res.data.results)
        ) {
          slidesArray = res.data.results;
        } else if (Array.isArray(res)) {
          slidesArray = res;
        } else if (res.data && res.data.sliders) {
          slidesArray = res.data.sliders;
        } else {
          slidesArray = [];
        }

        console.log("Processed sliders:", slidesArray);

        // Log each slider's image path for debugging
        slidesArray.forEach((slider) => logImageInfo(slider));

        setSliders(slidesArray);
      } catch (error) {
        console.error("Slider error:", error);

        // fallback
        setSliders([
          { id: 1, image: "/slider/1.jpg" },
          { id: 2, image: "/slider/3.png" },
          { id: 3, image: "/slider/4.png" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSliders();
  }, []);

  // =========================
  // LOADING UI
  // =========================
  if (loading) {
    return (
      <div className="w-full h-[50vh] mt-[70px] md:mt-[153px] md:h-[400px] lg:h-[620px] bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500 text-lg">Loading slider...</div>
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
        speed={1200}
        navigation={{ prevEl, nextEl }}
        grabCursor={true}
        className="h-full"
      >
        {sliders.map((slide, index) => (
          <SwiperSlide key={slide.id || index}>
            <motion.div
              variants={contentContainer}
              initial="hidden"
              animate="show"
              className="w-full h-full bg-cover bg-center relative flex items-center justify-center"
              style={{
                backgroundImage: `url(${getImageUrl(slide.image)})`,
              }}
            >
              {/* overlay */}
              <div className="absolute inset-0 bg-black/30"></div>

              {/* Optional: Add text content if available */}
              {slide.title && (
                <div className="relative z-10 text-center text-white px-4">
                  <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4">
                    {slide.title}
                  </h2>
                  {slide.description && (
                    <p className="text-sm md:text-base lg:text-lg max-w-2xl mx-auto">
                      {slide.description}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* NAVIGATION */}
      <div className="absolute bottom-10 md:top-2/3 right-1/2 translate-x-1/2 md:right-16 md:translate-x-0 z-20 flex md:flex-col gap-4">
        <button
          ref={(node) => setNextEl(node)}
          onMouseDown={(e) => e.preventDefault()}
          className="p-3 rounded-full border border-white text-white hover:bg-white hover:text-black transition"
        >
          <MdArrowForwardIos size={20} />
        </button>

        <button
          ref={(node) => setPrevEl(node)}
          onMouseDown={(e) => e.preventDefault()}
          className="p-3 rounded-full border border-white text-white hover:bg-white hover:text-black transition"
        >
          <MdArrowBackIos size={20} />
        </button>
      </div>
    </div>
  );
};

export default HeroMain;
