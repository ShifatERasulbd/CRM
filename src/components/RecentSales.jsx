import React from "react";

const sales = [
  { name: "Olivia Martin", email: "olivia@example.com", amount: "$1,999.00" },
  { name: "Isabella Smith", email: "isabella@example.com", amount: "$1,200.00" },
  { name: "Ethan Williams", email: "ethan@example.com", amount: "$1,000.00" },
  { name: "Amelia Brown", email: "amelia@example.com", amount: "$999.00" },
  { name: "Mason Davis", email: "mason@example.com", amount: "$890.00" },
];

export default function RecentSales() {
  return (
    <div className="rounded-lg bg-white p-6 shadow flex flex-col gap-4">
      <div className="font-semibold mb-2">Recent Sales</div>
      <table className="w-full text-sm">
        <tbody>
          {sales.map((sale, idx) => (
            <tr key={idx} className="border-b last:border-b-0">
              <td className="py-2 font-medium">{sale.name}</td>
              <td className="py-2 text-gray-500">{sale.email}</td>
              <td className="py-2 text-right">{sale.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}