import React, { useState } from "react";
import { createCategory, updateCategory, deleteCategory } from "../api/api";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const CategoriesTab = ({ categories, onCategoriesChange }) => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  // =========================
  // LOADING STATES
  // =========================
  const [submitting, setSubmitting] = useState(false); // create/update in-flight
  const [deletingId, setDeletingId] = useState(null); // which category is being deleted

  const resetForm = () => {
    setCategoryName("");
    setCategoryImage(null);
    setEditingCategory(null);
    const fileInput = document.getElementById("category-image-input");
    if (fileInput) fileInput.value = "";
  };

  const handleCreateCategory = async () => {
    if (submitting) return; // 🔒 block double-click
    if (!categoryName.trim()) return alert("Category name required");

    const formData = new FormData();
    formData.append("name", categoryName);
    if (categoryImage) {
      formData.append("image", categoryImage);
    }

    try {
      setSubmitting(true);
      await createCategory(formData);
      resetForm();
      onCategoriesChange();
    } catch (err) {
      console.error(err);
      alert("Failed to create category. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (submitting) return; // 🔒 block double-click
    if (!editingCategory) return;

    const formData = new FormData();
    formData.append("name", categoryName);

    if (categoryImage) {
      formData.append("image", categoryImage);
    }

    try {
      setSubmitting(true);
      await updateCategory(editingCategory.id, formData);
      resetForm();
      onCategoriesChange();
    } catch (err) {
      console.error(err);
      alert("Failed to update category. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (deletingId) return; // 🔒 one delete at a time
    if (
      !window.confirm("Delete this category? Attributes will also be deleted.")
    )
      return;

    try {
      setDeletingId(id);
      await deleteCategory(id);
      onCategoriesChange();
    } catch (err) {
      console.error(err);
      alert("Failed to delete category. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const startEditCategory = (category) => {
    if (submitting || deletingId) return;
    setEditingCategory(category);
    setCategoryName(category.name);
  };

  const cancelEditCategory = () => {
    if (submitting) return;
    resetForm();
  };

  const isBusy = submitting || deletingId !== null;

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {editingCategory ? "✏️ Edit Category" : "➕ Create New Category"}
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Category name (e.g., Electronics, Clothing)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none disabled:bg-gray-100"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            disabled={submitting}
          />
          <input
            id="category-image-input"
            type="file"
            accept="image/*"
            className="w-full mt-2"
            onChange={(e) => setCategoryImage(e.target.files[0])}
            disabled={submitting}
          />
          <div className="flex gap-3">
            {editingCategory ? (
              <>
                <button
                  onClick={handleUpdateCategory}
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
                  {submitting ? "Updating..." : "Update Category"}
                </button>
                <button
                  onClick={cancelEditCategory}
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
                onClick={handleCreateCategory}
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
                {submitting ? "Adding..." : "Add Category"}
              </button>
            )}
          </div>
        </div>
      </div>

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
            {categories.map((cat) => {
              const isDeleting = deletingId === cat.id;
              return (
                <div
                  key={cat.id}
                  className={`flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 transition relative ${
                    isDeleting ? "opacity-60" : "hover:shadow-md"
                  }`}
                >
                  {isDeleting && (
                    <div className="absolute inset-0 bg-white/40 flex items-center justify-center rounded-lg">
                      <span className="inline-block w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}

                  {cat.image && (
                    <img
                      src={`${BASE_URL}/${cat.image}`}
                      alt={cat.name}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                  )}
                  <span className="font-medium text-gray-800 flex-1 ml-3">
                    {cat.name}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditCategory(cat)}
                      disabled={isBusy}
                      className={`px-3 py-1 text-sm rounded-md transition ${
                        isBusy
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                      }`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      disabled={isBusy}
                      className={`px-3 py-1 text-sm rounded-md transition flex items-center gap-1 ${
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
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesTab;