// src/components/ContactPage.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import client from "../api/client";
import { toast } from "react-toastify";
import { MailIcon, PhoneIcon, LinkIcon, ArrowLeftIcon } from "@heroicons/react/solid";

export default function ContactPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [contact, setContact] = useState({
    email: "",
    phone: "",
    portfolio_url: "",
    freelancerName: "",
  });

  useEffect(() => {
    client
      .get(`bookings/${bookingId}/`)
      .then(({ data }) => {
        const freelancer = data.gig_detail.freelancer;
        setContact({
          email: data.freelancer_contact.email,
          phone: data.freelancer_contact.phone,
          portfolio_url: freelancer.portfolio_url || "",
          freelancerName: freelancer.user,
        });
      })
      .catch(() => {
        toast.error("Could not load contact info.");
        setError("Failed to retrieve contact details.");
      })
      .finally(() => setLoading(false));
  }, [bookingId]);

  if (loading) return <div className="text-center py-20">Loading…</div>;
  if (error)   return <div className="text-center text-red-600 py-20">{error}</div>;

  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-white rounded-2xl shadow-lg">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center text-indigo-600 hover:underline"
      >
        <ArrowLeftIcon className="w-5 h-5 mr-1" /> Back
      </button>

      <h2 className="text-2xl font-extrabold text-gray-800 mb-4">
        Contact {contact.freelancerName}
      </h2>

      <div className="space-y-4">
        {contact.email ? (
          <div className="flex items-center">
            <MailIcon className="w-6 h-6 text-green-500 mr-2" />
            <a
              href={`mailto:${contact.email}`}
              className="text-gray-700 hover:underline"
            >
              {contact.email}
            </a>
          </div>
        ) : null}

        {contact.phone ? (
          <div className="flex items-center">
            <PhoneIcon className="w-6 h-6 text-green-500 mr-2" />
            <a
              href={`tel:${contact.phone}`}
              className="text-gray-700 hover:underline"
            >
              {contact.phone}
            </a>
          </div>
        ) : null}

        {contact.portfolio_url ? (
          <div className="flex items-center">
            <LinkIcon className="w-6 h-6 text-blue-500 mr-2" />
            <a
              href={contact.portfolio_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:underline"
            >
              {contact.portfolio_url}
            </a>
          </div>
        ) : null}

        {!contact.email && !contact.phone && !contact.portfolio_url && (
          <p className="text-gray-600 italic">
            No contact information provided.
          </p>
        )}
      </div>
    </div>
  );
}
