import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Loader2,
  X,
  TrendingUp,
  Clock,
  ChevronLeft,
} from "lucide-react";
import {
  searchProducts,
  getSearchSuggestions,
  getCategories,
} from "../../api/api";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suggestions, setSuggestions] = useState({
    products: [],
    categories: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  const searchRef = useRef(null);
  const navigate = useNavigate();
  const debounceTimerRef = useRef(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      } catch (e) {
        console.error("Error loading recent searches:", e);
      }
    }
  }, []);

  // Save recent search
  const saveRecentSearch = (searchTerm) => {
    if (!searchTerm.trim()) return;
    const updated = [
      searchTerm,
      ...recentSearches.filter((s) => s !== searchTerm),
    ].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  // Fetch categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getCategories();
        const cats = Array.isArray(response.data) ? response.data : [];
        setCategories(cats.slice(0, 5));
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };
    loadCategories();
  }, []);

  // Search logic with debounce
  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (query.trim().length > 1) {
      setIsLoading(true);

      debounceTimerRef.current = setTimeout(async () => {
        try {
          // Get search suggestions for autocomplete
          const suggestionsData = await getSearchSuggestions(query, 5);
          setSuggestions(
            suggestionsData.suggestions || { products: [], categories: [] },
          );

          // Get actual search results
          const searchResults = await searchProducts({
            search: query,
            limit: 8,
            page: 1,
          });

          // Handle different response structures
          let items = [];
          if (searchResults.success) {
            items = searchResults.data || [];
          } else if (Array.isArray(searchResults)) {
            items = searchResults;
          } else if (searchResults.results) {
            items = searchResults.results;
          } else if (searchResults.data?.data) {
            items = searchResults.data.data;
          } else {
            items = [];
          }

          setResults(items.slice(0, 8));
          setIsOpen(true);
        } catch (error) {
          console.error("Search error:", error);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      }, 400);
    } else {
      setResults([]);
      setSuggestions({ products: [], categories: [] });
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (id) => {
    setIsOpen(false);
    setQuery("");
    navigate(`/product/${id}`);
  };

  const handleSearchSubmit = () => {
    if (query.trim()) {
      saveRecentSearch(query);
      setIsOpen(false);
      navigate(`/products?search=${encodeURIComponent(query)}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const handleRecentSearchClick = (searchTerm) => {
    setQuery(searchTerm);
    saveRecentSearch(searchTerm);
  };

  // Get product display name
  const getProductName = (product) => {
    return product.title || product.name || "نامشخص";
  };

  // Get product image
  const getProductImage = (product) => {
    if (product.image) return product.image;
    if (product.imageUrl) return product.imageUrl;
    if (product.ProductImages && product.ProductImages[0]) {
      return `http://localhost:5000${product.ProductImages[0].imageUrl}`;
    }
    return "/placeholder.png";
  };

  // Get category name for product
  const getCategoryName = (product) => {
    return product.category_name || product.Category?.name || "";
  };

  return (
    <div className="relative w-full max-w-[500px] z-50" ref={searchRef}>
      {/* Search Input Box */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className={`w-full bg-gray-100 py-3.5 pr-12 pl-12 rounded-md outline-none border-2 transition-all duration-300 ${
            isOpen ? "bg-white border-red-500 shadow-xl" : "border-transparent"
          }`}
          placeholder="جستجو محصولات، برندها و..."
          dir="rtl"
        />
        <Search
          className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${isOpen ? "text-red-500" : "text-gray-400"}`}
          size={20}
        />

        <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {isLoading && (
            <Loader2 size={18} className="animate-spin text-red-500" />
          )}
          {query && (
            <X
              size={18}
              className="text-gray-400 cursor-pointer hover:text-black"
              onClick={() => setQuery("")}
            />
          )}
          <button
            onClick={handleSearchSubmit}
            className="bg-black text-white p-2 rounded-md cursor-pointer hover:bg-red-600 transition-colors"
          >
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* Mega Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full mt-3 right-0 md:-right-20 w-screen max-w-[350px] md:max-w-[750px] bg-white rounded-md shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden"
            dir="rtl"
          >
            <div className="flex flex-col md:flex-row h-full">
              {/* Suggestions Column (Right Side) */}
              <div className="w-full md:w-1/3 bg-gray-50/50 p-6 border-l border-gray-100">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Clock size={14} /> جستجوهای اخیر
                    </h3>
                    <div className="flex flex-col gap-2">
                      {recentSearches.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => handleRecentSearchClick(s)}
                          className="text-right text-sm font-bold text-gray-600 hover:text-red-600 transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Category Suggestions from API */}
                {suggestions.categories &&
                  suggestions.categories.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <TrendingUp size={14} /> دسته‌های پیشنهادی
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {suggestions.categories.slice(0, 5).map((cat, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setIsOpen(false);
                              navigate(`/products?category=${cat.id || cat}`);
                            }}
                            className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-[11px] font-black text-gray-700 hover:border-red-500 hover:text-red-500 transition-all"
                          >
                            {typeof cat === "string" ? cat : cat.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Popular Categories (fallback if no suggestions) */}
                {categories.length > 0 &&
                  (!suggestions.categories ||
                    suggestions.categories.length === 0) && (
                    <div>
                      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <TrendingUp size={14} /> دسته‌های محبوب
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((c) => (
                          <button
                            key={c.id}
                            onClick={() => {
                              setIsOpen(false);
                              navigate(`/products?category=${c.id}`);
                            }}
                            className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-[11px] font-black text-gray-700 hover:border-red-500 hover:text-red-500 transition-all"
                          >
                            {c.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Product Suggestions */}
                {suggestions.products && suggestions.products.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Search size={14} /> محصولات پیشنهادی
                    </h3>
                    <div className="flex flex-col gap-2">
                      {suggestions.products.slice(0, 3).map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleSelect(product.id)}
                          className="text-right text-sm text-gray-600 hover:text-red-600 transition-colors"
                        >
                          {product.name || product.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Search Results Column (Left Side) */}
              <div className="flex-1 p-6 bg-white">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                  {query.length > 1
                    ? `نتایج برای "${query}"`
                    : "محصولات پیشنهادی"}
                </h3>

                <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto">
                  {results.length > 0 ? (
                    results.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleSelect(product.id)}
                        className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-2xl cursor-pointer transition-all border border-transparent hover:border-gray-100 group"
                      >
                        <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center p-2 shrink-0 group-hover:bg-white transition-colors">
                          <img
                            src={getProductImage(product)}
                            className="max-h-full object-contain"
                            alt={getProductName(product)}
                            onError={(e) => (e.target.src = "/placeholder.png")}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-gray-800 truncate">
                            {getProductName(product)}
                          </h4>
                          {getCategoryName(product) && (
                            <p className="text-[10px] text-blue-500 font-bold mt-1">
                              {getCategoryName(product)}
                            </p>
                          )}
                          {product.stock !== undefined && (
                            <p
                              className={`text-[10px] mt-1 ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}
                            >
                              {product.stock > 0
                                ? `موجودی: ${product.stock} عدد`
                                : "ناموجود"}
                            </p>
                          )}
                        </div>
                        <div className="text-left shrink-0 pl-2">
                          <p className="text-red-600 font-black text-sm">
                            {Number(product.price).toLocaleString()}{" "}
                            <small className="text-[8px]">AF</small>
                          </p>
                          {product.old_price > 0 && (
                            <p className="text-[9px] text-gray-400 line-through">
                              {Number(product.old_price).toLocaleString()}
                            </p>
                          )}
                        </div>
                        <ChevronLeft
                          size={14}
                          className="text-gray-300 group-hover:text-red-500"
                        />
                      </div>
                    ))
                  ) : query.length > 1 ? (
                    <div className="py-20 text-center flex flex-col items-center justify-center">
                      <Search size={40} className="text-gray-100 mb-2" />
                      <p className="text-gray-400 text-sm font-bold">
                        محصولی یافت نشد
                      </p>
                    </div>
                  ) : (
                    <div className="py-20 text-center flex flex-col items-center justify-center">
                      <Search size={40} className="text-gray-100 mb-2" />
                      <p className="text-gray-400 text-sm font-bold">
                        نام محصول مورد نظر را تایپ کنید...
                      </p>
                    </div>
                  )}
                </div>

                {results.length > 0 && (
                  <button
                    onClick={handleSearchSubmit}
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
