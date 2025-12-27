import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./modules/Dashboard/dashboard";
import Login from "./components/Login";
import Leads from "./modules/Leads/leads";
import Verified from "./modules/Verified/verified";
import Oppertunities from "./modules/Oppertunities/oppertunities";
import Deals from "./modules/Deals/deals";
import Customers from "./modules/Customers/customers";
import CustomerDetails from "./modules/Customers/CustomerDetails";
import LeadDetails from "./modules/Leads/leadDetails";
import Services from "./modules/Services/services";
import ServicePeople from "./modules/ServicePeople/ServicePeople";
import ServicePersonDetails from "./modules/ServicePeople/ServicePersonDetails";
import Activities from "./modules/Activities/activities";
import TaskFollowups from "./modules/TaskFollowups/taskfollowups";
import Employees from "./modules/Employees/employees";
import { useAuth } from "./AuthContext";

export default function App() {
  const location = useLocation();
  const { user, loading } = useAuth();
  // Show sidebar only for module routes
  const showSidebar = [
    "/dashboard",
    "/leads",
    "/verified",
    "/oppertuinities",
    "/deals",
    "/customers",
    "/service",
    "/service-people",
    "/activities",
    "/task&followups",
    "/employees"
  ].includes(location.pathname);

  // List of protected routes
  const protectedRoutes = [
    "/dashboard",
    "/leads",
    "/verified",
    "/oppertuinities",
    "/deals",
    "/customers",
    "/service",
    "/service-people",
    "/activities",
    "/task&followups",
    "/employees"
  ];

  // If not authenticated and not loading, redirect to login for protected routes
  if (!loading && !user && protectedRoutes.includes(location.pathname)) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen w-full bg-muted/40 md:flex">
      {showSidebar && <Sidebar />}
      {/* Add pt-16 to main for mobile burger menu space */}
      <main className={showSidebar ? "p-6 space-y-6 pt-16 md:pt-6" : "p-6 space-y-6 pt-16 md:pt-6"}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leads" element={<Leads/>} />
          <Route path="/verified" element={<Verified/>} />
          <Route path="/oppertuinities" element={<Oppertunities/>} />
          <Route path="/deals" element={<Deals/>} />
          <Route path="/customers" element={<Customers/>} />
          <Route path="/customers/:id" element={<CustomerDetails/>} />
          <Route path="/leads/:id" element={<LeadDetails/>} />
          <Route path="/service" element={<Services/>} />
          <Route path="/service-people" element={<ServicePeople/>} />
          <Route path="/service-people/:id" element={<ServicePersonDetails />} />
          <Route path="/activities" element={<Activities/>} />
          <Route path="/task&followups" element={<TaskFollowups/>} />
          <Route path="/employees" element={<Employees/>} />
        </Routes>
      </main>
    </div>
  );
}
