import React from "react";
import { useProductsByCategoryName } from "../../services/api";
import ProductCard from "./ProductCart";
import { Link } from "react-router-dom";

const ProductCategorySlider = ({
  title,
  categoryName,
  bgIconColor = "red",
}) => {
  const { products, loading } = useProductsByCategoryName(categoryName);

  if (loading || products.length === 0) return null;

  // ✅ Show only 5 products
  const limitedProducts = products.slice(0, 5);

  return (
    <div className="w-full mt-12" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-2">
        <p className="bg-gray-100 text-gray-800 border border-gray-200 shadow-sm text-sm rounded-md px-5 py-2 font-bold">
          {title}
        </p>

        <Link
          to="products"
          className={`text-sm font-bold hover:underline transition-all ${
            bgIconColor === "blue"
              ? "text-blue-500"
              : bgIconColor === "green"
                ? "text-green-500"
                : "text-red-500"
          }`}
        >
          مشاهده همه
        </Link>
      </div>

      {/* Product list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 px-2 justify-items-center">
        {limitedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductCategorySlider;
