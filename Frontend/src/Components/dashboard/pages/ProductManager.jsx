import React, { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { FaBoxOpen, FaSave, FaCheck, FaInfoCircle, FaArrowRight, FaSpinner, FaEdit } from "react-icons/fa";
import { fetchCategories, fetchAttributes, createProduct, updateProduct, fetchProducts } from "../../../services/api";
import CancelBtn from "../../../utils/CancelBtn";

const ProductManager = ({ initialData, onSuccess, onCancel }) => {
    const { accessToken: token } = useSelector((state) => state.user);
    const queryClient = useQueryClient();
    
    const isEditMode = !!initialData; // ✅ تشخیص حالت ویرایش

    // --- States ---
    const [selectedCategory, setSelectedCategory] = useState(initialData?.category || "");
    const [tools, setTools] = useState([]);
    const [selectedTool, setSelectedTool] = useState(initialData?.tool || "");
    const [fullName, setFullName] = useState(initialData?.full_name || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [isActive, setIsActive] = useState(initialData ? initialData.is_active : true);
    
    // ویژگی‌های داینامیک
    const [attrConfig, setAttrConfig] = useState([]); 
    const [attrValues, setAttrValues] = useState(initialData?.attributes || {}); 
    const [attrLoading, setAttrLoading] = useState(false);

    // ۱. دریافت دسته‌بندی‌ها
    const { data: categoryData } = useQuery({
      queryKey: ["categories", "all"],
      queryFn: () => fetchCategories(token, { page_size: 1000 }),
      enabled: !!token,
    });
    const categories = Array.isArray(categoryData) ? categoryData : (categoryData?.results || []);

    // ۲. دریافت لیست محصولات (برای چک کردن تکراری نبودن)
    const { data: productData } = useQuery({
        queryKey: ["products"],
        queryFn: () => fetchProducts(token, { page_size: 1000 }),
        enabled: !!token,
    });
    const existingProducts = Array.isArray(productData) ? productData : (productData?.results || []);

    // تنظیم ابزارها هنگام ویرایش یا تغییر دسته‌بندی
    useEffect(() => {
        if (selectedCategory && categories.length > 0) {
            const cat = categories.find(c => String(c.id) === String(selectedCategory));
            setTools(cat ? cat.tools : []);
        }
    }, [selectedCategory, categories]);

    // بارگذاری ویژگی‌های داینامیک ابزار
    useEffect(() => {
        const loadAttrs = async () => {
            if (selectedTool && selectedCategory) {
                setAttrLoading(true);
                try {
                    const response = await fetchAttributes(token, selectedCategory, selectedTool);
                    const attrs = Array.isArray(response) ? response : (response.results || []);
                    setAttrConfig(attrs);
                } catch (error) { console.error(error); } 
                finally { setAttrLoading(false); }
            }
        };
        loadAttrs();
    }, [selectedTool, selectedCategory, token]);

    // ۳. Mutation برای ثبت یا ویرایش
    const productMutation = useMutation({
        mutationFn: (payload) => isEditMode 
            ? updateProduct(token, initialData.id, payload) 
            : createProduct(token, payload),
        onSuccess: () => {
            queryClient.invalidateQueries(["products"]);
            Swal.fire({ title: "موفق!", text: isEditMode ? "محصول ویرایش شد." : "محصول ثبت شد.", icon: "success", timer: 2000, showConfirmButton: false });
            if (onSuccess) onSuccess();
        },
        onError: (error) => {
            const errMsg = error.response?.data?.non_field_errors?.[0] || error.response?.data?.detail || "خطایی رخ داد.";
            Swal.fire("خطا", errMsg, "error");
        }
    });

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        setSelectedTool(""); setAttrConfig([]); setAttrValues({});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedCategory || !selectedTool || !fullName) return Swal.fire("خطا", "فیلدهای اجباری را پر کنید.", "warning");

        // چک تکراری بودن (فقط اگر مشخصات اصلی تغییر کرده باشد)
        if (!isEditMode) {
            const isDuplicate = existingProducts.some(p => 
                String(p.category) === String(selectedCategory) && p.tool === selectedTool && p.full_name === fullName
            );
            if (isDuplicate) return Swal.fire("تکراری", "این محصول قبلاً ثبت شده است.", "error");
        }

        const payload = {
            category: selectedCategory,
            tool: selectedTool,
            full_name: fullName,
            description: description,
            attributes: attrValues,
            is_active: isActive
        };
        productMutation.mutate(payload);
    };

    return (
      <div className="p-4 sm:p-5 animate-fadeIn" dir="rtl">
        <button onClick={onCancel} className="flex items-center gap-2 text-gray-600 hover:text-cyan-700 mb-6 transition font-medium">
          <FaArrowRight /> بازگشت به لیست محصولات
        </button>

        <h1 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-3">
          <div className="p-3 bg-gray-100 rounded-md shadow-sm">
            {isEditMode ? <FaEdit className="text-amber-600 w-6 h-6" /> : <FaBoxOpen className="text-black w-6 h-6" />}
          </div>
          {isEditMode ? "ویرایش محصول" : "ثبت محصول جدید"}
        </h1>

        <div className="bg-white p-6 rounded-md shadow-md border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">۱. انتخاب کمپنی</label>
                <select className="input-field" value={selectedCategory} onChange={handleCategoryChange} required>
                  <option value="">-- انتخاب کنید --</option>
                  {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">۲. انتخاب نوع کالا (Tool)</label>
                <select className="input-field" value={selectedTool} onChange={(e) => setSelectedTool(e.target.value)} disabled={!selectedCategory} required>
                  <option value="">-- انتخاب کنید --</option>
                  {tools.map((t, i) => (<option key={i} value={t}>{t}</option>))}
                </select>
              </div>
            </div>

            {selectedTool && (
              <div className="bg-gray-50 p-6 rounded-md border border-gray-100 relative">
                {attrLoading && <div className="absolute inset-0 bg-white/50 flex items-center justify-center"><FaSpinner className="animate-spin text-indigo-600" /></div>}
                <h3 className="font-bold text-indigo-900 mb-6 flex items-center gap-2"><FaCheck /> مشخصات فنی</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {attrConfig.map((attr) => (
                    <div key={attr.id}>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5">{attr.name}</label>
                      {attr.attribute_type === "dropdown" ? (
                        <select className="w-full p-3 border rounded-md bg-white" value={attrValues[attr.name] || ""} onChange={(e) => setAttrValues({...attrValues, [attr.name]: e.target.value})} required>
                          <option value="">انتخاب...</option>
                          {attr.attribute_value.map((v, i) => (<option key={i} value={v}>{v}</option>))}
                        </select>
                      ) : (
                        <input type="text" className="input-field" value={attrValues[attr.name] || ""} onChange={(e) => setAttrValues({...attrValues, [attr.name]: e.target.value})} required placeholder={attr.name} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-6 pt-6 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                  <div className="md:col-span-3">
                      <label className="block text-sm font-bold text-gray-700 mb-2">نام کامل محصول</label>
                      <input type="text" className="input-field" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                  </div>
                  <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">وضعیت</label>
                      <button type="button" onClick={() => setIsActive(!isActive)} className={`w-full py-2.5 rounded-lg font-bold text-sm transition-all ${isActive ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                          {isActive ? "فعال" : "غیرفعال"}
                      </button>
                  </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">توضیحات</label>
                <textarea className="input-field" rows="3" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex gap-4">
              <CancelBtn onClick={onCancel} title="انصراف" />
              <button type="submit" disabled={productMutation.isPending} className={`flex-1 py-4 rounded-md font-bold text-lg shadow-lg flex justify-center items-center gap-3 transition-all ${productMutation.isPending ? "bg-gray-400" : "bg-cyan-700 text-white"}`}>
                {productMutation.isPending ? <FaSpinner className="animate-spin" /> : <><FaSave /> {isEditMode ? "ذخیره تغییرات" : "ثبت محصول"}</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
};

export default ProductManager;