// src/api/api.js
import axios from "axios";

// Use the same BASE_URL for all API calls
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

// base config
const API = axios.create({
  baseURL: `${BASE_URL}/api`, // Note: add /api here
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================
// CATEGORY APIs
// ============================

export const createCategory = (data) => API.post("/categories", data);

export const getCategories = () => API.get("/categories");

export const getCategory = (id) => API.get(`/categories/${id}`);

export const updateCategory = (id, data) => API.put(`/categories/${id}`, data);

export const deleteCategory = (id) => API.delete(`/categories/${id}`);

// ============================
// ATTRIBUTE APIs
// ============================

export const createAttribute = (data) => API.post("/attributes", data);

export const getAttributesByCategory = (categoryId) =>
  API.get(`/attributes/${categoryId}`);

export const updateAttribute = (id, data) => API.put(`/attributes/${id}`, data);

export const deleteAttribute = (id) => API.delete(`/attributes/${id}`);

// ============================
// PRODUCT APIs
// ============================

// create product (with images)
export const createProduct = (data) =>
  API.post("/products", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getProducts = () => API.get("/products");

export const getProduct = (id) => API.get(`/products/${id}`);

export const updateProduct = (id, data) => API.put(`/products/${id}`, data);

export const deleteProduct = (id) => API.delete(`/products/${id}`);

// ============================
// SEARCH APIs
// ============================

export const searchProducts = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.search) params.append("q", filters.search);
  if (filters.categoryId) params.append("categoryId", filters.categoryId);
  if (filters.minPrice) params.append("minPrice", filters.minPrice);
  if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
  if (filters.limit) params.append("limit", filters.limit);
  if (filters.page) params.append("page", filters.page);
  if (filters.sortBy) params.append("sortBy", filters.sortBy);
  if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

  const response = await API.get(
    `/products/search/advanced?${params.toString()}`,
  );
  return response.data;
};

export const getSearchSuggestions = async (query, limit = 5) => {
  const response = await API.get(
    `/products/search/suggestions?q=${query}&limit=${limit}`,
  );
  return response.data;
};

export const quickSearch = async (query, limit = 10) => {
  const response = await API.get(
    `/products/search/quick?q=${query}&limit=${limit}`,
  );
  return response.data;
};

// ============================
// SLIDER APIs
// ============================

export const createSlider = (data) =>
  API.post("/v1/website/sliders", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getSliders = () => API.get("/v1/website/sliders");

export const getSlider = (id) => API.get(`/v1/website/sliders/${id}`);

export const updateSlider = (id, data) =>
  API.put(`/v1/website/sliders/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteSlider = (id) => API.delete(`/v1/website/sliders/${id}`);

export default API;
