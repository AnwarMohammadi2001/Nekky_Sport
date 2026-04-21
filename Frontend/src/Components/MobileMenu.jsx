import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { MdKeyboardArrowDown } from "react-icons/md";

const mobileMenuVariants = {
  hidden: { x: "100%" },
  visible: { x: 0, transition: { duration: 0.3, ease: "easeInOut" } },
  exit: { x: "100%", transition: { duration: 0.2, ease: "easeIn" } },
};

const submenuVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: {
    height: "auto",
    opacity: 1,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.2, ease: "easeInOut" },
  },
};

const MobileMenu = ({ isMobileMenuOpen, setMobileMenuOpen, navbarItems }) => {
  const navigate = useNavigate();
  const [activeMobileMenu, setActiveMobileMenu] = useState(null);
  const [mobileCategories, setMobileCategories] = useState([
    { id: 1, name: "گوشی‌های هوشمند" },
    { id: 2, name: "لوازم جانبی موبایل" },
    { id: 3, name: "شارژر و کابل" },
    { id: 4, name: "کیف و کاور" },
    { id: 5, name: "پرینترهای لیزری" },
    { id: 6, name: "پرینترهای جوهرافشان" },
    { id: 7, name: "تونر و کارتریج" },
    { id: 8, name: "کیبورد و ماوس" },
    { id: 9, name: "هدفون و هندزفری" },
    { id: 10, name: "سیم و کابل" },
    { id: 11, name: "سیم ظرف‌شویی صنعتی" },
    { id: 12, name: "سیم ظرف‌شویی خانگی" },
  ]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Clean up on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const toggleMobileSubmenu = (itemName) => {
    if (activeMobileMenu === itemName) {
      setActiveMobileMenu(null);
    } else {
      setActiveMobileMenu(itemName);
    }
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/?category=${encodeURIComponent(categoryName.toLowerCase())}`);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setMobileMenuOpen(false)}
        className="fixed inset-0 bg-black/50 z-50"
      />
      <motion.div
        variants={mobileMenuVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white  z-50 border-r border-indigo-100 overflow-y-auto"
      >
        <div className="flex justify-between bg-gray-200 items-center p-6">
          <img src="sdf.png" alt="logo" className="h-10" />
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1 text-cyan-800 hover:text-indigo-900"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col space-y-2 py-6">
          {navbarItems.map((item, index) => {
            const isActive = activeMobileMenu === item.name;

            return (
              <div
                key={index}
                className="border-b border-gray-100 last:border-b-0"
              >
                <div
                  className="flex items-center justify-between px-5 text-gray-700 hover:text-cyan-800  py-3 bg-gray-50 hover:bg-gray-100 transition-colors duration-150 cursor-pointer"
                  onClick={() => {
                    if (item.isMegaMenu) {
                      toggleMobileSubmenu(item.name);
                    } else {
                      navigate(item.path);
                      setMobileMenuOpen(false);
                    }
                  }}
                >
                  <span className="font-medium">{item.name}</span>

                  {item.isMegaMenu ? (
                    <span className="text-indigo-600">
                      {isActive ? (
                        <Minus size={18} className="text-indigo-600" />
                      ) : (
                        <Plus size={18} className="text-indigo-600" />
                      )}
                    </span>
                  ) : (
                    <span className="text-gray-400 text-sm rotate-180">→</span>
                  )}
                </div>

                {/* Submenu for mega menu items */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      variants={submenuVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="overflow-hidden"
                    >
                      <div className="pl-6 pr-4 py-3 bg-white border-l-2 border-indigo-200">
                        <div className="mb-2">
                          <h4 className="text-sm font-semibold text-gray-700 mb-3">
                            دسته‌بندی‌های {item.name}
                          </h4>
                          <div className="grid grid-cols-1 gap-2">
                            {mobileCategories
                              .filter((_, idx) => {
                                // نمایش دسته‌های مختلف برای هر آیتم
                                if (item.name === "مبایل") return idx < 4;
                                if (item.name === "پرنتر")
                                  return idx >= 4 && idx < 8;
                                if (item.name === "پرزه جات")
                                  return idx >= 8 && idx < 10;
                                if (item.name === "سیم ظرف شویی")
                                  return idx >= 10;
                                return false;
                              })
                              .map((category) => (
                                <div
                                  key={category.id}
                                  onClick={() =>
                                    handleCategoryClick(category.name)
                                  }
                                  className="flex items-center justify-between text-gray-600 hover:text-indigo-700 px-3 py-2 rounded-md hover:bg-indigo-50 transition-colors cursor-pointer"
                                >
                                  <span className="text-sm">
                                    {category.name}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    →
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>

                        {/* View all link */}
                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <div
                            onClick={() => {
                              navigate(item.path);
                              setMobileMenuOpen(false);
                            }}
                            className="flex items-center justify-center text-indigo-700 hover:text-indigo-900 font-medium text-sm px-3 py-2 rounded-md hover:bg-indigo-100 transition-colors cursor-pointer"
                          >
                            مشاهده همه محصولات {item.name}
                            <span className="mr-2">←</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>
      </motion.div>
    </>
  );
};

export default MobileMenu;
