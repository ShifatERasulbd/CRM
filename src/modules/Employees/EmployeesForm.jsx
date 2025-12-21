import React, { useState } from "react";
import axios from "axios";

export default function EmployeesForm({ onSuccess, initialData }) {
  const [form, setForm] = useState(
    initialData || {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      position: "",
      department: "",
      hire_date: "",
      salary: "",
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
        await axios.put(`/api/employees/${initialData.id}`, form, config);
      } else {
        await axios.post("/api/employees", form, config);
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
        <label className="block font-semibold">First Name</label>
        <input
          name="first_name"
          value={form.first_name}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
          required
        />
        {errors.first_name && <div className="text-red-500 text-sm">{errors.first_name}</div>}
      </div>
      <div>
        <label className="block font-semibold">Last Name</label>
        <input
          name="last_name"
          value={form.last_name}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
          required
        />
        {errors.last_name && <div className="text-red-500 text-sm">{errors.last_name}</div>}
      </div>
      <div>
        <label className="block font-semibold">Email</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
          required
        />
        {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
      </div>
      <div>
        <label className="block font-semibold">Phone</label>
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
        />
        {errors.phone && <div className="text-red-500 text-sm">{errors.phone}</div>}
      </div>
      <div>
        <label className="block font-semibold">Position</label>
        <input
          name="position"
          value={form.position}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
        />
        {errors.position && <div className="text-red-500 text-sm">{errors.position}</div>}
      </div>
      <div>
        <label className="block font-semibold">Department</label>
        <input
          name="department"
          value={form.department}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
        />
        {errors.department && <div className="text-red-500 text-sm">{errors.department}</div>}
      </div>
      <div>
        <label className="block font-semibold">Hire Date</label>
        <input
          type="date"
          name="hire_date"
          value={form.hire_date}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
        />
        {errors.hire_date && <div className="text-red-500 text-sm">{errors.hire_date}</div>}
      </div>
      <div>
        <label className="block font-semibold">Salary</label>
        <input
          name="salary"
          type="number"
          value={form.salary}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
        />
        {errors.salary && <div className="text-red-500 text-sm">{errors.salary}</div>}
      </div>
      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded font-semibold hover:bg-gray-900"
        disabled={loading}
      >
        {loading ? "Saving..." : initialData ? "Update Employee" : "Add Employee"}
      </button>
    </form>
  );
}
