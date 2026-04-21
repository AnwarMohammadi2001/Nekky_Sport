import React from "react";
import { Heart, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { PiSignIn } from "react-icons/pi";
import SearchBar from "./SearchBar";

const TopHeader = ({ isMobileMenuOpen, setMobileMenuOpen }) => {
  return (
    <div className="bg-white border-b border-gray-50 relative z-[60]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        
        {/* بخش لوگو و جستجو */}
        <div className="flex items-center gap-x-8 flex-1">
          <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden">
            <Menu size={28} />
          </button>
          
          <Link to="/">
            <img src="/sdf.png" className="h-12 md:h-16 w-auto" alt="Logo" />
          </Link>

          {/* باکس جستجوی هوشمند جدید */}
          <div className="hidden md:block flex-1 max-w-[500px]">
            <SearchBar />
          </div>
        </div>

        {/* بخش دکمه‌های اکشن */}
        <div className="flex items-center gap-x-3 pr-4">
          <Link to="/wishlist" className="md:p-3 p-2 border-2 border-gray-100 rounded-md hover:border-red-500 transition-all group">
            <Heart size={20} className="group-hover:fill-red-500 group-hover:text-red-600" />
          </Link>

          <Link to="/sign-in" className="bg-black text-white px-3 py-2  md:px-6 md:py-3 rounded-md font-black text-sm hover:bg-red-600 transition-all flex items-center gap-2 shadow-lg shadow-gray-200">
            <span>ورود</span>
            <PiSignIn size={20} className="rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;