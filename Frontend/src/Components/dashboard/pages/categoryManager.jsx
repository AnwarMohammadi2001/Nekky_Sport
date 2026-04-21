import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { FaBuilding, FaPlus, FaTimes, FaTrash, FaRegEdit } from "react-icons/fa";
import { fetchCategories, createCategory, updateCategory, deleteCategory } from "../../../services/api"; // updateCategory باید در api.js باشد
import CancelBtn from "../../../utils/CancelBtn";

const CategoryManager = () => {
    const { accessToken: token } = useSelector((state) => state.user);
    const queryClient = useQueryClient();

    // States
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null); // آیدی در حال ویرایش
    const [name, setName] = useState("");
    const [type, setType] = useState("mobile");
    const [tools, setTools] = useState([]);
    const [toolInput, setToolInput] = useState("");

    // Queries
    const { data: categoryData, isLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: () => fetchCategories(token),
        enabled: !!token,
    });

    const categories = Array.isArray(categoryData) ? categoryData : (categoryData?.results || []);

    // Mutations
    const createMutation = useMutation({
        mutationFn: (data) => createCategory(token, data),
        onSuccess: () => {
            Swal.fire("موفق", "کمپنی جدید ساخته شد", "success");
            resetForm();
            queryClient.invalidateQueries(["categories"]);
        },
        onError: () => Swal.fire("خطا", "مشکلی پیش آمد", "error")
    });

    const updateMutation = useMutation({
        mutationFn: (data) => updateCategory(token, editingId, data),
        onSuccess: () => {
            Swal.fire("موفق", "تغییرات ذخیره شد", "success");
            resetForm();
            queryClient.invalidateQueries(["categories"]);
        },
        onError: () => Swal.fire("خطا", "مشکلی در ویرایش پیش آمد", "error")
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => deleteCategory(token, id),
        onSuccess: () => {
            queryClient.invalidateQueries(["categories"]);
            Swal.fire("حذف شد", "", "success");
        }
    });

    // Handlers
    const resetForm = () => {
        setShowForm(false);
        setEditingId(null);
        setName("");
        setTools([]);
        setToolInput("");
        setType("mobile");
    };

    const handleEdit = (cat) => {
        setEditingId(cat.id);
        setName(cat.name);
        setType(cat.type);
        setTools(cat.tools || []);
        setShowForm(true);
        window.scrollTo(0, 0);
    };

    const handleAddTool = () => {
        if (toolInput.trim() && !tools.includes(toolInput.trim())) {
            setTools([...tools, toolInput.trim()]);
            setToolInput("");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { name, type, tools };
        
        if (editingId) {
            updateMutation.mutate(payload);
        } else {
            createMutation.mutate(payload);
        }
    };

    return (
      <div className="p-6" dir="rtl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-800">
            مدیریت کمپنی‌ها و ابزارها
          </h1>
          <button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="bg-black text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <FaPlus /> {showForm ? "بستن فرم" : "کمپنی جدید"}
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-md shadow-md mb-8 border border-gray-100">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FaBuilding /> {editingId ? "ویرایش اطلاعات" : "ثبت اطلاعات پایه"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    نام کمپنی
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    نوع فعالیت
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="input-field"
                  >
                    <option value="mobile">موبایل و لوازم جانبی</option>
                    <option value="printer">پرینتر و ماشین اداری</option>
                    <option value="scrubber">شوینده و اسکاج</option>
                  </select>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  تعریف ابزارها
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={toolInput}
                    onChange={(e) => setToolInput(e.target.value)}
                    className="input-field"
                    placeholder="نام ابزار و اینتر..."
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), handleAddTool())
                    }
                  />
                  <button
                    type="button"
                    onClick={handleAddTool}
                    className="bg-cyan-800 text-white px-4 rounded-md"
                  >
                    افزودن
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tools.map((t, i) => (
                    <span
                      key={i}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg flex items-center gap-2 text-sm font-bold"
                    >
                      {t}{" "}
                      <FaTimes
                        className="cursor-pointer hover:text-red-500"
                        onClick={() => setTools(tools.filter((x) => x !== t))}
                      />
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <CancelBtn onClick={resetForm} title="انصراف" />
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-md font-bold"
                >
                  {editingId ? "ذخیره تغییرات" : "ثبت نهایی"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white  shadow-md rounded-t-md overflow-hidden">
          <table className="w-full text-center">
            <thead className="bg-slate-900 text-gray-100">
              <tr>
                <th className="px-5 py-3"> شماره</th>
                <th className="px-5 py-3">نام کمپنی</th>
                <th className="px-5 py-3">نوع</th>
                <th className="px-5 py-3">ابزارها</th>
                <th className="px-5 py-3 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center">
                    ...
                  </td>
                </tr>
              ) : (
                categories.map((cat, index) => (
                  <tr key={cat.id} className="border-b hover:bg-gray-100 border-gray-200 odd:bg-gray-100">
                    <td className="px-5 py-3 font-bold">{index +1}</td>
                    <td className="px-5 py-3 font-bold">{cat.name}</td>
                    <td className="px-5 py-3 ">{cat.type}</td>
                    <td className="px-5 py-3 text-sm text-gray-600">
                      {cat.tools && cat.tools.join(", ")}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="text-green-600 hover:bg-amber-50 p-2 rounded transition"
                          title="ویرایش"
                        >
                          <FaRegEdit size={20} />
                        </button>
                        <button
                          onClick={() =>
                            Swal.fire({
                              title: "حذف؟",
                              icon: "warning",
                              showCancelButton: true,
                            }).then((r) => {
                              if (r.isConfirmed) deleteMutation.mutate(cat.id);
                            })
                          }
                          className="text-red-500 hover:bg-red-50 p-2 rounded transition"
                          title="حذف"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
};
export default CategoryManager;