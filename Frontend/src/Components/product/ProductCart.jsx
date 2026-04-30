import React, { useState, useEffect, useMemo } from "react";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const ProductCart = ({ product }) => {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [currentImage, setCurrentImage] = useState("");

  // Helper function to get image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/placeholder.png";
    if (imagePath.startsWith("http")) return imagePath;

    let normalizedPath = imagePath.replace(/\\/g, "/");
    normalizedPath = normalizedPath.replace(/\/+/g, "/");

    if (normalizedPath.startsWith("uploads/")) {
      return `${BASE_URL}/${normalizedPath}`;
    }
    if (normalizedPath.startsWith("/uploads/")) {
      return `${BASE_URL}${normalizedPath}`;
    }
    return `${BASE_URL}/uploads/${normalizedPath}`;
  };

  // Extract product data from different possible structures
  const productData = useMemo(() => {
    return {
      id: product?.id || null,
      name: product?.name || product?.title || "بدون نام",
      price: product?.price || 0,
      oldPrice: product?.old_price || product?.oldPrice || null,
      stock: product?.stock || product?.inventory || 0,
      description: product?.description || "",
      categoryId: product?.categoryId,
      categoryName:
        product?.Category?.name || product?.category_name || "بدون دسته",
      images: product?.ProductImages || [],
      attributes: product?.ProductAttributeValues || [],
      isNew: product?.is_new || product?.isNew || false,
      createdAt: product?.createdAt || product?.created_at,
    };
  }, [product]);

  // Check if product is in stock
  const isInStock = productData.stock > 0;

  // Calculate discount percentage
  const hasDiscount =
    productData.oldPrice &&
    Number(productData.oldPrice) > Number(productData.price);
  const discountPercent = hasDiscount
    ? Math.round(
        ((Number(productData.oldPrice) - Number(productData.price)) /
          Number(productData.oldPrice)) *
          100,
      )
    : 0;

  // Get main image
  useEffect(() => {
    if (productData.images && productData.images.length > 0) {
      const mainImage = productData.images[0];
      const imageUrl = mainImage.imageUrl || mainImage.url || mainImage;
      setCurrentImage(getImageUrl(imageUrl));
    } else if (product?.image) {
      setCurrentImage(getImageUrl(product.image));
    } else if (product?.imageUrl) {
      setCurrentImage(getImageUrl(product.imageUrl));
    } else {
      setCurrentImage("/placeholder.png");
    }
  }, [product, productData.images]);

  // Check if product is in wishlist
  useEffect(() => {
    try {
      const savedWishlist = JSON.parse(
        localStorage.getItem("wishlist") || "[]",
      );
      setIsWishlisted(savedWishlist.some((item) => item.id === productData.id));
    } catch (error) {
      console.error("Error loading wishlist:", error);
      setIsWishlisted(false);
    }
  }, [productData.id]);

  // Toggle wishlist
  const toggleWishlist = (e) => {
    e.stopPropagation();
    try {
      let savedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

      if (isWishlisted) {
        savedWishlist = savedWishlist.filter(
          (item) => item.id !== productData.id,
        );
        toast.error("از لیست علاقه‌مندی‌ها حذف شد");
      } else {
        savedWishlist.push({
          id: productData.id,
          name: productData.name,
          price: productData.price,
          image: currentImage,
          stock: productData.stock,
        });
        toast.success("به لیست علاقه‌مندی‌ها اضافه شد");
      }

      localStorage.setItem("wishlist", JSON.stringify(savedWishlist));
      setIsWishlisted(!isWishlisted);
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast.error("خطا در به‌روزرسانی لیست علاقه‌مندی‌ها");
    }
  };

  // Handle add to cart
  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isInStock) {
      toast.error("این محصول در حال حاضر موجود نیست");
      return;
    }

    // Get current cart from localStorage
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item) => item.id === productData.id);

    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
      toast.success(
        `${productData.name} به سبد خرید اضافه شد (تعداد: ${existingItem.quantity})`,
      );
    } else {
      cart.push({
        id: productData.id,
        name: productData.name,
        price: productData.price,
        image: currentImage,
        quantity: 1,
        stock: productData.stock,
      });
      toast.success(`${productData.name} به سبد خرید اضافه شد`);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  };

  // Navigate to product detail
  const handleCardClick = () => {
    navigate(`/product/${productData.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white border border-gray-200 rounded-lg w-[270px] h-[380px] hover:shadow-xl transition-all duration-500 cursor-pointer group relative overflow-hidden flex flex-col shadow-sm hover:-translate-y-1"
    >
      {/* Badges */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
        {productData.isNew && (
          <span className="bg-black text-white text-[10px] font-black px-3 py-1 rounded-full shadow-sm">
            جدید
          </span>
        )}
        {hasDiscount && discountPercent > 0 && (
          <span className="bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-sm">
            {discountPercent}% تخفیف
          </span>
        )}
      </div>

      {/* Image Section */}
      <div className="h-48 flex items-center justify-center border-b border-gray-200 bg-gray-50 p-4 relative overflow-hidden">
        <img
          src={currentImage}
          alt={productData.name}
          className="max-h-full w-full object-contain group-hover:scale-110 transition-transform duration-700"
          onError={(e) => {
            e.target.src = "/placeholder.png";
          }}
        />

        {/* Out of stock overlay */}
        {!isInStock && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
            <span className="bg-red-600 text-white font-black px-4 py-2 rounded-xl rotate-[-15deg] shadow-lg text-sm">
              ناموجود
            </span>
          </div>
        )}

        {/* Quick view button on hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className="bg-white p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors"
          >
            <Eye size={18} />
          </button>
        </div>
      </div>

      {/* Product Info Section */}
      <div className="flex-1 flex flex-col px-4 pt-3 pb-4">
        {/* Product title */}
        <h4 className="font-semibold text-sm text-gray-800 line-clamp-2 mb-2 leading-5 group-hover:text-red-600 transition-colors min-h-[40px]">
          {productData.name}
        </h4>
        <h4 className="font-semibold text-sm text-gray-800 line-clamp-2 mb-2 leading-5 group-hover:text-red-600 transition-colors min-h-[40px]">
          {productData.description}
        </h4>

        {/* Stock status */}
        <div className="mb-2">
          {isInStock ? (
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-green-600 font-bold">
                موجود در انبار
              </span>
              {/* {productData.stock < 10 && (
                <span className="text-[9px] text-orange-500">
                  (تنها {productData.stock} عدد)
                </span>
              )} */}
            </div>
          ) : (
            <span className="text-[10px] text-red-500 font-bold">ناموجود</span>
          )}
        </div>

        {/* Price & Wishlist */}
        <div className="mt-auto flex justify-between items-center pt-2 border-t border-gray-100">
          <div className="flex flex-col">
            <span className="text-black font-black text-lg flex items-center gap-1">
              {Number(productData.price).toLocaleString()}
              <small className="text-xs font-bold text-gray-500">AF</small>
            </span>
            {hasDiscount && (
              <span className="text-[10px] text-gray-400 line-through">
                {Number(productData.oldPrice).toLocaleString()} AF
              </span>
            )}
          </div>

          <div className="flex gap-1">
            {/* Wishlist button */}
            <button
              onClick={toggleWishlist}
              className={`p-2 rounded-md transition-all duration-300 ${
                isWishlisted
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:text-red-500"
              }`}
              title={
                isWishlisted
                  ? "حذف از علاقه‌مندی‌ها"
                  : "افزودن به علاقه‌مندی‌ها"
              }
            >
              <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCart;
