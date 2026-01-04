import React from "react";
import { DataTable } from "../../components/ui/data-table";

const columns = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => row.original.name || "-",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => row.original.email || "-",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => row.original.role || "-",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => row.original.status || "-",
  },
];

const data = [
  { name: "Olivia Martin", email: "olivia@example.com", role: "Admin", status: "Active" },
  { name: "Isabella Smith", email: "isabella@example.com", role: "Editor", status: "Active" },
  { name: "Ethan Williams", email: "ethan@example.com", role: "Viewer", status: "Inactive" },
  { name: "Amelia Brown", email: "amelia@example.com", role: "Editor", status: "Active" },
  { name: "Mason Davis", email: "mason@example.com", role: "Admin", status: "Inactive" },
];

export default function OppertunitiesTable() {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="font-semibold mb-4 text-lg">Users</div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
