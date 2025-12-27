import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ServicePersonDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPerson = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/api/service-people/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPerson(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load details");
      } finally {
        setLoading(false);
      }
    };
    fetchPerson();
  }, [id]);

  if (loading) return <div>Loading details...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!person) return <div>No service person found.</div>;

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow p-6">
      <button
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm font-semibold"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>
      <h2 className="text-2xl font-bold mb-4">Service Person Details</h2>
      <div className="mb-2"><strong>Name:</strong> {person.first_name} {person.last_name}</div>
      <div className="mb-2"><strong>Email:</strong> {person.email}</div>
      <div className="mb-2"><strong>Phone:</strong> {person.phone}</div>
      <div className="mb-2"><strong>Present Address:</strong> {person.present_address}</div>
      <div className="mb-2"><strong>Permanent Address:</strong> {person.permanent_address}</div>
      <div className="mb-2"><strong>Emergency Contact Name:</strong> {person.emergency_contact_name}</div>
      <div className="mb-2"><strong>Emergency Contact Phone:</strong> {person.emergency_contact_phone}</div>
      <div className="mb-2"><strong>Emergency Contact Relation:</strong> {person.emergency_contact_relation}</div>
      {person.photo && (
        <div className="mb-2"><strong>Photo:</strong><br /><img src={person.photo} alt="" width="100" className="rounded" /></div>
      )}
    </div>
  );
}
