import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { fetchWebDownloads, createWebDownload, deleteWebDownload } from "../../services/api";
import { FaTrash, FaPlus, FaDownload, FaWindows, FaApple, FaLinux, FaFileArchive } from "react-icons/fa";
import { Loader2, HardDrive, Globe, Link as LinkIcon } from "lucide-react";
import Swal from "sweetalert2";

const WebDownloadManager = () => {
    const { accessToken: token } = useSelector((state) => state.user);
    const queryClient = useQueryClient();

    const [form, setForm] = useState({
        title: "",
        version: "",
        category: "پرینتر",
        file_size: "",
        os_support: "",
        download_link: "",
        description: ""
    });
    const [selectedFile, setSelectedFile] = useState(null);

    const { data: downloadData, isLoading } = useQuery({
        queryKey: ["webDownloads"],
        queryFn: fetchWebDownloads
    });

    const downloads = useMemo(() => {
        if (!downloadData) return [];
        return Array.isArray(downloadData) ? downloadData : (downloadData.results || []);
    }, [downloadData]);

    const createMutation = useMutation({
        mutationFn: (formData) => createWebDownload(token, formData),
        onSuccess: () => {
            queryClient.invalidateQueries(["webDownloads"]);
            setForm({ title: "", version: "", category: "پرینتر", file_size: "", os_support: "", download_link: "", description: "" });
            setSelectedFile(null);
            Swal.fire("موفق", "فایل دانلود اضافه شد", "success");
        },
        onError: (err) => Swal.fire("خطا", err.response?.data?.detail || "مشکلی در آپلود پیش آمد", "error")
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => deleteWebDownload(token, id),
        onSuccess: () => {
            queryClient.invalidateQueries(["webDownloads"]);
            Swal.fire("حذف شد", "فایل حذف گردید", "success");
        }
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.title) return Swal.fire("خطا", "عنوان الزامی است", "warning");
        if (!selectedFile && !form.download_link) return Swal.fire("خطا", "باید یا فایل انتخاب کنید یا لینک دانلود را وارد کنید", "warning");

        const formData = new FormData();
        Object.keys(form).forEach(key => formData.append(key, form[key]));
        if (selectedFile) {
            formData.append("file", selectedFile);
        }

        createMutation.mutate(formData);
    };

    return (
      <div className="p-6 bg-white rounded-md " dir="rtl">
        <h1 className="text-2xl font-bold mb-8 text-gray-800 flex items-center gap-3">
          <FaDownload className="text-black" /> مدیریت مرکز دانلود
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="bg-white p-6 rounded-md shadow-lg border border-gray-100 h-fit">
            <h2 className="font-bold text-lg mb-4 text-gray-700">افزودن فایل جدید</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">عنوان فایل / درایور</label>
                <input name="title" value={form.title} onChange={handleChange} className="input-field" placeholder="مثال: HP LaserJet Driver" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">نسخه</label>
                  <input name="version" value={form.version} onChange={handleChange} className="input-field" placeholder="v1.0.2" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">حجم</label>
                  <input name="file_size" value={form.file_size} onChange={handleChange} className="input-field" placeholder="50 MB" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">دسته‌بندی</label>
                  <select name="category" value={form.category} onChange={handleChange} className="input-field">
                    <option value="پرینتر">پرینتر</option>
                    <option value="اسکنر">اسکنر</option>
                    <option value="نرم‌افزار">نرم‌افزار جانبی</option>
                    <option value="کاتالوگ">کاتالوگ / راهنما</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">سیستم عامل</label>
                  <input name="os_support" value={form.os_support} onChange={handleChange} className="input-field" placeholder="Win 10, Mac" />
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <label className="block text-xs font-bold text-blue-700 mb-2 flex items-center gap-1"><FaFileArchive /> آپلود فایل (ZIP, EXE, ...)</label>
                <input type="file" onChange={handleFileChange} className="text-xs text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700" />
              </div>

              <div className="text-center text-xs text-gray-400">--- یا ---</div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 flex items-center gap-1"><LinkIcon size={12}/> لینک مستقیم دانلود</label>
                <input name="download_link" value={form.download_link} onChange={handleChange} className="input-field" placeholder="https://example.com/file.zip" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">توضیحات</label>
                <textarea name="description" value={form.description} onChange={handleChange} className="input-field h-20" placeholder="توضیحات تکمیلی..."></textarea>
              </div>

              <button type="submit" disabled={createMutation.isPending} className="w-full bg-black text-white py-3 rounded-md font-bold hover:bg-gray-800 transition flex justify-center items-center gap-2">
                {createMutation.isPending ? <Loader2 className="animate-spin" /> : <><FaPlus /> ثبت فایل</>}
              </button>
            </form>
          </div>

          {/* List Section */}
          <div className="lg:col-span-2 space-y-4">
            {isLoading ? <div className="text-center p-10"><Loader2 className="animate-spin mx-auto text-indigo-600" /></div> :
            downloads.map((item) => (
                <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-start md:items-center group hover:border-indigo-200 transition">
                  <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600"><HardDrive size={24} /></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg text-gray-800">{item.title}</h3>
                      <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">{item.category}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                    <div className="flex flex-wrap gap-3 mt-3 text-xs font-bold text-gray-600">
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">{item.version}</span>
                      <span className="bg-green-50 text-green-700 px-2 py-1 rounded">{item.file_size}</span>
                      <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded">{item.os_support}</span>
                    </div>
                    {item.file ? (
                        <a href={item.file} target="_blank" rel="noreferrer" className="text-xs text-green-600 mt-2 font-bold block hover:underline">📥 دانلود فایل آپلود شده</a>
                    ) : (
                        <a href={item.download_link} target="_blank" rel="noreferrer" className="text-xs text-indigo-500 mt-2 block hover:underline truncate dir-ltr text-left">{item.download_link}</a>
                    )}
                  </div>
                  <button onClick={() => Swal.fire({title: "حذف؟", icon: "warning", showCancelButton: true}).then(r => r.isConfirmed && deleteMutation.mutate(item.id))} className="text-red-400 bg-red-50 p-3 rounded-xl hover:bg-red-100 transition opacity-0 group-hover:opacity-100"><FaTrash /></button>
                </div>
            ))}
          </div>
        </div>
      </div>
    );
};

export default WebDownloadManager;