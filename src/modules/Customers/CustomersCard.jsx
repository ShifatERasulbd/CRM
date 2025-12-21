import React from "react";

export default function CustomersCard() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <div className="rounded-lg bg-white p-6 shadow flex flex-col gap-2">
        <div className="text-xs text-gray-500">Total Customers</div>
        <div className="text-2xl font-bold">-</div>
        <div className="text-xs text-green-600">+0% from last month</div>
      </div>
      <div className="rounded-lg bg-white p-6 shadow flex flex-col gap-2">
        <div className="text-xs text-gray-500">Active</div>
        <div className="text-2xl font-bold">-</div>
        <div className="text-xs text-green-600">+0% from last month</div>
      </div>
      <div className="rounded-lg bg-white p-6 shadow flex flex-col gap-2">
        <div className="text-xs text-gray-500">Inactive</div>
        <div className="text-2xl font-bold">-</div>
        <div className="text-xs text-red-600">0% from last month</div>
      </div>
      <div className="rounded-lg bg-white p-6 shadow flex flex-col gap-2">
        <div className="text-xs text-gray-500">New This Month</div>
        <div className="text-2xl font-bold">-</div>
        <div className="text-xs text-green-600">+0</div>
      </div>
    </div>
  );
}
