// src/components/BookingAction.jsx

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import client from "../api/client";
import { toast } from "react-toastify";

// These two already exist in your codebase
import DisputeForm from "./DisputeForm";
import ReviewForm  from "./ReviewForm";

export default function BookingAction() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    client
      .get(`bookings/${id}/`)
      .then(({ data }) => {
        setBooking(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load booking.");
        setLoading(false);
        toast.error("Failed to load booking details.");
      });
  }, [id]);

  if (loading) return <div className="text-center py-8">Loading…</div>;
  if (error)   return <div className="text-center text-red-600 py-8">{error}</div>;

  return (
    <div className="max-w-md mx-auto mt-8">
      {booking.status === "PENDING" && (
        <>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Booking #{booking.id} is still pending
          </h2>
          <DisputeForm />
        </>
      )}

      {booking.status === "CONFIRMED" && (
        <>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Booking #{booking.id} is confirmed
          </h2>
          <ReviewForm />
        </>
      )}

      {!["PENDING","CONFIRMED"].includes(booking.status) && (
        <p className="text-center text-gray-700">
          No actions available for status: <strong>{booking.status}</strong>
        </p>
      )}
    </div>
  );
}
