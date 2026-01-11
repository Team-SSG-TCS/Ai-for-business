const API_URL = "http://localhost:5000/api";

// Helper function for making authenticated requests
const authFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

// Auth API
export const authAPI = {
  login: (credentials) =>
    authFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  signup: (userData) =>
    authFetch("/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  getProfile: () => authFetch("/auth/profile"),
};

// Products API
export const productsAPI = {
  getAll: () => authFetch("/products"),

  add: (product) =>
    authFetch("/products", {
      method: "POST",
      body: JSON.stringify(product),
    }),

  update: (id, product) =>
    authFetch(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(product),
    }),

  delete: (id) =>
    authFetch(`/products/${id}`, {
      method: "DELETE",
    }),

  getFeatured: () => authFetch("/products/featured"),

  getByMaxPrice: (maxPrice) => authFetch(`/products/price/${maxPrice}`),

  getByMinRating: (minRating) => authFetch(`/products/rating/${minRating}`),
};
