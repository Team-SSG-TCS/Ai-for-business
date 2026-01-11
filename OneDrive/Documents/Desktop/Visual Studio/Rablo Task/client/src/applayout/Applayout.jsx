import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "../pages/signup/Signup";
import Products from "../pages/products/Products";
import useAuthStore from "../store/authStore";
import Login from "../pages/login/Login";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default function Applayout() {
  const { isAuthenticated } = useAuthStore();

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? "/products" : "/login"} />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
