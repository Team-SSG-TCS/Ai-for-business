import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import useProductStore from "../../store/productStore";

export default function Products() {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuthStore();
  const {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    clearError,
  } = useProductStore();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    productId: "",
    name: "",
    price: "",
    featured: false,
    rating: "",
    company: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchProducts();
  }, [isAuthenticated, navigate, fetchProducts]);

  const validateForm = () => {
    const errors = {};

    if (!formData.productId.trim()) {
      errors.productId = "Product ID is required";
    }

    if (!formData.name.trim()) {
      errors.name = "Product name is required";
    }

    if (!formData.price) {
      errors.price = "Price is required";
    } else if (isNaN(formData.price) || parseFloat(formData.price) < 0) {
      errors.price = "Price must be a valid positive number";
    }

    if (
      formData.rating &&
      (isNaN(formData.rating) ||
        parseFloat(formData.rating) < 0 ||
        parseFloat(formData.rating) > 5)
    ) {
      errors.rating = "Rating must be between 0 and 5";
    }

    if (!formData.company.trim()) {
      errors.company = "Company name is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      rating: formData.rating ? parseFloat(formData.rating) : 0,
    };

    if (editingId) {
      // Update existing product
      const result = await updateProduct(editingId, productData);
      if (result.success) {
        setFormData({
          productId: "",
          name: "",
          price: "",
          featured: false,
          rating: "",
          company: "",
        });
        setEditingId(null);
        setShowForm(false);
      }
    } else {
      // Add new product
      const result = await addProduct(productData);
      if (result.success) {
        setFormData({
          productId: "",
          name: "",
          price: "",
          featured: false,
          rating: "",
          company: "",
        });
        setShowForm(false);
      }
    }
  };

  const handleEdit = (product) => {
    setFormData({
      productId: product.productId || "",
      name: product.name || "",
      price: product.price !== undefined ? product.price : "",
      featured: !!product.featured,
      rating: product.rating !== undefined ? product.rating : "",
      company: product.company || "",
    });
    setEditingId(product._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between">
            <span>{error}</span>
            <button onClick={clearError} className="font-bold">
              ×
            </button>
          </div>
        )}

        {/* Add Product Button */}
        <div className="mb-6">
          <button
            onClick={() =>
              setShowForm((prev) => {
                const next = !prev;
                if (!next) setEditingId(null);
                return next;
              })
            }
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {showForm ? "Cancel" : "Add Product"}
          </button>
        </div>

        {/* Add Product Form */}
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Edit Product" : "Add New Product"}
            </h2>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Product ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="productId"
                  value={formData.productId}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.productId ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter product ID"
                />
                {formErrors.productId && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.productId}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter product name"
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.price ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter price"
                />
                {formErrors.price && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.price}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Rating (0-5)
                </label>
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  max="5"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.rating ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter rating"
                />
                {formErrors.rating && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.rating}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Company <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.company ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter company name"
                />
                {formErrors.company && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.company}
                  </p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-gray-700 font-medium">
                  Featured Product
                </label>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition disabled:bg-green-400"
                >
                  {loading
                    ? editingId
                      ? "Updating..."
                      : "Adding..."
                    : editingId
                    ? "Update Product"
                    : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products List */}
        {loading && !showForm ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow">
            <p className="text-gray-600">
              No products found. Add your first product!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-800">
                    {product.name}
                  </h3>
                  {product.featured && (
                    <span className="bg-yellow-400 text-yellow-800 text-xs px-2 py-1 rounded">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  ID: {product.productId}
                </p>
                <p className="text-2xl font-bold text-blue-600 mb-2">
                  ${product.price?.toFixed(2)}
                </p>
                <p className="text-gray-600 mb-1">Company: {product.company}</p>
                <p className="text-gray-600 mb-1">
                  Rating: {product.rating?.toFixed(1)} / 5
                </p>
                <p className="text-gray-500 text-sm mb-4">
                  Added: {new Date(product.createdAt).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition flex-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition flex-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
