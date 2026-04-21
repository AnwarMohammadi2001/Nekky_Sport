import React, { useState, useEffect, useRef, useMemo } from "react";
import { Search, Loader2, X, TrendingUp, Clock, ChevronLeft } from "lucide-react";
import { fetchWebProducts, fetchWebCategories } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // ۱. دریافت دسته‌بندی‌ها برای بخش پیشنهادات
  useEffect(() => {
    fetchWebCategories().then(data => {
      const cats = Array.isArray(data) ? data : data?.results || [];
      setCategories(cats.filter(c => c.type === 'main').slice(0, 5));
    });
  }, []);

  // ۲. منطق جستجوی زنده (Debounce)
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length > 1) {
        setIsLoading(true);
        try {
          const data = await fetchWebProducts({ search: query });
          const items = Array.isArray(data) ? data : data?.results || [];
          setResults(items.slice(0, 8)); // نمایش ۸ مورد برتر
          setIsOpen(true);
        } catch (error) { console.error(error); }
        finally { setIsLoading(false); }
      } else {
        setResults([]);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  // ۳. بستن با کلیک به بیرون
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (id) => {
    setIsOpen(false);
    setQuery("");
    navigate(`/product/${id}`);
  };

  return (
    <div className="relative w-full max-w-[500px] z-50" ref={searchRef}>
      {/* باکس ورودی اصلی */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => setQuery(e.target.value)}
          className={`w-full bg-gray-100 py-3.5 pr-12 pl-12 rounded-md outline-none border-2 transition-all duration-300 ${
            isOpen ? "bg-white border-red-500 shadow-xl" : "border-transparent"
          }`}
          placeholder="جستجو محصولات، برندها و..."
        />
        <Search className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${isOpen ? 'text-red-500' : 'text-gray-400'}`} size={20} />
        
        <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {isLoading && <Loader2 size={18} className="animate-spin text-red-500" />}
            {query && <X size={18} className="text-gray-400 cursor-pointer hover:text-black" onClick={() => setQuery("")} />}
            <div className="bg-black text-white p-2 rounded-md cursor-pointer hover:bg-red-600 transition-colors">
                <Search size={18} />
            </div>
        </div>
      </div>

      {/* پنل بزرگِ زیر باکس (Mega Dropdown) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full mt-3 right-0 md:-right-20 w-screen max-w-[350px] md:max-w-[750px] bg-white rounded-md shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden"
          >
            <div className="flex flex-col md:flex-row h-full">
              
              {/* ستون پیشنهادات (سمت راست) */}
              <div className="w-full md:w-1/3 bg-gray-50/50 p-6 border-l border-gray-100">
                <div className="mb-8">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Clock size={14}/> جستجوهای اخیر
                    </h3>
                    <div className="flex flex-col gap-2">
                        {["پرینتر HP", "iPhone 13", "شارژر"].map((s, i) => (
                            <button key={i} onClick={() => setQuery(s)} className="text-right text-sm font-bold text-gray-600 hover:text-red-600 transition-colors">
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <TrendingUp size={14}/> دسته‌های محبوب
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {categories.map(c => (
                            <button key={c.id} onClick={() => { setIsOpen(false); navigate(`/products?category=${c.id}`); }} className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-[11px] font-black text-gray-700 hover:border-red-500 hover:text-red-500 transition-all">
                                {c.name}
                            </button>
                        ))}
                    </div>
                </div>
              </div>

              {/* ستون نتایج (سمت چپ) */}
              <div className="flex-1 p-6 bg-white">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                    {query.length > 1 ? `نتایج برای "${query}"` : "محصولات پیشنهادی"}
                </h3>
                
                <div className="grid grid-cols-1 gap-3">
                  {results.length > 0 ? (
                    results.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleSelect(product.id)}
                        className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-2xl cursor-pointer transition-all border border-transparent hover:border-gray-100 group"
                      >
                        <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center p-2 shrink-0 group-hover:bg-white transition-colors">
                          <img src={product.image} className="max-h-full object-contain" alt="" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-gray-800 truncate">{product.title}</h4>
                          <p className="text-[10px] text-blue-500 font-bold">{product.category_name}</p>
                        </div>
                        <div className="text-left shrink-0 pl-2">
                          <p className="text-red-600 font-black text-sm">{Number(product.price).toLocaleString()} <small className="text-[8px]">AF</small></p>
                          {product.old_price > 0 && <p className="text-[9px] text-gray-400 line-through">{Number(product.old_price).toLocaleString()}</p>}
                        </div>
                        <ChevronLeft size={14} className="text-gray-300 group-hover:text-red-500" />
                      </div>
                    ))
                  ) : (
                    <div className="py-20 text-center flex flex-col items-center justify-center">
                        <Search size={40} className="text-gray-100 mb-2" />
                        <p className="text-gray-400 text-sm font-bold">نام محصول مورد نظر را تایپ کنید...</p>
                    </div>
                  )}
                </div>

                {results.length > 0 && (
                    <button 
                        onClick={() => { setIsOpen(false); navigate(`/products?search=${query}`); }}
                        className="w-full mt-4 py-3 bg-gray-900 text-white rounded-xl font-black text-xs hover:bg-red-600 transition-all"
                    >
                        مشاهده تمام نتایج برای "{query}"
                    </button>
                )}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;