import React, { useMemo } from "react";
import { Search, Filter, RotateCcw, Check } from "lucide-react";

const FilterSidebar = ({
  filters,
  setFilters,
  onApplyFilters,
  categories,
  selectedCategoryId = null,
  disableCategoryChange = false,
}) => {
  // Fix: Show all categories, not just those with type === "main"
  const allCategories = useMemo(() => {
    return categories || [];
  }, [categories]);

  const handleCategoryToggle = (id) => {
    if (selectedCategoryId === id && disableCategoryChange) return;
    const isSelected = filters.categories?.includes(id);
    let newCats;
    if (isSelected) {
      newCats = filters.categories?.filter((cId) => cId !== id) || [];
    } else {
      newCats = [...(filters.categories || []), id];
    }
    const newFilters = { ...filters, categories: newCats };
    setFilters(newFilters);
    onApplyFilters(newFilters);
  };

  const handleApply = () => {
    onApplyFilters({ ...filters });
  };

  const handleReset = () => {
    const resetValues = {
      search: "",
      categories:
        selectedCategoryId && disableCategoryChange ? [selectedCategoryId] : [],
      sortBy: "latest",
    };
    setFilters(resetValues);
    onApplyFilters(resetValues);
  };

  return (
    <div
      className="bg-gray-50 border border-gray-200 rounded-md p-6 shadow-sm font-vazir sticky top-32"
      dir="rtl"
    >
      <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
        <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
          <Filter size={22} className="text-red-600" /> فیلترها
        </h2>
        <button
          onClick={handleReset}
          className="p-2 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-600 transition-all"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      {/* Search Input */}
      <div className="mb-8">
        <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-wider">
          جستجوی نام کالا
        </label>
        <div className="relative">
          <input
            type="text"
            value={filters.search || ""}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="مثلاً: کفش ورزشی..."
            className="w-full border border-gray-200 rounded-md py-3.5 pr-11 pl-4 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 bg-white shadow-inner"
          />
          <Search className="absolute right-4 top-3.5 w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Categories Section */}
      <div className="mb-8">
        <h3 className="text-sm font-black text-gray-700 mb-4">دسته‌بندی ها</h3>
        {allCategories.length === 0 ? (
          <p className="text-gray-400 text-sm py-4 text-center">
            دسته‌بندی موجود نیست
          </p>
        ) : (
          <div className="space-y-0.5 max-h-48 overflow-y-auto pl-2 custom-scrollbar">
            {allCategories.map((cat) => {
              const isSelected = filters.categories?.includes(cat.id);
              const isDisabled =
                disableCategoryChange && selectedCategoryId === cat.id;

              return (
                <label
                  key={cat.id}
                  className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                    isSelected
                      ? "bg-red-50 text-red-600"
                      : "hover:bg-white text-gray-600"
                  } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-center gap-x-3 flex-1">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleCategoryToggle(cat.id)}
                      disabled={isDisabled}
                      className="hidden"
                    />
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-red-600 border-red-600"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      {isSelected && <Check size={14} className="text-white" />}
                    </div>
                    <span className="text-sm font-bold">{cat.name}</span>
                  </div>
                  {cat.productCount && (
                    <span className="text-xs text-gray-400">
                      ({cat.productCount})
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Apply Button */}
      <button
        onClick={handleApply}
        className="w-full bg-black text-white py-4 rounded-md hover:bg-red-600 transition-all font-black shadow-xl shadow-gray-200 active:scale-95"
      >
        اعمال فیلترها
      </button>
    </div>
  );
};

export default FilterSidebar;
