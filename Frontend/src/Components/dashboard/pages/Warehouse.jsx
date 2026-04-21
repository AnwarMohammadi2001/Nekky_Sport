import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { FaWarehouse, FaMapMarkerAlt, FaUserTie } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { fetchWarehouses } from "../../../services/api";

const WarehouseManagement = () => {
    const { accessToken: token } = useSelector((state) => state.user);
    
    const { data: warehouseData, isLoading } = useQuery({
        queryKey: ["warehouses"],
        queryFn: () => fetchWarehouses(token),
        enabled: !!token
    });

    // ✅ اصلاح: استخراج آرایه از داخل آبجکت Pagination
    const warehouses = useMemo(() => {
        if (!warehouseData) return [];
        // اگر آرایه بود (حالت قدیم) خودشو برگردون، اگر آبجکت بود (حالت جدید) results رو برگردون
        return Array.isArray(warehouseData) ? warehouseData : (warehouseData.results || []);
    }, [warehouseData]);

    return (
        <div className="p-6 bg-gray-100 " dir="rtl">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-3 text-gray-800">
                <div className="p-2 bg-gray-100 rounded-md"><FaWarehouse className="text-black"/></div>
                لیست گدام‌ها و شعبات فعال
            </h2>

            {/* لیست گدام‌ها */}
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="animate-spin w-10 h-10 text-indigo-600"/>
                </div>
            ) : warehouses.length === 0 ? (
                <div className="text-center p-10 bg-white rounded-2xl border border-dashed border-gray-300">
                    <p className="text-gray-500">هیچ گدامی یافت نشد.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {warehouses.map(wh => (
                        <div key={wh.id} className={`p-6 rounded-md shadow-sm border-2 transition hover:shadow-md relative overflow-hidden group ${
                            wh.warehouse_type === 'main' 
                            ? 'bg-white border-cyan-700' 
                            : 'bg-white border-gray-200'
                        }`}>
                            {/* نوار رنگی کنار */}
                           

                            <div className="flex justify-between items-start mb-4 pl-2 pr-3">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">{wh.name}</h3>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full mt-1 inline-block ${
                                        wh.warehouse_type === 'main' 
                                        ? 'bg-purple-100 text-purple-700' 
                                        : 'bg-blue-100 text-blue-700'
                                    }`}>
                                        {wh.warehouse_type === 'main' ? '⭐ گدام مرکزی' : 'شعبه فروش'}
                                    </span>
                                </div>
                                <div className={`p-3 rounded-full ${wh.warehouse_type === 'main' ? 'bg-purple-50 text-purple-500' : 'bg-blue-50 text-blue-500'}`}>
                                    <FaWarehouse size={20} />
                                </div>
                            </div>

                            <div className="space-y-3 text-sm text-gray-600 pl-2 pr-3 border-t pt-4 border-gray-50">
                                <p className="flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-gray-400"/> 
                                    <span className="font-medium text-gray-700">{wh.location || "موقعیت ثبت نشده"}</span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <FaUserTie className="text-gray-400"/> 
                                    {wh.manager_name ? (
                                        <span>مسئول: <strong className="text-gray-800">{wh.manager_name}</strong></span>
                                    ) : (
                                        <span className="text-red-400">مسئول: تعیین نشده</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WarehouseManagement;