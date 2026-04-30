import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import MainLayout from "./layout/MainLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import DashboardPage from "./pages/DashboardPage";

import ScrollToTop from "./components/ScrollToTop";

import PageNotFound from "./pages/PageNotFound";
import ProductPage from "./pages/website/ProductPage";
import ProductDetailPage from "./pages/website/ProductDetailPage";
import SupportPage from "./pages/website/SupportPage";
import HelpPage from "./pages/website/HelpPage";
import About from "./pages/website/About";
import WishlistPage from "./pages/website/WishlistPage";
import CategoryPage from "./components/homepage/CategoryPage";
import ProductCategoryPage from "./pages/website/ProductCategoryPage";
// import Contact from "./components/Contact";
// import ProductCategoryPage from "./pages/website/ProductCategoryPage";
// import CategoryPage from "./components/homepage/CategoryPage";


function App() {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<ProductPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="contact" element={<SupportPage />} />
            <Route path="help" element={<HelpPage />} />
            <Route path="aboutus" element={<About />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="categorie" element={<CategoryPage />} />
            <Route
              path="/category/:categoryId"
              element={<ProductCategoryPage />}
            />
         
          </Route>

          {/* Auth pages */}
          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />
          <Route path="/*" element={<PageNotFound />} />

          {/* Protected Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
