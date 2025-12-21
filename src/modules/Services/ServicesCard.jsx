import React from "react";

export default function ServicesCard() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-lg bg-white p-6 shadow flex flex-col gap-2">
        <div className="text-xs text-gray-500">Total Revenue</div>
        <div className="text-2xl font-bold">$45,231.89</div>
        <div className="text-xs text-green-600">+20.1% from last month</div>
      </div>
      <div className="rounded-lg bg-white p-6 shadow flex flex-col gap-2">
        <div className="text-xs text-gray-500">Subscriptions</div>
        <div className="text-2xl font-bold">+2350</div>
        <div className="text-xs text-green-600">+180.1% from last month</div>
      </div>
      <div className="rounded-lg bg-white p-6 shadow flex flex-col gap-2">
        <div className="text-xs text-gray-500">Sales</div>
        <div className="text-2xl font-bold">+12,234</div>
        <div className="text-xs text-green-600">+19% from last month</div>
      </div>
      <div className="rounded-lg bg-white p-6 shadow flex flex-col gap-2">
        <div className="text-xs text-gray-500">Active Now</div>
        <div className="text-2xl font-bold">+573</div>
        <div className="text-xs text-green-600">+201 since last hour</div>
      </div>
    </div>
  );
}