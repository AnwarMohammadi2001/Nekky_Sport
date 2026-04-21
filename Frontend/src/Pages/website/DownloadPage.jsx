import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaDownload,
  FaSearch,
  FaFilter,
  FaWindows,
  FaApple,
  FaLinux,
  FaInfoCircle,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaStar,
  FaRegStar,
  FaEye,
  FaArrowDown,
  FaFileArchive,
} from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const OSIcon = ({ os }) => {
  const icons = {
    ویندوز: <FaWindows className="text-blue-500" />,
    "مک اواس": <FaApple className="text-gray-700" />,
    لینوکس: <FaLinux className="text-yellow-600" />,
  };
  return icons[os] || null;
};

const RatingStars = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <span key={i}>
          {i < fullStars ? (
            <FaStar className="text-yellow-500" />
          ) : i === fullStars && hasHalfStar ? (
            <div className="relative">
              <FaRegStar className="text-yellow-500 absolute" />
              <div className="overflow-hidden w-1/2">
                <FaStar className="text-yellow-500" />
              </div>
            </div>
          ) : (
            <FaRegStar className="text-yellow-500" />
          )}
        </span>
      ))}
      <span className="text-sm text-gray-600 mr-1">{rating.toFixed(1)}</span>
    </div>
  );
};

const DownloadPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("همه");
  const [selectedOS, setSelectedOS] = useState("همه");
  const [sortBy, setSortBy] = useState("downloads");
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  // Fetch downloads from API
  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/website/downloads/`);

        let downloadsArray = [];
        if (Array.isArray(res.data)) {
          downloadsArray = res.data;
        } else if (res.data && res.data.results) {
          downloadsArray = res.data.results;
        } else if (res.data && res.data.data) {
          downloadsArray = res.data.data;
        }

        setDownloads(downloadsArray);

        const uniqueCategories = ["همه"];
        downloadsArray.forEach((item) => {
          if (item.category && !uniqueCategories.includes(item.category)) {
            uniqueCategories.push(item.category);
          }
        });
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Failed to load downloads:", error);
        setDownloads([]);
        setCategories(["همه"]);
      } finally {
        setLoading(false);
      }
    };

    fetchDownloads();
  }, []);

  const osOptions = ["همه", "ویندوز", "مک اواس", "لینوکس"];

  const filteredSoftware = downloads
    .filter((item) => {
      const matchesSearch =
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "همه" || item.category === selectedCategory;
      const matchesOS =
        selectedOS === "همه" ||
        (item.os_support &&
          item.os_support.toLowerCase().includes(selectedOS.toLowerCase()));

      return matchesSearch && matchesCategory && matchesOS;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.title || "").localeCompare(b.title || "");
        case "date":
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        case "downloads":
          return (b.downloadCount || 0) - (a.downloadCount || 0);
        case "views":
          return (b.views || 0) - (a.views || 0);
        default:
          return 0;
      }
    });

  const formatNumber = (num) => {
    if (!num) return "۰";
    return num.toLocaleString("fa-IR");
  };

  const getFileSize = (item) => {
    return item.file_size || "نامشخص";
  };

  const getRating = () => 4.5;
  const getDownloadCount = () => 12450;
  const getViewCount = () => 24500;
  const isLatest = (item) => true;

  if (loading) {
    return (
      <div
        className="min-h-screen bg-gray-50 font-vazir mt-16 mb-14 md:mb-0 md:mt-[135px]"
        dir="rtl"
      >
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gray-50 font-vazir mt-16 mb-14 md:mb-0 md:mt-[153px]"
      dir="rtl"
    >
      <div className="bg-gray-200 border-b h-[250px] flex items-center border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">
              مرکز دانلود درایورهای پرینتر
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              دانلود آخرین نسخه درایورها، نرم‌افزارها و ابزارهای کمکی برای
              دستگاه‌های چاپی
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-1/4 shrink-0">
            <div className="bg-white sticky top-[150px] rounded-md shadow-sm border border-gray-200 p-5 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
                <FaFilter className="inline ml-2" />
                فیلترها
              </h3>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  جستجوی نرم‌افزار
                </label>
                <div className="relative">
                  <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="نام نرم‌افزار یا توضیحات..."
                    className="w-full pr-10 pl-4 py-3 md:py-2 bg-gray-200 placeholder:text-gray-600 border-gray-300 rounded-md focus:outline-none text-sm focus:ring-1 focus:ring-red-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  مرتب‌سازی بر اساس
                </label>
                <select
                  className="w-full px-3 py-3 md:py-2 bg-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="downloads">پر دانلودترین</option>
                  <option value="views">پربازدیدترین</option>
                  <option value="date">جدیدترین</option>
                  <option value="name">ترتیب الفبایی</option>
                </select>
              </div>

              <div className="flex items-start justify-around">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    دسته‌بندی
                  </label>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center">
                        <input
                          type="radio"
                          id={`cat-${category}`}
                          name="category"
                          checked={selectedCategory === category}
                          onChange={() => setSelectedCategory(category)}
                          className="h-4 w-4 text-blue-600 ml-2"
                        />
                        <label
                          htmlFor={`cat-${category}`}
                          className="text-sm text-gray-700 cursor-pointer"
                        >
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    سیستم عامل
                  </label>
                  <div className="space-y-2">
                    {osOptions.map((os) => (
                      <div key={os} className="flex items-center">
                        <input
                          type="radio"
                          id={`os-${os}`}
                          name="os"
                          checked={selectedOS === os}
                          onChange={() => setSelectedOS(os)}
                          className="h-4 w-4 text-blue-600 ml-2"
                        />
                        <label
                          htmlFor={`os-${os}`}
                          className="text-sm text-gray-700 cursor-pointer"
                        >
                          {os}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* List Content */}
          <div className="lg:w-3/4">
            <div className="flex justify-center md:justify-start flex-wrap gap-2 mb-6">
              {categories.slice(1).map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    selectedCategory === category
                      ? "bg-cyan-800 text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-cyan-800 border hover:text-white border-gray-300"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {filteredSoftware.map((item) => {
                // تعیین لینک نهایی دانلود (اولویت با فایل آپلود شده)
                const finalDownloadLink = item.file || item.download_link;
                const date = new Date(item.created_at);
                const formattedDate = `${date.getFullYear()}-${String(
                  date.getMonth() + 1,
                ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="p-5">
                      <div className="flex flex-col md:flex-row md:items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-xl font-bold text-gray-800 mb-1">
                                {item.title}
                              </h3>
                              <div className="flex items-center gap-3 mb-3">
                                <span className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                                  {item.category || "عمومی"}
                                </span>
                                <RatingStars rating={getRating()} />
                                {isLatest(item) && (
                                  <span className="flex items-center gap-1 text-sm px-3 py-1 bg-green-100 text-green-800 rounded-full">
                                    <FaCheckCircle /> جدید
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="text-2xl font-bold text-cyan-800 hidden md:block">
                              رایگان
                            </span>
                          </div>

                          <p className="text-gray-600 mb-4 leading-relaxed">
                            {item.description || "بدون توضیحات"}
                          </p>

                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-2">
                              <FaWindows className="text-blue-500" />
                              <span>سیستم عامل:</span>
                              <span className="font-medium">
                                {item.os_support || "ویندوز"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FaCalendarAlt className="text-gray-500" />
                              <span>تاریخ انتشار:</span>
                              <span className="font-medium">
                                {formattedDate}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FaFileArchive className="text-indigo-500" />
                              <span>اندازه فایل:</span>
                              <span className="font-medium">
                                {getFileSize(item)}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-6 text-sm">
                            <div className="flex items-center gap-2 text-gray-700">
                              <FaEye className="text-gray-500" />
                              <span>بازدید:</span>
                              <span className="font-bold">
                                {formatNumber(getViewCount())}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700">
                              <FaArrowDown className="text-gray-500" />
                              <span>دانلود:</span>
                              <span className="font-bold">
                                {formatNumber(getDownloadCount())}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700">
                              <FaStar className="text-yellow-500" />
                              <span>امتیاز:</span>
                              <span className="font-bold">
                                {getRating().toFixed(1)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="md:w-48 flex-shrink-0">
                          <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                            <div className="text-center mb-3">
                              <span className="text-3xl font-bold text-red-600 block md:hidden">
                                رایگان
                              </span>
                              <span className="text-sm text-gray-600">
                                {item.version || "نسخه نهایی"}
                              </span>
                            </div>
                            <button
                              className="w-full bg-red-500 text-white py-3 rounded-lg font-bold hover:bg-red-600 transition-all duration-300 flex items-center justify-center gap-2 group"
                              onClick={() =>
                                window.open(finalDownloadLink, "_blank")
                              }
                            >
                              <FaDownload className="group-hover:animate-bounce" />
                              دانلود مستقیم
                            </button>
                            <p className="text-xs text-center text-gray-500 mt-2">
                              حجم: {getFileSize(item)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredSoftware.length === 0 && !loading && (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <FaTimesCircle className="text-5xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-700 mb-2">
                  نرم‌افزاری یافت نشد
                </h3>
                <p className="text-gray-600">
                  لطفاً فیلترهای جستجو را تغییر دهید یا کلمات کلیدی دیگری را
                  امتحان کنید.
                </p>
              </div>
            )}

            <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-md p-6">
              <div className="flex items-start gap-4">
                <FaInfoCircle className="text-blue-600 text-xl mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-800 mb-3 text-lg">
                    نکات مهم قبل از دانلود
                  </h4>
                  <ul className="text-gray-700 space-y-2 text-sm leading-relaxed">
                    <li className="flex items-start">
                      <span className="text-blue-600 ml-2">•</span>
                      قبل از نصب درایور، از اتصال پرینتر به کامپیوتر خود مطمئن
                      شوید
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 ml-2">•</span>
                      برای بهترین نتیجه، پس از نصب درایور کامپیوتر خود را مجدداً
                      راه‌اندازی کنید
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 ml-2">•</span>
                      فایلهای فشرده (ZIP) را قبل از اجرا با نرم‌افزارهای مربوطه
                      استخراج کنید
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;
