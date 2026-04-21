import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, TrendingUp, Clock, ArrowLeft, Loader2 } from "lucide-react";
import { fetchWebProducts, fetchWebCategories } from "../../services/api";
import { useNavigate } from "react-router-dom";

const AdvancedSearch = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState(["iPhone", "Printer", "Samsung"]);
  const navigate = useNavigate();

  // ۱. دریافت دسته‌بندی‌ها برای پیشنهادات
  useEffect(() => {
    if (isOpen) {
      fetchWebCategories().then(data => {
        const cats = Array.isArray(data) ? data : data?.results || [];
        setCategories(cats.filter(c => c.type === 'main').slice(0, 6));
      });
      // فوکوس خودکار روی اینپوت
      setTimeout(() => document.getElementById('main-search-input')?.focus(), 100);
    }
  }, [isOpen]);

  // ۲. منطق جستجوی زنده
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length > 1) {
        setIsLoading(true);
        try {
          const data = await fetchWebProducts({ search: query });
          const items = Array.isArray(data) ? data : data?.results || [];
          setResults(items);
        } catch (error) { console.error(error); }
        finally { setIsLoading(true); setIsLoading(false); }
      } else {
        setResults([]);
      }
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelect = (id) => {
    onClose();
    navigate(`/product/${id}`);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-xl flex flex-col items-center pt-10 md:pt-20 px-6"
      >
        {/* دکمه بستن */}
        <button onClick={onClose} className="absolute top-6 left-6 p-3 hover:bg-gray-100 rounded-full transition-all">
          <X size={32} className="text-gray-400" />
        </button>

        <div className="w-full max-w-4xl">
          {/* باکس جستجوی بزرگ */}
          <div className="relative mb-12">
            <input
              id="main-search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="نام محصول، برند یا دسته بندی را جستجو کنید..."
              className="w-full bg-transparent border-b-2 border-gray-100 py-6 pr-14 pl-10 text-2xl md:text-4xl font-black outline-none focus:border-red-500 transition-all placeholder:text-gray-300"
            />
            <Search className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400" size={36} />
            {isLoading && <Loader2 className="absolute left-0 top-1/2 -translate-y-1/2 animate-spin text-red-500" size={28} />}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* ستون پیشنهادات پیش‌فرض (وقتی متنی تایپ نشده) */}
            {query.length < 2 ? (
              <>
                <div className="space-y-6">
                  <h3 className="flex items-center gap-2 text-gray-400 font-bold uppercase text-xs tracking-widest"><Clock size={16}/> جستجوهای اخیر</h3>
                  <div className="flex flex-col gap-3">
                    {recentSearches.map((s, i) => (
                      <button key={i} onClick={() => setQuery(s)} className="text-right text-lg font-bold text-gray-700 hover:text-red-500 flex items-center gap-2 group">
                        <ArrowLeft size={14} className="opacity-0 group-hover:opacity-100 transition-all" /> {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="flex items-center gap-2 text-gray-400 font-bold uppercase text-xs tracking-widest"><TrendingUp size={16}/> دسته‌بندی‌های محبوب</h3>
                  <div className="flex flex-wrap gap-3">
                    {categories.map(c => (
                      <button key={c.id} onClick={() => {onClose(); navigate(`/products?category=${c.id}`)}} className="px-4 py-2 bg-gray-100 hover:bg-black hover:text-white rounded-xl text-sm font-bold transition-all">
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-red-50 p-6 rounded-[2rem] border border-red-100 flex flex-col justify-center items-center text-center">
                   <p className="text-red-600 font-black mb-2">دنبال چیز خاصی هستید؟</p>
                   <p className="text-xs text-red-400">گروه سعادت با بیش از ۲۰۰۰ محصول در کنار شماست</p>
                </div>
              </>
            ) : (
              /* ستون نتایج جستجو (وقتی در حال تایپ است) */
              <div className="md:col-span-3">
                <h3 className="text-gray-400 font-bold mb-6">نتایج هوشمند برای "{query}"</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.length > 0 ? results.map(product => (
                    <motion.div 
                      layout
                      key={product.id}
                      onClick={() => handleSelect(product.id)}
                      className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-white border border-transparent hover:border-red-100 rounded-3xl cursor-pointer transition-all shadow-sm hover:shadow-xl group"
                    >
                      <div className="w-20 h-20 bg-white rounded-2xl p-2 flex items-center justify-center shrink-0">
                        <img src={product.image} className="max-h-full object-contain group-hover:scale-110 transition-transform" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 line-clamp-1">{product.title}</h4>
                        <p className="text-xs text-gray-400 mb-2">{product.category_name}</p>
                        <p className="text-red-600 font-black">{Number(product.price).toLocaleString()} AF</p>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="col-span-3 py-20 text-center text-gray-400 font-bold">
                        محصولی یافت نشد! دوباره تلاش کنید.
                    </div>
                  )}
                </div>
                {results.length > 0 && (
                   <button 
                    onClick={() => { onClose(); navigate(`/products?search=${query}`); }}
                    className="w-full mt-10 py-4 bg-black text-white rounded-2xl font-black hover:bg-red-600 transition-all"
                   >
                     مشاهده همه نتایج جستجو
                   </button>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AdvancedSearch;