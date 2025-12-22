import React, { useEffect, useState } from "react";
import axios from "axios";

export default function DashboardCard() {
  const [stats, setStats] = useState({
    employees: 0,
    leads: 0,
    deals: 0,
    opportunities: 0,
    loading: true,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } };
        const [employeesRes, leadsRes, dealsRes, oppsRes] = await Promise.all([
          axios.get("/api/employees", config),
          axios.get("/api/leads", config),
          axios.get("/api/deals", config),
          axios.get("/api/oppertunities", config),
        ]);
        setStats({
          employees: Array.isArray(employeesRes.data) ? employeesRes.data.length : 0,
          leads: Array.isArray(leadsRes.data) ? leadsRes.data.length : 0,
          deals: Array.isArray(dealsRes.data) ? dealsRes.data.length : 0,
          opportunities: Array.isArray(oppsRes.data) ? oppsRes.data.length : 0,
          loading: false,
        });
      } catch (e) {
        setStats(s => ({ ...s, loading: false }));
      }
    }
    fetchStats();
  }, []);

  if (stats.loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-lg bg-white p-6 shadow flex flex-col gap-2">
        <div className="text-xs text-gray-500">Total Employees</div>
        <div className="text-2xl font-bold">{stats.employees}</div>
      </div>
      <div className="rounded-lg bg-white p-6 shadow flex flex-col gap-2">
        <div className="text-xs text-gray-500">Total Leads</div>
        <div className="text-2xl font-bold">{stats.leads}</div>
      </div>
      <div className="rounded-lg bg-white p-6 shadow flex flex-col gap-2">
        <div className="text-xs text-gray-500">Total Deals</div>
        <div className="text-2xl font-bold">{stats.deals}</div>
      </div>
      <div className="rounded-lg bg-white p-6 shadow flex flex-col gap-2">
        <div className="text-xs text-gray-500">Total Opportunities</div>
        <div className="text-2xl font-bold">{stats.opportunities}</div>
      </div>
    </div>
  );
}