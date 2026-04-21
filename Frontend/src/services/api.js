import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://127.0.0.1:8000";

// --- تنظیمات اولیه Axios ---
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// اینترسپتور برای اضافه کردن خودکار توکن به هر درخواست
api.interceptors.request.use(
  (config) => {
    // فرض بر این است که توکن در لوکال استوریج با کلید persist:root ذخیره شده
    // اما روش بهتر گرفتن مستقیم از استیت است. اینجا فرض میکنیم توکن پاس داده میشود
    // یا اینکه شما توکن را در کامپوننت‌ها هندل می‌کنید.
    return config;
  },
  (error) => Promise.reject(error),
);

const getHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// ==============================
// 1. AUTHENTICATION
// ==============================
export const loginUser = async (credentials) => {
  const response = await axios.post(
    `${BASE_URL}/api/v1/auth/token/`,
    credentials,
  );
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await axios.post(
    `${BASE_URL}/api/v1/auth/register/`,
    userData,
  );
  return response.data;
};

// برای مدیریت کاربران (فروشندگان)
export const createSeller = async (token, userData) => {
  const response = await axios.post(
    `${BASE_URL}/api/v1/auth/sellers/`,
    userData,
    getHeaders(token),
  );
  return response.data;
};

export const fetchSellers = async (token) => {
  const response = await axios.get(
    `${BASE_URL}/api/v1/auth/sellers/`,
    getHeaders(token),
  );
  return response.data;
};

export const toggleSellerStatus = async (token, id) => {
  const response = await axios.post(
    `${BASE_URL}/api/v1/auth/sellers/${id}/toggle_active/`,
    {},
    getHeaders(token),
  );
  return response.data;
};

export const deleteSeller = async (token, id) => {
  const response = await axios.delete(
    `${BASE_URL}/api/v1/auth/sellers/${id}/`,
    getHeaders(token),
  );
  return response.data;
};

// ==============================
// 2. CATEGORIES & ATTRIBUTES
// ==============================
export const fetchCategories = async (token) => {
  const response = await axios.get(
    `${BASE_URL}/api/v1/categories/categories/`,
    getHeaders(token),
  );
  return response.data;
};

export const createCategory = async (token, data) => {
  const response = await axios.post(
    `${BASE_URL}/api/v1/categories/categories/`,
    data,
    getHeaders(token),
  );
  return response.data;
};

export const deleteCategory = async (token, id) => {
  const response = await axios.delete(
    `${BASE_URL}/api/v1/categories/categories/${id}/`,
    getHeaders(token),
  );
  return response.data;
};

export const fetchAttributes = async (
  token,
  categoryId = null,
  toolKey = null,
) => {
  let url = `${BASE_URL}/api/v1/categories/attributes/`;
  if (categoryId && toolKey)
    url += `?category=${categoryId}&tool_key=${toolKey}`;
  const response = await axios.get(url, getHeaders(token));
  return response.data;
};

export const createAttribute = async (token, data) => {
  const response = await axios.post(
    `${BASE_URL}/api/v1/categories/attributes/`,
    data,
    getHeaders(token),
  );
  return response.data;
};

export const updateAttribute = async (token, id, data) => {
  const response = await axios.patch(
    `${BASE_URL}/api/v1/categories/attributes/${id}/`,
    data,
    getHeaders(token)
  );
  return response.data;
};

export const deleteAttribute = async (token, id) => {
  const response = await axios.delete(
    `${BASE_URL}/api/v1/categories/attributes/${id}/`,
    getHeaders(token),
  );
  return response.data;
};

// ==============================
// 3. PRODUCTS
// ==============================
export const fetchProducts = async (token, params = {}) => {
  // اضافه کردن پارامتر all برای دریافت لیست کامل در بخش خرید
  const queryString = new URLSearchParams({ ...params, all: 'true' }).toString();
  const { data } = await axios.get(`${BASE_URL}/api/v1/inventory/products/?${queryString}`, { 
    headers: { Authorization: `Bearer ${token}` } 
  });
  return data;
}

export const createProduct = async (token, productData) => {
  const response = await axios.post(
    `${BASE_URL}/api/v1/inventory/products/`,
    productData,
    getHeaders(token),
  );
  return response.data;
};

export const deleteProduct = async (token, id) => {
  const response = await axios.delete(
    `${BASE_URL}/api/v1/inventory/products/${id}/`,
    getHeaders(token),
  );
  return response.data;
};

// ==============================
// 4. WAREHOUSES & STOCKS
// ==============================
export const fetchWarehouses = async (token) => {
  const response = await axios.get(
    `${BASE_URL}/api/v1/inventory/warehouses/`,
    getHeaders(token),
  );
  return response.data;
};

export const createWarehouse = async (token, data) => {
  const response = await axios.post(
    `${BASE_URL}/api/v1/inventory/warehouses/`,
    data,
    getHeaders(token),
  );
  return response.data;
};

export const fetchStocks = async (token, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await axios.get(
    `${BASE_URL}/api/v1/inventory/stocks/?${queryString}`,
    getHeaders(token),
  );
  return response.data;
};

// ==============================
// 5. INVENTORY OPERATIONS (Purchase & Distribution)
// ==============================
export const fetchPurchaseOrders = async (token) => {
  const response = await axios.get(
    `${BASE_URL}/api/v1/inventory/purchase-orders/`,
    getHeaders(token),
  );
  return response.data;
};

export const createPurchaseOrder = async (token, data) => {
  const response = await axios.post(
    `${BASE_URL}/api/v1/inventory/purchase-orders/`,
    data,
    getHeaders(token),
  );
  return response.data;
};
export const updatePurchaseOrder = async (token, id, data) => {
  const response = await axios.patch(
    `${BASE_URL}/api/v1/inventory/purchase-orders/${id}/`,
    data,
    getHeaders(token),
  );
  return response.data;
};
export const confirmPurchaseOrder = async (token, orderId) => {
  const response = await axios.post(
    `${BASE_URL}/api/v1/inventory/purchase-orders/${orderId}/confirm/`,
    {},
    getHeaders(token),
  );
  return response.data;
};

export const distributeStock = async (token, data) => {
  const response = await axios.post(
    `${BASE_URL}/api/v1/inventory/stocks/distribute_batch/`,
    data,
    getHeaders(token),
  );
  return response.data;
};

export const fetchDistributionHistory = async (token) => {
  const response = await axios.get(
    `${BASE_URL}/api/v1/inventory/stocks/history/`,
    getHeaders(token),
  );
  return response.data;
};

// ==============================
// 6. SALES (Invoices)
// ==============================
export const fetchInvoices = async (token, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await axios.get(
    `${BASE_URL}/api/v1/inventory/invoices/?${queryString}`,
    getHeaders(token),
  );
  return response.data;
};
export const updateProduct = async (token, id, productData) => {
  const response = await axios.patch(`${BASE_URL}/api/v1/inventory/products/${id}/`, productData, getHeaders(token));
  return response.data;
}
export const createInvoice = async (token, data) => {
  const response = await axios.post(
    `${BASE_URL}/api/v1/inventory/invoices/`,
    data,
    getHeaders(token),
  );
  return response.data;
};

export const deleteInvoice = async (token, id) => {
  const response = await axios.delete(
    `${BASE_URL}/api/v1/inventory/invoices/${id}/`,
    getHeaders(token),
  );
  return response.data;
};

// ==============================
// 7. CUSTOMERS & PAYMENTS
// ==============================
export const fetchCustomers = async (token, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await axios.get(
    `${BASE_URL}/api/v1/customers/customers/?${queryString}`,
    getHeaders(token),
  );
  return response.data;
};
export const createCustomer = async (token, data) => {
  const response = await axios.post(
    `${BASE_URL}/api/v1/customers/customers/`,
    data,
    getHeaders(token),
  );
  return response.data;
};

export const updateCustomer = async (token, id, data) => {
  const response = await axios.patch(
    `${BASE_URL}/api/v1/customers/customers/${id}/`,
    data,
    getHeaders(token),
  );
  return response.data;
};

export const deleteCustomer = async (token, id) => {
  const response = await axios.delete(
    `${BASE_URL}/api/v1/customers/customers/${id}/`,
    getHeaders(token),
  );
  return response.data;
};

export const fetchCustomerWallet = async (token, id) => {
  const response = await axios.get(
    `${BASE_URL}/api/v1/customers/customers/${id}/wallet/`,
    getHeaders(token),
  );
  return response.data;
};

export const fetchPayments = async (token) => {
  const response = await axios.get(
    `${BASE_URL}/api/v1/customers/payments/`,
    getHeaders(token),
  );
  return response.data;
};

export const createPayment = async (token, data) => {
  const response = await axios.post(
    `${BASE_URL}/api/v1/customers/payments/`,
    data,
    getHeaders(token),
  );
  return response.data;
};

// ==============================
// 8. REPORTING
// ==============================
export const fetchComprehensiveReport = async (token, filters = {}) => {
  // حذف مقادیر null یا undefined از فیلترها
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v != null && v !== ""),
  );
  const queryString = new URLSearchParams(cleanFilters).toString();
  const response = await axios.get(
    `${BASE_URL}/api/v1/reporting/comprehensive-report/?${queryString}`,
    getHeaders(token),
  );
  return response.data;
};

export const fetchUserProfile = async (token) => {
  const response = await axios.get(
    `${BASE_URL}/api/v1/profiles/me/`,
    getHeaders(token),
  );
  return response.data;
};

// 9. EXPENSES
// ==============================
export const fetchExpenses = async (token, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await axios.get(
    `${BASE_URL}/api/v1/expenses/list/?${queryString}`,
    getHeaders(token),
  );
  return response.data;
};

export const createExpense = async (token, data) => {
  const response = await axios.post(
    `${BASE_URL}/api/v1/expenses/list/`,
    data,
    getHeaders(token),
  );
  return response.data;
};

export const deleteExpense = async (token, id) => {
  const response = await axios.delete(
    `${BASE_URL}/api/v1/expenses/list/${id}/`,
    getHeaders(token),
  );
  return response.data;
};

export const fetchExpenseCategories = async (token) => {
  const response = await axios.get(
    `${BASE_URL}/api/v1/expenses/categories/`,
    getHeaders(token),
  );
  return response.data;
};

export const createExpenseCategory = async (token, data) => {
  const response = await axios.post(
    `${BASE_URL}/api/v1/expenses/categories/`,
    data,
    getHeaders(token),
  );
  return response.data;
};

export const updateCategory = async (token, id, data) => {
  const response = await axios.put(
    `${BASE_URL}/api/v1/categories/categories/${id}/`,
    data,
    getHeaders(token),
  );
  return response.data;
};

// ==============================
// 10. WEBSITE MANAGEMENT (CMS) - ✅ اضافه شده
// ==============================

// Sliders
export const fetchWebSliders = async () => {
  const response = await axios.get(`${BASE_URL}/api/v1/website/sliders/`);
  return response.data;
};

export const createWebSlider = async (token, formData) => {
  const response = await axios.post(
    `${BASE_URL}/api/v1/website/sliders/`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const deleteWebSlider = async (token, id) => {
  const response = await axios.delete(
    `${BASE_URL}/api/v1/website/sliders/${id}/`,
    getHeaders(token),
  );
  return response.data;
};

// Web Categories
export const fetchWebCategories = async () => {
  const response = await axios.get(`${BASE_URL}/api/v1/website/categories/`);
  return response.data;
};

export const createWebCategory = async (token, formData) => {
  const response = await axios.post(
    `${BASE_URL}/api/v1/website/categories/`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const deleteWebCategory = async (token, id) => {
  const response = await axios.delete(
    `${BASE_URL}/api/v1/website/categories/${id}/`,
    getHeaders(token),
  );
  return response.data;
};

// Web Products
export const fetchWebProducts = async (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([_, v]) => v !== "" && v !== null && v !== undefined,
    ),
  );

  // --- LOGGING ---
  const queryString = new URLSearchParams(cleanParams).toString();
  console.log(
    `DEBUG AXIOS: Requesting URL: ${BASE_URL}/api/v1/website/products/?${queryString}`,
  );

  const response = await axios.get(`${BASE_URL}/api/v1/website/products/`, {
    params: cleanParams,
  });
  return response.data;
};
export const fetchCategoryIdByName = async (name) => {
  const response = await axios.get(`${BASE_URL}/api/v1/website/categories/`);
  const categories = response.data;

  const findCategory = (cats, name) => {
    for (const cat of cats) {
      if (cat.name === name) return cat.id;
      if (cat.children && cat.children.length > 0) {
        const childId = findCategory(cat.children, name);
        if (childId) return childId;
      }
    }
    return null;
  };

  return findCategory(categories, name);
};

// استفاده در React Query

export const useProductsByCategoryName = (categoryName) => {
  // مرحله اول: گرفتن آیدی از نام دسته
  const { data: categoryId, isLoading: loadingCategory } = useQuery({
    queryKey: ["categoryId", categoryName],
    queryFn: () => fetchCategoryIdByName(categoryName),
  });

  // مرحله دوم: گرفتن محصولات با آیدی دسته
  const { data: products, isLoading: loadingProducts } = useQuery({
    queryKey: ["webProducts", categoryId],
    queryFn: () => fetchWebProducts({ category: categoryId }),
    enabled: !!categoryId, // فقط وقتی آیدی موجود است اجرا شود
  });

  return {
    products: products ||[],
    loading: loadingCategory || loadingProducts,
  };
};
export const createWebProduct = async (token, formData) => {
  const response = await axios.post(
    `${BASE_URL}/api/v1/website/products/`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const deleteWebProduct = async (token, id) => {
  const response = await axios.delete(
    `${BASE_URL}/api/v1/website/products/${id}/`,
    getHeaders(token),
  );
  return response.data;
};

// Downloads
export const fetchWebDownloads = async () => {
  const response = await axios.get(`${BASE_URL}/api/v1/website/downloads/`);
  return response.data;
};

export const createWebDownload = async (token, formData) => {
  // 👈 توجه: وقتی دیتا FormData باشد، axios خودکار هدر لازم را تنظیم می‌کند،
  // اما برای اطمینان ما Content-Type را مشخص می‌کنیم
  const response = await axios.post(
    `${BASE_URL}/api/v1/website/downloads/`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const deleteWebDownload = async (token, id) => {
  const response = await axios.delete(
    `${BASE_URL}/api/v1/website/downloads/${id}/`,
    getHeaders(token),
  );
  return response.data;
};

// Branches
export const fetchWebBranches = async () => {
  const response = await axios.get(`${BASE_URL}/api/v1/website/branches/`);
  return response.data;
};

export const createWebBranch = async (token, data) => {
  const response = await axios.post(
    `${BASE_URL}/api/v1/website/branches/`,
    data,
    getHeaders(token),
  );
  return response.data;
};

export const deleteWebBranch = async (token, id) => {
  const response = await axios.delete(
    `${BASE_URL}/api/v1/website/branches/${id}/`,
    getHeaders(token),
  );
  return response.data;
};

export const createWebAttribute = async (token, data) => {
  const response = await axios.post(
    `${BASE_URL}/api/v1/website/attributes/`,
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return response.data;
};

export const deleteWebAttribute = async (token, id) => {
  const response = await axios.delete(
    `${BASE_URL}/api/v1/website/attributes/${id}/`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return response.data;
};

export const fetchWebProductDetail = async (id) => {
  const response = await axios.get(
    `${BASE_URL}/api/v1/website/products/${id}/`,
  );
  return response.data;
};

export const updateWebCategory = async (token, id, formData) => {
    const response = await axios.patch(`${BASE_URL}/api/v1/website/categories/${id}/`, formData, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
    });
    return response.data;
};
export const updateWebAttribute = async (token, id, data) => {
    const response = await axios.patch(`${BASE_URL}/api/v1/website/attributes/${id}/`, data, getHeaders(token));
    return response.data;
};
export const updateSeller = async (token, id, userData) => {
    const response = await axios.patch(`${BASE_URL}/api/v1/auth/sellers/${id}/`, userData, getHeaders(token));
    return response.data;
};