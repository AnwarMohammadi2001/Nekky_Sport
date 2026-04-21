import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchCustomerWallet } from '../../../services/api';
import { Loader2, ArrowLeft, Users, HandCoins, ShoppingCart, FileText, CreditCard, AlertCircle } from 'lucide-react';

const StatCard = ({ title, value, prefix = "", icon, gradient }) => (
    <div className="bg-gray-200 px-5 py-7 rounded-md shadow-md flex items-center justify-between relative overflow-hidden group">
      
        <div>
            <p className="text-gray-700 text-xs font-bold mb-1">{title}</p>
            <p className="text-xl font-black text-gray-800">
                {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
            </p>
        </div>
        <div className={`p-3 rounded-xl bg-gray-50 text-gray-600 group-hover:scale-110 transition-transform`}>
            {icon}
        </div>
    </div>
);

const CustomerWallet = ({ setActiveComponent }) => {
    const { accessToken: token } = useSelector((state) => state.user);
    const customerId = localStorage.getItem('selectedCustomerId');

    const { data: walletData, isLoading, isError, error } = useQuery({
        queryKey: ['customerWallet', customerId],
        queryFn: () => fetchCustomerWallet(token, customerId),
        enabled: !!(token && customerId),
        retry: 1
    });
    
    // --- مدیریت خطاها ---
    if (!customerId) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md border border-gray-100">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-800 mb-2">مشتری انتخاب نشده</h2>
                    <button onClick={() => setActiveComponent('customers')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold mt-4 transition-colors shadow-lg">
                        بازگشت به لیست
                    </button>
                </div>
            </div>
        );
    }
    
    if (isLoading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
        </div>
    );
    
    // ✅ هندل کردن ارور 404 یا دسترسی
    if (isError || !walletData) return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md border border-red-100">
                <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="text-red-500 w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">خطا در دریافت اطلاعات</h3>
                <p className="text-gray-500 text-sm mb-6">
                    {error?.response?.status === 404 
                        ? "اطلاعات این مشتری یافت نشد یا شما دسترسی مشاهده آن را ندارید." 
                        : "مشکلی در ارتباط با سرور پیش آمده است."}
                </p>
                <button 
                    onClick={() => setActiveComponent('customers')} 
                    className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition w-full"
                >
                    بازگشت به لیست مشتریان
                </button>
            </div>
        </div>
    );

    const { customer_details, sales_history = [], payment_history = [] } = walletData;
    const sales = Array.isArray(sales_history) ? sales_history : [];
    const payments = Array.isArray(payment_history) ? payment_history : [];
    const totalSalesValue = sales.reduce((sum, invoice) => sum + (Number(invoice.total_amount) || 0), 0);
    const totalPaidValue = Number(customer_details?.total_paid) || 0;
    const totalDebtValue = Number(customer_details?.total_debt) || 0;

    return (
        <div className="p-6 bg-gray-50  rounded-md min-h-screen" dir="rtl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <button 
                    onClick={() => setActiveComponent('customers')} 
                    className="flex items-center gap-2 text-gray-500 hover:text-cyan-700 font-bold transition-colors"
                >
                    <ArrowLeft size={20} className='rotate-180' /> بازگشت
                </button>
                
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-md shadow-sm border border-gray-200">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                        {customer_details?.full_name?.[0] || <Users size={18}/>}
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900">{customer_details?.full_name}</h1>
                        <p className="text-xs text-gray-500 dir-ltr text-right">{customer_details?.phone_number}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="مجموع خریدها" value={totalSalesValue} prefix="$" icon={<ShoppingCart className="w-6 h-6" />} gradient="from-purple-500 to-purple-600"/>
                <StatCard title="مجموع پرداختی‌ها" value={totalPaidValue} prefix="$" icon={<CreditCard className="w-6 h-6" />} gradient="from-green-500 to-green-600"/>
                <StatCard title= " مجموع باقیداری " value={totalDebtValue} prefix="$" icon={<HandCoins className="w-6 h-6" />} gradient={totalDebtValue > 0 ? "from-red-500 to-red-600" : "from-gray-500 to-gray-600"}/>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Sales History */}
                <div className="bg-white rounded-md shadow-md border border-gray-100 overflow-hidden flex flex-col h-[500px]">
                    <div className="p-5 border-b bg-gray-50 flex justify-between items-center">
                        <h2 className="font-bold text-gray-700 flex items-center gap-2"><FileText className="text-purple-600" size={20} /> تاریخچه فاکتورها</h2>
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-lg">{sales.length} فاکتور</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        {sales.length > 0 ? (
                            <div className="space-y-3">
                                {sales.map(invoice => (
                                    <div key={invoice.id} className="bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-bold text-gray-800 text-sm">فاکتور #{invoice.id.toString().slice(0, 6)}</p>
                                                <p className="text-xs text-gray-400 mt-0.5 dir-ltr text-right">{new Date(invoice.due_date).toLocaleDateString('fa-IR')}</p>
                                            </div>
                                            <span className="font-mono font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-lg text-sm">${Number(invoice.total_amount).toLocaleString()}</span>
                                        </div>
                                        <div className="border-t border-gray-50 pt-2 mt-2 space-y-1">
                                            {invoice.items?.map(item => (
                                                <div key={item.id} className="flex justify-between text-xs text-gray-500">
                                                    <span>{item.product_name} <span className="text-gray-300">x{item.quantity}</span></span>
                                                    <span>${(item.quantity * item.selling_price_per_unit).toLocaleString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400"><ShoppingCart size={48} className="mb-2 opacity-20"/><p className="text-sm">هنوز خریدی ثبت نشده است.</p></div>
                        )}
                    </div>
                </div>

                {/* Payment History */}
                <div className="bg-white rounded-md shadow-md border border-gray-100 overflow-hidden flex flex-col h-[500px]">
                    <div className="p-5 border-b bg-gray-50 flex justify-between items-center">
                        <h2 className="font-bold text-gray-700 flex items-center gap-2"><CreditCard className="text-green-600" size={20} /> تاریخچه پرداخت‌ها</h2>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-lg">{payments.length} تراکنش</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-0">
                        {payments.length > 0 ? (
                            <table className="w-full text-right text-sm">
                                <thead className="bg-gray-50 text-gray-500 font-medium text-xs sticky top-0"><tr><th className="p-4">تاریخ</th><th className="p-4">توضیحات</th><th className="p-4 text-center">مبلغ</th></tr></thead>
                                <tbody className="divide-y divide-gray-50">
                                    {payments.map(payment => (
                                        <tr key={payment.id} className="hover:bg-green-50/30 transition">
                                            <td className="p-4 text-gray-600 dir-ltr text-right text-xs">{payment.payment_date}</td>
                                            <td className="p-4 text-gray-800 text-xs">{payment.remarks || <span className="text-gray-300 italic">بدون توضیح</span>}</td>
                                            <td className="p-4 text-center font-mono font-bold text-green-600">${Number(payment.amount).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400"><HandCoins size={48} className="mb-2 opacity-20"/><p className="text-sm">هیچ پرداختی ثبت نشده است.</p></div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default CustomerWallet;