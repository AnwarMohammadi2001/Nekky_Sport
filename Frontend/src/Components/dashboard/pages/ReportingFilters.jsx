import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import Select from "react-select";
import { Users, Store, Filter } from "lucide-react";
import { fetchCategories, fetchCustomers, fetchWarehouses } from "../../../services/api";

const ReportingFilters = ({ onFilterChange, activityType }) => {
    const { accessToken: token, currentUser } = useSelector((state) => state.user);
    const isMobile = activityType === "mobile";
    
    // ✅ تشخیص ادمین برای نمایش/عدم نمایش فیلتر انبار
    const isStrictAdmin = currentUser?.is_superuser === true || currentUser?.role === "ADMIN";

    const [filters, setFilters] = useState({
        start_date: "", end_date: "", product_type: null,
        category_id: null, customer_id: null, warehouse_id: null
    });

    const { data: catData } = useQuery({ queryKey: ['categories'], queryFn: () => fetchCategories(token), enabled: !!token });
    const { data: customerData } = useQuery({ queryKey: ['customersAll'], queryFn: () => fetchCustomers(token, { page_size: 1000 }), enabled: !!token });
    const { data: whData } = useQuery({ queryKey: ['warehouses'], queryFn: () => fetchWarehouses(token), enabled: !!token && isStrictAdmin });

    const categories = useMemo(() => {
        const raw = Array.isArray(catData) ? catData : (catData?.results || []);
        return isMobile ? raw.filter(c => c.type === 'mobile') : raw.filter(c => c.type !== 'mobile');
    }, [catData, isMobile]);

    const customers = Array.isArray(customerData?.results) ? customerData.results : [];
    const warehouses = Array.isArray(whData) ? whData : (whData?.results || []);

    const typeOptions = isMobile 
        ? [{ value: "mobile", label: "📱 فقط بخش موبایل" }]
        : [{ value: "printer", label: "🖨️ پرینتر" }, { value: "scrubber", label: "🧽 اسکاج و شوینده" }];

    const handleSelectChange = (name, opt) => {
        setFilters(prev => ({ ...prev, [name]: opt ? opt.value : null }));
    };

    const handleApply = () => onFilterChange(filters);
    const handleReset = () => {
        setFilters({ start_date: "", end_date: "", product_type: null, category_id: null, customer_id: null, warehouse_id: null });
        onFilterChange({});
    };

    const customStyles = {
        control: (base) => ({ ...base, borderRadius: '8px', fontSize: '11px', minHeight: '42px' }),
        menuPortal: base => ({ ...base, zIndex: 9999 })
    };

    return (
        <div className="p-6 rounded-xl border bg-white mb-8 shadow-sm">
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-100">
                    <div>
                        <label className="text-[10px] font-black text-indigo-600 mb-2 flex items-center gap-1 uppercase tracking-widest"><Users size={12}/> جستجوی نام مشتری</label>
                        <Select options={customers.map(c=>({value:c.id, label:c.full_name}))} onChange={opt => handleSelectChange('customer_id', opt)} placeholder="همه مشتریان..." isClearable styles={customStyles} menuPortalTarget={document.body} />
                    </div>
                    
                    {/* ✅ فقط ادمین فیلتر انبار را می‌بیند */}
                    {isStrictAdmin ? (
                        <div>
                            <label className="text-[10px] font-black text-indigo-600 mb-2 flex items-center gap-1 uppercase tracking-widest"><Store size={12}/> فیلتر بر اساس شعبه / انبار</label>
                            <Select options={warehouses.map(w=>({value:w.id, label:w.name}))} onChange={opt => handleSelectChange('warehouse_id', opt)} placeholder="همه انبارها..." isClearable styles={customStyles} menuPortalTarget={document.body} />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-200 text-gray-400 text-xs font-bold">
                            گزارش محدود به انبار شماست
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="text-[10px] font-black text-gray-400 mb-1 block uppercase">نوع کالا</label>
                        <Select options={typeOptions} onChange={opt => handleSelectChange('product_type', opt)} placeholder="همه..." isClearable styles={customStyles} menuPortalTarget={document.body} />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-gray-400 mb-1 block uppercase">کمپنی / برند</label>
                        <Select options={categories.map(c=>({value:c.id, label:c.name}))} onChange={opt => handleSelectChange('category_id', opt)} placeholder="انتخاب..." isClearable styles={customStyles} menuPortalTarget={document.body} />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-gray-400 mb-1 block uppercase tracking-widest">از تاریخ</label>
                        <input type="date" value={filters.start_date} onChange={e => setFilters({...filters, start_date: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-indigo-500" />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-gray-400 mb-1 block uppercase tracking-widest">تا تاریخ</label>
                        <input type="date" value={filters.end_date} onChange={e => setFilters({...filters, end_date: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-indigo-500" />
                    </div>
                </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-50">
                <button onClick={handleReset} className="text-gray-400 text-[10px] font-black px-5 py-2 hover:text-red-500 transition">پاک کردن فیلترها</button>
                <button onClick={handleApply} className="bg-indigo-600 text-white px-10 py-2.5 rounded-lg text-[11px] font-black shadow-lg hover:bg-indigo-700 transition active:scale-95 flex items-center gap-2"><Filter size={14}/> استخراج گزارش</button>
            </div>
        </div>
    );
};

export default ReportingFilters;