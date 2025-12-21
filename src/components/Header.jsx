import React from "react";

export default function Header() {
  return (
    <header className="flex h-16 items-center border-b bg-white px-6 justify-between">
      <div className="font-semibold text-lg">Dashboard</div>
      <div className="flex items-center gap-4">
        <button className="rounded bg-muted px-3 py-1 text-sm">Notifications</button>
        <div className="rounded-full bg-gray-200 w-8 h-8 flex items-center justify-center">U</div>
      </div>
    </header>
  );
}