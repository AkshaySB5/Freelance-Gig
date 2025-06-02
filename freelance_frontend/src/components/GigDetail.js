// src/components/GigDetail.jsx

import React, { useState, useEffect } from "react";
import client from "../api/client";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CurrencyRupeeIcon, ClockIcon, UserIcon } from "@heroicons/react/solid";

export default function GigDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [gig, setGig]         = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    client
      .get(`gigs/${id}/`)
      .then(({ data }) => {
        setGig(data);
        // after fetching the gig, fetch the current user's profile
        return client.get("profiles/me/");
      })
      .then(({ data }) => setProfile(data))
      .catch((err) => {
        console.error("Gig detail error:", err);
        toast.error("Could not load gig.");
        setError("Could not load gig.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading gig…</div>;
  if (error)   return <div className="text-red-600">{error}</div>;

  // now both gig.freelancer.id and profile.id exist
  const isOwner = gig.freelancer.id === profile.id;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden mt-8">
      {/* optional gig image */}
      {gig.image && (
        <img
          src={gig.image}
          alt={gig.title}
          className="w-full h-64 object-cover"
        />
      )}

      <div className="p-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          {gig.title}
        </h1>

        {/* Creator line (now that gig.freelancer.user is a valid field) */}
        <div className="flex items-center text-gray-600 mb-4">
          <UserIcon className="w-5 h-5 mr-1 text-gray-500" />
          <span className="italic">
            Created by{" "}
            <span className="font-semibold text-gray-800">
              {gig.freelancer.user}
            </span>
          </span>
        </div>

        <p className="text-gray-700 mb-6">{gig.description}</p>

        <div className="flex flex-wrap items-center space-x-4 mb-8">
          <span className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-lg font-medium">
            <CurrencyRupeeIcon className="w-5 h-5 mr-1" />
            {gig.price}
          </span>
          <span className="inline-flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-lg font-medium">
            <ClockIcon className="w-5 h-5 mr-1" />
            {gig.delivery_time} day
            {gig.delivery_time > 1 && "s"}
          </span>
        </div>

        {!isOwner ? (
          <button
            onClick={() => navigate(`/gigs/${id}/book`)}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 transition"
          >
            Book Now
          </button>
        ) : (
          <p className="text-center text-gray-600 italic">
            You can’t book your own gig.
          </p>
        )}
      </div>
    </div>
  );
}
