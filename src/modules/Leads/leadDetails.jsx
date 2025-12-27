import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";



const LeadDetails = () => {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("interaction");
  const [showModal, setShowModal] = useState(false);
  const [interactions, setInteractions] = useState([]);
  const [interactionsLoading, setInteractionsLoading] = useState(false);
  const [interactionsError, setInteractionsError] = useState(null);
  const [noteInput, setNoteInput] = useState("");
  const [noteSaving, setNoteSaving] = useState(false);
  const [noteError, setNoteError] = useState(null);
  useEffect(() => {
    const fetchLead = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/api/leads/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        setLead(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch lead details");
      } finally {
        setLoading(false);
      }
    };
    const fetchInteractions = async () => {
      setInteractionsLoading(true);
      setInteractionsError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/api/interactions?lead_id=${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        setInteractions(res.data);
      } catch (err) {
        setInteractionsError(err.response?.data?.message || "Failed to fetch interactions");
      } finally {
        setInteractionsLoading(false);
      }
    };
    if (id) {
      fetchLead();
      fetchInteractions();
    }
  }, [id, showModal]);

  if (loading) return <div>Loading lead details...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!lead) return <div>No lead found.</div>;

  return (
    <>
      <div className="w-full mt-8 bg-white rounded-lg shadow p-6">
      <button
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm font-semibold"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <h2 className="text-2xl font-bold mb-4">Leads Details</h2>

      <div className="mb-2">
        <strong>Name:</strong> {lead.first_name} {lead.last_name}
      </div>
      <div className="mb-2">
        <strong>Email:</strong> {lead.email}
      </div>
      <div className="mb-2">
        <strong>Phone:</strong> {lead.phone}
      </div>
      <div className="mb-2">
        <strong>Company:</strong> {lead.company}
      </div>
      <div className="mb-2">
        <strong>Status:</strong> {lead.status}
      </div>
      <div className="mb-2">
        <strong>Source:</strong> {lead.source}
      </div>
      <div className="mb-2">
        <strong>Notes:</strong> {lead.notes}
      </div>
 <div className="mt-8">
    <div className="border-b flex gap-4 mb-4">
        <button
            className={`py-2 px-4 font-semibold border-b-2 ${
              activeTab === "interaction"
                ? "text-blue-600 border-blue-600"
                : "text-gray-600 border-transparent"
            }`}
            onClick={() => setActiveTab("interaction")}
          >
            Notes
          </button>
    </div>

     {activeTab === "interaction" && (
          <div>
                <div>
                      <div className="flex justify-end mb-4">
                            <button
                            className="bg-black text-white px-4 py-2 rounded font-semibold hover:bg-gray-900"
                            onClick={() => setShowModal(true)}
                            >
                            Add Lead
                            </button>
                        </div>
                  {lead.notes}
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Interactions</h4>
                    {interactionsLoading && <div>Loading interactions...</div>}
                    {interactionsError && <div className="text-red-500">{interactionsError}</div>}
                    {!interactionsLoading && !interactionsError && interactions.length === 0 && (
                      <div className="text-gray-500">No interactions found.</div>
                    )}
                    {!interactionsLoading && !interactionsError && interactions.length > 0 && (
                      <ul className="space-y-2">
                        {interactions.map((interaction) => (
                          <li key={interaction.id} className="border rounded p-2 bg-gray-50">
                            <div className="text-sm">{interaction.notes}</div>
                            <div className="text-xs text-gray-400">{interaction.created_at ? new Date(interaction.created_at).toLocaleString() : ''}</div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
          </div>
        )}
 </div>


    </div>
    {showModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-semibold">Add Note</h3>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </div>
          <div className="p-4">
            <form
              onSubmit={async e => {
                e.preventDefault();
                setNoteSaving(true);
                setNoteError(null);
                try {
                  const token = localStorage.getItem("token");
                  await axios.post(
                    "/api/interactions",
                    { lead_id: id, notes: noteInput },
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                      },
                    }
                  );
                  setShowModal(false);
                  setNoteInput("");
                } catch (err) {
                  setNoteError(err.response?.data?.message || "Failed to save note");
                } finally {
                  setNoteSaving(false);
                }
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Note</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  placeholder="Enter note..."
                  value={noteInput}
                  onChange={e => setNoteInput(e.target.value)}
                  required
                  disabled={noteSaving}
                />
                {noteError && <div className="text-red-500 text-sm mt-1">{noteError}</div>}
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  disabled={noteSaving}
                >
                  {noteSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default LeadDetails;
