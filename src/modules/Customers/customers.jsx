import React from 'react';
import CustomersCard from './CustomersCard';
import CustomerTable from './CustomerTable';
export default function Customers() {
  return (
    <div className="container">
      <CustomersCard />
      <CustomerTable />
    </div>
  );
}
