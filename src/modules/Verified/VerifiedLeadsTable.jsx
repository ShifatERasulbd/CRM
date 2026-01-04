import React, { useEffect, useState } from "react";
import LeadsForm from "../Leads/LeadsForm";
import axios from "axios";

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
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                  No verified leads found.
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => (
                <tr key={lead.id} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="px-4 py-2">{lead.first_name || ''} {lead.last_name || ''}</td>
                  <td className="px-4 py-2">{lead.email || '-'}</td>
                  <td className="px-4 py-2">{lead.phone || '-'}</td>
                  <td className="px-4 py-2">{lead.company || '-'}</td>
                  <td className="px-4 py-2">
                    {lead.service && typeof lead.service === 'object'
                      ? lead.service.name || '-'
                      : '-'}
                  </td>
                  <td className="px-4 py-2">{lead.status || '-'}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                      onClick={() => {
                        setEditLead(lead);
                        setShowEditModal(true);
                      }}
                    >Edit</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
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
