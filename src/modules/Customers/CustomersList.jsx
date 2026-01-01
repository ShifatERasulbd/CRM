import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CustomersForm from "./CustomersForm";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editCustomer, setEditCustomer] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [refresh, setRefresh] = useState(0);

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
    setShowEditModal(true);
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

  return (
    <div className="mt-8 max-w-4xl mx-auto">
      <h2 className="text-lg font-semibold mb-3">Customers</h2>

      <div className="overflow-x-auto rounded-lg shadow bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Company</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {safeCustomers.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                  No customers found.
                </td>
              </tr>
            ) : (
              safeCustomers.map((customer) => (
              <tr
                key={customer.id}
                className="border-b hover:bg-gray-50"
              >
                <td className="px-4 py-2">
                  {customer.first_name} {customer.last_name}
                </td>
                <td className="px-4 py-2">{customer.email}</td>
                <td className="px-4 py-2">{customer.phone}</td>
                <td className="px-4 py-2">{customer.company}</td>
                <td className="px-4 py-2">{customer.status}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => handleView(customer)}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(customer)}
                    className="bg-indigo-500 text-white px-2 py-1 rounded text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(customer.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-lg w-full max-w-xl relative">
            <button
              className="absolute top-2 right-3 text-xl"
              onClick={() => setShowEditModal(false)}
            >
              ×
            </button>

            <CustomersForm
              initialData={editCustomer}
              isEdit
              onSuccess={() => {
                setShowEditModal(false);
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
