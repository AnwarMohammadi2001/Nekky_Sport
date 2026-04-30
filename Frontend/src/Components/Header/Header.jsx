import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

import TopHeader from "./TopHeader";
import Navbar from "./Navbar";
import MobileMenu from "../MobileMenu";
import { AiFillHome } from "react-icons/ai";
import { FaBoxOpen, FaHeadset } from "react-icons/fa6";
import { IoNewspaper } from "react-icons/io5";
import { PiExclamationMarkFill, PiQuestionMarkFill } from "react-icons/pi";
import { Link } from "react-router-dom";
import { IoIosDownload, IoIosList } from "react-icons/io";
const navbarItems = [
  { name: "صفحه اصلی", path: "/", icon: <AiFillHome /> },
  { name: "محصولات", icon: <FaBoxOpen />, path: "/products" },
  { name: "پشتیبانی", icon: <FaHeadset />, path: "/contact" },
  {
    name: "درباره ما",
    path: "/about",
    icon: <PiExclamationMarkFill />,
    path: "/aboutus",
  },
  {
    name: "رهنمایی",
    path: "/about",
    icon: <PiQuestionMarkFill />,
    path: "/help",
  },
];
const Header = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`bg-white transition-all  duration-300 fixed top-0 z-50 left-0 right-0  ${
          isScrolled ? "" : ""
        }`}
      >
        <TopHeader
          isMobileMenuOpen={isMobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        {/* Desktop Navbar */}
        <div className="hidden md:block">
          <Navbar navbarItems={navbarItems} />
        </div>
      </header>

      {/* ✅ Mobile Menu must be OUTSIDE Navbar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu
            isMobileMenuOpen={isMobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
            navbarItems={navbarItems}
          />
        )}
      </AnimatePresence>
      <div className="border-t border-gray-200  fixed bottom-0 left-0 w-full py-2 bg-white z-50 md:hidden grid grid-cols-4 px-4">
        <Link
          to="/"
          onClick={() =>
            scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
          className="flex flex-col items-center  hover:text-red-500 justify-center space-y-1 text-gray-700 transition-colors duration-200"
        >
          <AiFillHome size={24} />
          <span className="text-xs">خانه</span>
        </Link>
        <Link
          to="/categorie"
          onClick={() =>
            scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
          className="flex flex-col items-center  hover:text-red-500 justify-center space-y-1 text-gray-700 transition-colors duration-200"
        >
          <IoIosList size={24} />
          <span className="text-xs">دسته بندی ها</span>
        </Link>
        <Link
          to="/products"
          onClick={() =>
            scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
          className="flex flex-col items-center  hover:text-red-500 justify-center space-y-1 text-gray-700 transition-colors duration-200"
        >
          <FaBoxOpen size={24} />
          <span className="text-xs">محصولات</span>
        </Link>

        <Link
          to="/help"
          onClick={() =>
            scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
          className="flex flex-col items-center  hover:text-red-500 justify-center space-y-1 text-gray-700 transition-colors duration-200"
        >
          <FaHeadset size={24} />
          <span className="text-xs">پشتیبانی</span>
        </Link>
      </div>
    </>
  );
};

export default Header;
