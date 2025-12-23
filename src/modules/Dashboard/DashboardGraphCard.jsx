import React, { useEffect, useState } from "react";
import axios from "axios";

function getPolylinePoints(data, width = 400, height = 150, maxY = 0) {
  if (!data.length) return "";
  const max = maxY || Math.max(...data.map((d) => d.count), 1);
  const step = width / (data.length - 1);
  return data
    .map((d, i) => {
      const x = i * step;
      const y = height - (d.count / max) * (height - 30);
      return `${x},${y}`;
    })
    .join(" ");
}

export default function DashboardGraphCard() {
  const [range, setRange] = useState(7);
  const [graphData, setGraphData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchGraph() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/api/leads/graph?days=${range}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        setGraphData(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        setError("Failed to load graph data");
        setGraphData([]);
      } finally {
        setLoading(false);
      }
    }
    fetchGraph();
  }, [range]);

  const maxY = graphData.length ? Math.max(...graphData.map((d) => d.count)) : 0;
  const points = getPolylinePoints(graphData, 400, 150, maxY);

  return (
    <div className="col-span-1 lg:col-span-3 rounded-lg bg-white p-4 sm:p-6 shadow flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="font-semibold">Leads Overview</div>
        <select
          className="border rounded px-2 py-1 text-sm"
          value={range}
          onChange={e => setRange(Number(e.target.value))}
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
        </select>
      </div>
      <div className="h-48 flex items-center justify-center w-full overflow-x-auto">
        {loading ? (
          <span>Loading graph...</span>
        ) : error ? (
          <span className="text-red-600">{error}</span>
        ) : graphData.length === 0 ? (
          <span>No data</span>
        ) : (
          <svg width="400" height="150" viewBox="0 0 400 150" className="w-full max-w-full">
            <polyline
              fill="none"
              stroke="#4f46e5"
              strokeWidth="4"
              points={points}
            />
            {graphData.map((d, i) => (
              <circle
                key={i}
                cx={(i * 400) / (graphData.length - 1)}
                cy={150 - (d.count / maxY) * (150 - 30)}
                r={3}
                fill="#4f46e5"
              >
                <title>{`${d.date}: ${d.count}`}</title>
              </circle>
            ))}
          </svg>
        )}
      </div>
    </div>
  );
}