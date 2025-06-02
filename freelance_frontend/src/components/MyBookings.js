// src/components/MyBookings.jsx

import React, { useState, useEffect } from "react";
import client from "../api/client";
import { useNavigate } from "react-router-dom";
import { ClipboardListIcon } from "@heroicons/react/outline";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    client
      .get("bookings/")
      .then((res) => setBookings(res.data))
      .catch(() => setError("Could not load your bookings."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-10">Loading your bookings…</div>;
  if (error)   return <div className="text-center text-red-600 py-10">{error}</div>;

  const handleClick = (b) => {
    if (b.status === "COMPLETED") {
      navigate(`/bookings/${b.id}/review`);
    } else {
      navigate(`/bookings/${b.id}/action`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-6">
        {/* Page heading */}
        <div className="flex items-center mb-6">
          <ClipboardListIcon className="w-6 h-6 text-indigo-600 mr-2" />
          <h2 className="text-2xl font-semibold text-gray-800">My Bookings</h2>
        </div>

        {bookings.length === 0 ? (
          <p className="text-center text-gray-600">You haven’t made any bookings yet.</p>
        ) : (
          <ul className="space-y-6">
            {bookings.map((b) => (
              <li
                key={b.id}
                onClick={() => handleClick(b)}
                className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition cursor-pointer"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-semibold text-gray-900">
                    {b.gig_detail.title}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      b.status === "COMPLETED"
                        ? "bg-green-100 text-green-800"
                        : b.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : b.status === "FAILED"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
                <p className="text-gray-500 text-sm">
                  Booked at: {new Date(b.booked_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
