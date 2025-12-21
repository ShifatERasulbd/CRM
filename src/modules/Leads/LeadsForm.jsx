import React, { useState } from "react";

export default function LeadsForm({ onSuccess }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company: "",
    status: "new",
    source: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, created_by: 1 }), // TODO: dynamic user
      });
      if (!res.ok) throw new Error("Failed to create lead");
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        company: "",
        status: "new",
        source: "",
        notes: "",
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow max-w-xl mx-auto">
      <h2 className="text-lg font-semibold mb-2">Add Lead</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">First Name</label>
          <input name="first_name" value={form.first_name} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <input name="last_name" value={form.last_name} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input name="phone" value={form.phone} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Company</label>
          <input name="company" value={form.company} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded px-3 py-2">
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="lost">Lost</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Source</label>
          <input name="source" value={form.source} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
      </div>
      <button type="submit" className="w-full bg-black text-white py-2 rounded font-semibold hover:bg-gray-900" disabled={loading}>
        {loading ? "Saving..." : "Add Lead"}
      </button>
      {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
    </form>
  );
}
