

import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataTable } from "../../components/ui/data-table";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";


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

  // Download as CSV
  const downloadCSV = () => {
    if (!leads || leads.length === 0) {
      alert("No data to download");
      return;
    }

    // Prepare CSV headers
    const headers = ["First Name", "Last Name", "Email", "Phone", "Company", "Status"];

    // Prepare CSV rows
    const rows = leads.map(lead => [
      lead.first_name || "-",
      lead.last_name || "-",
      lead.email || "-",
      lead.phone || "-",
      lead.company || "-",
      lead.status || "-"
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `leads_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download as PDF
  const downloadPDF = () => {
    if (!leads || leads.length === 0) {
      alert("No data to download");
      return;
    }

    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Leads Report", 14, 20);

    // Add filter info
    doc.setFontSize(10);
    let yPos = 30;
    if (from || to || status) {
      doc.text("Filters Applied:", 14, yPos);
      yPos += 6;
      if (from) {
        doc.text(`From: ${from}`, 14, yPos);
        yPos += 6;
      }
      if (to) {
        doc.text(`To: ${to}`, 14, yPos);
        yPos += 6;
      }
      if (status) {
        const statusLabel = statusOptions.find(opt => opt.value === status)?.label || status;
        doc.text(`Status: ${statusLabel}`, 14, yPos);
        yPos += 6;
      }
      yPos += 4;
    }

    // Add statistics if available
    if (stats) {
      doc.text(`Total Leads: ${stats.total} | Converted: ${stats.converted} | Lost: ${stats.lost} | Conversion Rate: ${stats.conversion_rate}% | Loss Rate: ${stats.loss_rate}%`, 14, yPos);
      yPos += 10;
    }

    // Prepare table data
    const tableData = leads.map(lead => [
      lead.first_name || "-",
      lead.last_name || "-",
      lead.email || "-",
      lead.phone || "-",
      lead.company || "-",
      lead.status || "-"
    ]);

    // Add table using autoTable
    autoTable(doc, {
      head: [["First Name", "Last Name", "Email", "Phone", "Company", "Status"]],
      body: tableData,
      startY: yPos,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [0, 0, 0] }
    });

    // Save PDF
    doc.save(`leads_report_${new Date().toISOString().split('T')[0]}.pdf`);
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

      {/* Download buttons */}
      {!loading && !error && leads.length > 0 && (
        <div className="flex gap-3 mb-4">
          <button
            onClick={downloadCSV}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Download CSV
          </button>
          <button
            onClick={downloadPDF}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Download PDF
          </button>
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