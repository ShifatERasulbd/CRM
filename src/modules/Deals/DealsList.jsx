import React, { useEffect, useState } from "react";
import axios from "axios";
import DealsForm from "./DealsForm";

export default function DealsList() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editDeal, setEditDeal] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to view deals");
          setLoading(false);
          return;
        }
        const res = await axios.get("/api/deals", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        let dealsData = res.data;
        if (!Array.isArray(dealsData)) {
          dealsData = [];
        }
        setDeals(dealsData);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("You are not authenticated. Please log in again.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        } else {
          setError(err.response?.data?.message || "Failed to load deals");
        }
        setDeals([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, [refresh]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this deal?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/deals/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRefresh(r => r + 1);
    } catch (err) {
      alert("Failed to delete deal");
    }
  };

  const handleEdit = (deal) => {
    setEditDeal(deal);
    setShowEditModal(true);
  };

  if (loading) return <div>Loading deals...</div>;
  if (error) return <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>;

  return (
    <div className="mt-8 max-w-4xl mx-auto">
      <h2 className="text-lg font-semibold mb-2">Deals</h2>
      <div className="overflow-x-auto rounded-lg shadow bg-white">
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Title</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Value</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Stage</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Probability</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Status</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {deals.map((deal) => (
              <tr key={deal.id} className="border-b last:border-b-0 hover:bg-gray-50">
                <td className="px-4 py-2">{deal.title}</td>
                <td className="px-4 py-2">{deal.deal_value}</td>
                <td className="px-4 py-2">{deal.stage}</td>
                <td className="px-4 py-2">{deal.probability}%</td>
                <td className="px-4 py-2">{deal.is_won ? "Won" : deal.is_lost ? "Lost" : "Open"}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                    onClick={() => handleEdit(deal)}
                  >Edit</button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                    onClick={() => handleDelete(deal.id)}
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
            <DealsForm
              initialData={editDeal}
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
