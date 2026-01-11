import { create } from "zustand";
import { authAPI } from "../api/api";

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const data = await authAPI.login(credentials);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      set({
        user: data,
        token: data.token,
        isAuthenticated: true,
        loading: false,
      });
      return { success: true };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  signup: async (userData) => {
    set({ loading: true, error: null });
    try {
      const data = await authAPI.signup(userData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      set({
        user: data,
        token: data.token,
        isAuthenticated: true,
        loading: false,
      });
      return { success: true };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
