import React from "react";

const columns = [
  { header: "Name", accessor: "name" },
  { header: "Email", accessor: "email" },
  { header: "Role", accessor: "role" },
  { header: "Status", accessor: "status" },
];

const data = [
  { name: "Olivia Martin", email: "olivia@example.com", role: "Admin", status: "Active" },
  { name: "Isabella Smith", email: "isabella@example.com", role: "Editor", status: "Active" },
  { name: "Ethan Williams", email: "ethan@example.com", role: "Viewer", status: "Inactive" },
  { name: "Amelia Brown", email: "amelia@example.com", role: "Editor", status: "Active" },
  { name: "Mason Davis", email: "mason@example.com", role: "Admin", status: "Inactive" },
];

export default function CustomerTable() {
  return (
    <div className="rounded-lg  bg-white p-6 shadow">
      <div className="font-semibold mb-4 text-lg">Users</div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              {columns.map((col) => (
                <th key={col.accessor} className="px-4 py-2 text-left font-medium text-gray-700 border-b">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="border-b last:border-b-0 hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={col.accessor} className="px-4 py-2">
                    {row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
