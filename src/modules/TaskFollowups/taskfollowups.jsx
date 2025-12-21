import React from "react";
import TaskFollowupsCard from "./Task&followupsCard";
import TaskFollowupsTable from "./Task&followupsTable";

export default function TaskFollowups() {
  return (
    <div className="container">
      <TaskFollowupsCard />
      <TaskFollowupsTable />
    </div>
  );
}
