import React, { useEffect, useState } from "react";
import axios from "axios";
import ServicePeopleForm from "./ServicePeopleForm";
import { useNavigate } from "react-router-dom";

export default function ServicePeopleList() {
  const navigate = useNavigate();
  const [servicePeople, setServicePeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editServicePerson, setEditServicePerson] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchServicePeople = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to view service people");
          setLoading(false);
          return;
        }
        const res = await axios.get("/api/service-people", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        let servicePeopleData = res.data;
        if (!Array.isArray(servicePeopleData)) {
          servicePeopleData = [];
        }
        setServicePeople(servicePeopleData);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("You are not authenticated. Please log in again.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        } else {
          setError(err.response?.data?.message || "Failed to load service people");
        }
        setServicePeople([]);
      } finally {
        setLoading(false);
      }
    };
    fetchServicePeople();
  }, [refresh]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service person?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/service-people/${id}`, {
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
        setError(err.response?.data?.message || "Failed to delete service person");
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div className="text-red-600 font-semibold">{error}</div>;
  }

  // Filter service people by search
  const filteredServicePeople = servicePeople.filter(person => {
    const searchTerm = search.toLowerCase();
    return (
      (person.first_name && person.first_name.toLowerCase().includes(searchTerm)) ||
      (person.last_name && person.last_name.toLowerCase().includes(searchTerm)) ||
      (person.phone && person.phone.toLowerCase().includes(searchTerm)) ||
      (person.email && person.email.toLowerCase().includes(searchTerm)) ||
      (person.present_address && person.present_address.toLowerCase().includes(searchTerm)) ||
      (person.permanent_address && person.permanent_address.toLowerCase().includes(searchTerm))
    );
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Service People</h2>
        <input
          type="text"
          placeholder="Search service people..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-64"
        />
      </div>
      <div className="overflow-x-auto rounded-lg shadow bg-white">
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">First Name</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Last Name</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Phone</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Email</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Present Address</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Permanent Address</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredServicePeople.map((person) => (
              <tr key={person.id} className="border-b last:border-b-0 hover:bg-gray-50">
                <td className="px-4 py-2">{person.first_name}</td>
                <td className="px-4 py-2">{person.last_name}</td>
                <td className="px-4 py-2">{person.phone}</td>
                <td className="px-4 py-2">{person.email}</td>
                <td className="px-4 py-2">{person.present_address}</td>
                <td className="px-4 py-2">{person.permanent_address}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                    onClick={() => navigate(`/service-people/${person.id}`)}
                  >View</button>
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                    onClick={() => setEditServicePerson(person)}
                  >Edit</button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                    onClick={() => handleDelete(person.id)}
                  >Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editServicePerson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 relative w-full max-w-xl">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
              onClick={() => setEditServicePerson(null)}
            >
              &times;
            </button>
            <ServicePeopleForm
              initialData={editServicePerson}
              onSuccess={() => {
                setEditServicePerson(null);
                setRefresh(r => r + 1);
              }}
            />
          </div>
        </div>
      )}

    </div>
  );
}
