import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    FaBuilding, FaCogs, FaWarehouse, FaBox, FaSitemap 
} from "react-icons/fa";

import CategoryManagement from "./categoryManager";
import AttributeManager from "./attribute";
import ProductManager from "./ProductManager";
import ProductList from "./ProductList";
import WarehouseManagement from "./Warehouse";

const ProductSetup = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [viewMode, setViewMode] = useState("list"); 
  const [editData, setEditData] = useState(null); // ✅ ذخیره محصول برای ویرایش

  const tabs = [
    { id: "products", name: "مدیریت محصولات", icon: <FaBox />, desc: "لیست کالاها و ثبت محصول جدید." },
    { id: "category", name: " تعریف کمپنی", icon: <FaBuilding />, desc: "تعریف برندها و ابزارها." },
    { id: "attribute", name: " تعریف ویژگی‌ها", icon: <FaCogs />, desc: "مشخصات فنی ابزارها." },
    { id: "warehouse", name: " مدیریت گدام", icon: <FaWarehouse />, desc: "تنظیم انبارها." },
  ];

  const handleEditProduct = (product) => {
    setEditData(product);
    setViewMode("form"); // تغییر حالت به فرم
  };

  const handleAddNewProduct = () => {
    setEditData(null); // چون محصول جدید است، دیتای قبلی پاک شود
    setViewMode("form");
  };

  return (
    <div className="bg-white rounded-md overflow-y-auto p-5" dir="rtl">
      <div className="flex items-center gap-4 bg-white rounded-md border-gray-100">
        <div className="bg-black p-2 rounded-md text-white shadow-lg">
          <FaSitemap size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">مدیریت جامع سیستم</h1>
          <p className="text-gray-500 mt-1 text-sm">کنترل مرکزی کالاها، انبار و تنظیمات پایه</p>
        </div>
      </div>

      <div className="flex overflow-x-auto py-4 gap-3 mb-6 no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
                setActiveTab(tab.id);
                setEditData(null);
                if(tab.id === 'products') setViewMode('list');
            }}
            className={`flex items-center justify-center gap-x-2 px-4 py-3 min-w-[140px] rounded-md transition-all duration-300 border-2 ${
              activeTab === tab.id
                ? "bg-cyan-700 border-cyan-700 shadow-lg text-gray-50 ring-1 ring-indigo-100"
                : "bg-white border-transparent hover:border-gray-300 text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span className={`${activeTab === tab.id ? "text-gray-50" : "text-gray-600"}`}>{tab.icon}</span>
            <span className="font-bold text-sm text-center">{tab.name}</span>
          </button>
        ))}
      </div>

      <div className="bg-gray-100 rounded-md border-gray-100 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + viewMode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {activeTab === "products" && (
                <div>
                    {viewMode === "list" ? (
                        <ProductList onAddNew={handleAddNewProduct} onEdit={handleEditProduct} />
                    ) : (
                        <ProductManager 
                            initialData={editData} // ✅ پاس دادن دیتا به فرم
                            onSuccess={() => setViewMode("list")} 
                            onCancel={() => setViewMode("list")} 
                        />
                    )}
                </div>
            )}
            {activeTab === "category" && <CategoryManagement />}
            {activeTab === "attribute" && <AttributeManager />}
            {activeTab === "warehouse" && <WarehouseManagement />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProductSetup;