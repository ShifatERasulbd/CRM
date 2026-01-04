import React, { useEffect, useState } from "react";
import axios from "axios";
import ServicesForm from "./ServicesForm";
import { DataTable } from "../../components/ui/data-table";

export default function ServicesList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editService, setEditService] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to view services");
          setLoading(false);
          return;
        }
        const res = await axios.get("/api/services", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        let servicesData = res.data;
        if (!Array.isArray(servicesData)) {
          servicesData = [];
        }
        setServices(servicesData);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("You are not authenticated. Please log in again.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        } else {
          setError(err.response?.data?.message || "Failed to load services");
        }
        setServices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [refresh]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/services/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRefresh(r => r + 1);
    } catch (err) {
      alert("Failed to delete service");
    }
  };

  const handleEdit = (service) => {
    setEditService(service);
    setShowEditModal(true);
  };

  if (loading) return <div>Loading services...</div>;
  if (error) return <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>;

  // DataTable columns
  const columns = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => row.original.name,
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => row.original.price,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => row.original.status,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
            onClick={() => handleEdit(row.original)}
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
    <div className="mt-8 max-w-4xl mx-auto">
      <h2 className="text-lg font-semibold mb-2">Services</h2>
      <div className="overflow-x-auto rounded-lg shadow bg-white">
        <DataTable columns={columns} data={services} />
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
            <ServicesForm
              initialData={editService}
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
