import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskFollowupsForm from "./TaskFollowupsForm";
import { DataTable } from "../../components/ui/data-table";

export default function TaskFollowupsList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editTask, setEditTask] = useState(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to view tasks");
          setLoading(false);
          return;
        }
        const res = await axios.get("/api/task-followups", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        let tasksData = res.data;
        if (!Array.isArray(tasksData)) {
          tasksData = [];
        }
        setTasks(tasksData);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("You are not authenticated. Please log in again.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        } else {
          setError(err.response?.data?.message || "Failed to load tasks");
        }
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [refresh]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/task-followups/${id}` , {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      setRefresh(r => r + 1);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("You are not authenticated. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } else {
        setError(err.response?.data?.message || "Failed to delete task");
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div className="text-red-600 font-semibold">{error}</div>;
  }

  // DataTable columns
  const columns = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => row.original.title,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => row.original.description,
    },
    {
      accessorKey: "due_date",
      header: "Due Date",
      cell: ({ row }) => row.original.due_date,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => row.original.status,
    },
    {
      accessorKey: "user",
      header: "User",
      cell: ({ row }) => row.original.user ? row.original.user.name : "-",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
            onClick={() => setEditTask(row.original)}
          >Edit</button>
          <button
            className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
            onClick={() => handleDelete(row.original.id)}
          >Delete</button>
        </div>
      ),
    },
  ];

  return (
    <div className="mt-8 max-w-4xl mx-auto">
      <h2 className="text-lg font-semibold mb-2">Task & Followups</h2>
      <div className="overflow-x-auto rounded-lg shadow bg-white">
        <DataTable columns={columns} data={tasks} />
      </div>
      {editTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 relative w-full max-w-xl">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
              onClick={() => setEditTask(null)}
            >
              &times;
            </button>
            <TaskFollowupsForm
              initialData={editTask}
              onSuccess={() => {
                setEditTask(null);
                setRefresh(r => r + 1);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
