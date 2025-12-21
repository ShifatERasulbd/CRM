
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function LeadsForm({ onSuccess, initialData = null, isEdit = false }) {
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const [employeesError, setEmployeesError] = useState(null);
    // Fetch employees for assign to dropdown
    useEffect(() => {
      const fetchEmployees = async () => {
        setEmployeesLoading(true);
        setEmployeesError(null);
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            setEmployeesError("You must be logged in to view employees");
            setEmployeesLoading(false);
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
          setEmployeesError(err.response?.data?.message || "Failed to load employees");
          setEmployees([]);
        } finally {
          setEmployeesLoading(false);
        }
      };
      fetchEmployees();
    }, []);
  const [form, setForm] = useState(
    initialData || {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      company: "",
      status: "new",
      source: "",
      notes: "",
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  // Fetch services for dropdown
  useEffect(() => {
    const fetchServices = async () => {
      setServicesLoading(true);
      setServicesError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setServicesError("You must be logged in to view services");
          setServicesLoading(false);
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
        setServicesError(err.response?.data?.message || "Failed to load services");
        setServices([]);
      } finally {
        setServicesLoading(false);
      }
    };
    fetchServices();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear validation error for this field
    if (validationErrors[e.target.name]) {
      setValidationErrors({ ...validationErrors, [e.target.name]: null });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setValidationErrors({});

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You must be logged in to perform this action");
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      };

      let response;
      if (isEdit && initialData) {
        // Update
        response = await axios.put(
          `/api/leads/${initialData.id}`,
          form,
          config
        );
      } else {
        // Create - get current user ID from localStorage or API
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        const created_by = userData.id || 1;

        response = await axios.post(
          "/api/leads",
          { ...form, created_by },
          config
        );
      }

      // Success
      if (!isEdit) {
        setForm({
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          company: "",
          status: "new",
          source: "",
          notes: "",
        });
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Error submitting lead:", err);

      // Handle validation errors
      if (err.response?.status === 422 && err.response?.data?.errors) {
        setValidationErrors(err.response.data.errors);
        setError("Please fix the validation errors below");
      }
      // Handle authentication errors
      else if (err.response?.status === 401) {
        setError("You are not authenticated. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      // Handle other errors
      else {
        setError(err.response?.data?.message || err.message || "An error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow max-w-6xl mx-auto">
      <h2 className="text-lg font-semibold mb-2">{isEdit ? "Edit Lead" : "Add Lead"}</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               
        <div>
          <label className="block text-sm font-medium mb-1">First Name *</label>
          <input
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${validationErrors.first_name ? 'border-red-500' : ''}`}
            required
          />
          {validationErrors.first_name && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.first_name[0]}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <input
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${validationErrors.last_name ? 'border-red-500' : ''}`}
          />
          {validationErrors.last_name && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.last_name[0]}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${validationErrors.email ? 'border-red-500' : ''}`}
          />
          {validationErrors.email && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.email[0]}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${validationErrors.phone ? 'border-red-500' : ''}`}
          />
          {validationErrors.phone && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.phone[0]}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Company</label>
          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${validationErrors.company ? 'border-red-500' : ''}`}
          />
          {validationErrors.company && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.company[0]}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${validationErrors.status ? 'border-red-500' : ''}`}
          >
            <option value="new">New</option>
            <option value="contracting">Contracting/Pricing</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="lost">Lost</option>
          </select>
          {validationErrors.status && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.status[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Assign To</label>
          {employeesLoading ? (
            <div className="text-gray-500 text-xs">Loading employees...</div>
          ) : employeesError ? (
            <div className="text-red-500 text-xs">{employeesError}</div>
          ) : (
            <select
              name="assigned_to"
              value={form.assigned_to || ""}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 ${validationErrors.assigned_to ? 'border-red-500' : ''}`}
            >
              <option value="">Select employee</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</option>
              ))}
            </select>
          )}
          {validationErrors.assigned_to && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.assigned_to[0]}</p>
          )}
        </div>

          <div>
          <label className="block text-sm font-medium mb-1">Source</label>
          <select
           name="source"
            value={form.source}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${validationErrors.status ? 'border-red-500' : ''}`}
          >
            <option value="walking">Walking </option>
            <option value="facebook">Facebook</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="phone">Phone</option>
          </select>
          {validationErrors.source && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.source[0]}</p>
          )}
        </div>

          <div>
            <label className="block text-sm font-medium mb-1">Service</label>
            {servicesLoading ? (
              <div className="text-gray-500 text-xs">Loading services...</div>
            ) : servicesError ? (
              <div className="text-red-500 text-xs">{servicesError}</div>
            ) : (
              <select
                name="service_id"
                value={form.service_id || ""}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 ${validationErrors.service_id ? 'border-red-500' : ''}`}
              >
                <option value="">Select a service</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>{service.name}</option>
                ))}
              </select>
            )}
            {validationErrors.service_id && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.service_id[0]}</p>
            )}
          </div>
       
        <div className="md:col-span-3">
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${validationErrors.notes ? 'border-red-500' : ''}`}
            rows="3"
          />
          {validationErrors.notes && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.notes[0]}</p>
          )}
        </div>
       
      </div>
      <button
        type="submit"
        className="w-full bg-black text-white py-2 rounded font-semibold hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? "Saving..." : (isEdit ? "Update Lead" : "Add Lead")}
      </button>
    </form>
  );
}
