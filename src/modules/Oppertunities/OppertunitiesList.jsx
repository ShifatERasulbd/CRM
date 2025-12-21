import React, { useEffect, useState } from "react";
import axios from "axios";
import OppertunitiesForm from "./OppertunitiesForm";

export default function OppertunitiesList() {
  const [oppertunities, setOppertunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editOppertunity, setEditOppertunity] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [refresh, setRefresh] = useState(0);

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
    if (!window.confirm("Are you sure you want to delete this oppertunity?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/oppertunities/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRefresh(r => r + 1);
    } catch (err) {
      alert("Failed to delete oppertunity");
    }
  };

  const handleEdit = (oppertunity) => {
    setEditOppertunity(oppertunity);
    setShowEditModal(true);
  };

  if (loading) return <div>Loading oppertunities...</div>;
  if (error) return <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>;

  return (
    <div className="mt-8 max-w-4xl mx-auto">
      <h2 className="text-lg font-semibold mb-2">Oppertunities</h2>
      <div className="overflow-x-auto rounded-lg shadow bg-white">
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Name</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Value</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Stage</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Status</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {oppertunities.map((oppertunity) => (
              <tr key={oppertunity.id} className="border-b last:border-b-0 hover:bg-gray-50">
                <td className="px-4 py-2">{oppertunity.name}</td>
                <td className="px-4 py-2">{oppertunity.value}</td>
                <td className="px-4 py-2">{oppertunity.stage}</td>
                <td className="px-4 py-2">{oppertunity.status}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                    onClick={() => handleEdit(oppertunity)}
                  >Edit</button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                    onClick={() => handleDelete(oppertunity.id)}
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
            <OppertunitiesForm
              initialData={editOppertunity}
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
