import React, { useEffect, useState } from "react";
import axios from "axios";
import CustomersForm from "./CustomersForm";

export default function CustomersList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editCustomer, setEditCustomer] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [refresh, setRefresh] = useState(0);

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
        // Fetch customers from /api/customers
        const resCustomers = await axios.get("/api/customers", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        let customersData = resCustomers.data;
        if (!Array.isArray(customersData)) {
          customersData = [];
        }
        // Fetch leads with status 'customers' from /api/leads
        const resLeads = await axios.get("/api/leads", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        let leadsData = resLeads.data;
        if (!Array.isArray(leadsData)) {
          leadsData = [];
        }
        const customerLeads = leadsData.filter(lead => lead.status === "customers");
        // Merge, avoiding duplicates by email (or id if you prefer)
        const merged = [...customersData];
        customerLeads.forEach(lead => {
          if (!merged.some(c => c.email === lead.email)) {
            merged.push(lead);
          }
        });
        setCustomers(merged);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("You are not authenticated. Please log in again.");
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
      await axios.delete(`/api/customers/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRefresh(r => r + 1);
    } catch (err) {
      alert("Failed to delete customer");
    }
  };

  const handleEdit = (customer) => {
    setEditCustomer(customer);
    setShowEditModal(true);
  };

  if (loading) return <div>Loading customers...</div>;
  if (error) return <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>;

  return (
    <div className="mt-8 max-w-4xl mx-auto">
      <h2 className="text-lg font-semibold mb-2">Customers</h2>
      <div className="overflow-x-auto rounded-lg shadow bg-white">
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Name</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Email</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Phone</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Company</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Status</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b last:border-b-0 hover:bg-gray-50">
                <td className="px-4 py-2">{customer.first_name} {customer.last_name}</td>
                <td className="px-4 py-2">{customer.email}</td>
                <td className="px-4 py-2">{customer.phone}</td>
                <td className="px-4 py-2">{customer.company}</td>
                <td className="px-4 py-2">{customer.status}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                    onClick={() => handleEdit(customer)}
                  >Edit</button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                    onClick={() => handleDelete(customer.id)}
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
            <CustomersForm
              initialData={editCustomer}
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
