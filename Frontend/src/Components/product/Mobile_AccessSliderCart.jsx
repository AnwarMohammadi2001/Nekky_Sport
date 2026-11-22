import { Heart } from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Mobile_AccessSliderCart = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setIsWishlisted(wishlist.some((item) => item.id === product.id));
  }, [product.id]);

  const toggleWishlist = (e) => {
    e.stopPropagation();
    e.preventDefault();
    let wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    if (isWishlisted) {
      wishlist = wishlist.filter((item) => item.id !== product.id);
      toast.error("حذف شد");
    } else {
      wishlist.push(product);
      toast.success("اضافه شد");
    }
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="w-[200px] md:w-[250px] h-[250px] md:h-[300px] border relative  cursor-pointer  rounded-lg overflow-hidden  group hover:-translate-y-2 transition-all duration-500 shadow-sm hover:shadow-xl"
    >
      <img
        src={product.image}
        loading="lazy"
        alt={product.title}
        className="absolute inset-0 w-full h-full rounded-t-lg transition-transform object-cover duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t rounded-b-lg from-black/80 via-black/10 to-transparent z-10" />
      <div className="absolute bottom-0 left-0 right-0 z-20 p-4 flex rounded-b-lg flex-col gap-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-white line-clamp-1 mb-1">
            {product.title}
          </p>
          <button
            onClick={toggleWishlist}
            className={`p-2 rounded-full shadow-lg transition-all ${isWishlisted ? "bg-red-500 text-white" : "bg-white backdrop-blur-md text-black hover:bg-white hover:text-red-500"}`}
          >
            <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Mobile_AccessSliderCart;
