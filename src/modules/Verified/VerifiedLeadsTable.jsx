import React, { useEffect, useState } from "react";
import LeadsForm from "../Leads/LeadsForm";
import axios from "axios";
import { DataTable } from "../../components/ui/data-table";

export default function VerifiedLeadsTable() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editLead, setEditLead] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchVerifiedLeads = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to view verified leads");
          setLoading(false);
          return;
        }
        const res = await axios.get("/api/leads", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        let leadsData = res.data;
        if (!Array.isArray(leadsData)) {
          leadsData = [];
        }
        // Filter only verified leads
        setLeads(leadsData.filter(lead => lead.status === "verified"));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load verified leads");
        setLeads([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVerifiedLeads();
  }, [refresh]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-gray-600">Loading verified leads...</div>
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

  // Ensure leads is always an array
  const safeLeads = Array.isArray(leads) ? leads : [];
  // Filter verified leads by search
  const filteredLeads = safeLeads.filter(lead => {
    const searchTerm = search.toLowerCase();
    return (
      (lead.first_name && lead.first_name.toLowerCase().includes(searchTerm)) ||
      (lead.last_name && lead.last_name.toLowerCase().includes(searchTerm)) ||
      (lead.email && lead.email.toLowerCase().includes(searchTerm)) ||
      (lead.phone && lead.phone.toLowerCase().includes(searchTerm)) ||
      (lead.company && lead.company.toLowerCase().includes(searchTerm)) ||
      (lead.status && lead.status.toLowerCase().includes(searchTerm)) ||
      (lead.service && typeof lead.service === 'object' && lead.service.name && lead.service.name.toLowerCase().includes(searchTerm))
    );
  });

  return (
    <div className="mt-8 max-w-4xl mx-auto">
      {/* Title and Search Bar */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Verified Leads</h2>
        <input
          type="text"
          placeholder="Search verified leads..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-64"
        />
      </div>
      {/* Shadcn DataTable for Verified Leads */}
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
                  className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                  onClick={() => window.location.href = `/leads/${row.original.id}`}
                >View</button>
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                  onClick={() => {
                    setEditLead(row.original);
                    setShowEditModal(true);
                  }}
                >Edit</button>
              </div>
            ),
          },
        ]}
        data={filteredLeads}
      />
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 relative w-full max-w-5xl overflow-y-auto" style={{ maxHeight: '90vh' }}>
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
