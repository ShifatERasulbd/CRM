import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Sidebar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post("/logout");
    } catch (e) {}
    localStorage.removeItem("token");
    navigate("/");
  };

  // Hide sidebar on mobile, show burger menu
  return (
    <>
      {/* Burger menu button for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-30 p-2 rounded bg-white shadow border"
        aria-label="Open sidebar"
        onClick={() => setOpen(true)}
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay for mobile sidebar */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r flex flex-col transform transition-transform duration-200 md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'} md:static md:inset-0 md:z-10`}
        style={{ minHeight: '100vh' }}
      >
        <div className="flex items-center justify-between p-6 font-bold text-xl">
          Acme Inc
          {/* Close button for mobile */}
          <button
            className="md:hidden p-1 ml-2 rounded hover:bg-gray-100"
            aria-label="Close sidebar"
            onClick={() => setOpen(false)}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link to="/dashboard" className="block px-4 py-2 rounded hover:bg-muted" onClick={() => setOpen(false)}>Overview</Link>
          <Link to="/leads" className="block px-4 py-2 rounded hover:bg-muted" onClick={() => setOpen(false)}>Leads</Link>
          <Link to="/oppertuinities" className="block px-4 py-2 rounded hover:bg-muted" onClick={() => setOpen(false)}>Oppertunities</Link>
          <Link to="/deals" className="block px-4 py-2 rounded hover:bg-muted" onClick={() => setOpen(false)}>Deals</Link>
          <Link to="/customers" className="block px-4 py-2 rounded hover:bg-muted" onClick={() => setOpen(false)}>Customers</Link>
          <Link to="/service" className="block px-4 py-2 rounded hover:bg-muted" onClick={() => setOpen(false)}>Services</Link>
          <Link to="/activities" className="block px-4 py-2 rounded hover:bg-muted" onClick={() => setOpen(false)}>Activities</Link>
          <Link to="/task&followups" className="block px-4 py-2 rounded hover:bg-muted" onClick={() => setOpen(false)}>Task & Followups</Link>
          <Link to="/employees" className="block px-4 py-2 rounded hover:bg-muted" onClick={() => setOpen(false)}>Employees</Link>
        </nav>
        <div className="p-4 border-t flex flex-col gap-2">
          <span>User Menu</span>
          <button
            onClick={() => { setOpen(false); handleLogout(); }}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 font-semibold"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}