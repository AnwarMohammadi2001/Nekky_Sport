import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchWebProductDetail, fetchWebProducts } from "../../services/api"; // یا مسیری که api.js قرار دارد
import ProductCard from "../../Components/product/ProductCart";

import {
  ShoppingCart,
  ArrowRight,
  Star,
  Loader2,
  ChevronLeft,
  ShieldCheck,
  Package,
  RotateCcw,
} from "lucide-react";

const ProductDetailPage = () => {
  const { id } = useParams(); // گرفتن ID از آدرس مرورگر
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);

  // دریافت اطلاعات از بک‌اِند بر اساس ID
  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["productDetail", id],
    queryFn: () => fetchWebProductDetail(id),
    enabled: !!id, // فقط وقتی ID وجود دارد درخواست بزن
  });

  const { data: relatedProductsData } = useQuery({
    queryKey: ["relatedProducts"],
    queryFn: fetchWebProducts,
  });

  const relatedProducts = useMemo(() => {
    if (!relatedProductsData || !product) return [];

    const list = Array.isArray(relatedProductsData)
      ? relatedProductsData
      : relatedProductsData.results || [];

    return list
      .filter(
        (item) =>
          item.id !== product.id &&
          item.category_name === product.category_name,
      )
      .slice(0, 6);
  }, [relatedProductsData, product]);

  useEffect(() => {
    console.log("PRODUCT DETAIL 👉", product);
  }, [product]);

  useEffect(() => {
    console.log("RELATED RAW DATA 👉", relatedProductsData);
  }, [relatedProductsData]);

  useEffect(() => {
    console.log("RELATED FILTERED 👉", relatedProducts);
  }, [relatedProducts]);

  // تنظیم عکس اصلی بعد از لود شدن دیتا
  useEffect(() => {
    if (product?.image) {
      setCurrentImage(product.image);
    }
  }, [product]);

  if (isLoading)
    return (
      <div className="min-h-screen flex flex-col items-center mt-[153px] justify-center">
        <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
        <p className="font-bold text-gray-500">در حال دریافت جزئیات محصول...</p>
      </div>
    );

  if (error || !product)
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900">محصول یافت نشد</h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-black text-white px-6 py-2 rounded-xl"
        >
          بازگشت
        </button>
      </div>
    );

  return (
    <div
      className="bg-white font-vazir mt-[85px] md:mt-[155px] pb-20"
      dir="rtl"
    >
      {/* Breadcrumb (مسیر راهنما) */}
      <div className="bg-gray-50 py-3 px-8 border-b">
        <div className="container mx-auto flex items-center gap-2 text-sm text-gray-500">
          <span
            className="cursor-pointer hover:text-black"
            onClick={() => navigate("/")}
          >
            خانه
          </span>
          <ChevronLeft size={14} />
          <span>{product.category_name}</span>
          <ChevronLeft size={14} />
          <span className="text-black font-bold">{product.title}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12">
          {/* بخش تصاویر (Gallery) */}
          <div className="flex h-[500px]  gap-4">
            {/* نمایش گالری تصاویر اگر وجود داشته باشد */}
            <div className="flex flex-col gap-4 overflow-x-auto py-2">
              <img
                src={product.image}
                onClick={() => setCurrentImage(product.image)}
                className={`w-20 h-20 rounded-xl border-2 cursor-pointer p-1 ${currentImage === product.image ? "border-red-500" : "border-transparent"}`}
              />
              {product.gallery_images?.map((img) => (
                <img
                  key={img.id}
                  src={img.image}
                  onClick={() => setCurrentImage(img.image)}
                  className={`w-20 h-20 rounded-xl border-2 cursor-pointer p-1 ${currentImage === img.image ? "border-red-500" : "border-transparent"}`}
                />
              ))}
            </div>
            <div className="aspect-square w-full overflow-hidden rounded-md border flex  items-center justify-center p-6 shadow-inner">
              <img
                src={currentImage}
                alt={product.title}
                className=" h-[400px] object-contain"
              />
            </div>
          </div>

          {/* بخش اطلاعات محصول */}
          <div className="mt-10 lg:mt-0">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                {product.category_name}
              </span>
              {product.is_new && (
                <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-bold">
                  جدید
                </span>
              )}
            </div>

            <h1 className="text-3xl font-black text-gray-900 mb-6">
              {product.title}
            </h1>

            <div className="bg-gray-50 p-6 rounded-md border border-gray-100 mb-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl font-black text-red-600">
                  {Number(product.price).toLocaleString()}{" "}
                  <small className="text-sm">AF</small>
                </span>
                {product.old_price > 0 && (
                  <span className="text-xl text-gray-400 line-through">
                    {Number(product.old_price).toLocaleString()}
                  </span>
                )}
              </div>
              <p className="text-gray-600 leading-8 text-justify">
                {product.description}
              </p>
            </div>

            {/* مشخصات فنی داینامیک از JSON */}
            <div className="mb-10">
              <h3 className="font-bold text-lg mb-4 border-red-500 pr-3">
                مشخصات این محصول:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {product.specs &&
                  Object.entries(product.specs).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between p-4 bg-gray-50 rounded-md border border-gray-100"
                    >
                      <span className="text-gray-500 font-medium">{key}</span>
                      <span className="text-gray-900 font-bold">{value}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* دکمه‌های عملیاتی */}
            <div className="flex flex-col sm:flex-row gap-4 border-t pt-8">
              <div className="flex items-center border-2 rounded-md px-4 py-2 bg-white">
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="text-2xl px-2"
                >
                  +
                </button>
                <span className="px-6 font-black text-xl">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
                  className="text-2xl px-2"
                >
                  -
                </button>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="flex-1 bg-black text-white py-4 rounded-md font-black text-lg hover:bg-gray-800 transition shadow-xl flex justify-center items-center gap-2"
              >
                <ShoppingCart size={22} />
                افزودن به سبد خرید
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* محصولات مرتبط */}
      {relatedProducts.length > 0 && (
        <div className="container mx-auto px-4 mt-12">
          <h2 className="text-2xl text-center font-black mb-8">
            محصولات مرتبط
          </h2>

          <div className="grid grid-cols-1 max-w-6xl mx-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center gap-6">
            {relatedProducts.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                onClick={() => {
                  navigate(`/product/${item.id}`);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            ))}
          </div>
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-lg rounded-md shadow-2xl p-8 relative animate-fadeIn">
            <h3 className="text-2xl font-black mb-4 text-center">
              خرید آنلاین فعال نیست
            </h3>

            <p className="text-gray-600 text-center leading-7 mb-6">
              هنوز قابلیت خرید آنلاین در وب‌سایت فعال نشده است.
              <br />
              به‌زودی امکان ثبت سفارش آنلاین فراهم خواهد شد.
            </p>

            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition"
            >
              متوجه شدم
            </button>

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 left-4 text-gray-400 hover:text-black text-xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
