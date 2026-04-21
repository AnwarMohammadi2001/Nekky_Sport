import React, { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserTie, FaUsers, FaUserCog } from "react-icons/fa";

// ایمپورت کامپوننت‌های فرزند
import SellerManager from "./SellerManager.jsx";
import CustomerManagement from "./CustomerManagement";

const UserManager = ({ setActiveComponent }) => {
  const { currentUser, profile } = useSelector((state) => state.user);
  
  // تشخیص نقش (با استفاده از داده‌های دقیق بک‌اند)
  const isAdmin = useMemo(() => {
    const user = { ...profile, ...currentUser };
    return user.is_superuser === true || user.role === "ADMIN";
  }, [currentUser, profile]);

  // اگر ادمین نبود، حتما تب customers انتخاب شود
  const [activeTab, setActiveTab] = useState(isAdmin ? "sellers" : "customers");

  useEffect(() => {
      if (!isAdmin && activeTab === "sellers") {
          setActiveTab("customers");
      }
  }, [isAdmin, activeTab]);

  const tabs = useMemo(() => {
    const items = [];
    
    // فقط ادمین حق دیدن تب فروشندگان را دارد
    if (isAdmin) {
      items.push({ 
        id: "sellers", 
        name: "مدیریت کارمندان (فروشندگان)", 
        icon: <FaUserTie />,
        desc: "ایجاد حساب کاربری برای کارمندان جدید"
      });
    }

    items.push({ 
      id: "customers", 
      name: isAdmin ? "لیست  مشتریان" : "مدیریت مشتریان ", 
      icon: <FaUsers />,
      desc: isAdmin ? "مشاهده همه مشتریان " : "مشتریان  "
    });

    return items;
  }, [isAdmin]);

  return (
    <div className="min-h-screen bg-gray-50 p-5 rounded-md sm:p-6" dir="rtl">
      <div className="mb-6 flex items-center gap-4 bg-white  border-gray-100">
        <div className="bg-black p-3 rounded-md text-white shadow-lg">
          <FaUserCog size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
             {isAdmin ? "  مدیریت کارمندان و  مشتریان" : "پنل مشتریان"}
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            {isAdmin ? "کنترل دسترسی‌ها و مدیریت حساب‌های کاربری" : "مدیریت و پیگیری مشتریان شما"}
          </p>
        </div>
      </div>

      {tabs.length > 1 && (
        <div className="flex gap-4 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={` flex flex-col items-center justify-center py-2 px-5   transition-all ${
                activeTab === tab.id
                  ? "bg-white  border-b-2 text-cyan-700 border-cyan-700 ring-cyan-700 "
                  : "bg-white hover:bg-gray-200  hover:border-b-2 border-gray-300 text-gray-500 "
              }`}
            >
              <div className="flex items-center  gap-2 font-bold text-lg mb-1">
                  {tab.icon} <span>{tab.name}</span>
              </div>
              
            </button>
          ))}
        </div>
      )}

      <div className=" p-1 min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="h-full"
          >
            {activeTab === "sellers" && isAdmin && <SellerManager />}
            {activeTab === "customers" && <CustomerManagement setActiveComponent={setActiveComponent} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UserManager;