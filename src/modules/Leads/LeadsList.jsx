
import React, { useEffect, useState } from "react";
import axios from "axios";
import LeadsForm from "./LeadsForm";
import { useNavigate } from "react-router-dom";
export default function LeadsList() {
    const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editLead, setEditLead] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("You must be logged in to view leads");
          setLoading(false);
          return;
        }


        

        const res = await axios.get("/api/leads", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        // Defensive: only set leads if response is an array
        let leadsData = res.data;
        if (!Array.isArray(leadsData)) {
          leadsData = [];
        }
        setLeads(leadsData);
      } catch (err) {
        console.error("Error fetching leads:", err);
        if (err.response?.status === 401) {
          setError("You are not authenticated. Please log in again.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        } else {
          setError(err.response?.data?.message || "Failed to load leads");
        }
        setLeads([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
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

  const handleEdit = (lead) => {
    setEditLead(lead);
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

    // Statistics
    const totalLeads = leads.length;
    const statusCounts = leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {});

    // Filter leads by search
    const filteredLeads = leads.filter(lead => {
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
      <div className="mt-8 w-full">
        {/* Title and Search Bar */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Leads</h2>
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded px-3 py-2 w-64"
          />
        </div>

        {/* Statistics Section */}
        <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-100 rounded p-3 text-center">
            <div className="text-xs text-gray-500">Total Leads</div>
            <div className="text-lg font-bold">{totalLeads}</div>
          </div>
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className="bg-gray-100 rounded p-3 text-center">
              <div className="text-xs text-gray-500">{status.charAt(0).toUpperCase() + status.slice(1)}</div>
              <div className="text-lg font-bold">{count}</div>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto rounded-lg shadow bg-white">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Name</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Email</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Phone</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Company</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Service</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Status</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                  No leads found. Click "Add Lead" to create your first lead.
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => (
                <tr key={lead.id} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="px-4 py-2">
                    {lead.first_name || ''} {lead.last_name || ''}
                  </td>
                  <td className="px-4 py-2">{lead.email || '-'}</td>
                  <td className="px-4 py-2">{lead.phone || '-'}</td>
                  <td className="px-4 py-2">{lead.company || '-'}</td>
                  <td className="px-4 py-2">
                    {lead.service && typeof lead.service === 'object'
                      ? lead.service.name || '-'
                      : '-'}
                  </td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                      lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                      lead.status === 'qualified' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {lead.status || 'new'}
                    </span>
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                     <button
                    onClick={() => handleView(lead)}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                  >
                    View
                  </button>
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                      onClick={() => handleEdit(lead)}
                    >Edit</button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                      onClick={() => handleDelete(lead.id)}
                    >Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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
