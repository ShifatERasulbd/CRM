import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function CustomerDetails() {
  const [activeTab, setActiveTab] = useState("employee");
  const { id } = useParams();
  const navigate = useNavigate();

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
        setError(
          err.response?.data?.message || "Failed to load customer details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  if (loading) return <div>Loading customer details...</div>;
  if (error)
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  if (!customer) return <div>No customer found.</div>;

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow p-6">
      <button
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm font-semibold"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <h2 className="text-2xl font-bold mb-4">Customer Details</h2>

      <div className="mb-2">
        <strong>Name:</strong> {customer.first_name} {customer.last_name}
      </div>
      <div className="mb-2">
        <strong>Email:</strong> {customer.email}
      </div>
      <div className="mb-2">
        <strong>Phone:</strong> {customer.phone}
      </div>
      <div className="mb-2">
        <strong>Company:</strong> {customer.company}
      </div>
      <div className="mb-2">
        <strong>Status:</strong> {customer.status}
      </div>
      <div className="mb-2">
        <strong>Source:</strong> {customer.source}
      </div>
      <div className="mb-2">
        <strong>Notes:</strong> {customer.notes}
      </div>

      {/* Tabs */}
      <div className="mt-8">
        <div className="border-b flex gap-4 mb-4">
          <button
            className={`py-2 px-4 font-semibold border-b-2 ${
              activeTab === "employee"
                ? "text-blue-600 border-blue-600"
                : "text-gray-600 border-transparent"
            }`}
            onClick={() => setActiveTab("employee")}
          >
            Assigned Employee
          </button>

          <button
            className={`py-2 px-4 font-semibold border-b-2 ${
              activeTab === "serviceman"
                ? "text-blue-600 border-blue-600"
                : "text-gray-600 border-transparent"
            }`}
            onClick={() => setActiveTab("serviceman")}
          >
            Assigned Serviceman
          </button>
        </div>

        {activeTab === "employee" && (
          <div>
            {customer.assignedEmployee ? (
              <>
                <div>
                  <strong>Name:</strong>{" "}
                  {customer.assignedEmployee.first_name}{" "}
                  {customer.assignedEmployee.last_name}
                </div>
                <div>
                  <strong>Email:</strong> {customer.assignedEmployee.email}
                </div>
                <div>
                  <strong>Phone:</strong> {customer.assignedEmployee.phone}
                </div>
                <div>
                  <strong>Position:</strong>{" "}
                  {customer.assignedEmployee.position}
                </div>
                <div>
                  <strong>Department:</strong>{" "}
                  {customer.assignedEmployee.department}
                </div>
              </>
            ) : (
              <div>No employee assigned.</div>
            )}
          </div>
        )}

        {activeTab === "serviceman" && (
          <div>
            {customer.servicePerson ? (
              <>
                <div>
                  <strong>Name:</strong>{" "}
                  {customer.servicePerson.first_name }{" "}
                  {customer.servicePerson.last_name}
                </div>
                <div>
                  <strong>Email:</strong>{" "}
                  {customer.servicePerson.email || "-"}
                </div>

                <div>
                  <strong>Joining Date:</strong>{" "}
                  {customer.service_person_joining_date || "-"}
                </div>

                <div>
                  <strong>End Date:</strong>{" "}
                  {customer.service_person_end_date || "-"}
                </div>
              </>
            ) : (
              <div>No serviceman assigned.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
