import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CustomersForm from "./CustomersForm";
import LeadsForm from "../Leads/LeadsForm";
import { DataTable } from "../../components/ui/data-table";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editCustomer, setEditCustomer] = useState(null);
  const [showLeadsEditModal, setShowLeadsEditModal] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to view customers");
          setLoading(false);
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        };

        // Customers
        const resCustomers = await axios.get("/api/customers", { headers });
        const customersData = Array.isArray(resCustomers.data)
          ? resCustomers.data
          : [];

        // Leads → customers
        const resLeads = await axios.get("/api/leads", { headers });
        const leadsData = Array.isArray(resLeads.data) ? resLeads.data : [];

        const customerLeads = leadsData.filter(
          (lead) => lead.status === "customer"
        );

        // Merge (avoid duplicate by email)
        const merged = [...customersData];
        customerLeads.forEach((lead) => {
          if (!merged.some((c) => c.email === lead.email)) {
            merged.push(lead);
          }
        });

        setCustomers(merged);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Session expired. Please login again.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        } else {
          setError(err.response?.data?.message || "Failed to load customers");
        }
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [refresh]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/customers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRefresh((r) => r + 1);
    } catch {
      alert("Failed to delete customer");
    }
  };

  const handleEdit = (customer) => {
    setEditCustomer(customer);
    setShowLeadsEditModal(true);
  };

  const handleView = (customer) => {
    navigate(`/customers/${customer.id}`);
  };

  if (loading) return <div>Loading customers...</div>;

  if (error)
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );

  // Ensure customers is always an array
  const safeCustomers = Array.isArray(customers) ? customers : [];
  // Filter customers by search
  const filteredCustomers = safeCustomers.filter(customer => {
    const searchTerm = search.toLowerCase();
    return (
      (customer.first_name && customer.first_name.toLowerCase().includes(searchTerm)) ||
      (customer.last_name && customer.last_name.toLowerCase().includes(searchTerm)) ||
      (customer.email && customer.email.toLowerCase().includes(searchTerm)) ||
      (customer.phone && customer.phone.toLowerCase().includes(searchTerm)) ||
      (customer.company && customer.company.toLowerCase().includes(searchTerm)) ||
      (customer.status && customer.status.toLowerCase().includes(searchTerm))
    );
  });

  // DataTable columns
  const columns = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => `${row.original.first_name || ""} ${row.original.last_name || ""}`,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => row.original.email,
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => row.original.phone,
    },
    {
      accessorKey: "company",
      header: "Company",
      cell: ({ row }) => row.original.company,
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
            onClick={() => handleView(row.original)}
            className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
          >
            View
          </button>
          <button
            onClick={() => handleEdit(row.original)}
            className="bg-indigo-500 text-white px-2 py-1 rounded text-xs"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row.original.id)}
            className="bg-red-500 text-white px-2 py-1 rounded text-xs"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="mt-8 max-w-4xl mx-auto">
      {/* Title and Search Bar */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Customers</h2>
        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-64"
        />
      </div>
      <div className="overflow-x-auto rounded-lg shadow bg-white">
        <DataTable columns={columns} data={filteredCustomers} />
      </div>

      {showLeadsEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 relative w-full max-w-5xl overflow-y-auto" style={{ maxHeight: '90vh' }}>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
              onClick={() => setShowLeadsEditModal(false)}
            >
              &times;
            </button>
            <LeadsForm
              initialData={editCustomer}
              isEdit={true}
              onSuccess={() => {
                setShowLeadsEditModal(false);
                setRefresh((r) => r + 1);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
