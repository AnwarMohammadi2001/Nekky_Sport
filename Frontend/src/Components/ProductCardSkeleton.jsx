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

        {/* Description */}
        <div className="space-y-2 mb-3">
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>

        {/* Wishlist */}
        <div className="mt-auto flex justify-end items-center pt-3 border-t border-gray-100">
          {/* Wishlist Button */}
          <div className="h-10 w-10 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
