import React, { useState, useEffect, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { getCategories } from "../../api/api";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const MainCategorySlider = () => {
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});
  const navigate = useNavigate();

  // Helper function to get image URL with base URL handling
  const getImageUrl = useMemo(
    () => (imagePath) => {
      if (!imagePath) return null;

      // If it's already a full URL
      if (imagePath.startsWith("http")) return imagePath;

      // Replace backslashes with forward slashes
      let normalizedPath = imagePath.replace(/\\/g, "/");

      // Remove any duplicate slashes
      normalizedPath = normalizedPath.replace(/\/+/g, "/");

      // Handle different path formats
      if (normalizedPath.startsWith("uploads/")) {
        return `${BASE_URL}/${normalizedPath}`;
      }

      if (normalizedPath.startsWith("/uploads/")) {
        return `${BASE_URL}${normalizedPath}`;
      }

      // Default: assume it's a relative path from uploads folder
      return `${BASE_URL}/uploads/${normalizedPath}`;
    },
    [],
  );

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

        // Sort by name or order if available
        const sortedCategories = [...categoriesArray].sort((a, b) => {
          if (a.order !== undefined && b.order !== undefined) {
            return a.order - b.order;
          }
          return a.name.localeCompare(b.name);
        });

        // Filter categories that have images or provide fallback
        const filteredCategories = sortedCategories
          .filter((cat) => cat.name) // Must have a name
          .slice(0, 12); // Limit to 12 items

        setCategories(filteredCategories);

        // Log for debugging
        console.log("Categories loaded:", filteredCategories.length);
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId, categoryName) => {
    navigate(`/products?category=${categoryId}`, {
      state: { categoryName, categoryId },
    });
  };

  // Skeleton loading component
  const SkeletonCard = () => (
    <div
      className="flex flex-col items-center justify-center
      bg-gradient-to-br from-rose-50 via-white to-rose-50
      border border-rose-200 rounded-3xl p-4 h-[140px] w-[140px] md:h-[170px] md:w-[170px]
      animate-pulse"
    >
      <div className="h-[80px] w-[80px] md:h-[90px] md:w-[90px] rounded-full bg-gray-200"></div>
      <div className="mt-3 h-4 w-20 bg-gray-200 rounded"></div>
    </div>
  );

  if (loading) {
    return (
      <div className="relative w-full max-w-5xl mx-auto py-10">
        <div className="flex justify-center space-x-4 px-6">
          {[...Array(6)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        🏷️ No categories available
      </div>
    );
  }

  return (
    <div className=" w-full max-w-5xl mx-auto py-10 ">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          دسته‌بندی محصولات
        </h2>
        <p className="text-gray-500 text-sm mt-2">
          محصولات مورد نظر خود را بر اساس دسته‌بندی پیدا کنید
        </p>
      </div>

      <div className="relative">
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation={{ prevEl, nextEl }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop={categories.length > 5}
          grabCursor
          spaceBetween={30}
          slidesPerView={2}
          breakpoints={{
            480: { slidesPerView: 2 },
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
            1280: { slidesPerView: 5 },
          }}
          className="px-6"
        >
          {categories.map((category) => (
            <SwiperSlide key={category.id}>
              <button
                onClick={() => handleCategoryClick(category.id, category.name)}
                className="flex flex-col items-center justify-center
              bg-gradient-to-br from-rose-50 via-white to-rose-50
              border border-rose-200 hover:border-rose-400
              rounded-3xl p-4 h-[140px] w-[140px] md:h-[170px] md:w-[170px]
              transition-all duration-300 hover:shadow-xl group
              cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-400"
              >
                <div className="h-[80px] w-[80px] md:h-[90px] md:w-[90px] rounded-full overflow-hidden bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center p-1 group-hover:scale-105 transition-all duration-300">
                  {!imageErrors[category.id] && category.image ? (
                    <img
                      src={getImageUrl(category.image)}
                      alt={category.name}
                      className="h-full w-full object-cover rounded-full"
                      loading="lazy"
                      onError={() => handleImageError(category.id)}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-rose-200 to-pink-200 text-rose-600 text-2xl font-bold">
                      {category.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <span className="mt-3 text-sm md:text-base font-semibold text-gray-700 group-hover:text-rose-500 text-center line-clamp-2 transition-colors duration-300">
                  {category.name}
                </span>
                {category.productCount !== undefined && (
                  <span className="text-xs text-gray-400 mt-1">
                    {category.productCount} محصول
                  </span>
                )}
              </button>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Buttons - only show if more than visible slides */}
        {categories.length > 5 && (
          <>
            <button
              ref={(node) => setPrevEl(node)}
              className="absolute -left-2 top-1/2 -translate-y-1/2 z-20
            p-2 rounded-full border border-rose-300 bg-white/90 backdrop-blur-sm
            hover:bg-rose-500 hover:text-white hover:border-rose-500 
            transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-rose-400
            disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous category"
            >
              <MdArrowBackIos size={20} />
            </button>

            <button
              ref={(node) => setNextEl(node)}
              className="absolute -right-3 top-1/2 -translate-y-1/2 z-20
            p-2 rounded-full border border-rose-300 bg-white/90 backdrop-blur-sm
            hover:bg-rose-500 hover:text-white hover:border-rose-500 
            transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-rose-400
            disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next category"
            >
              <MdArrowForwardIos size={20} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MainCategorySlider;
