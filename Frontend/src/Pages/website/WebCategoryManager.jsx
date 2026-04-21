import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { 
  fetchWebCategories, createWebCategory, updateWebCategory, deleteWebCategory, 
  createWebAttribute, updateWebAttribute, deleteWebAttribute 
} from "../../services/api";
import { 
  FaTrash, FaPlus, FaLayerGroup, FaTags, FaSitemap, 
  FaFolder, FaCubes, FaApple, FaChevronLeft, FaInfoCircle, FaSearch, FaCheckCircle, FaEdit, FaTimes
} from "react-icons/fa";
import Select from "react-select";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";

const WebCategoryManager = () => {
    const { accessToken: token } = useSelector((state) => state.user);
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState("main");

    // استیت‌های فرم
    const [name, setName] = useState("");
    const [selectedParent, setSelectedParent] = useState(null); 
    const [image, setImage] = useState(null);
    const [attrName, setAttrName] = useState("");

    // استیت‌های ویرایش
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // دریافت داده‌ها
    const { data: catData } = useQuery({ 
        queryKey: ["webCategories"], 
        queryFn: fetchWebCategories 
    });

    const categories = useMemo(() => {
        return Array.isArray(catData) ? catData : (catData?.results || []);
    }, [catData]);

    const mainCats = useMemo(() => categories.filter(c => c.type === "main"), [categories]);
    const subCats = useMemo(() => categories.filter(c => c.type === "sub"), [categories]);
    const brands = useMemo(() => categories.filter(c => c.type === "brand"), [categories]);

    const finalListToDisplay = useMemo(() => {
        if (activeTab === "main") return mainCats;
        if (!selectedParent) return [];
        if (activeTab === "attr") {
            const selectedBrandObj = categories.find(c => c.id === selectedParent.value);
            return selectedBrandObj ? selectedBrandObj.attributes : [];
        }
        return categories.filter(c => c.parent === selectedParent.value);
    }, [activeTab, mainCats, selectedParent, categories]);

    // Mutations
    const mutation = useMutation({
        mutationFn: (fd) => isEditMode ? updateWebCategory(token, editingId, fd) : createWebCategory(token, fd),
        onSuccess: () => {
            queryClient.invalidateQueries(["webCategories"]);
            Swal.fire({ icon: 'success', title: isEditMode ? 'بروزرسانی شد' : 'ثبت شد', timer: 1500, showConfirmButton: false });
            resetForm();
        },
        onError: (err) => Swal.fire("خطا", "عملیات ناموفق بود", "error")
    });

    const resetForm = () => {
        setName("");
        setImage(null);
        setAttrName("");
        setIsEditMode(false);
        setEditingId(null);
    };

    const handleAdd = (type) => {
        if (!name) return Swal.fire("خطا", "نام الزامی است", "error");
        if (type !== "main" && !selectedParent) return Swal.fire("خطا", "ابتدا والد را انتخاب کنید", "warning");

        const fd = new FormData();
        fd.append("name", name);
        fd.append("type", type);
        if (selectedParent) fd.append("parent", selectedParent.value);
        if (image) fd.append("image", image);
        
        mutation.mutate(fd);
    };

    const handleEditClick = (item) => {
        setIsEditMode(true);
        setEditingId(item.id);
        setName(item.name);
        // اگر ویژگی باشد (attr)، attrName را پر کن
        if (activeTab === "attr") setAttrName(item.name);
    };

    const handleAddAttribute = () => {
        if (!selectedParent) return Swal.fire("خطا", "برند را انتخاب کنید", "warning");
        if (!attrName) return Swal.fire("خطا", "نام ویژگی را وارد کنید", "error");
        
        const promise = isEditMode 
            ? updateWebAttribute(token, editingId, { name: attrName })
            : createWebAttribute(token, { category: selectedParent.value, name: attrName });

        promise.then(() => {
            queryClient.invalidateQueries(["webCategories"]);
            resetForm();
            Swal.fire({ icon: 'success', title: 'ویژگی ذخیره شد', timer: 1000, showConfirmButton: false });
        });
    };

    const handleDelete = (id, isAttr = false) => {
        Swal.fire({
            title: "حذف شود؟",
            text: isAttr ? "این ویژگی حذف می‌شود." : "زیرمجموعه‌ها هم حذف می‌شوند!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "بله، حذف کن"
        }).then(res => {
            if (res.isConfirmed) {
                const promise = isAttr ? deleteWebAttribute(token, id) : deleteWebCategory(token, id);
                promise.then(() => queryClient.invalidateQueries(["webCategories"]));
            }
        });
    };

    return (
        <div className="p-6 bg-white rounded-md shadow-md border border-gray-100 h-[calc(100vh-140px)] flex flex-col" dir="rtl">
            <div className="flex items-center justify-between mb-6 shrink-0">
                <h1 className="text-2xl font-black text-gray-800 flex items-center gap-3">
                    <FaLayerGroup className="text-cyan-700" /> مدیریت ساختار بندی وب سایت
                </h1>
            </div>

            {/* نوار تب‌ها */}
            <div className="flex flex-wrap gap-2 mb-6 bg-gray-50 px-4 py-2 rounded-md w-fit border border-gray-100 shrink-0">
                {[
                    { id: "main", label: "۱. دسته‌های اصلی", icon: <FaFolder /> },
                    { id: "sub", label: "۲. زیر دسته‌ها", icon: <FaCubes /> },
                    { id: "brand", label: "۳. برندها", icon: <FaApple /> },
                    { id: "attr", label: "۴. ویژگی‌های فنی", icon: <FaTags /> },
                    { id: "tree", label: "۵. نقشه سایت", icon: <FaSitemap /> }
                ].map(tab => (
                    <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSelectedParent(null); resetForm(); }}
                        className={`flex items-center gap-2 px-6 py-3 rounded-md font-black text-xs transition-all ${activeTab === tab.id ? "bg-black text-white shadow-xl scale-105" : "text-gray-500 hover:bg-gray-200"}`}>
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-hidden relative">
                <AnimatePresence mode="wait">
                    <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="h-full">
                        {activeTab === "tree" ? (
                            <div className="h-full overflow-y-auto custom-scrollbar pb-10 pr-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {mainCats.map(main => (
                                        <div key={main.id} className="bg-gray-50 rounded-md border border-gray-200 overflow-hidden shadow-sm h-fit">
                                            <div className="bg-gray-800 p-5 flex items-center justify-between">
                                                <h4 className="text-white font-black flex items-center gap-2"><FaFolder className="text-yellow-400"/> {main.name}</h4>
                                            </div>
                                            
                                            <div className="p-4 space-y-4">
                                                {categories.filter(s => s.parent === main.id).map(sub => (
                                                    <div key={sub.id} className="bg-white p-4 rounded-3xl border border-gray-100">
                                                        <p className="font-black text-blue-600 text-xs mb-3 flex items-center gap-2"><FaChevronLeft size={8}/> {sub.name}</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {categories.filter(b => b.parent === sub.id).map(brand => (
                                                                <div key={brand.id} className="bg-gray-50 px-3 py-1 rounded-xl border border-gray-200 text-[10px] font-bold text-gray-500 flex items-center gap-2">
                                                                    {brand.name}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 h-full overflow-hidden">
                                {/* ستون فرم */}
                                <div className="bg-gray-50 p-8 rounded-md border border-gray-200 h-fit">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-2 text-cyan-700">
                                            {isEditMode ? <FaEdit size={18}/> : <FaPlus size={18}/>}
                                            <h3 className="font-black text-lg uppercase">{isEditMode ? "ویرایش آیتم" : "افزودن جدید"}</h3>
                                        </div>
                                        {isEditMode && <button onClick={resetForm} className="text-gray-400 hover:text-red-500 flex items-center gap-1 text-xs font-bold"><FaTimes/> انصراف</button>}
                                    </div>

                                    {activeTab === "main" && (
                                        <div className="space-y-5">
                                            <input className="input-field" placeholder="نام دسته اصلی" value={name} onChange={e => setName(e.target.value)} />
                                            <div className="bg-white p-3 rounded-xl border border-dashed border-gray-300">
                                                <label className="text-[10px] font-bold text-gray-400 block mb-2">تصویر آیکون (اختیاری):</label>
                                                <input type="file" className="text-xs w-full" onChange={e => setImage(e.target.files[0])} />
                                            </div>
                                            <button onClick={() => handleAdd("main")} className={`w-full py-4 rounded-md font-black shadow-lg transition-all ${isEditMode ? "bg-amber-500 text-white" : "bg-black text-white"}`}>
                                                {isEditMode ? "بروزرسانی تغییرات" : "ثبت دسته اصلی"}
                                            </button>
                                        </div>
                                    )}

                                    {(activeTab === "sub" || activeTab === "brand") && (
                                        <div className="space-y-5">
                                            <label className="text-xs font-black text-gray-400">انتخاب والد:</label>
                                            <Select 
                                                options={(activeTab === "sub" ? mainCats : subCats).map(c => ({ value: c.id, label: c.name }))} 
                                                onChange={setSelectedParent} 
                                                value={selectedParent}
                                                placeholder="جستجو و انتخاب..." 
                                            />
                                            <input className="input-field" placeholder={activeTab === "sub" ? "نام زیردسته" : "نام برند"} value={name} onChange={e => setName(e.target.value)} />
                                            <button onClick={() => handleAdd(activeTab)} className={`w-full py-4 rounded-md font-black shadow-lg ${isEditMode ? "bg-amber-500 text-white" : "bg-black text-white"}`}>
                                                {isEditMode ? "بروزرسانی زیرمجموعه" : (activeTab === "sub" ? "ذخیره زیر دسته" : "ذخیره برند")}
                                            </button>
                                        </div>
                                    )}

                                    {activeTab === "attr" && (
                                        <div className="space-y-5">
                                            <label className="text-xs font-black text-gray-400">انتخاب برند:</label>
                                            <Select options={brands.map(b => ({ value: b.id, label: b.name }))} onChange={setSelectedParent} value={selectedParent} placeholder="جستجوی برند..." />
                                            {selectedParent && (
                                                <div className="mt-4 p-5 bg-white rounded-md border shadow-inner">
                                                    <label className="text-[10px] font-black text-black block mb-2 uppercase">{isEditMode ? "ویرایش ویژگی:" : "ویژگی جدید:"}</label>
                                                    <div className="flex gap-2">
                                                        <input className="input-field" placeholder="مثل: حافظه داخلی" value={attrName} onChange={e => setAttrName(e.target.value)} />
                                                        <button onClick={handleAddAttribute} className={`px-5 rounded-xl text-white ${isEditMode ? "bg-amber-500" : "bg-black"}`}>
                                                            {isEditMode ? <FaCheckCircle/> : <FaPlus />}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* ستون لیست */}
                                <div className="border rounded-md p-6 bg-white shadow-sm flex flex-col h-full overflow-hidden">
                                    <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-4 shrink-0">
                                        <h3 className="font-black text-gray-800 text-sm">لیست آیتم‌ها</h3>
                                    </div>
                                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 pb-4">
                                        {finalListToDisplay.map(item => (
                                            <div key={item.id} className="flex justify-between items-center p-4 bg-gray-100 rounded-md border border-transparent hover:border-blue-200 transition-all group">
                                                <span className="font-bold text-gray-700 text-sm">{item.name}</span>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleEditClick(item)} className="text-amber-500 hover:bg-amber-50 p-2 rounded-lg" title="ویرایش"><FaEdit size={14}/></button>
                                                    <button onClick={() => handleDelete(item.id, activeTab === "attr")} className="text-red-300 hover:text-red-500 p-2 rounded-lg" title="حذف"><FaTrash size={14}/></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default WebCategoryManager;