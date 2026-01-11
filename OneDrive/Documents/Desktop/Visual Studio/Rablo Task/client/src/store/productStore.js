import { create } from "zustand";
import { productsAPI } from "../api/api";

const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const data = await productsAPI.getAll();
      set({ products: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addProduct: async (product) => {
    set({ loading: true, error: null });
    try {
      const data = await productsAPI.add(product);
      set((state) => ({
        products: [...state.products, data],
        loading: false,
      }));
      return { success: true };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  updateProduct: async (id, product) => {
    set({ loading: true, error: null });
    try {
      const data = await productsAPI.update(id, product);
      set((state) => ({
        products: state.products.map((p) => (p._id === id ? data : p)),
        loading: false,
      }));
      return { success: true };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      await productsAPI.delete(id);
      set((state) => ({
        products: state.products.filter((p) => p._id !== id),
        loading: false,
      }));
      return { success: true };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  fetchFeatured: async () => {
    set({ loading: true, error: null });
    try {
      const data = await productsAPI.getFeatured();
      set({ products: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchByMaxPrice: async (maxPrice) => {
    set({ loading: true, error: null });
    try {
      const data = await productsAPI.getByMaxPrice(maxPrice);
      set({ products: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchByMinRating: async (minRating) => {
    set({ loading: true, error: null });
    try {
      const data = await productsAPI.getByMinRating(minRating);
      set({ products: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useProductStore;
