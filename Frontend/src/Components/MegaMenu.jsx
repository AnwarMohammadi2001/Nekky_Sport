import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchWebCategories, fetchWebProducts } from "../services/api";
import { ChevronLeft, Loader2, ShoppingBasket } from "lucide-react";

const MegaMenu = ({ onClose }) => {
  // دریافت دسته‌بندی‌ها
  const { data: catData, isLoading } = useQuery({
    queryKey: ["webCategories"],
    queryFn: fetchWebCategories,
  });

  // دریافت محصولات پرفروش برای ویترین منو
  const { data: prodData } = useQuery({
    queryKey: ["popularWebProducts"],
    queryFn: () => fetchWebProducts({ bestseller: true }),
  });

  const categories = useMemo(
    () => (Array.isArray(catData) ? catData : catData?.results || []),
    [catData],
  );
  const popularProducts = useMemo(
    () => (Array.isArray(prodData) ? prodData : prodData?.results || []),
    [prodData],
  );

  const mainCategories = categories.filter((c) => c.type === "main");

  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState(null);

  const getSubcategories = (parentId) =>
    categories.filter((c) => c.type === "sub" && c.parent === parentId);
  const getBrands = (subId) =>
    categories.filter((c) => c.type === "brand" && c.parent === subId);

  useEffect(() => {
    if (mainCategories.length > 0) {
      const firstMain = mainCategories[0];
      setActiveCategory(firstMain.id);
      const firstSub = getSubcategories(firstMain.id)[0];
      if (firstSub) setActiveSubcategory(firstSub.id);
    }
  }, [categories]);

  if (isLoading)
    return (
      <div className="fixed w-full max-w-[1200px] mx-auto left-0 right-0 z-50 bg-white p-20 flex justify-center border shadow-2xl rounded-b-3xl">
        <Loader2 className="animate-spin text-red-600" size={40} />
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed w-full max-w-[1200px] mx-auto top-[153px] left-0 -right-12 z-50 bg-white border border-gray-200 shadow-2xl overflow-hidden rounded-b-md"
      dir="rtl"
    >
      <div className="flex h-[500px]">
        {/* پنل راست: دسته‌های اصلی */}
        <div className="w-64 bg-gray-50 border-l border-gray-200 overflow-y-auto">
          <div className="p-4 border-b bg-gray-100/50">
            <h3 className="font-black text-gray-800 flex items-center gap-2">
              <ShoppingBasket size={18} className="text-red-600" /> دسته‌بندی‌ها
            </h3>
          </div>
          <div className="py-2">
            {mainCategories.map((category) => (
              <button
                key={category.id}
                onMouseEnter={() => {
                  setActiveCategory(category.id);
                  const subs = getSubcategories(category.id);
                  if (subs.length > 0) setActiveSubcategory(subs[0].id);
                }}
                className={`w-full text-right px-6 py-3 transition-all flex items-center justify-between group ${
                  activeCategory === category.id
                    ? "text-red-600 bg-white border-r-[4px] border-red-500 font-bold"
                    : "text-gray-600 hover:bg-white hover:text-red-500"
                }`}
              >
                <span>{category.name}</span>
                <ChevronLeft size={16} />
              </button>
            ))}
          </div>
        </div>

        {/* پنل وسط: زیر مجموعه‌ها */}
        <div className="w-64 border-l border-gray-100 bg-white overflow-y-auto">
          {activeCategory ? (
            <div className="p-4">
              <h3 className="font-bold text-xs text-gray-400 mb-4 tracking-widest uppercase">
                زیر مجموعه‌ها
              </h3>
              <div className="space-y-1">
                {getSubcategories(activeCategory).map((sub) => (
                  <button
                    key={sub.id}
                    onMouseEnter={() => setActiveSubcategory(sub.id)}
                    className={`w-full text-right text-sm px-4 py-3 flex items-center justify-between rounded-md transition-all ${
                      activeSubcategory === sub.id
                        ? "bg-red-50 text-gray-700 font-bold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {sub.name}
                    <ChevronLeft size={16} />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-300">
              <p className="text-sm">یک دسته را انتخاب کنید</p>
            </div>
          )}
        </div>

        {/* پنل چپ: برندها و محصولات */}
        <div className="flex-1 p-8 overflow-y-auto bg-white">
          <AnimatePresence mode="wait">
            {activeSubcategory ? (
              <motion.div
                key={activeSubcategory}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="grid grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {getBrands(activeSubcategory).map((brand) => (
                  <div key={brand.id} className="group">
                    <h4 className="font-black text-gray-900 mb-3 pb-2 border-b border-gray-100 group-hover:text-red-600 transition-colors">
                      {brand.name}
                    </h4>
                    <div className="space-y-2">
                      {/* ✅ اصلاح شد: استفاده از پارامتر category برای برند */}
                      <Link
                        to={`/products?category=${brand.id}`}
                        onClick={onClose}
                        className="text-sm text-gray-500 hover:text-red-500 block"
                      >
                        مشاهده همه محصولات {brand.name}
                      </Link>
                    </div>
                  </div>
                ))}
                {getBrands(activeSubcategory).length === 0 && (
                  <div className="col-span-full text-center py-20 text-gray-400">
                    هنوز برندی برای این بخش ثبت نشده است.
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h3 className="font-black text-lg mb-6 border-r-4 border-red-600 pr-3">
                  محصولات پیشنهادی ویترین
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {popularProducts.slice(0, 6).map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      className="flex items-center gap-3 p-3 border rounded-2xl hover:border-red-500 transition-all group"
                      onClick={onClose}
                    >
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-12 h-12 object-contain group-hover:scale-110 transition-transform"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-gray-800 truncate w-24">
                          {product.title}
                        </h4>
                        <p className="text-[10px] text-red-600 font-black">
                          {Number(product.price).toLocaleString()} AF
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default MegaMenu;