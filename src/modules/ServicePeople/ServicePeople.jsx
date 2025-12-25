import React, { useState } from "react";
import ServicePeopleForm from "./ServicePeopleForm";
import ServicePeopleList from "./ServicePeopleList";

export default function ServicePeople() {
  const [refresh, setRefresh] = useState(0);
  const [showModal, setShowModal] = useState(false);

  // This function triggers a re-fetch in the List component
  const handleSuccess = () => {
    setShowModal(false);
    setRefresh(prev => prev + 1);
  };

  return (
    <div className="p-4">
      <div className="flex justify-end mb-4">
        <button
          className="bg-black text-white px-4 py-2 rounded font-semibold hover:bg-gray-900"
          onClick={() => setShowModal(true)}
        >
          Add Service Person
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 relative w-full max-w-xl">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Add New Service Person</h2>
            <ServicePeopleForm onSuccess={handleSuccess} />
          </div>
        </div>
      )}

      {/* The key prop ensures the list re-mounts/re-fetches when refresh changes */}
      <ServicePeopleList key={refresh} />
    </div>
  );
}