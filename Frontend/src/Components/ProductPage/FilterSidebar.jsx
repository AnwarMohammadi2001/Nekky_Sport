import React, { useState, useEffect, useMemo } from "react";
import { Search, Filter, RotateCcw, Check } from "lucide-react";

const FilterSidebar = ({
  filters,
  setFilters,
  onApplyFilters,
  categories,
  selectedCategoryId = null,
  disableCategoryChange = false,
}) => {
  const mainCategories = useMemo(() => categories.filter((c) => c.type === "main"), [categories]);

  const [priceRange, setPriceRange] = useState([filters.minPrice, filters.maxPrice]);

  useEffect(() => {
    setPriceRange([filters.minPrice, filters.maxPrice]);
  }, [filters.minPrice, filters.maxPrice]);

  const handleCategoryToggle = (id) => {
    if (selectedCategoryId === id && disableCategoryChange) return;
    const isSelected = filters.categories.includes(id);
    const newCats = isSelected ? filters.categories.filter((cId) => cId !== id) : [...filters.categories, id];
    const newFilters = { ...filters, categories: newCats };
    setFilters(newFilters);
    onApplyFilters(newFilters);
  };

  const handleApply = () => {
    onApplyFilters({ ...filters, minPrice: priceRange[0], maxPrice: priceRange[1] });
  };

  const handleReset = () => {
    const resetValues = { search: "", categories: (selectedCategoryId && disableCategoryChange) ? [selectedCategoryId] : [], minPrice: 0, maxPrice: 2000000, stockStatus: "all", sortBy: "latest" };
    setFilters(resetValues);
    setPriceRange([0, 200000]);
    onApplyFilters(resetValues);
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-md p-6 shadow-sm font-vazir sticky top-32" dir="rtl">
      <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
        <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
          <Filter size={22} className="text-red-600" /> فیلترها
        </h2>
        <button onClick={handleReset} className="p-2 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-600 transition-all">
          <RotateCcw size={20} />
        </button>
      </div>

      <div className="mb-8">
        <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-wider">جستجوی نام کالا</label>
        <div className="relative">
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="iPhone 15..."
            className="w-full border border-gray-200 rounded-md py-3.5 pr-11 pl-4 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 bg-white shadow-inner"
          />
          <Search className="absolute right-4 top-3.5 w-5 h-5 text-gray-400" />
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-black text-gray-700 mb-4">دسته‌بندی ها</h3>
        <div className="space-y-0.5 max-h-48 overflow-y-auto pl-2 custom-scrollbar">
          {mainCategories.map((cat) => {
            const isSelected = filters.categories.includes(cat.id);
            return (
              <label key={cat.id} className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${isSelected ? "bg-red-50 text-red-600" : "hover:bg-white text-gray-600"}`}>
                <div className="flex items-center gap-x-3">
                  <input type="checkbox" checked={isSelected} onChange={() => handleCategoryToggle(cat.id)} className="hidden" />
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${isSelected ? "bg-red-600 border-red-600" : "bg-white border-gray-300"}`}>
                    {isSelected && <Check size={14} className="text-white" />}
                  </div>
                  <span className="text-sm font-bold">{cat.name}</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-sm font-black text-gray-700 mb-4">محدوده قیمت (AF)</h3>
        <div className="flex gap-2 mb-4">
          <div className="flex-1 bg-white p-2 rounded-xl border border-gray-100 text-center">
            <span className="text-[10px] text-gray-400 block">از</span>
            <input type="number" value={priceRange[0]} onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])} className="w-full text-xs font-black outline-none text-center" />
          </div>
          <div className="flex-1 bg-white p-2 rounded-xl border border-gray-100 text-center">
            <span className="text-[10px] text-gray-400 block">تا</span>
            <input type="number" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 0])} className="w-full text-xs font-black outline-none text-center" />
          </div>
        </div>
        <input type="range" min="0" max="2000000" step="10000" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600" />
      </div>

      <div className="mb-8">
        <h3 className="text-sm font-black text-gray-700 mb-4">وضعیت کالا</h3>
        <div className="flex flex-col gap-2 bg-white p-3 rounded-2xl border border-gray-100">
          {[{v:"all", l:"همه"}, {v:"available", l:"فقط موجود"}].map(s => (
            <label key={s.v} className="flex items-center gap-2 cursor-pointer py-1">
              <input type="radio" name="stock" checked={filters.stockStatus === s.v} onChange={() => setFilters({...filters, stockStatus: s.v})} className="w-4 h-4 accent-red-600" />
              <span className="text-xs font-bold text-gray-600">{s.l}</span>
            </label>
          ))}
        </div>
      </div>

      <button onClick={handleApply} className="w-full bg-black text-white py-4 rounded-md hover:bg-red-600 transition-all font-black shadow-xl shadow-gray-200 active:scale-95">
        اعمال فیلترها
      </button>
    </div>
  );
};

export default FilterSidebar;