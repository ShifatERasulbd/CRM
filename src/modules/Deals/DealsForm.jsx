import React, { useState, useEffect } from "react";
import axios from "axios";

export default function DealsForm({ onSuccess, initialData = null, isEdit = false }) {
  const [form, setForm] = useState(
    initialData || {
      lead_id: "",
      customer_id: "",
      assigned_to: "",
      created_by: "",
      title: "",
      deal_value: "",
      stage: "new",
      probability: 0,
      expected_close_date: "",
      description: "",
      is_won: false,
      is_lost: false,
      closed_at: "",
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
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: null });
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
          `/api/deals/${initialData.id}`,
          form,
          config
        );
      } else {
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        const created_by = userData.id || 1;
        response = await axios.post(
          "/api/deals",
          { ...form, created_by },
          config
        );
      }
      if (!isEdit) {
        setForm({
          lead_id: "",
          customer_id: "",
          assigned_to: "",
          created_by: "",
          title: "",
          deal_value: "",
          stage: "new",
          probability: 0,
          expected_close_date: "",
          description: "",
          is_won: false,
          is_lost: false,
          closed_at: "",
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
      <h2 className="text-lg font-semibold mb-2">{isEdit ? "Edit Deal" : "Add Deal"}</h2>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${validationErrors.title ? 'border-red-500' : ''}`}
            required
          />
          {validationErrors.title && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.title[0]}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Deal Value</label>
          <input
            name="deal_value"
            type="number"
            value={form.deal_value}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${validationErrors.deal_value ? 'border-red-500' : ''}`}
          />
          {validationErrors.deal_value && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.deal_value[0]}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Stage</label>
          <select
            name="stage"
            value={form.stage}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${validationErrors.stage ? 'border-red-500' : ''}`}
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="proposal">Proposal</option>
            <option value="negotiation">Negotiation</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>
          {validationErrors.stage && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.stage[0]}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Probability (%)</label>
          <input
            name="probability"
            type="number"
            min="0"
            max="100"
            value={form.probability}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${validationErrors.probability ? 'border-red-500' : ''}`}
          />
          {validationErrors.probability && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.probability[0]}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Expected Close Date</label>
          <input
            name="expected_close_date"
            type="date"
            value={form.expected_close_date}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${validationErrors.expected_close_date ? 'border-red-500' : ''}`}
          />
          {validationErrors.expected_close_date && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.expected_close_date[0]}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Lead ID</label>
          <input
            name="lead_id"
            value={form.lead_id}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${validationErrors.lead_id ? 'border-red-500' : ''}`}
          />
          {validationErrors.lead_id && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.lead_id[0]}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Customer ID</label>
          <input
            name="customer_id"
            value={form.customer_id}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${validationErrors.customer_id ? 'border-red-500' : ''}`}
          />
          {validationErrors.customer_id && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.customer_id[0]}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Assigned To (User ID)</label>
          <input
            name="assigned_to"
            value={form.assigned_to}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${validationErrors.assigned_to ? 'border-red-500' : ''}`}
            required
          />
          {validationErrors.assigned_to && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.assigned_to[0]}</p>
          )}
        </div>
        <div className="md:col-span-3">
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
        <div className="md:col-span-2 flex gap-4 items-center">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="is_won"
              checked={form.is_won}
              onChange={handleChange}
              className="mr-2"
            />
            Won
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="is_lost"
              checked={form.is_lost}
              onChange={handleChange}
              className="mr-2"
            />
            Lost
          </label>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Closed At</label>
          <input
            name="closed_at"
            type="datetime-local"
            value={form.closed_at}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${validationErrors.closed_at ? 'border-red-500' : ''}`}
          />
          {validationErrors.closed_at && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.closed_at[0]}</p>
          )}
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-black text-white py-2 rounded font-semibold hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? "Saving..." : (isEdit ? "Update Deal" : "Add Deal")}
      </button>
    </form>
  );
}
