import React from "react";

const ProductCardSkeleton = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg w-[270px] h-[380px] overflow-hidden flex flex-col shadow-sm animate-pulse">
      {/* --- Image Skeleton --- */}
      <div className="h-48 bg-gray-200 border-b border-gray-200" />

      {/* --- Content Section --- */}
      <div className="flex-1 flex flex-col px-4 pt-2 pb-4">
        {/* Title skeleton (2 lines) */}
        <div className="space-y-2 mb-3">
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>

        {/* Category + Stock */}
        <div className="flex justify-between mb-3">
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        </div>

        {/* Price + Wishlist */}
        <div className="mt-auto flex justify-between items-center pt-3 border-t border-gray-100">
          {/* Price */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-3 bg-gray-100 rounded w-16"></div>
          </div>

          {/* Wishlist Button */}
          <div className="h-10 w-10 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
