// src/components/ReviewForm.jsx

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import client from "../api/client";           // your preconfigured Axios instance
import { toast } from "react-toastify";
import { StarIcon } from "@heroicons/react/solid";

export default function ReviewForm() {
  const { id } = useParams();                // booking ID
  const navigate = useNavigate();

  const [rating, setRating]     = useState(5);
  const [comment, setComment]   = useState("");
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setErrors({});

    try {
      await client.post("reviews/", {
        booking: id,
        rating,
        comment: comment.trim(),
      });

      toast.success("Review submitted! Redirecting…");
      setTimeout(() => navigate("/bookings"), 3200);
    } catch (err) {
      const res = err.response;
      if (res?.status === 400) {
        setErrors(res.data);
      } else if (res?.status === 403) {
        toast.error("Not authorized to review this booking.");
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
      <h2 className="text-3xl font-extrabold mb-6 flex items-center text-gray-800">
        <StarIcon className="w-7 h-7 text-green-500 mr-3" />
        Leave a Review
      </h2>

      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-700">
          Rating
        </label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          disabled={loading}
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} ★
            </option>
          ))}
        </select>
        {errors.rating && (
          <p className="mt-2 text-sm text-red-600">{errors.rating[0]}</p>
        )}
      </div>

      <div className="mb-8">
        <label className="block mb-2 font-medium text-gray-700">
          Comment
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={5}
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 resize-none transition"
          placeholder="Share your experience…"
          disabled={loading}
          required
        />
        {errors.comment && (
          <p className="mt-2 text-sm text-red-600">{errors.comment[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-lg font-semibold text-white transition transform ${
          loading
            ? "bg-green-300 cursor-not-allowed"
            : "bg-gradient-to-r from-green-400 to-green-600 hover:scale-105 shadow-lg"
        }`}
      >
        {loading ? "Submitting…" : "Submit Review"}
      </button>
    </form>
  );
}
