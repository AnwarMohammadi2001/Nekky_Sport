import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { FaCogs, FaTrash, FaRegEdit } from "react-icons/fa";
import {
  fetchCategories,
  fetchAttributes,
  createAttribute,
  deleteAttribute,
  updateAttribute,
} from "../../../services/api";
import SubmitBtn from "../../../utils/SubmitBtn";

const AttributeManager = () => {
  const { accessToken: token } = useSelector((state) => state.user);
  const queryClient = useQueryClient();

  // انتخاب‌های کاربر برای فیلتر
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTool, setSelectedTool] = useState("");

  // فرم ویژگی جدید/ویرایش
  const [editingAttrId, setEditingAttrId] = useState(null);
  const [attrName, setAttrName] = useState("");
  const [attrType, setAttrType] = useState("input"); // input, dropdown
  const [attrOptions, setAttrOptions] = useState("");

  // دریافت لیست کمپنی‌ها
  const { data: categoryData = [] } = useQuery({
    queryKey: ["categories", "all"],
    queryFn: () => fetchCategories(token, { page_size: 1000 }),
    enabled: !!token,
  });
  // استخراج آرایه از results
  const categories = Array.isArray(categoryData)
    ? categoryData
    : categoryData?.results || [];

  // دریافت لیست ویژگی‌های موجود
  const { data: attributeData = [] } = useQuery({
    queryKey: ["attributes", selectedCategory, selectedTool],
    queryFn: () => fetchAttributes(token, selectedCategory, selectedTool),
    enabled: !!token && !!selectedCategory && !!selectedTool,
  });

  // استخراج آرایه از results
  const attributes = Array.isArray(attributeData)
    ? attributeData
    : attributeData?.results || [];

  const resetForm = () => {
    setAttrName("");
    setAttrType("input");
    setAttrOptions("");
    setEditingAttrId(null);
  };

  const createMutation = useMutation({
    mutationFn: (data) => createAttribute(token, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["attributes"]);
      resetForm();
      Swal.fire("ثبت شد", "ویژگی جدید اضافه شد", "success");
    },
    onError: (err) =>
      Swal.fire("خطا", err.response?.data?.detail || "خطا در ثبت", "error"),
  });

  const updateMutation = useMutation({
    mutationFn: (data) => updateAttribute(token, editingAttrId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["attributes"]);
      resetForm();
      Swal.fire("بروزرسانی شد", "ویژگی با موفقیت ویرایش شد", "success");
    },
    onError: (err) =>
      Swal.fire("خطا", err.response?.data?.detail || "خطا در ویرایش", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteAttribute(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries(["attributes"]);
      Swal.fire("حذف شد", "", "success");
    },
  });

  // لیست ابزارها بر اساس کمپنی انتخاب شده
  const tools = useMemo(() => {
    if (!selectedCategory) return [];
    const cat = categories.find(
      (c) => String(c.id) === String(selectedCategory)
    );
    return cat ? cat.tools : [];
  }, [categories, selectedCategory]);

  const handleEditClick = (attr) => {
    setEditingAttrId(attr.id);
    setAttrName(attr.name);
    setAttrType(attr.attribute_type);
    if (attr.attribute_type === "dropdown" && Array.isArray(attr.attribute_value)) {
      setAttrOptions(attr.attribute_value.join(", "));
    } else {
      setAttrOptions("");
    }
  };

  const handleAddOrUpdateAttribute = (e) => {
    e.preventDefault();
    if (!selectedCategory || !selectedTool)
      return Swal.fire("خطا", "لطفا کمپنی و ابزار را انتخاب کنید", "warning");

    const payload = {
      category: selectedCategory,
      tool_key: selectedTool,
      name: attrName,
      attribute_type: attrType,
      attribute_value:
        attrType === "dropdown"
          ? attrOptions.split(",").filter(Boolean).map((s) => s.trim())
          : [],
    };

    if (editingAttrId) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="p-6" dir="rtl">
      <h1 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <FaCogs /> پیکربندی ویژگی‌ها{" "}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* پنل سمت راست: انتخاب و فرم */}
        <div className="bg-white p-6 rounded-md shadow-lg border border-gray-100 h-fit">
          <h2 className="font-bold text-lg mb-4 text-cyan-700">
            ۱. انتخاب مسیر
          </h2>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                کمپنی
              </label>
              <select
                className="input-field"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedTool("");
                  resetForm();
                }}
              >
                <option value="">انتخاب کنید...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                ابزار (Tool)
              </label>
              <select
                className="input-field"
                value={selectedTool}
                onChange={(e) => {
                  setSelectedTool(e.target.value);
                  resetForm();
                }}
                disabled={!selectedCategory}
              >
                <option value="">انتخاب کنید...</option>
                {tools.map((t, i) => (
                  <option key={i} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedCategory && selectedTool && (
            <>
              <h2 className="font-bold text-lg mb-4 text-green-800 border-t pt-4">
                {editingAttrId ? "۲. ویرایش ویژگی" : "۲. افزودن ویژگی جدید"}
              </h2>
              <form onSubmit={handleAddOrUpdateAttribute} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    نام ویژگی (مثلاً RAM)
                  </label>
                  <input
                    type="text"
                    value={attrName}
                    onChange={(e) => setAttrName(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    نوع ورودی
                  </label>
                  <select
                    value={attrType}
                    onChange={(e) => setAttrType(e.target.value)}
                    className="input-field"
                  >
                    <option value="input">متنی (تایپ دستی)</option>
                    <option value="dropdown">لیست کشویی (Dropdown)</option>
                  </select>
                </div>
                {attrType === "dropdown" && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      گزینه‌ها (با کاما جدا کنید)
                    </label>
                    <input
                      type="text"
                      value={attrOptions}
                      onChange={(e) => setAttrOptions(e.target.value)}
                      className="input-field"
                      placeholder="مثال: 4GB, 8GB, 16GB"
                      required
                    />
                  </div>
                )}

                <div className="flex items-center justify-center gap-2 mt-4">
                  {editingAttrId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="bg-gray-400 text-white px-4 py-2 rounded-md font-bold hover:bg-gray-500 transition"
                    >
                      انصراف
                    </button>
                  )}
                  <SubmitBtn
                    onClick={handleAddOrUpdateAttribute}
                    title={editingAttrId ? "ذخیره تغییرات" : "افزودن ویژگی"}
                    isLoading={createMutation.isPending || updateMutation.isPending}
                  />
                </div>
              </form>
            </>
          )}
        </div>

        {/* پنل سمت چپ: لیست ویژگی‌های موجود */}
        <div className="lg:col-span-2 bg-white p-6 rounded-md shadow-md border border-gray-100">
          <h2 className="font-bold text-lg mb-4 flex justify-between">
            <span>لیست ویژگی‌های تعریف شده</span>
            {selectedTool && (
              <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                {selectedTool}
              </span>
            )}
          </h2>

          {!selectedCategory || !selectedTool ? (
            <div className="text-center text-gray-400 py-10">
              لطفاً از پنل سمت راست، کمپنی و ابزار را انتخاب کنید.
            </div>
          ) : attributes.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              هنوز ویژگی برای این ابزار تعریف نشده است.
            </div>
          ) : (
            <div className="gap-4 space-y-1">
              {attributes.map((attr) => (
                <div
                  key={attr.id}
                  className="bg-gray-100 p-4 flex items-center gap-x-5 rounded-md border border-gray-200 relative group"
                >
                  <h3 className="font-bold text-gray-800">{attr.name}</h3>
                  <span className="text-xs bg-gray-200 px-2 py-0.5 rounded text-gray-600 ml-2">
                    {attr.attribute_type === "input" ? "متنی" : "لیست"}
                  </span>

                  {attr.attribute_type === "dropdown" && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {attr.attribute_value.map((val, i) => (
                        <span
                          key={i}
                          className="text-xs bg-white border px-2 py-1 rounded"
                        >
                          {val}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="absolute top-3 left-3 flex gap-3 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => handleEditClick(attr)}
                      className="text-amber-500 hover:text-amber-600 transition"
                      title="ویرایش ویژگی"
                    >
                      <FaRegEdit size={16} />
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(attr.id)}
                      className="text-red-400 hover:text-red-600 transition"
                      title="حذف ویژگی"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttributeManager;