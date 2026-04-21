import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowBigLeft,
  ArrowDownLeft,
  ArrowLeft,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
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

const Footer = () => {
  return (
    <footer
      className="bg-[#060812] hidden md:block text-white"
      aria-labelledby="footer-heading"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-10">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            {/* Replaced text with logo */}
            <Link to="/" className="flex flex-col items-start justify-center ">
              <img
                src="sdf.png"
                alt="Website Logo"
                className="h-[100px] w-auto" // Adjust height to match your header logo
              />
              <span className="text-3xl mr-10 font-semibold text-gray-100">
                سعادت گروپ
              </span>
            </Link>
            <p className="text-base text-gray-400">
              سعادت گروپ عرضه‌کننده پرينتر، وسایل جانبی پرینتر، موبایل و لوازم
              جانبی آن با کیفیت تضمین‌ شده و قیمت مناسب در افغانستان است.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-red-500 tracking-wider uppercase">
                  لینک های سریع
                </h3>
                <ul role="list" className="mt-4 space-y-2">
                  <li className="flex items-center justify-between hover:bg-gray-500 p-1.5 rounded-md   group">
                    <Link
                      to="/"
                      className="text-base text-gray-400 group-hover:text-white"
                    >
                      صفحه اصلی
                    </Link>
                    <MdKeyboardArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300" />
                  </li>
                  <li className="flex items-center justify-between hover:bg-gray-500 p-1.5 rounded-md   group">
                    <Link
                      to="/products"
                      className="text-base text-gray-400 group-hover:text-white"
                    >
                      {" "}
                      محصولات
                    </Link>
                    <MdKeyboardArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300" />
                  </li>
                  <li className="flex items-center justify-between hover:bg-gray-500 p-1.5 rounded-md   group">
                    <Link
                      to="/download"
                      className="text-base text-gray-400 group-hover:text-white"
                    >
                      دانلود
                    </Link>
                    <MdKeyboardArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300" />
                  </li>
                  <li className="flex items-center justify-between hover:bg-gray-500 p-1.5 rounded-md   group">
                    <Link
                      to="/support"
                      className="text-base text-gray-400 group-hover:text-white"
                    >
                      پشتیبانی
                    </Link>
                    <MdKeyboardArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300" />
                  </li>
                  <li className="flex items-center justify-between hover:bg-gray-500 p-1.5 rounded-md   group">
                    <Link
                      to="aboutus"
                      className="text-base text-gray-400 group-hover:text-white"
                    >
                      درباره
                    </Link>
                    <MdKeyboardArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300" />
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold tracking-wider text-red-500 uppercase">
                  دسته بندی ها
                </h3>
                <ul role="list" className="mt-4 space-y-2">
                  <li className="flex items-center justify-between hover:bg-gray-500 p-1.5 rounded-md   group">
                    <Link
                      to="/"
                      className="text-base text-gray-400 group-hover:text-white"
                    >
                      موبایل
                    </Link>
                    <MdKeyboardArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300" />
                  </li>
                  <li className="flex items-center justify-between hover:bg-gray-500 p-1.5 rounded-md   group">
                    <Link
                      to="/"
                      className="text-base text-gray-400 group-hover:text-white"
                    >
                      پرینتر
                    </Link>
                    <MdKeyboardArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300" />
                  </li>
                  <li className="flex items-center justify-between hover:bg-gray-500 p-1.5 rounded-md   group">
                    <Link
                      to="/"
                      className="text-base text-gray-400 group-hover:text-white"
                    >
                      لوازم جانبی موبایل
                    </Link>
                    <MdKeyboardArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300" />
                  </li>
                  <li className="flex items-center justify-between hover:bg-gray-500 p-1.5 rounded-md   group">
                    <Link
                      to="/"
                      className="text-base text-gray-400 group-hover:text-white"
                    >
                      لوازم جانبی پرینتر
                    </Link>
                    <MdKeyboardArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300" />
                  </li>
                  <li className="flex items-center justify-between hover:bg-gray-500 p-1.5 rounded-md   group">
                    <Link
                      to="/"
                      className="text-base text-gray-400 group-hover:text-white"
                    >
                      سیم ظرف شویی
                    </Link>
                    <MdKeyboardArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300" />
                  </li>
                </ul>
              </div>
            </div>
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

                    <span className="text-base">0764334224</span>
                  </li>

                  {/* WhatsApp */}
                  <li className="flex items-center gap-5">
                    <span className="border rounded-md border-gray-400 p-2">
                      <FaWhatsapp size={18} className="text-gray-400" />
                    </span>
                      <span dir="" className="text-base ">
                        {" "}
                        0789200605
                      </span>
                  </li>

                  {/* Email */}
                  <li className="flex items-center gap-5">
                    <span className="border rounded-md border-gray-400 p-2">
                      <FaEnvelope size={18} className="text-gray-400" />
                    </span>
                    <span className="text-base">saadatgroup1996@gmail.com</span>
                  </li>

                  {/* Address */}
                  <li className="flex items-start gap-5">
                    <span className="border rounded-md border-gray-400 p-2">
                      <FaMapMarkerAlt size={18} className="text-gray-400" />
                    </span>
                    <span className="text-base">
                      کابل، پل سوخته، مارکیت محمدی، دوکان نمبر های ۳۱ و ۳۲
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-5 border-t border-gray-700 flex items-center justify-between ">
          <div className="flex gap-x-5">
            <a href="#" className="group ">
              <FaFacebookSquare
                className="text-gray-400 group-hover:scale-110 transition"
                size={34}
              />
            </a>
            <a
              href="https://www.instagram.com/chiqfrip.vibes?igsh=MWZhZ29iajBva2Jybg=="
              className="group"
            >
              <FaInstagramSquare
                className="text-gray-400 group-hover:scale-110 transition"
                size={34}
              />
            </a>
            <a href="#" className="group">
              <FaSquareWhatsapp
                className="text-gray-400 group-hover:scale-110 transition"
                size={34}
              />
            </a>
          </div>
          <p className="text-base text-gray-400 text-center">
            © {new Date().getFullYear()} سعادت گروپ — تمامی حقوق محفوظ است.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
