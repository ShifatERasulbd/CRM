
import React, { useEffect, useState } from "react";
import axios from "axios";
import LeadsForm from "../Leads/LeadsForm";
import {useNavigate } from "react-router-dom";
import { DataTable } from "../../components/ui/data-table";

export default function OppertunitiesList() {
  const [oppertunities, setOppertunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editLead, setEditLead] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchOppertunities = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to view oppertunities");
          setLoading(false);
          return;
        }
        const res = await axios.get("/api/oppertunities", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        let oppertunitiesData = res.data;
        if (!Array.isArray(oppertunitiesData)) {
          oppertunitiesData = [];
        }
        setOppertunities(oppertunitiesData);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("You are not authenticated. Please log in again.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        } else {
          setError(err.response?.data?.message || "Failed to load oppertunities");
        }
        setOppertunities([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOppertunities();
  }, [refresh]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/leads/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      setRefresh(r => r + 1);
    } catch (err) {
      console.error("Error deleting lead:", err);
      const errorMsg = err.response?.data?.message || "Failed to delete lead";
      alert(errorMsg);
    }
  };

  const handleView = (lead) => {
    navigate(`/leads/${lead.id}`);
  };

  // When editing an opportunity, load the lead edit modal (LeadsForm)
  const handleEdit = (opportunity) => {
    setEditLead(opportunity);
    setShowEditModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-gray-600">Loading leads...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  // Statistics - ensure oppertunities is always an array
  const safeOppertunities = Array.isArray(oppertunities) ? oppertunities : [];
  const totalOppertunities = safeOppertunities.length;
  const statusCounts = safeOppertunities.reduce((acc, opp) => {
    const status = opp?.status || 'unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Filter opportunities by search
  const filteredOppertunities = safeOppertunities.filter(opp => {
    const searchTerm = search.toLowerCase();
    return (
      (opp.first_name && opp.first_name.toLowerCase().includes(searchTerm)) ||
      (opp.last_name && opp.last_name.toLowerCase().includes(searchTerm)) ||
      (opp.email && opp.email.toLowerCase().includes(searchTerm)) ||
      (opp.phone && opp.phone.toLowerCase().includes(searchTerm)) ||
      (opp.company && opp.company.toLowerCase().includes(searchTerm)) ||
      (opp.status && opp.status.toLowerCase().includes(searchTerm)) ||
      (opp.service && typeof opp.service === 'object' && opp.service.name && opp.service.name.toLowerCase().includes(searchTerm))
    );
  });

  return (
    <div className="mt-8 max-w-4xl mx-auto">
      {/* Title and Search Bar */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Oppertunities</h2>
        <input
          type="text"
          placeholder="Search opportunities..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-64"
        />
      </div>

      {/* Statistics Section */}
      <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-100 rounded p-3 text-center">
          <div className="text-xs text-gray-500">Total Oppertunities</div>
          <div className="text-lg font-bold">{totalOppertunities}</div>
        </div>
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status} className="bg-gray-100 rounded p-3 text-center">
            <div className="text-xs text-gray-500">{status.charAt(0).toUpperCase() + status.slice(1)}</div>
            <div className="text-lg font-bold">{count}</div>
          </div>
        ))}
      </div>

      {/* Shadcn DataTable for Opportunities */}
      <DataTable
        columns={[
          {
            accessorKey: "first_name",
            header: "Name",
            cell: ({ row }) => `${row.original.first_name || ''} ${row.original.last_name || ''}`,
          },
          {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => row.original.email || "-",
          },
          {
            accessorKey: "phone",
            header: "Phone",
            cell: ({ row }) => row.original.phone || "-",
          },
          {
            accessorKey: "company",
            header: "Company",
            cell: ({ row }) => row.original.company || "-",
          },
          {
            accessorKey: "service",
            header: "Service",
            cell: ({ row }) => row.original.service?.name || "-",
          },
          {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => row.original.status || "-",
          },
          {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
              <div className="flex gap-2">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                  onClick={() => handleView(row.original)}
                >View</button>
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                  onClick={() => handleEdit(row.original)}
                >Edit</button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                  onClick={() => handleDelete(row.original.id)}
                >Delete</button>
              </div>
            ),
          },
        ]}
        data={filteredOppertunities}
      />

      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 relative w-full max-w-4xl overflow-y-auto max-h-screen">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
              onClick={() => setShowEditModal(false)}
            >
              &times;
            </button>
            <LeadsForm
              initialData={editLead}
              onSuccess={() => {
                setShowEditModal(false);
                setRefresh(r => r + 1);
              }}
              isEdit={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
