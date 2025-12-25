import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function CustomerDetails() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/api/customers/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        setCustomer(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load customer details");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id]);

  if (loading) return <div>Loading customer details...</div>;
  if (error) return <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>;
  if (!customer) return <div>No customer found.</div>;

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Customer Details</h2>
      <div className="mb-2"><strong>Name:</strong> {customer.first_name} {customer.last_name}</div>
      <div className="mb-2"><strong>Email:</strong> {customer.email}</div>
      <div className="mb-2"><strong>Phone:</strong> {customer.phone}</div>
      <div className="mb-2"><strong>Company:</strong> {customer.company}</div>
      <div className="mb-2"><strong>Status:</strong> {customer.status}</div>
      <div className="mb-2"><strong>Source:</strong> {customer.source}</div>
     
      <div className="mb-2"><strong>Notes:</strong> {customer.notes}</div>
    </div>
  );
}
