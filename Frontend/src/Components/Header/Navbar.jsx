import React, { useState, useRef } from "react";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import MegaMenu from "../MegaMenu";
// اصلاح آیکون‌ها به نام‌های استاندارد برای جلوگیری از خطای ورژن
import { FaWhatsapp, FaFacebook, FaInstagram } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { FaBoxOpen, FaHeadset } from "react-icons/fa";
import { PiExclamationMarkFill, PiQuestionMarkFill } from "react-icons/pi";
import { IoIosDownload } from "react-icons/io";

const navbarItems = [
  { name: "صفحه اصلی", path: "/", icon: <AiFillHome /> },
  { name: "محصولات", path: "/products", icon: <FaBoxOpen /> },

  { name: "پشتیبانی", path: "/contact", icon: <FaHeadset /> },
  { name: "درباره ما", path: "/aboutus", icon: <PiExclamationMarkFill /> },
  { name: "راهنمایی", path: "/help", icon: <PiQuestionMarkFill /> },
];

const Navbar = () => {
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const leaveTimerRef = useRef(null);

  const handleEnter = () => {
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    setShowMegaMenu(true);
  };

  const handleLeave = () => {
    leaveTimerRef.current = setTimeout(() => {
      setShowMegaMenu(false);
    }, 200);
  };

  return (
    <div className="bg-gray-100 py-3 hidden md:block border-b">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4">
        <div className="flex items-center gap-x-10">
          {/* 🔥 ALL PRODUCTS BUTTON (Dynamic MegaMenu) */}
          <div
            className="relative"
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
          >
            <button
              className={`flex items-center gap-x-2 font-bold transition-all duration-300 py-2 ${showMegaMenu ? "text-red-600" : "text-black"}`}
            >
              <Menu className="w-5 h-5" />
              <span>دسته بندی محصولات</span>
            </button>

            {showMegaMenu && (
              <div className="absolute right-0 top-full pt-2 z-50">
                {/* پاس دادن تابع بستن منو به مگامنو */}
                <MegaMenu onClose={() => setShowMegaMenu(false)} />
              </div>
            )}
          </div>

          {/* 🔹 Dynamic Nav Links */}
          <div className="flex items-center gap-x-6">
            {navbarItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="relative flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-red-600 transition-colors group"
              >
                {item.icon}
                {item.name}
                <span className="absolute -bottom-4 left-0 w-full h-0.5 bg-red-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-center" />
              </Link>
            ))}
          </div>
        </div>

        {/* Social Icons - اصلاح شده */}
        <div className="flex items-center gap-x-4">
          <FaWhatsapp
            className="text-green-500 hover:scale-110 transition cursor-pointer"
            size={24}
          />
          <FaFacebook
            className="text-blue-600 hover:scale-110 transition cursor-pointer"
            size={24}
          />
          <FaInstagram
            className="text-pink-600 hover:scale-110 transition cursor-pointer"
            size={24}
          />
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
