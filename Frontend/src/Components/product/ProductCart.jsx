import React, { useState, useEffect } from "react";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const ProductCart = ({ product }) => {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);

  // ۱. بررسی اینکه آیا این محصول در لیست علاقه‌مندی‌ها هست یا خیر
  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setIsWishlisted(savedWishlist.some((item) => item.id === product.id));
  }, [product.id]);

  // ۲. محاسبه درصد تخفیف به صورت داینامیک
  const hasDiscount =
    product.old_price && Number(product.old_price) > Number(product.price);
  const discountPercent = hasDiscount
    ? Math.round(
        ((Number(product.old_price) - Number(product.price)) /
          Number(product.old_price)) *
          100,
      )
    : 0;

  // ۳. مدیریت لیست علاقه‌مندی‌ها (Wishlist)
  const toggleWishlist = (e) => {
    e.stopPropagation(); // جلوگیری از رفتن به صفحه جزئیات هنگام لایک
    let savedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

    if (isWishlisted) {
      savedWishlist = savedWishlist.filter((item) => item.id !== product.id);
      toast.error("از لیست علاقه‌مندی‌ها حذف شد");
    } else {
      savedWishlist.push(product);
      toast.success("به لیست علاقه‌مندی‌ها اضافه شد");
    }

    localStorage.setItem("wishlist", JSON.stringify(savedWishlist));
    setIsWishlisted(!isWishlisted);
  };

  // ۴. مدیریت افزودن به سبد خرید (نمونه اولیه)
  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!product.in_stock) {
      return toast.error("این محصول در حال حاضر موجود نیست");
    }
    toast.success(`${product.title} به سبد خرید اضافه شد`);
  };

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-white border border-gray-200 rounded-lg w-[270px] h-[380px] hover:shadow-md transition-all duration-500 cursor-pointer group relative overflow-hidden flex flex-col shadow-sm"
    >
      {/* --- Badges --- */}
      <div className="absolute top-5 left-5 z-20 flex flex-col gap-2">
        {product.is_new && (
          <span className="bg-black text-white text-[10px] font-black px-3 py-1 rounded-full shadow-sm">
            جدید
          </span>
        )}
      </div>

      {/* --- Image Section --- */}
      <div className="h-48 flex items-center justify-center border-b border-gray-200 bg-gray-50 p-4 relative overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="max-h-full w-full object-contain group-hover:scale-110 transition-transform duration-700"
        />

        {/* Out-of-stock overlay */}
        {!product.in_stock && (
          <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
            <span className="bg-white/90 border-2 border-red-600 text-red-600 font-black px-4 py-1 rounded-xl rotate-[-15deg] shadow-lg">
              ناموجود
            </span>
          </div>
        )}
      </div>

      {/* --- Product Info Section --- */}
      <div className="flex-1 flex flex-col px-4 pt-2 pb-4">
        {/* Product title */}
        <h4 className="font-semibold text-sm text-gray-700 line-clamp-2 mb-2 leading-5 group-hover:text-red-600 transition-colors">
          {product.title}
        </h4>

        {/* Category & Stock */}
        <div className="flex items-center justify-between text-sm mb-2">
          <p className="text-sm text-red-500 font-black uppercase tracking-widest">
            {product.category_name || "بدون دسته"}
          </p>
          <p className="text-sm text-green-600 font-black py-1 px-2 rounded-full uppercase tracking-widest">
            {product.in_stock ? "موجود" : "ناموجود"}
          </p>
        </div>

        {/* Price & Wishlist */}
        <div className="mt-auto flex justify-between items-center pt-2 border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-black font-black text-lg flex items-center gap-1">
              {Number(product.price).toLocaleString()}
              <small className="text-sm font-bold">AF</small>
            </span>
            {product.old_price &&
              Number(product.old_price) > Number(product.price) && (
                <span className="text-[11px] text-gray-400 line-through decoration-red-300">
                  {Number(product.old_price).toLocaleString()}
                </span>
              )}
          </div>

          <button
            onClick={toggleWishlist}
            className={`p-2.5 rounded-md shadow-md transition-all duration-300 ${
              isWishlisted
                ? "bg-red-500 text-white"
                : "bg-black backdrop-blur-sm text-gray-100 hover:text-red-500"
            }`}
          >
            <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCart;
