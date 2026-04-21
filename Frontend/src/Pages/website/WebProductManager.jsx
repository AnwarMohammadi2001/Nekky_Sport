import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { 
    fetchWebProducts, 
    createWebProduct, 
    deleteWebProduct, 
    fetchWebCategories 
} from "../../services/api";
import { 
    FaPlus, FaCheck, FaArrowLeft, FaArrowRight, 
    FaTrash, FaBox, FaLayerGroup, FaTags 
} from "react-icons/fa";
import Select from "react-select";
import Swal from "sweetalert2";
import { Loader2 } from "lucide-react";

const WebProductManager = () => {
    const { accessToken: token } = useSelector((state) => state.user);
    const queryClient = useQueryClient();
    const [step, setStep] = useState(1);

    // استیت‌های سلسله مراتبی
    const [selMain, setSelMain] = useState(null);
    const [selSub, setSelSub] = useState(null);
    const [selBrand, setSelBrand] = useState(null);

    // دیتای فرم محصول
    const [form, setForm] = useState({ title: "", price: "", old_price: "", description: "", in_stock: true, is_new: true, is_bestseller: false });
    const [mainImage, setMainImage] = useState(null);
    const [gallery, setGallery] = useState([]);
    const [specs, setSpecs] = useState({});

    // دریافت داده‌ها از API
    const { data: catData } = useQuery({ queryKey: ["webCategories"], queryFn: fetchWebCategories });
    const { data: prodData, isLoading: isProdLoading } = useQuery({ 
        queryKey: ["webProducts"], 
        queryFn: () => fetchWebProducts() 
    });

    // استخراج ایمن دسته‌ها و محصولات
    const categories = useMemo(() => Array.isArray(catData) ? catData : (catData?.results || []), [catData]);
    const products = useMemo(() => Array.isArray(prodData) ? prodData : (prodData?.results || []), [prodData]);

    // گزینه‌های منوهای کشویی (Dropdowns)
    const mainOps = useMemo(() => categories.filter(c => c.type === "main").map(c => ({ value: c.id, label: c.name })), [categories]);
    const subOps = useMemo(() => selMain ? categories.filter(c => c.type === "sub" && c.parent === selMain.value).map(c => ({ value: c.id, label: c.name })) : [], [selMain, categories]);
    const brandOps = useMemo(() => selSub ? categories.filter(c => c.type === "brand" && c.parent === selSub.value).map(c => ({ value: c.id, label: c.name, attributes: c.attributes })) : [], [selSub, categories]);

    // اکشن ثبت محصول
    const createMutation = useMutation({
        mutationFn: (fd) => createWebProduct(token, fd),
        onSuccess: () => {
            queryClient.invalidateQueries(["webProducts"]);
            Swal.fire("موفق", "محصول با موفقیت در سایت منتشر شد", "success");
            resetAll();
        },
        onError: () => Swal.fire("خطا", "ارسال اطلاعات ناموفق بود. فیلدهای اجباری را چک کنید.", "error")
    });

    // اکشن حذف محصول
    const deleteMutation = useMutation({
        mutationFn: (id) => deleteWebProduct(token, id),
        onSuccess: () => {
            queryClient.invalidateQueries(["webProducts"]);
            Swal.fire("حذف شد", "محصول از ویترین سایت حذف گردید", "success");
        }
    });

    const resetAll = () => {
        setStep(1);
        setForm({ title: "", price: "", old_price: "", description: "", in_stock: true, is_new: true, is_bestseller: false });
        setMainImage(null); setGallery([]); setSpecs({});
        setSelMain(null); setSelSub(null); setSelBrand(null);
    };

    const handlePublish = () => {
        if (!form.description || !mainImage) return Swal.fire("خطا", "توضیحات و عکس کاور اجباری است", "warning");
        const fd = new FormData();
        Object.keys(form).forEach(k => fd.append(k, form[k]));
        fd.append("category", selBrand.value);
        fd.append("specs", JSON.stringify(specs));
        fd.append("image", mainImage);
        gallery.forEach(f => fd.append("uploaded_images", f));
        createMutation.mutate(fd);
    };

    return (
      <div className="p-6" dir="rtl">
        {/* --- فرم ثبت محصول جدید --- */}
        <div className="bg-white p-8 rounded-md border shadow-sm mb-12">
          <h2 className="text-xl font-black mb-8 flex items-center gap-3 text-gray-800">
            <FaBox className="text-cyan-700" /> افزودن محصول جدید به سایت
          </h2>

          {/* Stepper */}
          <div className="flex justify-around mb-12 relative px-10">
            <div className="absolute top-1/2 w-full h-0.5 bg-gray-100 -z-10"></div>
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-sm transition-all duration-300 ${step >= s ? "bg-black text-white scale-110" : "bg-gray-100 text-gray-400"}`}
              >
                {s === 1 ? (
                  <FaLayerGroup />
                ) : s === 2 ? (
                  <FaCheck />
                ) : (
                  <FaTags />
                )}
              </div>
            ))}
          </div>

          {/* مرحله ۱: انتخاب شاخه */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs font-bold text-gray-400">
                    ۱. دسته اصلی
                  </label>
                  <Select
                    options={mainOps}
                    value={selMain}
                    onChange={(v) => {
                      setSelMain(v);
                      setSelSub(null);
                      setSelBrand(null);
                    }}
                    placeholder="انتخاب..."
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400">
                    ۲. زیردسته
                  </label>
                  <Select
                    options={subOps}
                    value={selSub}
                    isDisabled={!selMain}
                    onChange={(v) => {
                      setSelSub(v);
                      setSelBrand(null);
                    }}
                    placeholder="انتخاب..."
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400">
                    ۳. برند (هدف)
                  </label>
                  <Select
                    options={brandOps}
                    value={selBrand}
                    isDisabled={!selSub}
                    onChange={setSelBrand}
                    placeholder="انتخاب..."
                  />
                </div>
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!selBrand}
                className="w-full bg-black text-white py-4 rounded-md font-bold mt-4 disabled:bg-gray-200"
              >
                مرحله بعد
              </button>
            </div>
          )}

          {/* مرحله ۲: اطلاعات محصول */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  className="input-field"
                  placeholder="نام محصول"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
                <div className="flex gap-2">
                  <input
                    className="input-field"
                    type="number"
                    placeholder="قیمت فروش"
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                  />
                  <input
                    className="input-field border-red-100 text-red-400"
                    type="number"
                    placeholder="قیمت قبل (تخفیف)"
                    onChange={(e) =>
                      setForm({ ...form, old_price: e.target.value })
                    }
                  />
                </div>
              </div>
              <textarea
                className="input-field h-24"
                placeholder="توضیحات معرفی (اجباری)..."
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
              <div className="flex flex-wrap gap-6 bg-gray-50 p-4 rounded-2xl border border-dashed text-sm font-bold">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.in_stock}
                    onChange={(e) =>
                      setForm({ ...form, in_stock: e.target.checked })
                    }
                  />{" "}
                  موجود در سایت
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.is_new}
                    onChange={(e) =>
                      setForm({ ...form, is_new: e.target.checked })
                    }
                  />{" "}
                  برچسب جدید
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border rounded-2xl">
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">
                    ۱. عکس کاور (اصلی):
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setMainImage(e.target.files[0])}
                  />
                </div>
                <div className="p-4 border rounded-2xl">
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">
                    ۲. گالری تصاویر:
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => setGallery(Array.from(e.target.files))}
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="w-1/3 bg-gray-200 py-4 rounded-2xl font-bold"
                >
                  برگشت
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={
                    !form.title ||
                    !form.price ||
                    !form.description ||
                    !mainImage
                  }
                  className="w-2/3 btn-primary py-4 rounded-2xl"
                >
                  مرحله بعد
                </button>
              </div>
            </div>
          )}

          {/* مرحله ۳: مشخصات فنی */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="font-bold border-b pb-4 text-xl flex items-center gap-2">
                <FaTags className="text-blue-500" /> مشخصات فنی برند{" "}
                {selBrand?.label}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-8 rounded-3xl border">
                {selBrand?.attributes?.map((attr) => (
                  <div key={attr.id} className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 block">
                      {attr.name}:
                    </label>
                    <input
                      className="w-full p-4 border rounded-2xl outline-none focus:ring-1 focus:ring-black"
                      placeholder={`مقدار ${attr.name}`}
                      onChange={(e) =>
                        setSpecs({ ...specs, [attr.name]: e.target.value })
                      }
                    />
                  </div>
                ))}
                {(!selBrand?.attributes ||
                  selBrand.attributes.length === 0) && (
                  <p className="text-center py-6 text-gray-400 col-span-2">
                    ویژگی فنی برای این برند تعریف نشده است.
                  </p>
                )}
              </div>
              <div className="flex gap-4 pt-6">
                <button
                  onClick={() => setStep(2)}
                  className="w-1/3 bg-gray-200 py-4 rounded-2xl font-bold"
                >
                  برگشت
                </button>
                <button
                  onClick={handlePublish}
                  disabled={createMutation.isPending}
                  className="w-2/3 bg-green-600 text-white py-4 rounded-2xl font-bold shadow-lg"
                >
                  {createMutation.isPending ? (
                    <Loader2 className="animate-spin mx-auto" />
                  ) : (
                    "انتشار نهایی محصول در ویترین"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* --- لیست محصولات منتشر شده (ویترین) --- */}
        <h3 className="font-black text-xl mb-8 flex items-center gap-3">
          <FaBox className="text-gray-400" /> محصولات منتشر شده در 
          وب‌سایت
          <span className="bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-full">
            {products.length} محصول
          </span>
        </h3>

        <div className=" gap-6">
          {isProdLoading ? (
            <div className="col-span-full text-center py-20">
              <Loader2 className="animate-spin mx-auto text-blue-600" />
            </div>
          ) : products.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed text-gray-400 font-bold">
              هنوز محصولی در  سایت ثبت نشده است.
            </div>
          ) : (
            products.map((p) => (
              <div
                key={p.id}
                className="bg-white flex items-center h-[80px] px-5 py-2 justify-between  rounded-md border shadow-sm group hover:border-black transition-all relative overflow-hidden"
              >
                <div className="h-40 bg-gray-50 rounded-2xl  flex items-center justify-center p-2 relative overflow-hidden">
                  <img
                    src={p.image}
                    className="h-14 w-14 rounded-full  mix-blend-multiply"
                    alt={p.title}
                  />
                </div>

                <p className="font-bold text-xs truncate text-gray-800 mb-1">
                  {p.is_new && (
                    <span className="  bg-black text-white  px-2 py-0.5 rounded-full z-10">
                      جدید
                    </span>
                  )}
                </p>
                <p className="font-bold text-xs truncate text-gray-800 mb-1">
                  {!p.in_stock && (
                    <div className="  bg-white/60 flex items-center justify-center font-bold text-red-600">
                      ناموجود
                    </div>
                  )}
                </p>
                <h4 className="font-bold  truncate text-gray-800 ">
                  {p.title}
                </h4>
                <p className=" text-blue-500 font-bold ">
                  {p.category_name}
                </p>

                <div className="flex  items-center  gap-x-10 ">
                  <div className="flex flex-col">
                    <span className="text-red-600 font-black ">
                      {Number(p.price).toLocaleString()}{" "}
                      <small className="">AF</small>
                    </span>
                    {p.old_price > 0 && (
                      <span className="text-[9px] text-gray-400 line-through decoration-red-300">
                        {Number(p.old_price).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() =>
                      Swal.fire({
                        title: "حذف از ویترین؟",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#d33",
                      }).then(
                        (r) => r.isConfirmed && deleteMutation.mutate(p.id),
                      )
                    }
                    className="text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
};

export default WebProductManager;