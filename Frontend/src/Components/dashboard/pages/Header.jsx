import React from "react";
import { Menu, Search, Bell, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const Header = ({ profile, setIsSidebarOpen, activeComponent }) => {
    
    // تبدیل نام کامپوننت به تیتر فارسی
    const getTitle = () => {
        const titles = {
            dashboard_home: "نمای کلی داشبورد",
            product_setup: "پیکربندی سیستم",
            user_manager: "مدیریت کاربران",
            purchase_orders: "خرید و ورود کالا",
            seller_dist: "توزیع کالا",
            received_goods: "کالاهای دریافتی",
            stockmanagement: "موجودی انبار",
            salesmanagement: "مدیریت فروش",
            payments: "مرکز پرداخت",
            customer_wallet: "کیف پول مشتریان",
            reporting: "گزارشات جامع",
            profile: "پروفایل کاربری"
        };
        return titles[activeComponent] || "پنل مدیریت";
    };

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 z-20 sticky top-0">
            
            {/* Left: Mobile Menu & Title */}
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => setIsSidebarOpen(true)} 
                    className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                >
                    <Menu size={24} />
                </button>
                
                <div className="flex flex-col">
                    <h2 className="text-lg font-bold text-gray-800 hidden sm:block">{getTitle()}</h2>
                    <span className="text-xs text-gray-400 font-mono hidden sm:block">
                        {new Date().toLocaleDateString('fa-IR')}
                    </span>
                </div>
            </div>

            {/* Right: Search & Profile */}
            <div className="flex items-center gap-4">
                
                {/* Search Bar */}
                <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-64 border border-transparent focus-within:border-black focus-within:bg-white transition-all">
                    <Search size={18} className="text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="جستجو..." 
                        className="bg-transparent border-none outline-none text-sm w-full pr-2 text-gray-700 placeholder-gray-400"
                    />
                </div>

                <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block"></div>

                {/* Notifications */}
                <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>

                {/* Profile Dropdown Trigger */}
                <div className="flex items-center gap-3 pl-1 cursor-pointer hover:bg-gray-50 p-1.5 rounded-xl transition border border-transparent hover:border-gray-200">
                    <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-bold shadow-sm">
                        {profile?.first_name ? profile.first_name[0] : "U"}
                    </div>
                    <div className="hidden md:block text-right">
                        <p className="text-sm font-bold text-gray-800 leading-none">
                            {profile ? `${profile.first_name} ${profile.last_name}` : "کاربر"}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-1">
                            {profile?.is_superuser ? "مدیر کل" : "فروشنده"}
                        </p>
                    </div>
                    <ChevronDown size={16} className="text-gray-400 hidden md:block" />
                </div>
            </div>
        </header>
    );
};

export default Header;