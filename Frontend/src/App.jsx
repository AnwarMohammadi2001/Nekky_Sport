import React, { useState, useRef, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer";
import HomePage from "./Pages/website/HomePage";
import QuickViewModal from "./Components/QuickViewModal";
import CartDrawer from "./Components/CartDrawer";
import FlyingImage from "./Components/FlyingImage";
import PrivateRoute from "./Components/common/PrivateRoute";
import Signin from "./features/authentication/components/Signin";
import SignUp from "./features/authentication/components/Signup";
import DashboardPage from "./Components/dashboard/DashboardPage";
import CookiePolicyPage from "./Pages/website/CookiePolicyPage";
import CookieConsentBanner from "./Components/CookieConsentBanner";
import AuthContainer from "./features/authentication/components/AuthContainer";
import ForgotPassword from "./Pages/website/ForgotPassword";
import CreateNewPassword from "./Pages/website/CreatePassword";
import ProductPage from "./Pages/website/ProductPage";
import SupportPage from "./Pages/website/SupportPage";
import About from "./Pages/website/About";
import HelpPage from "./Pages/website/HelpPage";
import DownloadPage from "./Pages/website/DownloadPage";
import ProductDetailPage from "./Pages/website/ProductDetailPage";
import WishlistPage from "./Pages/website/WishlistPage";
import LoginPage from "./features/authentication/components/Signin"; // اضافه شده
import ScrollToTop from "./Components/ScrollToTop";
import ProductCategoryPage from "./Pages/website/ProductCategoryPage";
import CategoryPage from "./Components/Categori/CategoryPage";

function App() {
  const [wishlist, setWishlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [animationData, setAnimationData] = useState(null);
  const cartRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/") {
      setSearchQuery("");
    }
    setQuickViewProduct(null);
    setIsCartOpen(false);
  }, [location.pathname]);

  const handleToggleWishlist = (productId) => {
    setWishlist((prevWishlist) => {
      if (prevWishlist.includes(productId)) {
        toast.error("Removed from wishlist.");
        return prevWishlist.filter((id) => id !== productId);
      } else {
        toast.success("Added to wishlist!");
        return [...prevWishlist, productId];
      }
    });
  };

  // لیست مسیرهایی که نباید هدر و فوتر داشته باشند
  const noLayoutPaths = [
    "/dashboard",
    "/dashboard/*",
    "/sign-in",
    "/sign-up",
    "/logee",
    "/forgot-password",
    "/create-new-password",
  ];

  const shouldHideLayout = noLayoutPaths.some((path) => {
    if (path.endsWith("/*")) {
      const basePath = path.replace("/*", "");
      return location.pathname.startsWith(basePath);
    }
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  });

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <ScrollToTop />
      <Toaster
        position="bottom-center"
        toastOptions={{
          success: { style: { background: "#333", color: "#fff" } },
          error: { style: { background: "#D22B2B", color: "#fff" } },
        }}
      />
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <FlyingImage
        animationData={animationData}
        onAnimationComplete={() => setAnimationData(null)}
      />

      {!shouldHideLayout && (
        <Header
          wishlistCount={wishlist.length}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onCartClick={() => setIsCartOpen(true)}
          cartRef={cartRef}
        />
      )}

      <main className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                searchQuery={searchQuery}
                onQuickView={setQuickViewProduct}
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
              />
            }
          />
          <Route path="products" element={<ProductPage />} />
          <Route path="support" element={<SupportPage />} />
          <Route path="download" element={<DownloadPage />} />
          <Route path="aboutus" element={<About />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route
            path="/category/:categoryId"
            element={<ProductCategoryPage />}
          />
          <Route path="help" element={<HelpPage />} />
          <Route path="categorie" element={<CategoryPage />} />
          {/* <Route path="/cookie-policy" element={<CookiePolicyPage />} /> */}
          <Route path="/sign-in" element={<LoginPage />} />{" "}
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/logee" element={<AuthContainer />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/create-new-password" element={<CreateNewPassword />} />
          {/* مسیر داشبورد */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard/*" element={<DashboardPage />} />
          </Route>
          {/* ریدایرکت پیش‌فرض */}
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </main>

      {!shouldHideLayout && <Footer />}    </div>
  );
}

export default App;
