import React, { useEffect, useState } from "react";
import axios from "axios";
import ActivitiesForm from "./ActivitiesForm";

export default function ActivitiesList() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editActivity, setEditActivity] = useState(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to view activities");
          setLoading(false);
          return;
        }
        const res = await axios.get("/api/activities", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        let activitiesData = res.data;
        if (!Array.isArray(activitiesData)) {
          activitiesData = [];
        }
        setActivities(activitiesData);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("You are not authenticated. Please log in again.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        } else {
          setError(err.response?.data?.message || "Failed to load activities");
        }
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, [refresh]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this activity?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/activities/${id}` , {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      setRefresh(r => r + 1);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("You are not authenticated. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } else {
        setError(err.response?.data?.message || "Failed to delete activity");
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div className="text-red-600 font-semibold">{error}</div>;
  }

  return (
    <div className="mt-8 max-w-4xl mx-auto">
      <h2 className="text-lg font-semibold mb-2">Activities</h2>
      <div className="overflow-x-auto rounded-lg shadow bg-white">
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Title</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Description</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Date</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Type</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">User</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity.id} className="border-b last:border-b-0 hover:bg-gray-50">
                <td className="px-4 py-2">{activity.title}</td>
                <td className="px-4 py-2">{activity.description}</td>
                <td className="px-4 py-2">{activity.date}</td>
                <td className="px-4 py-2">{activity.type}</td>
                <td className="px-4 py-2">{activity.user ? activity.user.name : "-"}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                    onClick={() => setEditActivity(activity)}
                  >Edit</button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                    onClick={() => handleDelete(activity.id)}
                  >Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 relative w-full max-w-xl">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
              onClick={() => setEditActivity(null)}
            >
              &times;
            </button>
            <ActivitiesForm
              initialData={editActivity}
              onSuccess={() => {
                setEditActivity(null);
                setRefresh(r => r + 1);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
