import React, { useState } from "react";
import LeadsForm from "../Leads/LeadsForm";
import OppertunitiesList from "./OppertunitiesList";
export default function Leads() {
  const [refresh, setRefresh] = useState(0);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 relative w-full max-w-xl">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <LeadsForm
              onSuccess={() => {
                setShowModal(false);
                setRefresh(r => r + 1);
              }}
            />
          </div>
        </div>
      )}
      <OppertunitiesList key={refresh} />
    </>
  );
}
