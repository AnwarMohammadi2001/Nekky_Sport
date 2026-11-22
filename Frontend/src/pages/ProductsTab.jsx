import React, { useState } from "react";
import {
  getAttributesByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/api";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const ProductsTab = ({ categories, products, onProductsChange }) => {
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    categoryId: "",
  });
  const [attributeValues, setAttributeValues] = useState({});
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [selectedProductCategory, setSelectedProductCategory] = useState("");
  const [attributes, setAttributes] = useState([]);

  // =========================
  // LOADING STATES
  // =========================
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [loadingAttributes, setLoadingAttributes] = useState(false);

  const loadAttributesForCategory = async (categoryId) => {
    if (categoryId) {
      try {
        setLoadingAttributes(true);
        const res = await getAttributesByCategory(categoryId);
        setAttributes(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingAttributes(false);
      }
    } else {
      setAttributes([]);
    }
  };

  const handleAttrChange = (attrId, value) => {
    setAttributeValues({ ...attributeValues, [attrId]: value });
  };

  const resetProductForm = () => {
    setProductForm({
      name: "",
      description: "",
      categoryId: "",
    });
    setAttributeValues({});
    setImages([]);
    setExistingImages([]);
    setEditingProduct(null);
    setSelectedProductCategory("");
    setAttributes([]);
    const fileInput = document.getElementById("product-images-input");
    if (fileInput) fileInput.value = "";
  };

  const buildAttributePayload = () =>
    Object.keys(attributeValues).map((key) => ({
      attributeId: parseInt(key),
      value: attributeValues[key],
    }));

  const handleCreateProduct = async () => {
    if (submitting) return; // 🔒 block double-click
    if (!productForm.name || !selectedProductCategory) {
      return alert("Please fill all required fields and select a category");
    }

    const formData = new FormData();
    formData.append("name", productForm.name);
    formData.append("description", productForm.description || "");
    formData.append("categoryId", selectedProductCategory);
    formData.append("attributes", JSON.stringify(buildAttributePayload()));
    images.forEach((img) => formData.append("images", img));

    try {
      setSubmitting(true);
      await createProduct(formData);
      alert("Product Created Successfully ✅");
      resetProductForm();
      onProductsChange();
    } catch (err) {
      console.error(err);
      alert("Failed to create product. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateProductSubmit = async () => {
    if (submitting) return; // 🔒 block double-click
    if (!editingProduct) return;

    const formData = new FormData();
    formData.append("name", productForm.name);
    formData.append("description", productForm.description);
    formData.append("categoryId", selectedProductCategory);
    formData.append("attributes", JSON.stringify(buildAttributePayload()));

    images.forEach((img) => formData.append("images", img));

    if (existingImages.length) {
      formData.append("existingImages", JSON.stringify(existingImages));
    }

    try {
      setSubmitting(true);
      await updateProduct(editingProduct.id, formData);
      alert("Product Updated Successfully ✅");
      resetProductForm();
      onProductsChange();
    } catch (err) {
      console.error(err);
      alert("Failed to update product. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (deletingId) return; // 🔒 one delete at a time
    if (!window.confirm("Delete this product?")) return;

    try {
      setDeletingId(id);
      await deleteProduct(id);
      onProductsChange();
    } catch (err) {
      console.error(err);
      alert("Failed to delete product. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditProduct = async (product) => {
    if (submitting || deletingId) return;

    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || "",
      categoryId: product.categoryId,
    });
    setSelectedProductCategory(product.categoryId);

    await loadAttributesForCategory(product.categoryId);

    const attrVals = {};
    if (product.ProductAttributeValues) {
      product.ProductAttributeValues.forEach((attr) => {
        try {
          const parsedValue = JSON.parse(attr.value);
          if (Array.isArray(parsedValue)) {
            attrVals[attr.attributeId] = parsedValue;
          } else {
            attrVals[attr.attributeId] = attr.value;
          }
        } catch {
          attrVals[attr.attributeId] = attr.value;
        }
      });
    }
    setAttributeValues(attrVals);

    if (product.ProductImages) {
      setExistingImages(
        product.ProductImages.map((img) => img.imageUrl || img.url || img),
      );
    }
  };

  const handleProductCategoryChange = async (categoryId) => {
    setSelectedProductCategory(categoryId);
    setProductForm({ ...productForm, categoryId });
    await loadAttributesForCategory(categoryId);
    setAttributeValues({});
  };

  const renderAttributeInput = (attr) => {
    if (attr.type === "input") {
      return (
        <input
          type="text"
          disabled={submitting}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100"
          value={attributeValues[attr.id] || ""}
          onChange={(e) => handleAttrChange(attr.id, e.target.value)}
        />
      );
    } else if (attr.type === "select") {
      const selectedValues = attributeValues[attr.id] || [];

      return (
        <div className="relative">
          <div
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white cursor-pointer focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            onClick={(e) => {
              if (submitting) return;
              const dropdown = e.currentTarget.nextSibling;
              dropdown.classList.toggle("hidden");
            }}
          >
            <div className="flex justify-between items-center">
              <span className="text-gray-700">
                {selectedValues.length === 0
                  ? `Select ${attr.name}...`
                  : `${selectedValues.length} selected`}
              </span>
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          <div className="hidden absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            <div className="p-2">
              {attr.AttributeOptions?.map((opt) => {
                const isSelected = selectedValues.includes(opt.value);

                return (
                  <label
                    key={opt.id}
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={submitting}
                      onChange={(e) => {
                        let newValues;
                        if (e.target.checked) {
                          newValues = [...selectedValues, opt.value];
                        } else {
                          newValues = selectedValues.filter(
                            (v) => v !== opt.value,
                          );
                        }
                        handleAttrChange(attr.id, newValues);
                      }}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">{opt.value}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <select
          disabled={submitting}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100"
          value={attributeValues[attr.id] || ""}
          onChange={(e) => handleAttrChange(attr.id, e.target.value)}
        >
          <option value="">Select {attr.name}</option>
          {attr.AttributeOptions?.map((opt) => (
            <option key={opt.id} value={opt.value}>
              {opt.value}
            </option>
          ))}
        </select>
      );
    }
  };

  // Product Card Component
  const ProductCard = ({ product }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showFullDetails, setShowFullDetails] = useState(false);

    const productImages = product.ProductImages || [];
    const processedImages = productImages
      .map((img) => {
        const raw =
          typeof img === "string" ? img : img.imageUrl || img.url || img;
        return raw?.replace(/\\/g, "/");
      })
      .filter(Boolean);

    const getImageUrl = (imagePath) => {
      if (!imagePath) return "/no-image.png";
      const path = imagePath.replace(/\\/g, "/");
      if (path.startsWith("http")) return path;
      if (path.startsWith("/uploads")) {
        return `${BASE_URL}${path}`;
      }
      return `${BASE_URL}/uploads/${path}`;
    };

    const getAttributeValuesArray = (value) => {
      if (!value) return [];

      if (Array.isArray(value)) {
        return value;
      }

      if (typeof value === "string") {
        try {
          const parsed = JSON.parse(value);
          return Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          return [value];
        }
      }

      return [value];
    };

    const getBadgeColor = (attributeName) => {
      const colors = {
        رنگ: "bg-pink-100 text-pink-800 border-pink-200",
        سایز: "bg-blue-100 text-blue-800 border-blue-200",
        برند: "bg-green-100 text-green-800 border-green-200",
        color: "bg-pink-100 text-pink-800 border-pink-200",
        size: "bg-blue-100 text-blue-800 border-blue-200",
        brand: "bg-green-100 text-green-800 border-green-200",
      };
      return (
        colors[attributeName?.toLowerCase()] ||
        "bg-indigo-100 text-indigo-800 border-indigo-200"
      );
    };

    const productAttributes = product.ProductAttributeValues || [];
    const categoryName =
      categories.find((c) => c.id === product.categoryId)?.name || "N/A";

    const isDeleting = deletingId === product.id;
    const isBusy = submitting || deletingId !== null;

    return (
      <div
        className={`bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full relative ${
          isDeleting ? "opacity-60" : ""
        }`}
      >
        {isDeleting && (
          <div className="absolute inset-0 bg-white/50 z-20 flex items-center justify-center">
            <span className="inline-block w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Image Gallery */}
        <div className="relative bg-gray-100">
          {processedImages.length > 0 ? (
            <>
              <img
                src={getImageUrl(processedImages[currentImageIndex])}
                alt={product.name}
                className="w-full h-64 object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/400x400?text=No+Image";
                }}
              />
              {processedImages.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentImageIndex((prev) =>
                        prev === 0 ? processedImages.length - 1 : prev - 1,
                      )
                    }
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-opacity-70 transition"
                  >
                    ◀
                  </button>
                  <button
                    onClick={() =>
                      setCurrentImageIndex((prev) =>
                        prev === processedImages.length - 1 ? 0 : prev + 1,
                      )
                    }
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-opacity-70 transition"
                  >
                    ▶
                  </button>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                    {processedImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-2 h-2 rounded-full transition ${
                          idx === currentImageIndex
                            ? "bg-white w-4"
                            : "bg-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <h3 className="font-bold text-xl text-gray-800">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Category: {categoryName}
              </p>
            </div>
          </div>

          {product.description && (
            <p className="text-gray-600 text-sm mt-2 line-clamp-2">
              {product.description}
            </p>
          )}

          {productAttributes.length > 0 && (
            <div className="mt-3">
              <h4 className="text-xs font-semibold text-gray-500 mb-2">
                SPECIFICATIONS
              </h4>
              <div className="space-y-2">
                {productAttributes.slice(0, 3).map((attr, idx) => {
                  const attributeName = attr.Attribute?.name || "Attribute";
                  const values = getAttributeValuesArray(attr.value);

                  return (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-700">
                        {attributeName}:
                      </span>
                      <div className="flex w-16 gap-1">
                        {values.map((val, valIdx) => (
                          <span
                            key={valIdx}
                            className="flex justify-center items-center px-5 py-2 text-xs font-medium border-gray-300 text-gray-700 bg-gray-100"
                          >
                            {val}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
                {productAttributes.length > 3 && (
                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowFullDetails(!showFullDetails)}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      +{productAttributes.length - 3} more
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {processedImages.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {processedImages.slice(0, 4).map((img, idx) => (
                <img
                  key={idx}
                  src={getImageUrl(img)}
                  alt={`${product.name} thumbnail ${idx + 1}`}
                  className="w-12 h-12 object-cover rounded cursor-pointer hover:opacity-75 transition"
                  onClick={() => setCurrentImageIndex(idx)}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/50x50?text=Error";
                  }}
                />
              ))}
              {processedImages.length > 4 && (
                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-600">
                  +{processedImages.length - 4}
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
            <button
              onClick={() => setShowFullDetails(!showFullDetails)}
              className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              {showFullDetails ? "Show Less" : "View Details"}
            </button>
            <button
              onClick={() => handleEditProduct(product)}
              disabled={isBusy}
              className={`px-3 py-2 text-sm rounded-lg transition ${
                isBusy
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
              }`}
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteProduct(product.id)}
              disabled={isBusy}
              className={`px-3 py-2 text-sm rounded-lg transition flex items-center gap-1 ${
                isBusy
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-red-100 text-red-700 hover:bg-red-200"
              }`}
            >
              {isDeleting && (
                <span className="inline-block w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
              )}
              Delete
            </button>
          </div>

          {showFullDetails && (
            <div className="mt-4 pt-3 border-t border-gray-100 space-y-3">
              {product.description && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">
                    Full Description:
                  </h4>
                  <p className="text-sm text-gray-600">{product.description}</p>
                </div>
              )}

              {productAttributes.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    All Specifications:
                  </h4>
                  <div className="space-y-2">
                    {productAttributes.map((attr, idx) => {
                      const attributeName = attr.Attribute?.name || "Attribute";
                      const values = getAttributeValuesArray(attr.value);

                      return (
                        <div
                          key={idx}
                          className="flex flex-wrap items-start gap-2"
                        >
                          <span className="text-sm font-medium text-gray-700 min-w-[100px]">
                            {attributeName}:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {values.map((val, valIdx) => (
                              <span
                                key={valIdx}
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeColor(attributeName)}`}
                              >
                                {val}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {processedImages.length > 1 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    All Images:
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {processedImages.map((img, idx) => (
                      <img
                        key={idx}
                        src={getImageUrl(img)}
                        alt={`${product.name} ${idx + 1}`}
                        className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-75 transition"
                        onClick={() => {
                          setCurrentImageIndex(idx);
                          setShowFullDetails(false);
                        }}
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/100x100?text=Error";
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-400 pt-2">
                <p>Product ID: {product.id}</p>
                {product.createdAt && (
                  <p>
                    Created: {new Date(product.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const isBusy = submitting || deletingId !== null;

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {editingProduct ? "✏️ Edit Product" : "➕ Create New Product"}
        </h2>
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          <select
            disabled={submitting}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100"
            value={selectedProductCategory}
            onChange={(e) => handleProductCategoryChange(e.target.value)}
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
            disabled={submitting}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100"
            value={productForm.name}
            onChange={(e) =>
              setProductForm({ ...productForm, name: e.target.value })
            }
          />

          <textarea
            placeholder="Description"
            rows="3"
            disabled={submitting}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100"
            value={productForm.description}
            onChange={(e) =>
              setProductForm({
                ...productForm,
                description: e.target.value,
              })
            }
          />

          {loadingAttributes ? (
            <div className="flex items-center gap-2 text-sm text-gray-500 py-2">
              <span className="inline-block w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              Loading attributes...
            </div>
          ) : (
            attributes.map((attr) => (
              <div key={attr.id} className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  <span>
                    {attr.name}
                    {attributeValues[attr.id] && (
                      <span className="ml-2 text-xs text-gray-500">
                        (
                        {Array.isArray(attributeValues[attr.id])
                          ? attributeValues[attr.id].join(", ")
                          : attributeValues[attr.id]}
                        )
                      </span>
                    )}
                  </span>
                </label>
                {renderAttributeInput(attr)}

                {attr.allowMultiple && attributeValues[attr.id]?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {(attributeValues[attr.id] || []).map((val, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded"
                      >
                        {val}
                        <button
                          type="button"
                          disabled={submitting}
                          onClick={() => {
                            const newValues = attributeValues[attr.id].filter(
                              (v) => v !== val,
                            );
                            handleAttrChange(attr.id, newValues);
                          }}
                          className="hover:text-indigo-900"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}

          <input
            id="product-images-input"
            type="file"
            multiple
            accept="image/*"
            disabled={submitting}
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
                  disabled={submitting}
                  className={`px-4 py-2 rounded-lg text-white transition flex items-center gap-2 ${
                    submitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {submitting && (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {submitting ? "Updating..." : "Update Product"}
                </button>
                <button
                  onClick={resetProductForm}
                  disabled={submitting}
                  className={`px-4 py-2 rounded-lg transition ${
                    submitting
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                  }`}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleCreateProduct}
                disabled={!selectedProductCategory || submitting}
                className={`px-4 py-2 rounded-lg text-white transition flex items-center gap-2 ${
                  !selectedProductCategory || submitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {submitting && (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {submitting ? "Creating..." : "Create Product"}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          📦 All Products ({products.length})
        </h2>
        {products.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No products yet. Create one!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsTab;