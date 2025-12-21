import React from "react";

export default function GraphCard() {
  return (
    <div className="col-span-4 lg:col-span-3 rounded-lg bg-white p-6 shadow flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Overview</div>
        <select className="border rounded px-2 py-1 text-sm">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
        </select>
      </div>
      {/* Placeholder for chart */}
      <div className="h-48 flex items-center justify-center">
        <svg width="100%" height="100%" viewBox="0 0 400 150">
          <polyline
            fill="none"
            stroke="#4f46e5"
            strokeWidth="4"
            points="0,120 50,80 100,100 150,60 200,80 250,20 300,40 350,10 400,40"
          />
        </svg>
      </div>
    </div>
  );
}