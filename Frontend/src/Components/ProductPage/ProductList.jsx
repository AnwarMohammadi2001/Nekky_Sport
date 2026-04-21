import React, { useMemo } from "react";
import ProductCard from "../product/ProductCart";
import { Loader2, PackageSearch } from "lucide-react";
import ProductCardSkeleton from "../ProductCardSkeleton";

const ProductList = ({ products, isLoading, viewMode }) => {
  // اطمینان از اینکه ورودی همیشه آرایه است
  const safeProducts = useMemo(() => {
    if (!products) return [];
    if (Array.isArray(products)) return products;
    if (products.results && Array.isArray(products.results))
      return products.results;
    return [];
  }, [products]);

  if (isLoading && safeProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-40 w-full">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-red-600 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center font-black text-[10px]">
            SGC
          </div>
        </div>
        <p className="mt-6 text-gray-500 font-black animate-pulse tracking-widest">
          در حال فراخوانی محصولات ویترین...
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full pb-10 animate-fadeIn">
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-content-center place-items-center gap-2 md:gap-5"
              : "flex flex-col gap-3"
          }
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-10 animate-fadeIn">
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-content-center place-items-center  gap-2 md:gap-5"
            : "flex flex-col gap-3"
        }
      >
        {safeProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
