import React, { useEffect, useState } from "react";
import axios from "axios";

const columns = [
  { header: "First Name", accessor: "first_name" },
  { header: "Last Name", accessor: "last_name" },
  { header: "Email", accessor: "email" },
  { header: "Position", accessor: "position" },
  { header: "Department", accessor: "department" },
];

export default function DashboardTable() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEmployees() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/employees", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        setEmployees(Array.isArray(res.data) ? res.data.slice(0, 8) : []);
      } catch (e) {
        setError("Failed to load employees");
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    }
    fetchEmployees();
  }, []);

  if (loading) return <div className="p-6">Loading employees...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="rounded-lg bg-white p-4 sm:p-6 shadow">
      <div className="font-semibold mb-4 text-lg">Employees</div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              {columns.map((col) => (
                <th key={col.accessor} className="px-2 sm:px-4 py-2 text-left font-medium text-gray-700 border-b">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map((row, idx) => (
              <tr key={row.id || idx} className="border-b last:border-b-0 hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={col.accessor} className="px-2 sm:px-4 py-2">
                    {row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
