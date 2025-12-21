import React, { useState } from "react";
import axios from "axios";

export default function TaskFollowupsForm({ onSuccess, initialData }) {
  const [form, setForm] = useState(
    initialData || {
      title: "",
      description: "",
      due_date: "",
      status: "pending",
      user_id: "",
    }
  );
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrors({ auth: "You must be logged in to perform this action" });
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
      if (initialData && initialData.id) {
        await axios.put(`/api/task-followups/${initialData.id}`, form, config);
      } else {
        await axios.post("/api/task-followups", form, config);
      }
      onSuccess && onSuccess();
    } catch (err) {
      setErrors(err.response?.data?.errors || {});
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-semibold">Title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
          required
        />
        {errors.title && <div className="text-red-500 text-sm">{errors.title}</div>}
      </div>
      <div>
        <label className="block font-semibold">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
        />
        {errors.description && <div className="text-red-500 text-sm">{errors.description}</div>}
      </div>
      <div>
        <label className="block font-semibold">Due Date</label>
        <input
          type="date"
          name="due_date"
          value={form.due_date}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
        />
        {errors.due_date && <div className="text-red-500 text-sm">{errors.due_date}</div>}
      </div>
      <div>
        <label className="block font-semibold">Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
        </select>
        {errors.status && <div className="text-red-500 text-sm">{errors.status}</div>}
      </div>
      <div>
        <label className="block font-semibold">User ID</label>
        <input
          name="user_id"
          value={form.user_id}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
        />
        {errors.user_id && <div className="text-red-500 text-sm">{errors.user_id}</div>}
      </div>
      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded font-semibold hover:bg-gray-900"
        disabled={loading}
      >
        {loading ? "Saving..." : initialData ? "Update Task" : "Add Task"}
      </button>
    </form>
  );
}
