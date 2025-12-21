
import React, { useEffect, useState } from "react";
import axios from "axios";
import LeadsForm from "../Leads/LeadsForm";

export default function DealsList() {
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

        const res = await axios.get("/api/deals", {
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

    return (
      <div className="mt-8 max-w-4xl mx-auto">
        <h2 className="text-lg font-semibold mb-2">Deals</h2>

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
        <table className="min-w-full text-sm border-collapse">
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
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b last:border-b-0 hover:bg-gray-50">
                <td className="px-4 py-2">{lead.first_name} {lead.last_name}</td>
                <td className="px-4 py-2">{lead.email}</td>
                <td className="px-4 py-2">{lead.phone}</td>
                <td className="px-4 py-2">{lead.company}</td>
                <td className="px-4 py-2">{lead.service?.name || ''}</td>
                <td className="px-4 py-2">{lead.status}</td>
                <td className="px-4 py-2 flex gap-2">
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
            ))}
          </tbody>
        </table>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 relative w-full max-w-xl">
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
