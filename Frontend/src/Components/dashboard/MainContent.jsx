import React from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";


import ProductSetup from "./pages/ProductStructure"; 
import UserManager from "./pages/UserManager";
import CustomerWallet from "./pages/CustomerWallet";
import PurchaseManagement from "./pages/PurchaseManagement";
import SellerDistribution from "./pages/SellerDistribution";
import ReceivedGoods from "./pages/ReceivedGoods";
import StockManagement from "./pages/StockManagement";
import SalesManagement from "./pages/SalesManagement";
import ExpensesManagement from "./pages/ExpensesManagement";
import Reporting from "./pages/Reporting";
import Profile from "../../Pages/dashboard/Profiles";

// CMS Pages
import WebSliderManager from "../../Pages/website/WebSliderManager";
import WebCategoryManager from "../../Pages/website/WebCategoryManager";
import WebProductManager from "../../Pages/website/WebProductManager";
import WebDownloadManager from "../../Pages/website/WebDownloadManager";
import WebBranchManager from "../../Pages/website/WebBranchManager";

// ✅ وارد کردن گیت امنیتی
import SecurityGate from "../common/SecurityGate";

const MainContent = ({ activeComponent, setActiveComponent }) => {
  const { profile, currentUser } = useSelector((state) => state.user);
  
  const isStrictAdmin = 
    currentUser?.is_superuser === true || 
    currentUser?.role === "ADMIN" || 
    profile?.role === "ADMIN";

  const renderComponent = () => {
    switch (activeComponent) {
      case "dashboard_home": return isStrictAdmin ? <Reporting activityType="general" /> : <SalesManagement />;
      
      case "product_setup": return <ProductSetup />;
      case "user_manager": return <UserManager setActiveComponent={setActiveComponent} />;
      case "customer_wallet": return <CustomerWallet setActiveComponent={setActiveComponent} />;
      
      case "purchase_orders": 
        return (
          <SecurityGate sectionName="مدیریت خرید و تدارکات">
            <PurchaseManagement />
          </SecurityGate>
        );

      case "seller_dist": return <SellerDistribution />;
      case "received_goods": return <ReceivedGoods />;
      case "stockmanagement": return <StockManagement />;
      
      case "salesmanagement": return <SalesManagement />;
      case "expenses": return <ExpensesManagement />;
      
      case "reporting_mobile":
        return (
            <SecurityGate sectionName="گزارشات اختصاصی بخش موبایل">
                <Reporting activityType="mobile" />
            </SecurityGate>
        );
        
      case "reporting": 
        return isStrictAdmin ? (
          <SecurityGate sectionName="گزارشات مالی و سود">
            <Reporting activityType="general" />
          </SecurityGate>
        ) : (
          <Reporting activityType="general" />
        );

      case "web_slider": return <WebSliderManager />;
      case "web_categories": return <WebCategoryManager />;
      case "web_products": return <WebProductManager />;
      case "web_downloads": return <WebDownloadManager />;
      case "web_branches": return <WebBranchManager />;

      case "profile": return <Profile />;
      
      default: return <div className="p-20 text-center text-gray-500 font-bold text-lg">صفحه مورد نظر یافت نشد.</div>;
    }
  };

  return (
    <div className="flex-1 h-full bg-gray-200 overflow-hidden relative">
      <div className="h-full overflow-y-auto overflow-x-hidden p-4 md:p-6 custom-scrollbar relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeComponent} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="h-full"
          >
            {renderComponent()}
          </motion.div>
    
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MainContent;
