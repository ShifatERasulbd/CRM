import React from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { Routes, Route } from "react-router-dom";
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
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Sidebar />
      <div className="flex flex-1 flex-col md:pl-64">
        <Header />
        <main className="flex-1 p-6 space-y-6">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leads" element={
              <Leads/>
              } />
            <Route path="/oppertuinities" element={<Oppertunities/>} />
            <Route path="/deals" element={<Deals/>} />
            <Route path="/customers" element={<Customers/>} />
            <Route path="/service" element={<Services/>} />
            <Route path="/activities" element={<Activities/>} />
            <Route path="/task&followups" element={<TaskFollowups/>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
