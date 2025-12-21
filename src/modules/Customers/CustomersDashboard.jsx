import React from "react";
import CustomersCard from "./CustomersCard";
import CustomersList from "./CustomersList";

export default function CustomersDashboard() {
  return (
    <div className="container">
      <CustomersCard />
      <CustomersList />
    </div>
  );
}
