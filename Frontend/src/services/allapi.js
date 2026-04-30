// allapi.js
// Base URL for your backend API
const API_BASE_URL =  "http://localhost:5000/api";

// Helper function for handling API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// ==================== CATEGORY APIS ====================

// Get all categories
export const getCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/categories`);
  return handleResponse(response);
};

// Get single category by ID
export const getCategory = async (id) => {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`);
  return handleResponse(response);
};

// Create new category
export const createCategory = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: "POST",
    body: formData, // Don't set Content-Type header, let browser set it with boundary
  });
  return handleResponse(response);
};

// Update category
export const updateCategory = async (id, formData) => {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: "PUT",
    body: formData,
  });
  return handleResponse(response);
};

// Delete category
export const deleteCategory = async (id) => {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response);
};

// ==================== ATTRIBUTE APIS ====================

// Get all attributes (optional: by category)
export const getAttributes = async (categoryId = null) => {
  let url = `${API_BASE_URL}/attributes`;
  if (categoryId) {
    url += `?categoryId=${categoryId}`;
  }
  const response = await fetch(url);
  return handleResponse(response);
};

// Get attributes by category
export const getAttributesByCategory = async (categoryId) => {
  const response = await fetch(
    `${API_BASE_URL}/attributes/category/${categoryId}`,
  );
  return handleResponse(response);
};

// Get single attribute by ID
export const getAttribute = async (id) => {
  const response = await fetch(`${API_BASE_URL}/attributes/${id}`);
  return handleResponse(response);
};

// Create new attribute
export const createAttribute = async (attributeData) => {
  const response = await fetch(`${API_BASE_URL}/attributes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(attributeData),
  });
  return handleResponse(response);
};

// Update attribute
export const updateAttribute = async (id, attributeData) => {
  const response = await fetch(`${API_BASE_URL}/attributes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(attributeData),
  });
  return handleResponse(response);
};

// Delete attribute
export const deleteAttribute = async (id) => {
  const response = await fetch(`${API_BASE_URL}/attributes/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response);
};

// ==================== PRODUCT APIS ====================

// Get all products (with optional filters)
export const getProducts = async (filters = {}) => {
  let url = `${API_BASE_URL}/products`;
  const queryParams = new URLSearchParams();

  if (filters.categoryId) queryParams.append("categoryId", filters.categoryId);
  if (filters.minPrice) queryParams.append("minPrice", filters.minPrice);
  if (filters.maxPrice) queryParams.append("maxPrice", filters.maxPrice);
  if (filters.search) queryParams.append("search", filters.search);

  if (queryParams.toString()) {
    url += `?${queryParams.toString()}`;
  }

  const response = await fetch(url);
  return handleResponse(response);
};

// Get single product by ID with all details
export const getProduct = async (id) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  return handleResponse(response);
};

// Get products by category
export const getProductsByCategory = async (categoryId) => {
  const response = await fetch(
    `${API_BASE_URL}/products/category/${categoryId}`,
  );
  return handleResponse(response);
};

// Create new product
export const createProduct = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: "POST",
    body: formData,
  });
  return handleResponse(response);
};

// Update product
export const updateProduct = async (id, formData) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "PUT",
    body: formData,
  });
  return handleResponse(response);
};

// Delete product
export const deleteProduct = async (id) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response);
};

// ==================== PRODUCT ATTRIBUTE VALUES APIS ====================

// Get attribute values for a product
export const getProductAttributeValues = async (productId) => {
  const response = await fetch(
    `${API_BASE_URL}/products/${productId}/attributes`,
  );
  return handleResponse(response);
};

// Add attribute values to product
export const addProductAttributeValues = async (productId, attributeValues) => {
  const response = await fetch(
    `${API_BASE_URL}/products/${productId}/attributes`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ attributeValues }),
    },
  );
  return handleResponse(response);
};

// Update product attribute values
export const updateProductAttributeValues = async (
  productId,
  attributeValues,
) => {
  const response = await fetch(
    `${API_BASE_URL}/products/${productId}/attributes`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ attributeValues }),
    },
  );
  return handleResponse(response);
};

// Delete specific attribute value from product
export const deleteProductAttributeValue = async (productId, attributeId) => {
  const response = await fetch(
    `${API_BASE_URL}/products/${productId}/attributes/${attributeId}`,
    {
      method: "DELETE",
    },
  );
  return handleResponse(response);
};

// ==================== PRODUCT IMAGES APIS ====================

// Get all images for a product
export const getProductImages = async (productId) => {
  const response = await fetch(`${API_BASE_URL}/products/${productId}/images`);
  return handleResponse(response);
};

// Add images to product
export const addProductImages = async (productId, formData) => {
  const response = await fetch(`${API_BASE_URL}/products/${productId}/images`, {
    method: "POST",
    body: formData,
  });
  return handleResponse(response);
};

// Delete specific product image
export const deleteProductImage = async (productId, imageId) => {
  const response = await fetch(
    `${API_BASE_URL}/products/${productId}/images/${imageId}`,
    {
      method: "DELETE",
    },
  );
  return handleResponse(response);
};

// Set primary image for product
export const setPrimaryImage = async (productId, imageId) => {
  const response = await fetch(
    `${API_BASE_URL}/products/${productId}/images/${imageId}/primary`,
    {
      method: "PUT",
    },
  );
  return handleResponse(response);
};

// ==================== SEARCH & FILTER APIS ====================

// Search products
export const searchProducts = async (query) => {
  const response = await fetch(
    `${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`,
  );
  return handleResponse(response);
};

// Filter products by attribute values
export const filterProductsByAttributes = async (filters) => {
  const response = await fetch(`${API_BASE_URL}/products/filter`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(filters),
  });
  return handleResponse(response);
};

// Get product statistics (for dashboard)
export const getProductStats = async () => {
  const response = await fetch(`${API_BASE_URL}/products/stats/summary`);
  return handleResponse(response);
};

// ==================== BULK OPERATIONS APIS ====================

// Bulk delete products
export const bulkDeleteProducts = async (productIds) => {
  const response = await fetch(`${API_BASE_URL}/products/bulk/delete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productIds }),
  });
  return handleResponse(response);
};

// Bulk update category for products
export const bulkUpdateProductCategory = async (productIds, categoryId) => {
  const response = await fetch(`${API_BASE_URL}/products/bulk/category`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productIds, categoryId }),
  });
  return handleResponse(response);
};

// ==================== HELPER FUNCTIONS ====================

// Get image URL helper (for consistent image path handling)
export const getImageUrl = (imagePath) => {
  if (!imagePath) return "/no-image.png";
  const path = imagePath.replace(/\\/g, "/");
  if (path.startsWith("http")) return path;
  if (path.startsWith("/uploads")) {
    return `http://localhost:5000${path}`;
  }
  return `http://localhost:5000/uploads/${path}`;
};

// Format price helper
export const formatPrice = (price) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

// Error handler wrapper for API calls
export const apiWrapper = async (
  apiCall,
  errorMessage = "An error occurred",
) => {
  try {
    const result = await apiCall();
    return { success: true, data: result };
  } catch (error) {
    console.error(errorMessage, error);
    return { success: false, error: error.message };
  }
};
