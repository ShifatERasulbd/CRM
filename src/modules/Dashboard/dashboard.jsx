import React from 'react';
import DashboardCard from "./DashboardCard";
import DashboardGraphCard from "./DashboardGraphCard";
import DashboardTable from "./DashboardTable";
export default function Dashboard() {
    return (
         <>
            <DashboardCard />
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  <DashboardGraphCard />
                  <div className="lg:col-span-2">
                    <DashboardTable />
                  </div>
                </div>
              </>
    );
}