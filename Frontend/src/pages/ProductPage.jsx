import React, { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  createAttribute,
  getAttributesByCategory,
  updateAttribute,
  deleteAttribute,
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../api/api";

const ProductPage = () => {
  // =========================
  // State Management
  // =========================
  const [activeTab, setActiveTab] = useState("categories");

  // Categories
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  // Attributes
  const [selectedCategory, setSelectedCategory] = useState("");
  const [attributes, setAttributes] = useState([]);
  const [attrName, setAttrName] = useState("");
  const [attrType, setAttrType] = useState("input");
  const [attrOptions, setAttrOptions] = useState("");
  const [editingAttribute, setEditingAttribute] = useState(null);

  // Products
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    categoryId: "",
  });
  const [attributeValues, setAttributeValues] = useState({});
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [selectedProductCategory, setSelectedProductCategory] = useState("");

  // =========================
  // Load Data
  // =========================
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

  const loadAttributesForCategory = async (categoryId) => {
    if (categoryId) {
      const res = await getAttributesByCategory(categoryId);
      setAttributes(res.data);
    } else {
      setAttributes([]);
    }
  };

  // =========================
  // Category CRUD
  // =========================
  const handleCreateCategory = async () => {
    if (!categoryName.trim()) return alert("Category name required");

    const formData = new FormData();
    formData.append("name", categoryName);
    if (categoryImage) {
      formData.append("image", categoryImage);
    }

    await createCategory(formData);

    setCategoryName("");
    setCategoryImage(null);
    loadCategories();
  };

  const handleUpdateCategory = async () => {
    const formData = new FormData();
    formData.append("name", categoryName);

    if (categoryImage) {
      formData.append("image", categoryImage);
    }

    await updateCategory(editingCategory.id, formData);

    setEditingCategory(null);
    setCategoryName("");
    setCategoryImage(null);
    loadCategories();
  };

  const handleDeleteCategory = async (id) => {
    if (
      window.confirm("Delete this category? Attributes will also be deleted.")
    ) {
      await deleteCategory(id);
      loadCategories();
      if (selectedCategory === id) {
        setSelectedCategory("");
        setAttributes([]);
      }
    }
  };

  const startEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
  };

  const cancelEditCategory = () => {
    setEditingCategory(null);
    setCategoryName("");
  };

  // =========================
  // Attribute CRUD
  // =========================
  const handleCreateAttribute = async () => {
    if (!attrName.trim()) return alert("Attribute name required");
    if (!selectedCategory) return alert("Select a category first");

    const optionsArray =
      attrType === "select"
        ? attrOptions
            .split(",")
            .map((o) => o.trim())
            .filter((o) => o)
        : [];

    await createAttribute({
      name: attrName,
      type: attrType,
      categoryId: selectedCategory,
      options: optionsArray,
    });

    setAttrName("");
    setAttrOptions("");
    setAttrType("input");
    loadAttributesForCategory(selectedCategory);
  };

  const handleUpdateAttribute = async () => {
    if (!attrName.trim()) return;

    const optionsArray =
      attrType === "select"
        ? attrOptions
            .split(",")
            .map((o) => o.trim())
            .filter((o) => o)
        : [];

    await updateAttribute(editingAttribute.id, {
      name: attrName,
      type: attrType,
      options: optionsArray,
    });

    setEditingAttribute(null);
    setAttrName("");
    setAttrOptions("");
    setAttrType("input");
    loadAttributesForCategory(selectedCategory);
  };

  const handleDeleteAttribute = async (id) => {
    if (window.confirm("Delete this attribute?")) {
      await deleteAttribute(id);
      loadAttributesForCategory(selectedCategory);
    }
  };

  const startEditAttribute = (attr) => {
    setEditingAttribute(attr);
    setAttrName(attr.name);
    setAttrType(attr.type);
    if (attr.AttributeOptions) {
      setAttrOptions(attr.AttributeOptions.map((opt) => opt.value).join(", "));
    } else {
      setAttrOptions("");
    }
  };

  const cancelEditAttribute = () => {
    setEditingAttribute(null);
    setAttrName("");
    setAttrOptions("");
    setAttrType("input");
  };

  // =========================
  // Product CRUD
  // =========================
  const handleAttrChange = (attrId, value) => {
    setAttributeValues({ ...attributeValues, [attrId]: value });
  };

  const resetProductForm = () => {
    setProductForm({
      name: "",
      price: "",
      stock: "",
      description: "",
      categoryId: "",
    });
    setAttributeValues({});
    setImages([]);
    setExistingImages([]);
    setEditingProduct(null);
    setSelectedProductCategory("");
  };

  const handleCreateProduct = async () => {
    if (!productForm.name || !productForm.price || !selectedProductCategory) {
      return alert("Please fill all required fields and select a category");
    }

    const formData = new FormData();
    formData.append("name", productForm.name);
    formData.append("price", productForm.price);
    formData.append("stock", productForm.stock || 0);
    formData.append("description", productForm.description || "");
    formData.append("categoryId", selectedProductCategory);

    const attrs = Object.keys(attributeValues).map((key) => ({
      attributeId: key,
      value: attributeValues[key],
    }));
    formData.append("attributes", JSON.stringify(attrs));

    images.forEach((img) => formData.append("images", img));

    await createProduct(formData);
    alert("Product Created Successfully ✅");
    resetProductForm();
    loadProducts();
  };

  const handleUpdateProductSubmit = async () => {
    const formData = new FormData();
    formData.append("name", productForm.name);
    formData.append("price", productForm.price);
    formData.append("stock", productForm.stock);
    formData.append("description", productForm.description);
    formData.append("categoryId", selectedProductCategory);

    const attrs = Object.keys(attributeValues).map((key) => ({
      attributeId: key,
      value: attributeValues[key],
    }));
    formData.append("attributes", JSON.stringify(attrs));

    images.forEach((img) => formData.append("images", img));

    if (existingImages.length) {
      formData.append("existingImages", JSON.stringify(existingImages));
    }

    await updateProduct(editingProduct.id, formData);
    alert("Product Updated Successfully ✅");
    resetProductForm();
    loadProducts();
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Delete this product?")) {
      await deleteProduct(id);
      loadProducts();
    }
  };

  const handleEditProduct = async (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || "",
      categoryId: product.categoryId,
    });
    setSelectedProductCategory(product.categoryId);

    // Load attributes for this category
    await loadAttributesForCategory(product.categoryId);

    // Populate attribute values
    const attrVals = {};
    if (product.attributes) {
      product.attributes.forEach((attr) => {
        attrVals[attr.attributeId] = attr.value;
      });
    }
    setAttributeValues(attrVals);

    if (product.images) {
      setExistingImages(product.images.map((img) => img.url || img));
    }
    setActiveTab("products");
  };

  const handleProductCategoryChange = async (categoryId) => {
    setSelectedProductCategory(categoryId);
    setProductForm({ ...productForm, categoryId });
    await loadAttributesForCategory(categoryId);
    setAttributeValues({});
  };

  // =========================
  // Render Helpers
  // =========================
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

          {/* ================= CATEGORIES TAB ================= */}
          <div
            className={`p-6 ${activeTab === "categories" ? "block" : "hidden"}`}
          >
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Create/Edit Category Form */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  {editingCategory
                    ? "✏️ Edit Category"
                    : "➕ Create New Category"}
                </h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Category name (e.g., Electronics, Clothing)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full mt-2"
                    onChange={(e) => setCategoryImage(e.target.files[0])}
                  />
                  <div className="flex gap-3">
                    {editingCategory ? (
                      <>
                        <button
                          onClick={handleUpdateCategory}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                        >
                          Update Category
                        </button>
                        <button
                          onClick={cancelEditCategory}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleCreateCategory}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                      >
                        Add Category
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Categories List */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  📋 All Categories
                </h2>
                {categories.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No categories yet. Create one!
                  </p>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {categories.map((cat) => (
                      <div
                        key={cat.id}
                        className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 hover:shadow-md transition"
                      >
                        {cat.image && (
                          <img
                            src={`http://localhost:5000/${cat.image}`}
                            alt={cat.name}
                            className="w-12 h-12 object-cover rounded-md"
                          />
                        )}
                        <span className="font-medium text-gray-800">
                          {cat.name}
                        </span>

                        <div className="flex gap-2">
                          <button
                            onClick={() => startEditCategory(cat)}
                            className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ================= ATTRIBUTES TAB ================= */}
          <div
            className={`p-6 ${activeTab === "attributes" ? "block" : "hidden"}`}
          >
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Attribute Form */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  {editingAttribute
                    ? "✏️ Edit Attribute"
                    : "➕ Create Attribute"}
                </h2>
                <div className="space-y-4">
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      loadAttributesForCategory(e.target.value);
                    }}
                  >
                    <option value="">Select Category First</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="Attribute name (e.g., Color, Size, Brand)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={attrName}
                    onChange={(e) => setAttrName(e.target.value)}
                  />

                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={attrType}
                    onChange={(e) => setAttrType(e.target.value)}
                  >
                    <option value="input">Text Input</option>
                    <option value="select">Dropdown Select</option>
                  </select>

                  {attrType === "select" && (
                    <input
                      type="text"
                      placeholder="Options (comma separated: Red, Blue, Green)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={attrOptions}
                      onChange={(e) => setAttrOptions(e.target.value)}
                    />
                  )}

                  <div className="flex gap-3">
                    {editingAttribute ? (
                      <>
                        <button
                          onClick={handleUpdateAttribute}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                        >
                          Update Attribute
                        </button>
                        <button
                          onClick={cancelEditAttribute}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleCreateAttribute}
                        disabled={!selectedCategory}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                      >
                        Add Attribute
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Attributes List */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  🏷️ Attributes for{" "}
                  {categories.find((c) => c.id === selectedCategory)?.name ||
                    "Selected Category"}
                </h2>
                {!selectedCategory ? (
                  <p className="text-gray-500 text-center py-8">
                    Select a category to view attributes
                  </p>
                ) : attributes.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No attributes yet for this category
                  </p>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {attributes.map((attr) => (
                      <div
                        key={attr.id}
                        className="bg-white p-3 rounded-lg border border-gray-200"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-medium text-gray-800">
                              {attr.name}
                            </span>
                            <span
                              className={`ml-2 text-xs px-2 py-1 rounded-full ${
                                attr.type === "select"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {attr.type === "select"
                                ? "Dropdown"
                                : "Text Input"}
                            </span>
                            {attr.type === "select" &&
                              attr.AttributeOptions && (
                                <div className="text-xs text-gray-500 mt-1">
                                  Options:{" "}
                                  {attr.AttributeOptions.map(
                                    (o) => o.value,
                                  ).join(", ")}
                                </div>
                              )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEditAttribute(attr)}
                              className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteAttribute(attr.id)}
                              className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ================= PRODUCTS TAB ================= */}
          <div
            className={`p-6 ${activeTab === "products" ? "block" : "hidden"}`}
          >
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Product Form */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  {editingProduct ? "✏️ Edit Product" : "➕ Create New Product"}
                </h2>
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={selectedProductCategory}
                    onChange={(e) =>
                      handleProductCategoryChange(e.target.value)
                    }
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="Product Name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={productForm.name}
                    onChange={(e) =>
                      setProductForm({ ...productForm, name: e.target.value })
                    }
                  />

                  <input
                    type="number"
                    placeholder="Price"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm({ ...productForm, price: e.target.value })
                    }
                  />

                  <input
                    type="number"
                    placeholder="Stock Quantity"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={productForm.stock}
                    onChange={(e) =>
                      setProductForm({ ...productForm, stock: e.target.value })
                    }
                  />

                  <textarea
                    placeholder="Description"
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={productForm.description}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        description: e.target.value,
                      })
                    }
                  />

                  {/* Dynamic Attributes */}
                  {attributes.map((attr) => (
                    <div key={attr.id} className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">
                        {attr.name}
                      </label>
                      {attr.type === "input" ? (
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                          value={attributeValues[attr.id] || ""}
                          onChange={(e) =>
                            handleAttrChange(attr.id, e.target.value)
                          }
                        />
                      ) : (
                        <select
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                          value={attributeValues[attr.id] || ""}
                          onChange={(e) =>
                            handleAttrChange(attr.id, e.target.value)
                          }
                        >
                          <option value="">Select {attr.name}</option>
                          {attr.AttributeOptions?.map((opt) => (
                            <option key={opt.id} value={opt.value}>
                              {opt.value}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  ))}

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    onChange={(e) => setImages([...e.target.files])}
                  />

                  {existingImages.length > 0 && (
                    <div className="text-sm text-gray-600">
                      Existing images: {existingImages.length} image(s)
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    {editingProduct ? (
                      <>
                        <button
                          onClick={handleUpdateProductSubmit}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                        >
                          Update Product
                        </button>
                        <button
                          onClick={resetProductForm}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleCreateProduct}
                        disabled={!selectedProductCategory}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                      >
                        Create Product
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Products List */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  📦 All Products
                </h2>
                {products.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No products yet. Create one!
                  </p>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {products.map((prod) => (
                      <div
                        key={prod.id}
                        className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-800">
                              {prod.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Category: {prod.category?.name || "N/A"}
                            </p>
                            <p className="text-indigo-600 font-semibold mt-1">
                              ${prod.price}
                            </p>
                            <p className="text-xs text-gray-400">
                              Stock: {prod.stock}
                            </p>
                            {prod.attributes && prod.attributes.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {prod.attributes.map((attr, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs bg-gray-100 px-2 py-1 rounded"
                                  >
                                    {attr.attribute?.name}: {attr.value}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => handleEditProduct(prod)}
                              className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
