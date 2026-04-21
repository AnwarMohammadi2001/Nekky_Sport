import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { signOutSuccess } from "../../state/userSlice/userSlice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  LayoutDashboard, Settings, Users, ShoppingCart, Package, Truck,
  LogOut, UserCircle, Archive, ChevronDown, ChevronLeft,
  Image as ImageIcon, Layers, Monitor, Download, MapPin, CreditCard,
  Smartphone
} from "lucide-react";
import { FaMoneyBillWave } from "react-icons/fa";

const Sidebar = ({ setActiveComponent, activeComponent }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  // فقط گروه داشبورد باز باشد
  const [openGroups, setOpenGroups] = useState({
    "داشبورد": true, 
  });

  const { currentUser, profile } = useSelector((state) => state.user);

  const userRoleInfo = useMemo(() => {
    const user = { ...profile, ...currentUser };
    const isSuperAdmin = user.is_superuser === true || user.role === "ADMIN";
    const isContentManager = user.is_content_manager === true || user.role === "CONTENT_MANAGER";
    const isSeller = !isSuperAdmin && !isContentManager && (user.is_staff === true || user.role === "SELLER");
    return { isSuperAdmin, isSeller, isContentManager };
  }, [currentUser, profile]);

  const { isSuperAdmin, isSeller, isContentManager } = userRoleInfo;

  const handleSignOut = () => {
    MySwal.fire({
      title: "خروج از سیستم؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "بله، خروج",
      cancelButtonText: "انصراف",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#000000",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(signOutSuccess());
        navigate("/sign-in");
      }
    });
  };

  const toggleGroup = (groupName) => {
    setOpenGroups((prev) => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  const menuItems = [
    {
      group: "گزارشات عمومی",
      items: [
        { name: " بخش مالی و گزارشات", value: "reporting", icon: <LayoutDashboard size={20} />, show: isSuperAdmin },
         { name: "گزارشات بخش موبایل", value: "reporting_mobile", icon: <Smartphone size={20} />, show: isSuperAdmin||isSeller },
        { name: "گزارشات گدام", value: "stockmanagement", icon: <Layers size={20} />, show: isSeller || isSuperAdmin },
      ], 
    },
    {
      group: "مدیریت حسابداری   ",
      items: [
       
        { name: "فروشنده و مشتریان", value: "user_manager", icon: <Users size={20} />, show: isSuperAdmin || isSeller},
      ],
    },
    {
      group: " مدیریت ورود و خروج  ",
      items: [
        { name: "خرید اجناس", value: "purchase_orders", icon: <Package size={20} />, show: isSuperAdmin },
        { name: "  فروش اجناس", value: "salesmanagement", icon: <ShoppingCart size={20} />, show: isSeller || isSuperAdmin },
        { name: " انتفال به شبعه ها ", value: "seller_dist", icon: <Truck size={20} />, show: isSuperAdmin },
        { name: "اجناس  دریافتی", value: "received_goods", icon: <Archive size={20} />, show: isSeller },
        
      ],
    },
    {
      group: " مصارف ",
      items: [
        // { name: isSeller ? "مشتریان و حساب‌ها" : " کل مشتریان", value: "user_manager", icon: <Users size={20} />, show: true },
        { name: "مدیریت مصارف", value: "expenses", icon: <FaMoneyBillWave size={20} />, show: isSeller || isSuperAdmin },
      ],
    },
    {
      group: "مدیریت وب‌سایت ",
      items: [
        { name: "اسلایدر صفحه اصلی", value: "web_slider", icon: <ImageIcon size={20} />, show: isContentManager },
        { name: "دسته‌بندی‌های سایت", value: "web_categories", icon: <Layers size={20} />, show: isContentManager },
        { name: "مدیریت محصولات وبسایت", value: "web_products", icon: <Monitor size={20} />, show: isContentManager },
        { name: "مرکز دانلود", value: "web_downloads", icon: <Download size={20} />, show: isContentManager },
        { name: "مدیریت شعبات", value: "web_branches", icon: <MapPin size={20} />, show: isContentManager },
      ],
    },
    {
      group: "حساب کاربری",
      items: [
         { name: "مدیریت محصولات", value: "product_setup", icon: <Settings size={20} />, show: isSuperAdmin },
        { name: "پروفایل من", value: "profile", icon: <UserCircle size={20} />, show: true },
        { name: "خروج از سیستم", value: "signout", icon: <LogOut size={20} />, show: true },
      ],
    },
  ];

  return (
    <div className="h-screen w-20 lg:w-72 bg-white border-l border-gray-200 flex flex-col shadow-2xl z-20" dir="rtl">
      {/* Header */}
      <div className="px-6 py-5 border-b flex items-center gap-4 bg-white">
        <img src="/sdf.png" alt="Logo" className="h-12 object-contain" />
        <div>
          <p className="text-xl text-gray-900 font-black tracking-tight"> سعادت گروپ</p>
          <p className="text-xs text-gray-500">  داشبورد مدیریتی</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {menuItems.map((group, groupIdx) => {
          const visibleItems = group.items.filter((i) => i.show);
          if (visibleItems.length === 0) return null;
          
          const isOpen = !!openGroups[group.group];

          return (
            <div key={groupIdx} className="border-b border-gray-100 last:border-0 pb-2">
              <div
                className={`hidden lg:flex items-center justify-between px-3 py-3 text-sm cursor-pointer rounded-lg transition-all duration-200 select-none
                ${isOpen ? "text-gray-900 bg-gray-50 font-bold" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
                onClick={() => toggleGroup(group.group)}
              >
                <span className="text-base">{group.group}</span>
                {isOpen ? <ChevronDown size={18} /> : <ChevronLeft size={18} />}
              </div>

              <div className={`space-y-1 overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[500px] opacity-100 mt-2" : "max-h-0 opacity-0"}`}>
                {visibleItems.map((item, idx) => {
                  const isActive = activeComponent === item.value;
                  return (
                    <button
                      key={idx}
                      onClick={() => item.value === "signout" ? handleSignOut() : setActiveComponent(item.value)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative
                        ${isActive ? "bg-black text-white shadow-lg transform scale-105 font-bold" : "text-gray-600 hover:bg-gray-100 hover:text-black"}
                      `}
                    >
                      <span className={`${isActive ? "text-white" : "text-gray-500 group-hover:text-black"}`}>{item.icon}</span>
                      <span className="text-base hidden lg:inline font-medium">{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
    </div>
  );
};
export default Sidebar;