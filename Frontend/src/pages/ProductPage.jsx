import React, { useState, useEffect } from "react";
import { getCategories, getProducts } from "../api/api";
import CategoriesTab from "./CategoriesTab";
import AttributesTab from "./AttributesTab";
import ProductsTab from "./ProductsTab";

const ProductPage = () => {
  const [activeTab, setActiveTab] = useState("categories");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const loadCategories = async () => {
    const res = await getCategories();
    setCategories(res.data);
  };

  const loadProducts = async () => {
    const res = await getProducts();
    setProducts(res.data);
  };

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  const TabButton = ({ id, label }) => (
    <button
      className={`px-6 py-3 text-sm font-semibold rounded-t-lg transition-all ${
        activeTab === id
          ? "bg-white text-indigo-600 border-b-2 border-indigo-600"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
      onClick={() => setActiveTab(id)}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Product Management System
          </h1>
          <p className="text-gray-500 mt-2">
            Manage categories, attributes & products seamlessly
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex border-b border-gray-200 bg-gray-50 px-4">
            <TabButton id="categories" label="📁 Categories" />
            <TabButton id="attributes" label="🏷️ Attributes" />
            <TabButton id="products" label="🛍️ Products" />
          </div>

          {/* Categories Tab */}
          <div
            className={`p-6 ${activeTab === "categories" ? "block" : "hidden"}`}
          >
            <CategoriesTab
              categories={categories}
              onCategoriesChange={loadCategories}
            />
          </div>

          {/* Attributes Tab */}
          <div
            className={`p-6 ${activeTab === "attributes" ? "block" : "hidden"}`}
          >
            <AttributesTab categories={categories} />
          </div>

          {/* Products Tab */}
          <div
            className={`p-6 ${activeTab === "products" ? "block" : "hidden"}`}
          >
            <ProductsTab
              categories={categories}
              products={products}
              onProductsChange={loadProducts}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
