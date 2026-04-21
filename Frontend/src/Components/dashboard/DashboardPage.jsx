import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import { FaUser, FaBell, FaCog } from "react-icons/fa";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Menu, ChevronDown } from "lucide-react";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://127.0.0.1:8000";

const Dashboard = () => {
  const { profile, currentUser, loading } = useSelector((state) => state.user);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState("");

  // تعیین صفحه پیش‌فرض بر اساس نقش
  useEffect(() => {
    if (!currentUser) return;

    const isAdmin = currentUser.is_superuser || currentUser.role === "ADMIN";
    const isContentManager = currentUser.is_content_manager || currentUser.role === "CONTENT_MANAGER";
    const isSeller = currentUser.is_staff || currentUser.role === "SELLER";

    if (isAdmin) setActiveComponent("reporting");
    else if (isContentManager) setActiveComponent("web_slider");
    else if (isSeller) setActiveComponent("salesmanagement");
    else setActiveComponent("profile");
  }, [currentUser]);

  const fullProfilePhotoUrl = profile?.profile_photo ? `${BASE_URL}${profile.profile_photo}` : null;

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-gray-100" dir="rtl">
      {/* Sidebar - Responsive */}
      <div className={`${isMobileMenuOpen ? "block" : "hidden"} lg:block fixed lg:relative inset-0 z-50 lg:z-auto h-full`}>
        <Sidebar setActiveComponent={setActiveComponent} activeComponent={activeComponent} />
      </div>

      {/* Overlay for Mobile */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 h-screen overflow-hidden min-w-0">
        
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 z-10 shadow-sm">
          <div className="flex items-center justify-between px-6 py-3">
            
            {/* Left Side: Mobile Menu & Search */}
            <div className="flex items-center gap-4">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
              <div className="relative hidden md:block">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input type="text" placeholder="جستجو در سیستم..." className="w-72 pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all" />
              </div>
            </div>

            {/* Right Side: Profile & Actions */}
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-full hover:bg-gray-100 transition relative">
                <FaBell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 left-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              
              <div className="h-8 w-[1px] bg-gray-200 mx-2 hidden md:block"></div>

              <div className="flex items-center gap-3 cursor-pointer">
                <AnimatePresence mode="wait">
                  {loading && !profile ? (
                    <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                  ) : (
                    <div className="flex items-center gap-3">
                        <div className="text-left hidden md:block">
                            <p className="font-bold text-sm text-gray-800">{profile ? `${profile.first_name} ${profile.last_name}` : "کاربر سیستم"}</p>
                            <p className="text-xs text-gray-500">{currentUser?.is_superuser ? "مدیر کل" : "کاربر"}</p>
                        </div>
                        <div className="relative">
                            {fullProfilePhotoUrl ? (
                            <img src={fullProfilePhotoUrl} alt="User" className="w-10 h-10 rounded-full object-cover border border-gray-300 shadow-sm" />
                            ) : (
                            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold shadow-sm"><FaUser /></div>
                            )}
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-gray-200">
          <MainContent activeComponent={activeComponent} setActiveComponent={setActiveComponent} />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;