// src/components/BookingForm.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircleIcon, CurrencyRupeeIcon, ClockIcon } from "@heroicons/react/solid";
import client from "../api/client";
import { toast } from "react-toastify";

export default function BookingForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [gig, setGig]         = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  useEffect(() => {
    client
      .get(`gigs/${id}/`)
      .then((res) => setGig(res.data))
      .catch(() => setError("Could not load gig."));
  }, [id]);

  const handleConfirm = () => {
    if (!gig) return;
    setLoading(true);
    client
      .post("bookings/", { gig: id })
      .then(({ data }) => {
        toast.success("Booking confirmed!");
        navigate(`/bookings/${data.id}`);
      })
      .catch((err) => {
        toast.error(err.response?.status === 401 ? "Please log in first." : "Failed to confirm booking.");
        if (err.response?.status === 401) navigate("/login");
      })
      .finally(() => setLoading(false));
  };

  if (error) return <div className="text-center text-red-600 mt-8">{error}</div>;
  if (!gig)  return <div className="text-center py-20">Loading gig…</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden mt-10">
      {gig.image && (
        <img
          src={gig.image}
          alt={gig.title}
          className="w-full h-56 object-cover"
        />
      )}
      <div className="p-8">
        <div className="flex items-center mb-4">
          <CheckCircleIcon className="w-8 h-8 text-green-500 mr-2" />
          <h2 className="text-3xl font-extrabold text-gray-900">
            Confirm Booking
          </h2>
        </div>

        <h3 className="text-2xl font-semibold mb-2">{gig.title}</h3>
        <p className="text-gray-700 mb-6">{gig.description}</p>

        <div className="flex flex-wrap items-center gap-4 mb-8">
          <span className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-lg font-medium">
            <CurrencyRupeeIcon className="w-5 h-5 mr-1" />
            {gig.price}
          </span>
          <span className="inline-flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-lg font-medium">
            <ClockIcon className="w-5 h-5 mr-1" />
            {gig.delivery_time} day{gig.delivery_time > 1 && "s"}
          </span>
        </div>

        <button
          onClick={handleConfirm}
          disabled={loading}
          className={`w-full py-3 text-white font-semibold rounded-lg shadow-lg transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          }`}
        >
          {loading ? "Confirming…" : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
}
