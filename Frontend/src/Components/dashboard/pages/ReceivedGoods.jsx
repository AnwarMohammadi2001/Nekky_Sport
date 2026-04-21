import React, { useMemo } from "react"; // useMemo اضافه شد
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { 
    FaBoxOpen, FaHistory, FaCalendarAlt, FaFileInvoice 
} from "react-icons/fa";
import { Loader2, PackageCheck } from "lucide-react"; 
import { fetchDistributionHistory } from "../../../services/api";

const ReceivedGoods = () => {
    const { accessToken: token } = useSelector((state) => state.user);
    
    // دریافت تاریخچه
    const { data: historyData, isLoading } = useQuery({ 
        queryKey: ["receivedGoods"], 
        queryFn: () => fetchDistributionHistory(token), 
        enabled: !!token
    });

    // ✅ اصلاح مهم: استخراج آرایه از results (اگر pagination فعال باشد)
    const history = useMemo(() => {
        if (!historyData) return [];
        // اگر سرور آرایه فرستاد (حالت بدون pagination) همان را برگردان
        if (Array.isArray(historyData)) return historyData;
        // اگر آبجکت pagination فرستاد، results را برگردان
        return historyData.results || [];
    }, [historyData]);

    // نمایش جزئیات فاکتور در مودال
    // نمایش جزئیات فاکتور در مودال (Professional Receipt Format)
    const showOrderDetails = (order) => {
        const itemsHtml = order.items.map((item, idx) => `
            <tr style="border-bottom: 1px solid #f3f4f6; transition: background 0.2s;">
                <td style="padding: 12px; text-align: center; color: #9ca3af; font-family: monospace;">${idx + 1}</td>
                <td style="padding: 12px; text-align: right;">
                    <div style="font-weight: bold; color: #1f2937;">${item.product_details.full_name}</div>
                    <div style="font-size: 10px; color: #6b7280; font-family: monospace;">SKU: ${item.product_details.sku}</div>
                </td>
                <td style="padding: 12px; text-align: center;">
                    <span style="background: #f0fdf4; color: #166534; padding: 4px 10px; border-radius: 6px; font-weight: 800; font-size: 13px;">
                        ${item.quantity}
                    </span>
                </td>
                <td style="padding: 12px; text-align: center; font-family: 'Courier New', monospace; color: #0891b2; font-weight: bold;">
                    $${Number(item.sell_price).toLocaleString()}
                </td>
                <td style="padding: 12px; text-align: left; font-family: 'Courier New', monospace; color: #111827; font-weight: 900;">
                    $${(item.quantity * item.sell_price).toLocaleString()}
                </td>
            </tr>
        `).join('');

        Swal.fire({
            title: '',
            html: `
                <div style="direction: rtl; font-family: 'Tahoma', sans-serif; color: #1f2937; position: relative;">
                    <div style="position: absolute; top: 40%; left: 50%; transform: translate(-50%, -50%) rotate(-30deg); font-size: 70px; font-weight: 900; color: #f3f4f6; pointer-events: none; z-index: 0; white-space: nowrap;">
                        RECEIVED / رسید
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #111827; padding-bottom: 15px; margin-bottom: 20px; position: relative; z-index: 1;">
                        <div style="text-align: right;">
                            <h2 style="margin: 0; font-size: 22px; font-weight: 900; color: #111827; letter-spacing: -0.5px;">رسید ورود کالا به انبار</h2>
                            <p style="margin: 5px 0 0; font-size: 11px; color: #6b7280;">سند تاییدیه توزیع محصولات از مرکز</p>
                        </div>
                        <div style="text-align: left;">
                            <div style="font-size: 10px; font-weight: bold; color: #111827; border: 1px solid #111827; padding: 4px 8px; display: inline-block;">
                                ID: #DIST-${order.id.toString().padStart(5, '0')}
                            </div>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; position: relative; z-index: 1;">
                        <div style="background: #f9fafb; padding: 12px; border-radius: 8px; border: 1px solid #f1f5f9; text-align: right;">
                            <div style="font-size: 9px; font-weight: 900; color: #6366f1; text-transform: uppercase; margin-bottom: 5px;">اطلاعات مبدأ و زمان</div>
                            <div style="font-size: 12px; margin-bottom: 4px;"><strong>فرستنده:</strong> ${order.source_name}</div>
                            <div style="font-size: 12px;"><strong>تاریخ دریافت:</strong> ${new Date(order.created_at).toLocaleDateString('fa-IR')}</div>
                        </div>
                        <div style="background: #f9fafb; padding: 12px; border-radius: 8px; border: 1px solid #f1f5f9; text-align: right;">
                            <div style="font-size: 9px; font-weight: 900; color: #6366f1; text-transform: uppercase; margin-bottom: 5px;">تاییدیه سیستمی</div>
                            <div style="font-size: 12px; margin-bottom: 4px;"><strong>تحویل‌دهنده:</strong> ${order.issuer_name || 'مرکز مدیریت'}</div>
                            <div style="font-size: 12px;"><strong>وضعیت:</strong> <span style="color: #059669; font-weight: bold;">تایید شده ✅</span></div>
                        </div>
                    </div>

                    <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; position: relative; z-index: 1;">
                        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                            <thead>
                                <tr style="background: #111827; color: #ffffff;">
                                    <th style="padding: 10px; text-align: center; width: 30px;">#</th>
                                    <th style="padding: 10px; text-align: right;">شرح کالا</th>
                                    <th style="padding: 10px; text-align: center;">تعداد</th>
                                    <th style="padding: 10px; text-align: center;">فی واحد</th>
                                    <th style="padding: 10px; text-align: left;">جمع کل</th>
                                </tr>
                            </thead>
                            <tbody>${itemsHtml}</tbody>
                        </table>
                    </div>

                    <div style="margin-top: 15px; display: flex; justify-content: flex-end; position: relative; z-index: 1;">
                        <div style="width: 200px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px; border-radius: 8px;">
                            <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 900;">
                                <span>ارزش کل بار:</span>
                                <span style="color: #111827;">$${Number(order.total_value).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div style="margin-top: 20px; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px dashed #e2e8f0; pt: 10px;">
                        این یک سند چاپی سیستمی است و به منزله ورود قطعی کالا به انبار شعبه می‌باشد.
                    </div>
                </div>
            `,
            width: '700px',
            confirmButtonText: 'بستن رسید',
            confirmButtonColor: '#111827',
            showCloseButton: true,
            customClass: {
                popup: 'rounded-2xl shadow-2xl'
            }
        });
    };
    if (isLoading) return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="text-center">
                <Loader2 className="animate-spin w-12 h-12 text-indigo-600 mx-auto mb-4"/>
                <p className="text-gray-500">در حال دریافت لیست کالاهای ورودی...</p>
            </div>
        </div>
    );

    return (
      <div className="p-6 bg-white rounded-md" dir="rtl">
        <div className="max-w-6xl mx-auto">
          {/* هدر */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-xl text-cyan-700">
                  <PackageCheck size={28} />
                </div>
                محصولات دریافتی (ورودی به انبار)
              </h1>
              <p className="text-gray-500 mt-1 text-sm">
                لیست محصولات که از گدام مرکزی دریافت کرده‌اید و به موجودی شما
                اضافه شده است.
              </p>
            </div>
            <div className="bg-white px-5 py-3 rounded-xl shadow-sm border border-gray-200 text-sm font-bold text-gray-600 flex flex-col items-center">
              <span className="text-xs text-gray-400 font-normal">
                تعداد کل محصولات
              </span>
              <span className="text-xl text-indigo-600">{history.length}</span>
            </div>
          </div>

          {/* جدول لیست */}
          <div className="bg-white rounded-md shadow-md  overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-center text-sm">
                <thead className="bg-slate-900 text-gray-100 font-bold uppercase text-sm border-b border-gray-200">
                  <tr>
                    <th className="px-5 py-3">شماره </th>
                    <th className="px-5 py-3">فرستنده </th>
                    <th className="px-5 py-3 text-center">تعداد جنس</th>
                    <th className="px-5 py-3 text-center">ارزش کل (فروش)</th>
                    <th className="px-5 py-3 text-center">تاریخ دریافت</th>
                    <th className="px-5 py-3 text-center">مشاهده</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {history.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="p-20 text-center text-gray-400"
                      >
                        <FaBoxOpen
                          size={48}
                          className="mx-auto mb-4 opacity-20"
                        />
                        <p>هنوز هیچ کالایی از مرکز دریافت نکرده‌اید.</p>
                      </td>
                    </tr>
                  ) : (
                    history.map((order, index) => (
                      <tr
                        key={order.id}
                        className="hover:bg-gray-100 border-b border-gray-200 odd:bg-gray-100  transition group"
                      >
                        <td className="px-5 py-3 font-mono  font-bold">
                          {index + 1}
                        </td>
                        <td className="px-5 py-3 text-gray-600">
                          {order.source_name}
                        </td>
                        <td className="px-5 py-3 text-center">
                          <span className=" text-cyan-700 px-3 py-1 rounded-lg font-bold ">
                            {order.total_items} 
                          </span>
                        </td>
                        <td className="px-5 py-3 text-center font-bold text-green-600 font-mono text-base">
                          ${Number(order.total_value).toLocaleString()}
                        </td>
                        <td className="px-5 py-3 text-center text-gray-500 text-sm">
                          <div className="flex items-center justify-center gap-2 bg-gray-50 py-1 px-2 rounded-lg w-fit mx-auto border border-gray-100">
                            <FaCalendarAlt className="text-gray-400" />
                            {new Date(order.created_at).toLocaleDateString(
                              "fa-IR",
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3 text-center">
                          <button
                            onClick={() => showOrderDetails(order)}
                            className="text-white bg-cyan-700 hover:bg-cyan-800 p-2.5 rounded-md shadow-md transition transform active:scale-95 flex items-center justify-center gap-2 mx-auto"
                            title="مشاهده جزئیات اقلام"
                          >
                            <FaFileInvoice />{" "}
                            <span className="text-xs">جزئیات</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
};

export default ReceivedGoods;