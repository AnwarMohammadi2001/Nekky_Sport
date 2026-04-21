import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // اگر صفحه 1 بود یا دیتایی نداشتیم، صفحه‌بندی را پنهان کن
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // ساخت آرایه از شماره صفحات
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    // استفاده از dir="ltr" کلیدی‌ترین بخش برای جلوگیری از به هم ریختگی در داشبورد فارسی است
    <nav className="flex items-center justify-center gap-2 mt-6 mb-2" dir="ltr">
      {/* دکمه قبلی (فلش چپ) */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all shadow-sm"
        title="صفحه قبلی"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* شماره صفحات */}
      <div className="flex items-center gap-2">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all duration-200 ${
              currentPage === number
                ? "bg-cyan-700 text-white border-2 border-cyan-700 shadow-md transform scale-105" // استایل صفحه فعال (همرنگ با دکمه‌های سایت شما)
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-cyan-700 hover:border-cyan-200 shadow-sm" // استایل صفحات غیرفعال
            }`}
          >
            {number}
          </button>
        ))}
      </div>

      {/* دکمه بعدی (فلش راست) */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all shadow-sm"
        title="صفحه بعدی"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </nav>
  );
};

export default Pagination;
