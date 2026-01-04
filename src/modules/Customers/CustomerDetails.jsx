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
  const [servicePeople, setServicePeople] = useState([]);
const dateDiffDetailed = (start, end) => {
    if (!start || !end) return "-";

    let startDate = new Date(start);
    let endDate = new Date(end);

    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();
    let days = endDate.getDate() - startDate.getDate();

    if (days < 0) {
        months--;
        days += new Date(
            endDate.getFullYear(),
            endDate.getMonth(),
            0
        ).getDate();
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    return `${years}y ${months}m ${days}d`;
};
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

  // Fetch service man details from lead_service_people table where lead_id = id
  useEffect(() => {
    const fetchServicePeople = async () => {
      try {
        const token = localStorage.getItem("token");
        // Assuming you have an API endpoint to get service people by lead id
        const res = await axios.get(`/api/lead-service-people?lead_id=${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        setServicePeople(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        // Optionally handle error
        setServicePeople([]);
      }
    };
    if (id) fetchServicePeople();
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
            {servicePeople.length > 0 ? (
              <>
                {servicePeople.map((sp, idx) => (
                  <div key={sp.id || idx} className="mb-4 p-3 border rounded">
                    <div>
                      <strong>Name:</strong> {sp.first_name} {sp.last_name}
                    </div>
                    <div>
                      <strong>Email:</strong> {sp.email || "-"}
                    </div>
                    <div>
                      <strong>Joining Date:</strong> {sp.joining_date || "-"}
                    </div>
                    <div>
                      <strong>End Date:</strong> {sp.end_date || "-"}
                    </div>
                    <div>
                      <strong>Duty Days:</strong> {dateDiffDetailed(sp.joining_date, sp.end_date)}
                    </div>
                    <div>
                      <strong>Expected Salary:</strong> {(() => {
                        const salary = parseFloat(sp.salary);
                        const dutyDays = (() => {
                          if (sp.joining_date && sp.end_date) {
                            const start = new Date(sp.joining_date);
                            const end = new Date(sp.end_date);
                            return Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
                          }
                          return 0;
                        })();
                        if (!isNaN(salary) && dutyDays > 0) {
                          const expected = (salary / 30) * dutyDays;
                          return expected.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                        }
                        return "-";
                      })()}
                    </div>
                  </div>
                ))}
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
