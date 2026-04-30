import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProduct, getProducts, searchProducts } from "../../api/api";
import ProductCard from "../../Components/product/ProductCart";
import {
  ShoppingCart,
  Loader2,
  ChevronLeft,
  ShieldCheck,
  Package,
  RotateCcw,
} from "lucide-react";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [openDropdowns, setOpenDropdowns] = useState({});

  // Get product detail
  const {
    data: productResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["productDetail", id],
    queryFn: () => getProduct(id),
    enabled: !!id,
  });

  // Extract product data
  const product = useMemo(() => {
    if (!productResponse) return null;
    if (productResponse.data) return productResponse.data;
    if (productResponse.product) return productResponse.product;
    return productResponse;
  }, [productResponse]);

  // Get related products based on category
  const { data: relatedProductsResponse } = useQuery({
    queryKey: ["relatedProducts", product?.categoryId],
    queryFn: () => {
      if (product?.categoryId) {
        return searchProducts({ categoryId: product.categoryId, limit: 6 });
      }
      return getProducts();
    },
    enabled: !!product?.categoryId,
  });

  const relatedProducts = useMemo(() => {
    if (!relatedProductsResponse) return [];

    let productsList = [];

    if (
      relatedProductsResponse.data &&
      Array.isArray(relatedProductsResponse.data)
    ) {
      productsList = relatedProductsResponse.data;
    } else if (
      relatedProductsResponse.data &&
      relatedProductsResponse.data.data &&
      Array.isArray(relatedProductsResponse.data.data)
    ) {
      productsList = relatedProductsResponse.data.data;
    } else if (Array.isArray(relatedProductsResponse)) {
      productsList = relatedProductsResponse;
    } else if (relatedProductsResponse.results) {
      productsList = relatedProductsResponse.results;
    }

    return productsList.filter((item) => item.id != id).slice(0, 6);
  }, [relatedProductsResponse, id]);

  // Get image URL helper
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

  // Set current image when product loads
  useEffect(() => {
    if (product) {
      const mainImage =
        product.image ||
        product.imageUrl ||
        (product.ProductImages && product.ProductImages[0]?.imageUrl) ||
        "/placeholder.png";
      setCurrentImage(getImageUrl(mainImage));
    }
  }, [product]);

  // Handle attribute selection for dynamic attributes
  const handleAttributeChange = (
    attributeId,
    value,
    isMultiple = false,
    currentValues = [],
  ) => {
    if (isMultiple) {
      let newValues;
      if (currentValues.includes(value)) {
        newValues = currentValues.filter((v) => v !== value);
      } else {
        newValues = [...currentValues, value];
      }
      setSelectedAttributes((prev) => ({
        ...prev,
        [attributeId]: newValues,
      }));
    } else {
      setSelectedAttributes((prev) => ({
        ...prev,
        [attributeId]: value,
      }));
    }
  };

  // Toggle dropdown for custom select
  const toggleDropdown = (attrId) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [attrId]: !prev[attrId],
    }));
  };

  // Get attribute values as array for badge display
  const getAttributeValuesArray = (value) => {
    if (!value) return [];

    if (Array.isArray(value)) {
      return value;
    }

    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return [value];
      }
    }

    return [value];
  };

  // Get color for attribute badges
  const getBadgeColor = (attributeName) => {
    const colors = {
      رنگ: "bg-pink-100 text-pink-800 border-pink-200",
      سایز: "bg-blue-100 text-blue-800 border-blue-200",
      برند: "bg-green-100 text-green-800 border-green-200",
      color: "bg-pink-100 text-pink-800 border-pink-200",
      size: "bg-blue-100 text-blue-800 border-blue-200",
      brand: "bg-green-100 text-green-800 border-green-200",
    };
    return (
      colors[attributeName?.toLowerCase()] ||
      "bg-indigo-100 text-indigo-800 border-indigo-200"
    );
  };

  // Get product specs from attributes - READ ATTRIBUTE NAME from attr.Attribute.name
  const productSpecs = useMemo(() => {
    if (!product?.ProductAttributeValues) return [];

    console.log("Raw ProductAttributeValues:", product.ProductAttributeValues);

    return product.ProductAttributeValues.map((attr) => {
      const values = getAttributeValuesArray(attr.value);

      // Try multiple possible paths for attribute name
      let attributeName = "ویژگی";

      // Case 1: attr.Attribute.name (most common)
      if (attr.Attribute?.name) {
        attributeName = attr.Attribute.name;
      }
      // Case 2: attr.attribute?.name (lowercase a)
      else if (attr.attribute?.name) {
        attributeName = attr.attribute.name;
      }
      // Case 3: attr.attributeName (direct property)
      else if (attr.attributeName) {
        attributeName = attr.attributeName;
      }
      // Case 4: attr.name (direct property)
      else if (attr.name) {
        attributeName = attr.name;
      }

      console.log(
        `Attribute ${attr.attributeId}: name = "${attributeName}", values =`,
        values,
      );

      return {
        id: attr.id,
        attributeId: attr.attributeId,
        name: attributeName,
        values: values,
        type: attr.Attribute?.type || attr.type || "text",
        options: attr.Attribute?.AttributeOptions || attr.options || [],
        allowMultiple:
          attr.Attribute?.allowMultiple || attr.allowMultiple || false,
      };
    });
  }, [product]);

  // Debug: Log product specs to see if Attribute name is being read
  useEffect(() => {
    if (productSpecs.length > 0) {
      console.log("Final Product Specs with Attribute Names:", productSpecs);
    }
  }, [productSpecs]);

  // Get gallery images
  const galleryImages = useMemo(() => {
    if (!product?.ProductImages) return [];
    return product.ProductImages.map((img) => getImageUrl(img.imageUrl));
  }, [product]);

  const handleAddToCart = () => {
    setShowModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center mt-[153px] justify-center">
        <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
        <p className="font-bold text-gray-500">در حال دریافت جزئیات محصول...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-20 mt-[153px]">
        <h2 className="text-2xl font-bold text-gray-900">محصول یافت نشد</h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-black text-white px-6 py-2 rounded-xl hover:bg-gray-800 transition"
        >
          بازگشت
        </button>
      </div>
    );
  }

  return (
    <div
      className="bg-white font-vazir mt-[85px] md:mt-[155px] pb-20"
      dir="rtl"
    >
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-3 px-8 border-b">
        <div className="container mx-auto flex items-center gap-2 text-sm text-gray-500">
          <span
            className="cursor-pointer hover:text-black transition"
            onClick={() => navigate("/")}
          >
            خانه
          </span>
          <ChevronLeft size={14} />
          <span
            className="cursor-pointer hover:text-black transition"
            onClick={() => navigate(`/products?category=${product.categoryId}`)}
          >
            {product.Category?.name || "دسته بندی"}
          </span>
          <ChevronLeft size={14} />
          <span className="text-black font-bold">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12">
          {/* Image Gallery */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex md:flex-row lg:flex-col gap-4 overflow-x-auto md:overflow-y-auto py-2 order-2 md:order-1">
              <img
                src={getImageUrl(
                  product.image || product.ProductImages?.[0]?.imageUrl,
                )}
                onClick={() =>
                  setCurrentImage(
                    getImageUrl(
                      product.image || product.ProductImages?.[0]?.imageUrl,
                    ),
                  )
                }
                className={`w-20 h-20 rounded-xl border-2 cursor-pointer p-1 object-cover ${
                  currentImage ===
                  getImageUrl(
                    product.image || product.ProductImages?.[0]?.imageUrl,
                  )
                    ? "border-red-500"
                    : "border-transparent"
                }`}
                alt={product.name}
              />

              {galleryImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  onClick={() => setCurrentImage(img)}
                  className={`w-20 h-20 rounded-xl border-2 cursor-pointer p-1 object-cover ${
                    currentImage === img
                      ? "border-red-500"
                      : "border-transparent"
                  }`}
                  alt={`${product.name} ${index + 1}`}
                />
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 aspect-square w-full overflow-hidden rounded-md border flex items-center justify-center p-6 bg-gray-50 order-1 md:order-2">
              <img
                src={currentImage}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  e.target.src = "/placeholder.png";
                }}
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="mt-10 lg:mt-0">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              {product.Category && (
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                  {product.Category.name}
                </span>
              )}
              {product.stock > 0 ? (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                  موجود در انبار
                </span>
              ) : (
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
                  ناموجود
                </span>
              )}
              {product.is_new && (
                <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-bold">
                  جدید
                </span>
              )}
            </div>

            <h1 className="text-3xl font-black text-gray-900 mb-6">
              {product.name}
            </h1>

            {/* Price Section */}
            <div className="bg-gray-50 p-6 rounded-md border border-gray-100 mb-8">
              <div className="flex items-center gap-4 mb-4 flex-wrap">
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

              {product.stock > 0 && product.stock < 10 && (
                <p className="text-orange-600 text-sm mt-2">
                  تنها {product.stock} عدد در انبار باقی مانده است
                </p>
              )}

              {product.description && (
                <p className="text-gray-600 leading-8 text-justify mt-4">
                  {product.description}
                </p>
              )}
            </div>

            {/* Product Specifications - Display attribute names and values as badges */}
            {productSpecs.length > 0 && (
              <div className="mb-10">
                <h3 className="font-bold text-lg mb-4 border-r-4 border-red-500 pr-3">
                  مشخصات فنی:
                </h3>
                <div className="space-y-4">
                  {productSpecs.map((spec, index) => (
                    <div key={index} className="flex flex-col gap-2">
                      <span className="text-sm font-bold text-gray-700">
                        {spec.name}:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {spec.values.map((value, valueIdx) => (
                          <span
                            key={valueIdx}
                            className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium border ${getBadgeColor(spec.name)}`}
                          >
                            {value}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* If no specifications found */}
            {productSpecs.length === 0 && (
              <div className="mb-10">
                <h3 className="font-bold text-lg mb-4 border-r-4 border-red-500 pr-3">
                  مشخصات فنی:
                </h3>
                <p className="text-gray-500 text-center py-8">
                  هیچ مشخصه‌ای برای این محصول ثبت نشده است.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="container mx-auto px-4 mt-12">
          <h2 className="text-2xl text-center font-black mb-8">
            محصولات مرتبط
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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

      {/* Modal */}
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
              className="absolute top-4 left-4 text-gray-400 hover:text-black text-xl transition"
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
