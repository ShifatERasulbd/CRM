import React, { useEffect, useState } from "react";
import axios from "axios";
import EmployeesForm from "./EmployeesForm";

const EmployeesList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editEmployee, setEditEmployee] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [search, setSearch] = useState("");
  const [logModal, setLogModal] = useState({ open: false, employee: null, logs: [], loading: false, error: null });
  // Fetch login logs for an employee
  const handleShowLog = async (employee) => {
    setLogModal({ open: true, employee, logs: [], loading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/employees/${employee.id}/login-logs`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      setLogModal({ open: true, employee, logs: res.data, loading: false, error: null });
    } catch (err) {
      setLogModal({ open: true, employee, logs: [], loading: false, error: err.response?.data?.message || "Failed to load logs" });
    }
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to view employees");
          setLoading(false);
          return;
        }
        const res = await axios.get("/api/employees", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        let employeesData = res.data;
        if (!Array.isArray(employeesData)) {
          employeesData = [];
        }
        setEmployees(employeesData);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("You are not authenticated. Please log in again.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        } else {
          setError(err.response?.data?.message || "Failed to load employees");
        }
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, [refresh]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/employees/${id}` , {
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
        setError(err.response?.data?.message || "Failed to delete employee");
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div className="text-red-600 font-semibold">{error}</div>;
  }

  // Statistics
  const totalEmployees = employees.length;
  const departmentCounts = employees.reduce((acc, emp) => {
    if (emp.department) acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {});
  const positionCounts = employees.reduce((acc, emp) => {
    if (emp.position) acc[emp.position] = (acc[emp.position] || 0) + 1;
    return acc;
  }, {});

  // Filter employees by search
  const filteredEmployees = employees.filter(employee => {
    const searchTerm = search.toLowerCase();
    return (
      (employee.first_name && employee.first_name.toLowerCase().includes(searchTerm)) ||
      (employee.last_name && employee.last_name.toLowerCase().includes(searchTerm)) ||
      (employee.email && employee.email.toLowerCase().includes(searchTerm)) ||
      (employee.phone && employee.phone.toLowerCase().includes(searchTerm)) ||
      (employee.position && employee.position.toLowerCase().includes(searchTerm)) ||
      (employee.department && employee.department.toLowerCase().includes(searchTerm)) ||
      (employee.hire_date && employee.hire_date.toLowerCase().includes(searchTerm))
    );
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Employees</h2>
        <input
          type="text"
          placeholder="Search employees..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-64"
        />
      </div>
      {/* Statistics Section */}
      <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-100 rounded p-3 text-center">
          <div className="text-xs text-gray-500">Total Employees</div>
          <div className="text-lg font-bold">{totalEmployees}</div>
        </div>
        {Object.entries(departmentCounts).map(([dept, count]) => (
          <div key={dept} className="bg-gray-100 rounded p-3 text-center">
            <div className="text-xs text-gray-500">Dept: {dept}</div>
            <div className="text-lg font-bold">{count}</div>
          </div>
        ))}
        {Object.entries(positionCounts).map(([pos, count]) => (
          <div key={pos} className="bg-gray-100 rounded p-3 text-center">
            <div className="text-xs text-gray-500">Position: {pos}</div>
            <div className="text-lg font-bold">{count}</div>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto rounded-lg shadow bg-white">
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">First Name</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Last Name</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Email</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Phone</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Position</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Department</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Hire Date</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Salary</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee.id} className="border-b last:border-b-0 hover:bg-gray-50">
                <td className="px-4 py-2">{employee.first_name}</td>
                <td className="px-4 py-2">{employee.last_name}</td>
                <td className="px-4 py-2">{employee.email}</td>
                <td className="px-4 py-2">{employee.phone}</td>
                <td className="px-4 py-2">{employee.position}</td>
                <td className="px-4 py-2">{employee.department}</td>
                <td className="px-4 py-2">{employee.hire_date}</td>
                <td className="px-4 py-2">{employee.salary}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                    onClick={() => setEditEmployee(employee)}
                  >Edit</button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                    onClick={() => handleDelete(employee.id)}
                  >Delete</button>
                  <button
                    className="bg-gray-700 text-white px-2 py-1 rounded text-xs hover:bg-gray-900"
                    onClick={() => handleShowLog(employee)}
                  >Log</button>
                </td>
                    {/* Login Log Modal (moved outside the map) */}
                    {logModal.open && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                        <div className="bg-white rounded-lg shadow-lg p-6 relative w-full max-w-xl">
                          <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
                            onClick={() => setLogModal({ open: false, employee: null, logs: [], loading: false, error: null })}
                          >
                            &times;
                          </button>
                          <h2 className="text-lg font-bold mb-2">Login Log for {logModal.employee?.first_name} {logModal.employee?.last_name}</h2>
                          {logModal.loading ? (
                            <div>Loading...</div>
                          ) : logModal.error ? (
                            <div className="text-red-600">{logModal.error}</div>
                          ) : logModal.logs.length === 0 ? (
                            <div>No login logs found.</div>
                          ) : (
                            <ul className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
                              {logModal.logs.map((log, idx) => (
                                <li key={idx} className="py-2">
                                  {(() => {
                                    let date = '', time = '';
                                    if (log.login_at) {
                                      const dt = new Date(log.login_at);
                                      date = dt.toLocaleDateString();
                                      time = dt.toLocaleTimeString();
                                    }
                                    return (
                                      <>
                                        <div><span className="font-semibold">Date:</span> {date}</div>
                                        <div><span className="font-semibold">Time:</span> {time}</div>
                                        
                                      </>
                                    );
                                  })()}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 relative w-full max-w-xl">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
              onClick={() => setEditEmployee(null)}
            >
              &times;
            </button>
            <EmployeesForm
              initialData={editEmployee}
              onSuccess={() => {
                setEditEmployee(null);
                setRefresh(r => r + 1);
              }}
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default EmployeesList;
