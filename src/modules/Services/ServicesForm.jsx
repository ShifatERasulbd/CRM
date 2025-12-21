import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ServicesForm({ onSuccess, initialData = null, isEdit = false }) {
  const [form, setForm] = useState(
    initialData || {
      name: "",
      description: "",
      price: "",
      status: "active",
      created_by: "",
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (validationErrors[e.target.name]) {
      setValidationErrors({ ...validationErrors, [e.target.name]: null });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setValidationErrors({});
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to perform this action");
        setLoading(false);
        return;
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      };
      let response;
      if (isEdit && initialData) {
        response = await axios.put(
          `/api/services/${initialData.id}`,
          form,
          config
        );
      } else {
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        const created_by = userData.id || 1;
        response = await axios.post(
          "/api/services",
          { ...form, created_by },
          config
        );
      }
      if (!isEdit) {
        setForm({
          name: "",
          description: "",
          price: "",
          status: "active",
          created_by: "",
        });
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      if (err.response?.status === 422 && err.response?.data?.errors) {
        setValidationErrors(err.response.data.errors);
        setError("Please fix the validation errors below");
      } else if (err.response?.status === 401) {
        setError("You are not authenticated. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } else {
        setError(err.response?.data?.message || err.message || "An error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow max-w-xl mx-auto">
      <h2 className="text-lg font-semibold mb-2">{isEdit ? "Edit Service" : "Add Service"}</h2>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${validationErrors.name ? 'border-red-500' : ''}`}
            required
          />
          {validationErrors.name && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.name[0]}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Price</label>
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${validationErrors.price ? 'border-red-500' : ''}`}
          />
          {validationErrors.price && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.price[0]}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${validationErrors.status ? 'border-red-500' : ''}`}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          {validationErrors.status && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.status[0]}</p>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${validationErrors.description ? 'border-red-500' : ''}`}
            rows="2"
          />
          {validationErrors.description && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.description[0]}</p>
          )}
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-black text-white py-2 rounded font-semibold hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? "Saving..." : (isEdit ? "Update Service" : "Add Service")}
      </button>
    </form>
  );
}
