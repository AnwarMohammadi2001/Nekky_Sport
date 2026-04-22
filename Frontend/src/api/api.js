// src/api/api.js

import axios from "axios";

// base config
const API = axios.create({
  baseURL: "http://localhost:5000/api",
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
