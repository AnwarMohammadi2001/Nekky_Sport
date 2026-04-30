import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { FaSquareWhatsapp } from "react-icons/fa6";
import { FaFacebookSquare } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { MdKeyboardArrowLeft } from "react-icons/md";
import {
  FaPhoneAlt,
  FaWhatsapp,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { getCategories } from "../../api/api";

const Footer = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();

        // Extract categories from response
        let categoriesArray = [];

        if (response?.data && Array.isArray(response.data)) {
          categoriesArray = response.data;
        } else if (Array.isArray(response)) {
          categoriesArray = response;
        } else if (response?.data?.data && Array.isArray(response.data.data)) {
          categoriesArray = response.data.data;
        } else if (
          response?.data?.results &&
          Array.isArray(response.data.results)
        ) {
          categoriesArray = response.data.results;
        }

        // Limit to first 6 categories for footer
        setCategories(categoriesArray.slice(0, 6));
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <footer
      className="bg-[#060812] hidden md:block text-white"
      aria-labelledby="footer-heading"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-10">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            {/* Logo and company name */}
            <Link to="/" className="flex flex-col items-start justify-center">
              <img
                src="logo.jpeg"
                alt="Website Logo"
                className="h-[100px] w-auto"
              />
              <span className="text-3xl mr-10 font-semibold text-gray-100">
                نیکی اسپورت
              </span>
            </Link>
            <p className="text-base text-gray-400">
              نیکی اسپورت عرضه‌کننده انواع محصولات و تجهیزات ورزشی با کیفیت
              تضمین‌شده و قیمت مناسب در افغانستان است.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              {/* Quick Links */}
              <div>
                <h3 className="text-sm font-semibold text-red-500 tracking-wider uppercase">
                  لینک های سریع
                </h3>
                <ul role="list" className="mt-4 space-y-2">
                  <li className="flex items-center justify-between hover:bg-gray-700 p-1.5 rounded-md group transition-colors">
                    <Link
                      to="/"
                      className="text-base text-gray-400 group-hover:text-white"
                    >
                      صفحه اصلی
                    </Link>
                    <MdKeyboardArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300" />
                  </li>
                  <li className="flex items-center justify-between hover:bg-gray-700 p-1.5 rounded-md group transition-colors">
                    <Link
                      to="/products"
                      className="text-base text-gray-400 group-hover:text-white"
                    >
                      محصولات
                    </Link>
                    <MdKeyboardArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300" />
                  </li>
                  <li className="flex items-center justify-between hover:bg-gray-700 p-1.5 rounded-md group transition-colors">
                    <Link
                      to="/contact"
                      className="text-base text-gray-400 group-hover:text-white"
                    >
                      پشتیبانی
                    </Link>
                    <MdKeyboardArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300" />
                  </li>
                  <li className="flex items-center justify-between hover:bg-gray-700 p-1.5 rounded-md group transition-colors">
                    <Link
                      to="/aboutus"
                      className="text-base text-gray-400 group-hover:text-white"
                    >
                      درباره ما
                    </Link>
                    <MdKeyboardArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300" />
                  </li>
                </ul>
              </div>

              {/* Categories - Dynamic from API */}
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold tracking-wider text-red-500 uppercase">
                  دسته بندی ها
                </h3>
                <ul role="list" className="mt-4 space-y-2">
                  {loading ? (
                    // Loading skeletons
                    [...Array(4)].map((_, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between p-1.5"
                      >
                        <div className="h-5 w-24 bg-gray-700 rounded animate-pulse"></div>
                        <div className="w-4 h-4 bg-gray-700 rounded animate-pulse"></div>
                      </li>
                    ))
                  ) : categories.length > 0 ? (
                    categories.slice(0, 4).map((category) => (
                      <li
                        key={category.id}
                        className="flex items-center justify-between hover:bg-gray-700 p-1.5 rounded-md group transition-colors"
                      >
                        <Link
                          to={`/products?category=${category.id}`}
                          className="text-base text-gray-400 group-hover:text-white"
                        >
                          {category.name}
                        </Link>
                        <MdKeyboardArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300" />
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-400 text-sm">
                      دسته‌بندی موجود نیست
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Contact Info */}
            <div className="md:grid md:grid-cols-1 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold tracking-wider text-red-500 uppercase">
                  تماس با ما
                </h3>

                <ul className="mt-4 space-y-3 text-sm text-gray-400">
                  {/* Phone */}
                  <li className="flex items-center gap-5">
                    <span className="border rounded-md border-gray-400 p-2">
                      <FaPhoneAlt size={18} className="text-gray-400" />
                    </span>
                    <span className="text-base">0784576164</span>
                  </li>

                  {/* WhatsApp */}
                  <li className="flex items-center gap-5">
                    <span className="border rounded-md border-gray-400 p-2">
                      <FaWhatsapp size={18} className="text-gray-400" />
                    </span>
                    <span className="text-base">0748648401</span>
                  </li>

                  {/* Email */}
                  <li className="flex items-center gap-5">
                    <span className="border rounded-md border-gray-400 p-2">
                      <FaEnvelope size={18} className="text-gray-400" />
                    </span>
                    <span className="text-base">info@nikisport.com</span>
                  </li>

                  {/* Address */}
                  <li className="flex items-start gap-5">
                    <span className="border rounded-md border-gray-400 p-2">
                      <FaMapMarkerAlt size={18} className="text-gray-400" />
                    </span>
                    <span className="text-base">
                      بین کوته سنگی و گولایی دواخانه مارکیت باختریان منزل دوم
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-5 mt-8 border-t border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex gap-x-5">
            <a
              href="#"
              className="group"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookSquare
                className="text-gray-400 group-hover:scale-110 transition group-hover:text-blue-500"
                size={34}
              />
            </a>
            <a
              href="https://www.instagram.com/"
              className="group"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagramSquare
                className="text-gray-400 group-hover:scale-110 transition group-hover:text-pink-500"
                size={34}
              />
            </a>
            <a
              href="#"
              className="group"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaSquareWhatsapp
                className="text-gray-400 group-hover:scale-110 transition group-hover:text-green-500"
                size={34}
              />
            </a>
          </div>
          <p className="text-base text-gray-400 text-center">
            © {new Date().getFullYear()} نیکی اسپورت — تمامی حقوق محفوظ است.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
