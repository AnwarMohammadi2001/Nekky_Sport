import { useEffect, useState } from "react";
import { Heart, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import ProductCard from "../../Components/product/ProductCart";

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = () => {
    try {
      const savedWishlist = localStorage.getItem("wishlist");
      const items = savedWishlist ? JSON.parse(savedWishlist) : [];
      // Sort by most recently added
      const sortedItems = items.sort(
        (a, b) => new Date(b.addedAt) - new Date(a.addedAt)
      );
      setWishlistItems(sortedItems);
    } catch (error) {
      console.error("Error loading wishlist:", error);
      toast.error("خطا در بارگذاری لیست علاقه‌مندی‌ها");
    }
  };

  const removeFromWishlist = (productId) => {
    try {
      const currentWishlist = JSON.parse(
        localStorage.getItem("wishlist") || "[]"
      );
      const updatedWishlist = currentWishlist.filter(
        (item) => item.id !== productId
      );
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      setWishlistItems(updatedWishlist);
      toast.success("محصول از لیست علاقه‌مندی‌ها حذف شد");
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("خطا در حذف محصول");
    }
  };

  const clearWishlist = () => {
    if (wishlistItems.length === 0) return;

    if (
      window.confirm(
        "آیا از حذف همه محصولات از لیست علاقه‌مندی‌ها اطمینان دارید؟"
      )
    ) {
      localStorage.removeItem("wishlist");
      setWishlistItems([]);
      toast.success("همه محصولات از لیست علاقه‌مندی‌ها حذف شدند");
    }
  };

  const handleProductClick = (product) => {
    const productSlug = product.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    navigate(`/${product.category}/${productSlug}`);
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    // Add to cart logic here
    console.log("Add to cart from wishlist:", product.id);
    toast.success("محصول به سبد خرید اضافه شد");
  };

  return (
    <div className=" bg-gray-50 mt-[135px] mb-16 md:mb-0 font-vazir" dir="rtl">
      <div className="max-w-7xl mx-auto px-8 md:px-5 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 rotate-180" />
            بازگشت
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="w-7 h-7 text-cyan-800 fill-cyan-800" />
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                لیست علاقه‌مندی‌ها
              </h1>
            </div>

            {wishlistItems.length > 0 && (
              <button
                onClick={clearWishlist}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium"
              >
                <Trash2 className="w-4 h-4" />
                حذف همه
              </button>
            )}
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border">
            <Heart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-700 mb-3">
              لیست علاقه‌مندی‌های شما خالی است
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              محصولاتی که به علاقه‌مندی‌ها اضافه می‌کنید در اینجا نمایش داده
              می‌شوند
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              بازگشت به فروشگاه
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
