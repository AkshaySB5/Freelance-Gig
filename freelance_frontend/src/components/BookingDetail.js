// src/components/BookingDetail.jsx

import React, { useState, useEffect } from "react";
// ↳ use our Axios instance with baseURL="/api/"
import client from "../api/client";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ClipboardCheckIcon,
  CreditCardIcon,
  ExclamationCircleIcon,
  StarIcon,
  ClockIcon,
} from "@heroicons/react/solid";

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    client
      .get(`bookings/${id}/`)            // <-- use `client`
      .then((res) => setBooking(res.data))
      .catch(() => setError("Could not load booking."))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePay = () => {
    if (!booking) return;
    const amountPaise = booking.gig_detail.price * 100;
    client                                // <-- and here
      .post("create-order/", { booking: booking.id })
      .then(({ data }) => {
        const options = {
          key: data.key,
          amount: amountPaise,
          currency: data.currency,
          order_id: data.order_id,
          handler: () => {
            toast.success("Payment successful!");
            setTimeout(() => navigate(`/contact/${booking.id}`), 1500);
          },
          modal: {
            ondismiss: () => toast.error("Payment cancelled."),
          },
        };
        new window.Razorpay(options).open();
      })
      .catch(() => toast.error("Failed to create payment order."));
  };

  const handleDispute = () => {
    toast.info("Redirecting to dispute form…");
    setTimeout(() => navigate(`/bookings/${id}/dispute`), 500);
  };

  if (loading) return <div className="text-center py-20">Loading…</div>;
  if (error)   return <div className="text-center text-red-600 py-20">{error}</div>;

  const { gig_detail, status } = booking;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden mt-10">
      <div className="p-8">
        <div className="flex items-center mb-6">
          <ClipboardCheckIcon className="w-8 h-8 text-indigo-600 mr-2" />
          <h1 className="text-3xl font-extrabold text-gray-900">
            Booking #{booking.id}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex items-center">
            <StarIcon className="w-5 h-5 text-indigo-600 mr-2" />
            <span className="font-medium text-gray-800">Gig:</span>
            <span className="ml-1 text-gray-700">{gig_detail.title}</span>
          </div>
          <div className="flex items-center">
            <StarIcon className="w-5 h-5 text-purple-600 mr-2" />
            <span className="font-medium text-gray-800">Status:</span>
            <span className="ml-1 text-gray-700">{status}</span>
          </div>
          <div className="flex items-center">
            <CreditCardIcon className="w-5 h-5 text-green-600 mr-2" />
            <span className="font-medium text-gray-800">Price:</span>
            <span className="ml-1 text-gray-700">₹{gig_detail.price}</span>
          </div>
          <div className="flex items-center">
            <ClockIcon className="w-5 h-5 text-indigo-500 mr-2" />
            <span className="font-medium text-gray-800">Delivery:</span>
            <span className="ml-1 text-gray-700">
              {gig_detail.delivery_time} day{gig_detail.delivery_time > 1 && "s"}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {status === "PENDING" && (
            <button
              onClick={handlePay}
              className="w-full flex items-center justify-center py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow hover:from-indigo-700 hover:to-purple-700 transition"
            >
              <CreditCardIcon className="w-5 h-5 mr-2" />
              Pay Now ₹{gig_detail.price}
            </button>
          )}

          <button
            onClick={handleDispute}
            className="w-full flex items-center justify-center py-3 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600 transition"
          >
            <ExclamationCircleIcon className="w-5 h-5 mr-2" />
            Raise Dispute
          </button>
        </div>
      </div>
    </div>
  );
}
