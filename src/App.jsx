import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./modules/Dashboard/dashboard";
import Login from "./components/Login";
import Leads from "./modules/Leads/leads";
import Oppertunities from "./modules/Oppertunities/oppertunities";
import Deals from "./modules/Deals/deals";
import Customers from "./modules/Customers/customers";
import Services from "./modules/Services/services";
import Activities from "./modules/Activities/activities";
import TaskFollowups from "./modules/TaskFollowups/taskfollowups";

export default function App() {
  const location = useLocation();
  // Show sidebar only for module routes
  const showSidebar = [
    "/leads",
    "/oppertuinities",
    "/deals",
    "/customers",
    "/service",
    "/activities",
    "/task&followups"
  ].includes(location.pathname);

  return (
    <div className="min-h-screen w-full bg-muted/40">
      {showSidebar && <Sidebar />}
      <main className={showSidebar ? "p-6 space-y-6 md:pl-64" : "p-6 space-y-6"}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leads" element={<Leads/>} />
          <Route path="/oppertuinities" element={<Oppertunities/>} />
          <Route path="/deals" element={<Deals/>} />
          <Route path="/customers" element={<Customers/>} />
          <Route path="/service" element={<Services/>} />
          <Route path="/activities" element={<Activities/>} />
          <Route path="/task&followups" element={<TaskFollowups/>} />
        </Routes>
      </main>
    </div>
  );
}
