import React, { useState } from "react";
import ActivitiesForm from "./ActivitiesForm";
import ActivitiesList from "./ActivitiesList";

export default function Activities() {
  const [refresh, setRefresh] = useState(0);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          className="bg-black text-white px-4 py-2 rounded font-semibold hover:bg-gray-900"
          onClick={() => setShowModal(true)}
        >
          Add Activity
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
            <ActivitiesForm
              onSuccess={() => {
                setShowModal(false);
                setRefresh(r => r + 1);
              }}
            />
          </div>
        </div>
      )}
      <ActivitiesList key={refresh} />
    </>
  );
}
