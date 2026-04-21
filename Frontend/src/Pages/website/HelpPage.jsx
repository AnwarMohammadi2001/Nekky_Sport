import React, { useState } from "react";
import {
  Search,
  BookOpen,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  FileText,
  CreditCard,
  Truck,
  RefreshCw,
  Shield,
  User,
  Settings,
  Globe,
  ArrowRight,
  CheckCircle,
  Star,
  ThumbsUp,
} from "lucide-react";
import { Link } from "react-router-dom";

const HelpPage = () => {
  const [activeCategory, setActiveCategory] = useState("started");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaqs, setExpandedFaqs] = useState([]);

  // دسته‌بندی‌های راهنما
  const categories = [
    { id: "started", name: "شروع کار", icon: <BookOpen className="w-5 h-5" /> },
    { id: "account", name: "حساب کاربری", icon: <User className="w-5 h-5" /> },
    {
      id: "shopping",
      name: "خرید کردن",
      icon: <ShoppingBag className="w-5 h-5" />,
    },
    { id: "payment", name: "پرداخت", icon: <CreditCard className="w-5 h-5" /> },
    { id: "delivery", name: "تحویل کالا", icon: <Truck className="w-5 h-5" /> },
    { id: "return", name: "مرجوعی", icon: <RefreshCw className="w-5 h-5" /> },
    { id: "security", name: "امنیت", icon: <Shield className="w-5 h-5" /> },
    { id: "other", name: "سایر", icon: <Settings className="w-5 h-5" /> },
  ];

  // سوالات متداول
  const faqs = {
    started: [
      {
        id: 1,
        question: "چگونه می‌توانم در وبسایت سعادت ثبت نام کنم؟",
        answer:
          'برای ثبت نام، روی دکمه "ثبت نام" در بالای صفحه کلیک کنید. سپس شماره تماس خود را وارد کرده و کد تأیید را دریافت نمایید. پس از وارد کردن کد، می‌توانید اطلاعات حساب کاربری خود را تکمیل کنید.',
      },
      {
        id: 2,
        question: "آیا استفاده از وبسایت سعادت رایگان است؟",
        answer:
          "بله، ثبت نام و استفاده از تمام امکانات وبسایت سعادت کاملاً رایگان است. تنها هزینه‌ای که پرداخت می‌کنید، قیمت کالاها و هزینه ارسال می‌باشد.",
      },
      {
        id: 3,
        question: "چگونه می‌توانم محصولات را جستجو کنم؟",
        answer:
          "می‌توانید از نوار جستجوی بالای صفحه استفاده کنید یا از دسته‌بندی‌های موجود برای یافتن محصولات مورد نظر خود بهره ببرید.",
      },
    ],
    account: [
      {
        id: 4,
        question: "چگونه رمز عبور خود را تغییر دهم؟",
        answer:
          'به بخش "حساب کاربری" → "تنظیمات امنیتی" مراجعه کرده و گزینه "تغییر رمز عبور" را انتخاب کنید.',
      },
      {
        id: 5,
        question: "چگونه آدرس خود را اضافه یا ویرایش کنم؟",
        answer:
          'در بخش "حساب کاربری" → "آدرس‌های من" می‌توانید آدرس‌های جدید اضافه یا آدرس‌های موجود را ویرایش کنید.',
      },
    ],
    payment: [
      {
        id: 6,
        question: "چه روش‌های پرداختی پشتیبانی می‌شود؟",
        answer:
          "ما از پرداخت آنلاین با کارت‌های بانکی، پرداخت در محل و کیف پول الکترونیکی پشتیبانی می‌کنیم.",
      },
    ],
    delivery: [
      {
        id: 7,
        question: "زمان تحویل سفارشات چقدر است؟",
        answer: "در کابل: ۲۴ ساعت کاری | سایر ولایات: ۳-۵ روز کاری",
      },
    ],
  };

  const toggleFaq = (id) => {
    setExpandedFaqs((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const currentFaqs = faqs[activeCategory] || [];

  return (
    <div className="min-h-screen bg-gradient-to-b mt-14  md:mt-[136px] from-gray-50 to-white">
      {/* هدر اصلی */}
      <header className=" bg-gray-100 text-white">
        <div className="max-w-7xl mx-auto px-4 pt-12">
          <div className="flex flex-col items-center justify-between gap-4">
            {/* تصویر یا آیکون هدر */}
            <div className=" flex justify-center">
              <div className="relative">
                <div className=" bg-gray-100 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <HelpCircle className=" w-20 h-20 md:w-32 md:h-32 text-red-500" />
                </div>
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-2xl md:text-4xl lg:text-xl text-gray-700 space-y-1 font-bold mb-4">
                <span className="block">
                  {" "}
                  راهنمایی استفاده از وبسایت سعادت گروپ
                </span>
              </h1>
              <p className="text-md md:text-lg text-gray-600 mb-8">
                ما اینجا هستیم تا به شما کمک کنیم. هر سوالی دارید، پاسخ آن را
                اینجا پیدا خواهید کرد.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pb-12 pt-5">
        <div className="flex flex-col items-center justify-center gap-8">
          {/* سمت چپ: محتوای اصلی */}
          <div className="lg:w-2/3">
            {/* عنوان دسته فعال */}
            <div className="mb-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                {categories.find((c) => c.id === activeCategory)?.icon}
                <h2 className="text-2xl font-bold text-gray-800">
                  {categories.find((c) => c.id === activeCategory)?.name}
                </h2>
              </div>
              <p className="text-gray-600">
                تمامی اطلاعات مورد نیاز درباره{" "}
                {categories.find((c) => c.id === activeCategory)?.name} را در
                این بخش پیدا کنید.
              </p>
            </div>

            {/* سوالات متداول */}
            <div className="space-y-4 mb-12">
              {currentFaqs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-center justify-between p-6 text-right hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-lg ${
                          expandedFaqs.includes(faq.id)
                            ? "bg-red-100 text-red-600"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        <HelpCircle className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-gray-800 text-sm md:text-lg">
                        {faq.question}
                      </span>
                    </div>
                    {expandedFaqs.includes(faq.id) ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>

                  {expandedFaqs.includes(faq.id) && (
                    <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                      <div className="flex items-start gap-3">
                        <div className="w-1 h-full bg-blue-200 rounded-full mt-2"></div>
                        <p className="text-gray-700 leading-relaxed pr-4">
                          {faq.answer}
                        </p>
                      </div>
                      <div className="mt-4 flex items-center gap-4">
                        <button className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium">
                          <ThumbsUp className="w-4 h-4" />
                          <span>مفید بود</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* بنر پایانی */}
        <div className=" rounded-md flex items-center justify-center py-8 ">
          <div className="flex flex-col items-center justify-center rounded-md  p-10 bg-gray-200  gap-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-700 mb-3">
                هنوز مشکل شما حل نشده؟
              </h3>
              <p className="text-red-500">
                تیم پشتیبانی ما آماده پاسخگویی به سوالات شماست
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                to="/support"
                className="bg-black text-gray-100 font-bold px-6 py-3 rounded-xl  transition-colors"
              >
                درخواست تماس
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// کامپوننت آیکون ShoppingBag
const ShoppingBag = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

// کامپوننت آیکون Eye
const Eye = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export default HelpPage;
