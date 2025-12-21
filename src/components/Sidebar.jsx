import React from "react";
import { Link } from "react-router-dom";
export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 w-64 bg-white border-r flex flex-col">
      <div className="p-6 font-bold text-xl">Acme Inc</div>
      <nav className="flex-1 px-4 space-y-2">
        <Link to="/" className="block px-4 py-2 rounded hover:bg-muted">Overview</Link>
        <Link to="/leads" className="block px-4 py-2 rounded hover:bg-muted">Leads</Link>
        <Link to="/oppertuinities" className="block px-4 py-2 rounded hover:bg-muted">Oppertunities</Link>
        <Link to="/deals" className="block px-4 py-2 rounded hover:bg-muted">Deals</Link>
        <Link to="/customers" className="block px-4 py-2 rounded hover:bg-muted">Customers</Link>
        <Link to="/service" className="block px-4 py-2 rounded hover:bg-muted">Services</Link>
        <Link to="/activities" className="block px-4 py-2 rounded hover:bg-muted">Activities</Link>
        <Link to="/task&followups" className="block px-4 py-2 rounded hover:bg-muted">Task & Followups</Link>
      </nav>
      <div className="p-4 border-t">User Menu</div>
    </aside>
  );
}