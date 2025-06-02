// src/components/DisputeForm.jsx

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import client from "../api/client";
import { toast } from "react-toastify";
import { ExclamationCircleIcon } from "@heroicons/react/outline";

export default function DisputeForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [errors, setErrors]           = useState({});
  const [loading, setLoading]         = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setErrors({});

    try {
      await client.post("disputes/", { booking: id, description });
      toast.success("Dispute raised! Redirecting…");
      setTimeout(() => navigate("/bookings"), 3200);
    } catch (err) {
      console.error("Dispute error:", err.response?.data);
      if (err.response?.status === 400) {
        setErrors(err.response.data);
      } else if (err.response?.status === 403) {
        toast.error("Not authorized to dispute this booking.");
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto mt-12 p-8 bg-white rounded-2xl shadow-xl"
    >
      <h2 className="text-2xl font-semibold mb-6 flex items-center text-gray-800">
        <ExclamationCircleIcon className="w-6 h-6 text-red-500 mr-3" />
        Raise a Dispute
      </h2>

      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-700">
          Describe your issue
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          required
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 resize-none transition"
          placeholder="Explain what went wrong…"
          disabled={loading}
        />
        {errors.description && (
          <p className="mt-2 text-sm text-red-600">
            {errors.description[0]}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-lg font-semibold text-white transition transform ${
          loading
            ? "bg-red-300 cursor-not-allowed"
            : "bg-gradient-to-r from-red-500 to-red-600 hover:scale-105 shadow-lg"
        }`}
      >
        {loading ? "Submitting…" : "Submit Dispute"}
      </button>
    </form>
  );
}
