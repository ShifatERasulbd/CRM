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
    <div className="overflow-x-auto">
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">User</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity) => (
            <tr key={activity.id}>
              <td className="p-2 border">{activity.id}</td>
              <td className="p-2 border">{activity.title}</td>
              <td className="p-2 border">{activity.description}</td>
              <td className="p-2 border">{activity.date}</td>
              <td className="p-2 border">{activity.type}</td>
              <td className="p-2 border">{activity.user ? activity.user.name : "-"}</td>
              <td className="p-2 border space-x-2">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => setEditActivity(activity)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => handleDelete(activity.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
