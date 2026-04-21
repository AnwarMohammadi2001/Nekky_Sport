import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { fetchWebBranches, createWebBranch, deleteWebBranch } from "../../services/api";
import { FaTrash, FaPlus, FaMapMarkerAlt, FaPhone, FaUserTie } from "react-icons/fa";
import { Loader2, MapPin } from "lucide-react";
import Swal from "sweetalert2";

const WebBranchManager = () => {
    const { accessToken: token } = useSelector((state) => state.user);
    const queryClient = useQueryClient();

    const [form, setForm] = useState({
        name: "",
        location: "",
        manager_name: "",
        phone: "",
        map_link: ""
    });

    const { data: branchData, isLoading } = useQuery({
        queryKey: ["webBranches"],
        queryFn: fetchWebBranches
    });

    // استخراج امن دیتا (حل مشکل map)
    const branches = useMemo(() => {
        if (!branchData) return [];
        return Array.isArray(branchData) ? branchData : (branchData.results || []);
    }, [branchData]);

    const createMutation = useMutation({
        mutationFn: (data) => createWebBranch(token, data),
        onSuccess: () => {
            queryClient.invalidateQueries(["webBranches"]);
            setForm({ name: "", location: "", manager_name: "", phone: "", map_link: "" });
            Swal.fire("موفق", "شعبه جدید اضافه شد", "success");
        },
        onError: (err) => Swal.fire("خطا", err.response?.data?.detail || "خطا در ثبت", "error")
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => deleteWebBranch(token, id),
        onSuccess: () => {
            queryClient.invalidateQueries(["webBranches"]);
            Swal.fire("حذف شد", "شعبه حذف گردید", "success");
        }
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name || !form.phone) return Swal.fire("خطا", "نام و شماره تماس الزامی است", "warning");
        createMutation.mutate(form);
    };

    return (
      <div className="p-6 bg-white rounded-md" dir="rtl">
        <h1 className="text-2xl font-bold mb-8 text-gray-800 flex items-center gap-3">
          <MapPin className="text-black" /> مدیریت شعبات (تماس با ما)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="bg-white p-6 rounded-md shadow-lg border border-gray-100 h-fit">
            <h2 className="font-bold text-lg mb-4 text-gray-700">
              ثبت شعبه جدید
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">
                  نام شعبه
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="مثال: شعبه مرکزی کابل"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">
                  آدرس دقیق
                </label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="کابل، جاده شهید مزاری..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    مدیر شعبه
                  </label>
                  <input
                    name="manager_name"
                    value={form.manager_name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="آقای احمدی"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    شماره تماس
                  </label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="079..."
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">
                  لینک نقشه (Google Maps Embed)
                </label>
                <input
                  name="map_link"
                  value={form.map_link}
                  onChange={handleChange}
                  className="input-field"
                  placeholder='<iframe src="..." ...></iframe>'
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  از گوگل مپ گزینه Embed a map را کپی کنید.
                </p>
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
                    <FaPlus /> ثبت شعبه
                  </>
                )}
              </button>
            </form>
          </div>

          {/* List */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {isLoading ? (
              <div className="col-span-2 text-center p-10">
                <Loader2 className="animate-spin mx-auto text-red-600" />
              </div>
            ) : branches.length === 0 ? (
              <div className="col-span-2 text-center text-gray-400 p-10 bg-white rounded-2xl border border-dashed">
                هیچ شعبه‌ای ثبت نشده است.
              </div>
            ) : (
              branches.map((branch) => (
                <div
                  key={branch.id}
                  className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between group hover:border-red-200 transition"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-lg text-gray-800">
                        {branch.name}
                      </h3>
                      <button
                        onClick={() =>
                          Swal.fire({
                            title: "حذف؟",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#d33",
                          }).then((r) => {
                            if (r.isConfirmed) deleteMutation.mutate(branch.id);
                          })
                        }
                        className="text-red-400 bg-red-50 p-2 rounded-lg hover:bg-red-100 transition opacity-0 group-hover:opacity-100"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-red-500" />{" "}
                        {branch.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <FaUserTie className="text-blue-500" />{" "}
                        {branch.manager_name}
                      </div>
                      <div className="flex items-center gap-2">
                        <FaPhone className="text-green-500" />{" "}
                        <span className="dir-ltr">{branch.phone}</span>
                      </div>
                    </div>
                  </div>

                  {branch.map_link && (
                    <div className="mt-4 h-32 rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                      <div
                        dangerouslySetInnerHTML={{ __html: branch.map_link }}
                        className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full"
                      />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
};
export default WebBranchManager;