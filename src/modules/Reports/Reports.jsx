

import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataTable } from "../../components/ui/data-table";


export default function Reports() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [leads, setLeads] = useState([]);
  const [error, setError] = useState("");

  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "new", label: "New" },
    { value: "qualified", label: "Qualified" },
    { value: "contracting", label: "Contracting/Pricing" },
    { value: "contacted", label: "Contacted" },
    { value: "verified", label: "Verified" },
    { value: "customer", label: "Customer" },
    { value: "lost", label: "Lost" },
  ];

  const fetchStats = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const params = {};
      if (from) params.from = from;
      if (to) params.to = to;
      if (status) params.status = status;
      const res = await axios.get("/api/reports/leads-summary", {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          Accept: "application/json",
        },
        params,
      });
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError("Failed to fetch report stats.");
    } finally {
      setLoading(false);
    }
  };

  const fetchLeads = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const params = {};
      if (from) params.from = from;
      if (to) params.to = to;
      if (status) params.status = status;
      const res = await axios.get("/api/leads", {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          Accept: "application/json",
        },
        params,
      });
      setLeads(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError("Failed to fetch leads.");
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchLeads();
    // eslint-disable-next-line
  }, []);

  const handleFilter = e => {
    e.preventDefault();
    fetchStats();
    fetchLeads();
  };

  // Table columns for leads
  const columns = [
    { accessorKey: "first_name", header: "First Name", cell: ({ row }) => row.original.first_name || "-" },
    { accessorKey: "last_name", header: "Last Name", cell: ({ row }) => row.original.last_name || "-" },
    { accessorKey: "email", header: "Email", cell: ({ row }) => row.original.email || "-" },
    { accessorKey: "phone", header: "Phone", cell: ({ row }) => row.original.phone || "-" },
    { accessorKey: "company", header: "Company", cell: ({ row }) => row.original.company || "-" },
    { accessorKey: "status", header: "Status", cell: ({ row }) => row.original.status || "-" },
  ];

  return (
    <div className="max-w-5xl mx-auto mt-8 bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Leads Report</h2>
      <form className="flex flex-col md:flex-row gap-4 mb-6" onSubmit={handleFilter}>
        <div>
          <label className="block text-sm font-medium mb-1">From</label>
          <input type="date" className="border rounded px-2 py-1" value={from} onChange={e => setFrom(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">To</label>
          <input type="date" className="border rounded px-2 py-1" value={to} onChange={e => setTo(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select className="border rounded px-2 py-1" value={status} onChange={e => setStatus(e.target.value)}>
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-black text-white px-4 py-2 rounded self-end md:self-auto">Filter</button>
      </form>

      {/* Stats summary */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
          <div className="p-4 border rounded bg-gray-50">
            <div className="text-3xl font-bold">{stats.total}</div>
            <div className="text-gray-600">Total Leads</div>
          </div>
          <div className="p-4 border rounded bg-gray-50">
            <div className="text-3xl font-bold">{stats.converted}</div>
            <div className="text-gray-600">Converted</div>
          </div>
          <div className="p-4 border rounded bg-gray-50">
            <div className="text-3xl font-bold">{stats.lost}</div>
            <div className="text-gray-600">Lost</div>
          </div>
          <div className="p-4 border rounded bg-gray-50">
            <div className="text-3xl font-bold">{stats.conversion_rate}%</div>
            <div className="text-gray-600">Conversion Rate</div>
          </div>
          <div className="p-4 border rounded bg-gray-50">
            <div className="text-3xl font-bold">{stats.loss_rate}%</div>
            <div className="text-gray-600">Loss Rate</div>
          </div>
        </div>
      )}

      {/* Table of leads */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : error ? (
        <div className="text-red-500 text-center py-8">{error}</div>
      ) : (
        <DataTable columns={columns} data={leads} />
      )}
    </div>
  );
}
