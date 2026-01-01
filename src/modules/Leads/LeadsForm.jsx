
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function LeadsForm({
  initialData = null,
  isEdit = false,
  onSuccess = null,
}) {
  // ===================== STATES =====================
  const [servicePeople, setServicePeople] = useState([]);
  const [servicePeopleLoading, setServicePeopleLoading] = useState(true);
  const [servicePeopleError, setServicePeopleError] = useState(null);

  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState(null);

  const [employees, setEmployees] = useState([]);
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const [employeesError, setEmployeesError] = useState(null);

  const [customers, setCustomers] = useState([]);
  const [customersLoading, setCustomersLoading] = useState(true);
  const [customersError, setCustomersError] = useState(null);

  const [editData, setEditData] = useState(null);

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
      assigned_to: "",
      service_id: "",
      reference_by_customer: "",
      reference_by_staff: "",
      service_person_dates: [{ service_person_id: "", joining_date: "", end_date: "" }],
    }
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // ===================== EFFECTS =====================

  useEffect(() => {
    if (isEdit && initialData && initialData.id) {
      const fetchEditData = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get(`/api/leads/${initialData.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setEditData(res.data);
        } catch (err) {
          console.error("Error fetching lead for edit:", err);
        }
      };
      fetchEditData();
    }
  }, [isEdit, initialData]);

  useEffect(() => {
    const data = editData || initialData;
    if (data) {
      console.log('Lead data received:', data); // Debug log

      // Support both snake_case and camelCase for API response
      const lspArr = data.lead_service_people || data.leadServicePeople || [];
      console.log('Lead service people array:', lspArr); // Debug log

      const servicePersonDates = Array.isArray(lspArr) && lspArr.length > 0
        ? lspArr.map(lsp => {
            console.log('Processing LSP:', lsp); // Debug log

            // Format dates properly for HTML date inputs (YYYY-MM-DD)
            let joiningDate = "";
            let endDate = "";

            if (lsp.joining_date) {
              // Handle both string dates and date objects
              const jd = new Date(lsp.joining_date);
              if (!isNaN(jd.getTime())) {
                joiningDate = jd.toISOString().split('T')[0];
              }
            }

            if (lsp.end_date) {
              const ed = new Date(lsp.end_date);
              if (!isNaN(ed.getTime())) {
                endDate = ed.toISOString().split('T')[0];
              }
            }

            return {
              service_person_id: lsp.service_person_id ? String(lsp.service_person_id) : "",
              joining_date: joiningDate,
              end_date: endDate,
            };
          })
        : [{ service_person_id: "", joining_date: "", end_date: "" }];

      console.log('Formatted service person dates:', servicePersonDates); // Debug log

      setForm(f => ({
        ...f,
        ...data,
        assigned_to: data.assigned_to ? String(data.assigned_to) : "",
        service_id: data.service_id ? String(data.service_id) : "",
        reference_by_customer: data.reference_by_customer ? String(data.reference_by_customer) : "",
        service_person_dates: servicePersonDates,
      }));
    }
  }, [initialData, editData]);

  useEffect(() => {
    const fetchServicePeople = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/service-people", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setServicePeople(Array.isArray(res.data) ? res.data : []);
      } catch {
        setServicePeopleError("Failed to load service people");
      } finally {
        setServicePeopleLoading(false);
      }
    };
    fetchServicePeople();
  }, []);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/employees", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployees(Array.isArray(res.data) ? res.data : []);
      } catch {
        setEmployeesError("Failed to load employees");
      } finally {
        setEmployeesLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/services", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setServices(Array.isArray(res.data) ? res.data : []);
      } catch {
        setServicesError("Failed to load services");
      } finally {
        setServicesLoading(false);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/leads?status=customer", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCustomers(Array.isArray(res.data) ? res.data : []);
      } catch {
        setCustomersError("Failed to load customers");
      } finally {
        setCustomersLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // ===================== HANDLERS =====================

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (validationErrors[e.target.name]) {
      setValidationErrors({ ...validationErrors, [e.target.name]: null });
    }
  }

  function handleDateChange(index, field, value) {
    const updatedDates = [...form.service_person_dates];
    updatedDates[index][field] = value;
    setForm({ ...form, service_person_dates: updatedDates });
    if (validationErrors[`service_person_dates.${index}.${field}`]) {
      setValidationErrors({ ...validationErrors, [`service_person_dates.${index}.${field}`]: null });
    }
  }

  function addDatePair() {
    setForm({
      ...form,
      service_person_dates: [...form.service_person_dates, { service_person_id: "", joining_date: "", end_date: "" }]
    });
  }

  function removeDatePair(index) {
    if (form.service_person_dates.length > 1) {
      const updatedDates = form.service_person_dates.filter((_, i) => i !== index);
      setForm({ ...form, service_person_dates: updatedDates });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setValidationErrors({});

    try {
      const token = localStorage.getItem("token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      };

      if (isEdit && initialData) {
        await axios.put(`/api/leads/${initialData.id}`, form, config);
      } else {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        await axios.post("/api/leads", { ...form, created_by: user.id }, config);
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      if (err.response?.status === 422) {
        setValidationErrors(err.response.data.errors);
        setError("Please fix validation errors");
      } else {
        setError(err.response?.data?.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }

  // ===================== JSX =====================

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-lg shadow max-w-7xl mx"
    >
      <h2 className="text-lg font-semibold">
        {isEdit ? "Edit Lead" : "Add Lead"}
      </h2>


      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded">
          {error}
        </div>
      )}

     

    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
               
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
            <option value="qualified">Qualified</option>
            <option value="contracting">Contracting/Pricing</option>
            <option value="contacted">Contacted</option>
            <option value="verified">Verified</option>
            <option value="customer">Customer</option>
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
                <option key={emp.id} value={String(emp.id)}>{emp.first_name} {emp.last_name}</option>
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
                  <option key={service.id} value={String(service.id)}>{service.name}</option>
                ))}
              </select>
            )}
            {validationErrors.service_id && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.service_id[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Reference By Customer</label>
            {customersLoading ? (
              <div className="text-gray-500 text-xs">Loading customers...</div>
            ) : customersError ? (
              <div className="text-red-500 text-xs">{customersError}</div>
            ) : (
              <select
                name="reference_by_customer"
                value={form.reference_by_customer || ""}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 ${validationErrors.reference_by_customer ? 'border-red-500' : ''}`}
              >
                <option value="">Select customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={String(customer.id)}>{customer.first_name} {customer.last_name}</option>
                ))}
              </select>
            )}
            {validationErrors.reference_by_customer && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.reference_by_customer[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Reference By Staff</label>
            <input
              name="reference_by_staff"
              value={form.reference_by_staff}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 ${validationErrors.reference_by_staff ? 'border-red-500' : ''}`}
            />
            {validationErrors.reference_by_staff && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.reference_by_staff[0]}</p>
            )}
          </div>

        <div className="md:col-span-5">
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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-md font-medium">Service Person Dates</h3>
          <button
            type="button"
            onClick={addDatePair}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
          >
            Add Date Pair
          </button>
        </div>
        {(Array.isArray(form.service_person_dates) ? form.service_person_dates : []).map((datePair, index) => (
          <div key={index} className="border rounded p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Date Pair {index + 1}</span>
              {form.service_person_dates.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeDatePair(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Service Person</label>
                {servicePeopleLoading ? (
                  <div className="text-gray-500 text-xs">Loading service people...</div>
                ) : servicePeopleError ? (
                  <div className="text-red-500 text-xs">{servicePeopleError}</div>
                ) : (
                  <select
                    value={datePair.service_person_id || ""}
                    onChange={(e) => handleDateChange(index, 'service_person_id', e.target.value)}
                    className={`w-full border rounded px-3 py-2 ${validationErrors[`service_person_dates.${index}.service_person_id`] ? 'border-red-500' : ''}`}
                  >
                    <option value="">Select service person</option>
                    {servicePeople.map(sp => (
                      <option key={sp.id} value={String(sp.id)}>{sp.first_name} {sp.last_name}</option>
                    ))}
                  </select>
                )}
                {validationErrors[`service_person_dates.${index}.service_person_id`] && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors[`service_person_dates.${index}.service_person_id`][0]}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Joining Date</label>
                <input
                  type="date"
                  value={datePair.joining_date || ""}
                  onChange={(e) => handleDateChange(index, 'joining_date', e.target.value)}
                  className={`w-full border rounded px-3 py-2 ${validationErrors[`service_person_dates.${index}.joining_date`] ? 'border-red-500' : ''}`}
                />
                {validationErrors[`service_person_dates.${index}.joining_date`] && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors[`service_person_dates.${index}.joining_date`][0]}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <input
                  type="date"
                  value={datePair.end_date || ""}
                  onChange={(e) => handleDateChange(index, 'end_date', e.target.value)}
                  className={`w-full border rounded px-3 py-2 ${validationErrors[`service_person_dates.${index}.end_date`] ? 'border-red-500' : ''}`}
                />
                {validationErrors[`service_person_dates.${index}.end_date`] && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors[`service_person_dates.${index}.end_date`][0]}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white py-2 rounded"
      >
        {loading ? "Saving..." : isEdit ? "Update Lead" : "Add Lead"}
      </button>
    </form>
  );
}
