import React, { useEffect, useState } from "react";
import axios from "axios";
import ServicePeopleForm from "./ServicePeopleForm";
import { useNavigate } from "react-router-dom";
import { DataTable } from "../../components/ui/data-table";

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

  // DataTable columns
  const columns = [
    {
      accessorKey: "first_name",
      header: "First Name",
      cell: ({ row }) => row.original.first_name,
    },
    {
      accessorKey: "last_name",
      header: "Last Name",
      cell: ({ row }) => row.original.last_name,
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => row.original.phone,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => row.original.email,
    },
    {
      accessorKey: "present_address",
      header: "Present Address",
      cell: ({ row }) => row.original.present_address,
    },
    {
      accessorKey: "permanent_address",
      header: "Permanent Address",
      cell: ({ row }) => row.original.permanent_address,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
            onClick={() => navigate(`/service-people/${row.original.id}`)}
          >View</button>
          <button
            className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
            onClick={() => setEditServicePerson(row.original)}
          >Edit</button>
          <button
            className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
            onClick={() => handleDelete(row.original.id)}
          >Delete</button>
        </div>
      ),
    },
  ];

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
        <DataTable columns={columns} data={filteredServicePeople} />
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
