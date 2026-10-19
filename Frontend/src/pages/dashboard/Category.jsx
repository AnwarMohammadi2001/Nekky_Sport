import React, { useEffect, useState } from "react";
const BASE_URL = import.meta.env.VITE_BASE_URL 
const Category = () => {
  // State کتگوری
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // State ساب‌کتگوری
  const [subName, setSubName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subMessage, setSubMessage] = useState("");
  const [subError, setSubError] = useState("");
  const [subLoading, setSubLoading] = useState(false);

  // 🔹 Fetch all categories with subcategories
  const fetchCategories = async () => {
    setFetching(true);
    setError("");
    try {
      const res = await fetch( `${BASE_URL}/api/categories`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "خطا در دریافت کتگوری‌ها");

      // Ensure subcategories key exists
      const categoriesWithSubs = data.map((cat) => ({
        ...cat,
        subcategories: cat.SubCategories || [],
      }));

      setCategories(categoriesWithSubs);
    } catch (err) {
      setError(err.message);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 🔹 Add Category
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch(`${BASE_URL}/api/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "خطا در ایجاد کتگوری");

      setMessage("✅ کتگوری با موفقیت ایجاد شد");
      setName("");
      fetchCategories();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Add Subcategory
  const handleSubSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategory) {
      setSubError("لطفاً یک کتگوری انتخاب کنید");
      return;
    }
    setSubLoading(true);
    setSubMessage("");
    setSubError("");

    try {
      const res = await fetch(`${BASE_URL}/api/subcategories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name: subName, categoryId: selectedCategory }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "خطا در ایجاد ساب‌کتگوری");

      setSubMessage("✅ ساب‌کتگوری با موفقیت ایجاد شد");
      setSubName("");

      // Update categories state to add new subcategory dynamically
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === selectedCategory
            ? {
                ...cat,
                subcategories: [...cat.subcategories, data.subCategory],
              }
            : cat
        )
      );
    } catch (err) {
      setSubError(err.message);
    } finally {
      setSubLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-8">
      {/* ➕ Add Category */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          افزودن کتگوری جدید
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثلاً: نقاشی دیواری"
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
          {message && <p className="text-green-600">{message}</p>}
          {error && <p className="text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "در حال ذخیره..." : "ایجاد کتگوری"}
          </button>
        </form>
      </div>

      {/* ➕ Add Subcategory */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          افزودن ساب‌کتگوری
        </h1>

        <form onSubmit={handleSubSubmit} className="space-y-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
          >
            <option value="">انتخاب کتگوری</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={subName}
            onChange={(e) => setSubName(e.target.value)}
            placeholder="نام ساب‌کتگوری"
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />

          {subMessage && <p className="text-green-600">{subMessage}</p>}
          {subError && <p className="text-red-600">{subError}</p>}

          <button
            type="submit"
            disabled={subLoading}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg transition disabled:opacity-50"
          >
            {subLoading ? "در حال ذخیره..." : "ایجاد ساب‌کتگوری"}
          </button>
        </form>
      </div>

      {/* 📋 Categories List with Subcategories */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">لیست کتگوری‌ها</h2>
        {fetching ? (
          <p className="text-gray-500">در حال دریافت اطلاعات...</p>
        ) : categories.length === 0 ? (
          <p className="text-gray-500">هیچ کتگوری‌ای وجود ندارد</p>
        ) : (
          <ul className="divide-y">
            {categories.map((cat) => (
              <li key={cat.id} className="py-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-gray-700">{cat.name}</span>
                  <span className="text-xs text-gray-400">ID: {cat.id}</span>
                </div>

                {/* Subcategories */}
                {cat.subcategories && cat.subcategories.length > 0 ? (
                  <ul className="pl-6 space-y-1">
                    {cat.subcategories.map((sub) => (
                      <li key={sub.id} className="text-gray-600 text-sm">
                        • {sub.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="pl-6 text-gray-400 text-sm">ساب‌کتگوری ندارد</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Category;
