import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getProducts } from "../api/api";
import { ChevronLeft, Loader2, ShoppingBasket } from "lucide-react";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const MegaMenu = ({ onClose }) => {
  // دریافت دسته‌بندی‌ها
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // دریافت همه محصولات
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const categories = useMemo(
    () => (Array.isArray(categoriesData?.data) ? categoriesData.data : []),
    [categoriesData],
  );

  const allProducts = useMemo(
    () => (Array.isArray(productsData?.data) ? productsData.data : []),
    [productsData],
  );

  const [activeCategory, setActiveCategory] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Helper function to get image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;

    // If it's already a full URL
    if (imagePath.startsWith("http")) return imagePath;

    // Replace backslashes with forward slashes
    let normalizedPath = imagePath.replace(/\\/g, "/");
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

  // Get products for a specific category
  const getProductsByCategory = (categoryId) => {
    return allProducts.filter((product) => product.categoryId === categoryId);
  };

  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].id);
      setHoveredCategory(categories[0].id);
    }
  }, [categories]);

  if (categoriesLoading || productsLoading) {
    return (
      <div className="fixed w-full max-w-[1200px] mx-auto left-0 right-0 z-50 bg-white p-20 flex justify-center border shadow-2xl rounded-b-3xl">
        <Loader2 className="animate-spin text-red-600" size={40} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed w-full max-w-[1200px] mx-auto top-[153px] left-0 right-0 z-50 bg-white border border-gray-200 shadow-2xl overflow-hidden rounded-b-md"
      dir="rtl"
    >
      <div className="flex h-[500px]">
        {/* Right Panel: Main Categories */}
        <div className="w-64 bg-gray-50 border-l border-gray-200 overflow-y-auto">
          <div className="p-4 border-b bg-gray-100/50 sticky top-0">
            <h3 className="font-black text-gray-800 flex items-center gap-2">
              <ShoppingBasket size={18} className="text-red-600" />
              دسته‌بندی‌ها
            </h3>
          </div>
          <div className="py-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onMouseEnter={() => {
                  setHoveredCategory(category.id);
                  setSelectedCategory(category.id);
                }}
                onClick={() => {
                  setActiveCategory(category.id);
                  setSelectedCategory(category.id);
                }}
                className={`w-full text-right px-6 py-3 transition-all flex items-center justify-between group ${
                  hoveredCategory === category.id ||
                  activeCategory === category.id
                    ? "text-red-600 bg-white border-r-[4px] border-red-500 font-bold"
                    : "text-gray-600 hover:bg-white hover:text-red-500"
                }`}
              >
                <div className="flex items-center gap-3">
                  {category.image && (
                    <img
                      src={getImageUrl(category.image)}
                      alt={category.name}
                      className="w-5 h-5 object-cover rounded"
                      onError={(e) => {
                        e.target.src = "/placeholder.png";
                      }}
                    />
                  )}
                  <span>{category.name}</span>
                </div>
                <ChevronLeft size={16} />
              </button>
            ))}
          </div>
        </div>

        {/* Left Panel: Products for selected category */}
        <div className="flex-1 p-6 overflow-y-auto bg-white">
          <AnimatePresence mode="wait">
            {hoveredCategory || activeCategory ? (
              <motion.div
                key={hoveredCategory || activeCategory}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                {/* Category Header */}
                <div className="pb-4 border-b border-gray-200">
                  <h3 className="font-bold text-xl text-gray-800">
                    {
                      categories.find(
                        (c) => c.id === (hoveredCategory || activeCategory),
                      )?.name
                    }
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {
                      getProductsByCategory(hoveredCategory || activeCategory)
                        .length
                    }{" "}
                    محصول
                  </p>
                </div>

                {/* Products Grid */}
                {getProductsByCategory(hoveredCategory || activeCategory)
                  .length > 0 ? (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {getProductsByCategory(
                      hoveredCategory || activeCategory,
                    ).map((product) => {
                      // Get the correct image URL
                      let productImage = null;
                      if (product.ProductImages && product.ProductImages[0]) {
                        const img = product.ProductImages[0];
                        const imagePath = img.imageUrl || img.url || img;
                        productImage = getImageUrl(imagePath);
                      } else if (product.image) {
                        productImage = getImageUrl(product.image);
                      } else if (product.imageUrl) {
                        productImage = getImageUrl(product.imageUrl);
                      }

                      return (
                        <Link
                          key={product.id}
                          to={`/product/${product.id}`}
                          onClick={onClose}
                          className="group block p-3 border border-gray-100 rounded-xl hover:border-red-200 hover:shadow-lg transition-all duration-300"
                        >
                          {/* Product Image */}
                          <div className="relative w-full h-20 mb-3 bg-gray-50 rounded-lg overflow-hidden">
                            {productImage ? (
                              <img
                                src={productImage}
                                alt={product.name}
                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  console.error(
                                    "Image failed to load:",
                                    productImage,
                                  );
                                  e.target.src = "/placeholder.png";
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                <ShoppingBasket
                                  size={32}
                                  className="text-gray-400"
                                />
                              </div>
                            )}

                            {/* Stock Badge */}
                            {product.stock <= 0 && (
                              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                ناموجود
                              </div>
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="space-y-2">
                            <h4 className="font-bold text-sm text-gray-800 line-clamp-2 group-hover:text-red-600 transition-colors">
                              {product.name}
                            </h4>

                            {/* Price */}
                            <div className="flex items-center justify-between">
                              <p className="text-red-600 font-black text-lg">
                                {Number(product.price).toLocaleString()} AF
                              </p>
                              {product.stock > 0 && (
                                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                  موجود
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <ShoppingBasket size={48} className="mb-4 opacity-50" />
                    <p className="text-center">
                      هیچ محصولی در این دسته‌بندی یافت نشد
                    </p>
                  </div>
                )}

                {/* View All Link */}
                {getProductsByCategory(hoveredCategory || activeCategory)
                  .length > 0 && (
                  <div className="pt-4 text-center border-t border-gray-100">
                    <Link
                      to={`/products?category=${hoveredCategory || activeCategory}`}
                      onClick={onClose}
                      className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold text-sm transition-colors"
                    >
                      مشاهده همه محصولات این دسته
                      <ChevronLeft size={16} />
                    </Link>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full text-gray-400"
              >
                <ShoppingBasket size={64} className="mb-4 opacity-30" />
                <p className="text-center">
                  برای مشاهده محصولات، یک دسته را انتخاب کنید
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default MegaMenu;
