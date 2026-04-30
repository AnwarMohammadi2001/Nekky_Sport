import React, { useState } from "react";
import { createCategory, updateCategory, deleteCategory } from "../api/api";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const CategoriesTab = ({ categories, onCategoriesChange }) => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

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
    onCategoriesChange();
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
    onCategoriesChange();
  };

  const handleDeleteCategory = async (id) => {
    if (
      window.confirm("Delete this category? Attributes will also be deleted.")
    ) {
      await deleteCategory(id);
      onCategoriesChange();
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
  );
};

export default CategoriesTab;
