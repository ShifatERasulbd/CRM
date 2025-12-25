import React, { useState } from "react";
import axios from "axios";

export default function ServicePeopleForm({ onSuccess, initialData }) {
  const [form, setForm] = useState(
    initialData || {
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      present_address: "",
      permanent_address: "",
      photo: "",
      emergency_contact_name: "",
      emergency_contact_phone: "",
      emergency_contact_relation: "",
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
        await axios.put(`/api/service-people/${initialData.id}`, form, config);
      } else {
        await axios.post("/api/service-people", form, config);
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <label className="block font-semibold">Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            required
          />
          {errors.phone && <div className="text-red-500 text-sm">{errors.phone}</div>}
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
          <label className="block font-semibold">Present Address</label>
          <input
            name="present_address"
            value={form.present_address}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            required
          />
          {errors.present_address && <div className="text-red-500 text-sm">{errors.present_address}</div>}
        </div>
        <div>
          <label className="block font-semibold">Permanent Address</label>
          <input
            name="permanent_address"
            value={form.permanent_address}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            required
          />
          {errors.permanent_address && <div className="text-red-500 text-sm">{errors.permanent_address}</div>}
        </div>
        <div>
          <label className="block font-semibold">Photo URL</label>
          <input
            name="photo"
            value={form.photo}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
          />
          {errors.photo && <div className="text-red-500 text-sm">{errors.photo}</div>}
        </div>
        <div>
          <label className="block font-semibold">Emergency Contact Name</label>
          <input
            name="emergency_contact_name"
            value={form.emergency_contact_name}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            required
          />
          {errors.emergency_contact_name && <div className="text-red-500 text-sm">{errors.emergency_contact_name}</div>}
        </div>
        <div>
          <label className="block font-semibold">Emergency Contact Phone</label>
          <input
            name="emergency_contact_phone"
            value={form.emergency_contact_phone}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            required
          />
          {errors.emergency_contact_phone && <div className="text-red-500 text-sm">{errors.emergency_contact_phone}</div>}
        </div>
        <div>
          <label className="block font-semibold">Emergency Contact Relation</label>
          <input
            name="emergency_contact_relation"
            value={form.emergency_contact_relation}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            required
          />
          {errors.emergency_contact_relation && <div className="text-red-500 text-sm">{errors.emergency_contact_relation}</div>}
        </div>
      </div>
      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded font-semibold hover:bg-gray-900"
        disabled={loading}
      >
        {loading ? "Saving..." : initialData ? "Update Service Person" : "Add Service Person"}
      </button>
    </form>
  );
}
