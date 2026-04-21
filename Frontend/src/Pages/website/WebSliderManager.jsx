import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import {
  fetchWebSliders,
  createWebSlider,
  deleteWebSlider,
} from "../../services/api";
import { FaTrash, FaPlus, FaCheckCircle } from "react-icons/fa";
import { Loader2, Image as ImageIcon } from "lucide-react";
import Swal from "sweetalert2";

const WebSliderManager = () => {
  const { accessToken: token } = useSelector((state) => state.user);
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const { data: sliderData, isLoading } = useQuery({
    queryKey: ["webSliders"],
    queryFn: fetchWebSliders,
  });

  // ✅✅✅ اصلاح حیاتی: استخراج امن آرایه از داخل آبجکت صفحه‌بندی
  const sliders = useMemo(() => {
    if (!sliderData) return [];
    return Array.isArray(sliderData) ? sliderData : sliderData.results || [];
  }, [sliderData]);

  const createMutation = useMutation({
    mutationFn: (formData) => createWebSlider(token, formData),
    onSuccess: () => {
      queryClient.invalidateQueries(["webSliders"]);
      setTitle("");
      setDesc("");
      setImage(null);
      setPreview(null);
      Swal.fire("موفق", "اسلایدر افزوده شد", "success");
    },
    onError: (err) =>
      Swal.fire(
        "خطا",
        err.response?.data?.detail || "آپلود انجام نشد",
        "error",
      ),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteWebSlider(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries(["webSliders"]);
      Swal.fire("حذف شد", "اسلایدر حذف گردید", "success");
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!image)
      return Swal.fire("خطا", "لطفاً یک تصویر انتخاب کنید", "warning");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", desc);
    formData.append("image", image);
    formData.append("active", "true");

    createMutation.mutate(formData);
  };

  return (
    <div className="p-6 bg-gray-50 rounded-md" dir="rtl">
      <h1 className="text-2xl font-bold mb-8 text-gray-800 flex items-center gap-3">
        <ImageIcon className="text-black" /> مدیریت اسلایدر صفحه اصلی
      </h1>
      <div className="gap-8">
        {/* Form */}
        <div className="bg-white p-6 rounded-md shadow-lg border border-gray-100 h-fit">
          <h2 className="font-bold text-lg mb-4 text-gray-700">
            افزودن اسلاید جدید
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">
                عنوان اصلی
              </label>
              <input
                type="text"
                className="input-field "
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: جشنواره تابستانه"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">
                توضیحات کوتاه
              </label>
              <textarea
                className="input-field "
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="توضیحات روی عکس..."
              ></textarea>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">
                تصویر پس‌زمینه (1920x600)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:bg-gray-50 transition relative">
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleImageChange}
                  accept="image/*"
                />
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-40 mx-auto rounded-lg shadow-sm"
                  />
                ) : (
                  <div className="text-gray-400">
                    <FaPlus className="mx-auto mb-2 text-2xl" />
                    <span className="text-xs">
                      کلیک کنید یا عکس را اینجا رها کنید
                    </span>
                  </div>
                )}
              </div>
            </div>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full bg-black text-white py-3 rounded-md font-bold hover:bg-gray-800 transition flex justify-center items-center gap-2"
            >
              {createMutation.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <FaCheckCircle /> افزودن اسلاید جدید
                </>
              )}
            </button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <div className="text-center p-10">
              <Loader2 className="animate-spin mx-auto text-indigo-600" />
            </div>
          ) : sliders.length === 0 ? (
            <div className="text-center text-gray-400 p-10 bg-white rounded-2xl border border-dashed">
              هیچ اسلایدی وجود ندارد.
            </div>
          ) : (
            sliders.map((slide) => (
              <div
                key={slide.id}
                className="bg-white p-4 rounded-md shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center group hover:shadow-md transition"
              >
                <div className="w-full md:w-48 h-28 rounded-xl overflow-hidden relative border border-gray-200">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition"></div>
                </div>
                <div className="flex-1 text-center md:text-right">
                  <h3 className="font-bold text-lg text-gray-800">
                    {slide.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {slide.description}
                  </p>
                  <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-[10px] rounded-lg font-bold">
                    فعال در سایت
                  </span>
                </div>
                <button
                  onClick={() =>
                    Swal.fire({
                      title: "حذف؟",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#d33",
                    }).then((r) => {
                      if (r.isConfirmed) deleteMutation.mutate(slide.id);
                    })
                  }
                  className="text-red-500 bg-red-50 p-3 rounded-xl hover:bg-red-100 transition"
                >
                  <FaTrash />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
export default WebSliderManager;
