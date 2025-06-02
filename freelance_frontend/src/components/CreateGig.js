// src/components/CreateGig.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import { toast } from "react-toastify";
import {
  PlusCircleIcon,
  DocumentTextIcon,
  CurrencyRupeeIcon,
  ClockIcon,
  PhotographIcon,
} from "@heroicons/react/outline";

export default function CreateGig() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setErrors({});

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("price", price);
    formData.append("delivery_time", deliveryTime);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const { data } = await client.post("gigs/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Gig created successfully!");
      navigate(`/gigs/${data.id}`);
    } catch (err) {
      if (err.response?.status === 400) {
        setErrors(err.response.data);
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
      className="max-w-xl mx-auto mt-8 p-6 bg-white rounded-2xl shadow-lg space-y-6"
    >
      <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
        <PlusCircleIcon className="w-6 h-6 text-indigo-600 mr-2" />
        Create New Gig
      </h2>

      {/* Title */}
      <div>
        <label className="flex items-center text-gray-700 font-medium mb-1">
          <DocumentTextIcon className="w-5 h-5 mr-2 text-gray-500" />
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
          disabled={loading}
          required
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title[0]}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="flex items-center text-gray-700 font-medium mb-1">
          <DocumentTextIcon className="w-5 h-5 mr-2 text-gray-500" />
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="4"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
          disabled={loading}
          required
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description[0]}
          </p>
        )}
      </div>

      {/* Price & Delivery Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="flex items-center text-gray-700 font-medium mb-1">
            <CurrencyRupeeIcon className="w-5 h-5 mr-2 text-green-500" />
            Price (₹)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
            disabled={loading}
            required
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price[0]}</p>
          )}
        </div>

        <div>
          <label className="flex items-center text-gray-700 font-medium mb-1">
            <ClockIcon className="w-5 h-5 mr-2 text-yellow-500" />
            Delivery Time (days)
          </label>
          <input
            type="number"
            value={deliveryTime}
            onChange={(e) => setDeliveryTime(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
            disabled={loading}
            required
          />
          {errors.delivery_time && (
            <p className="mt-1 text-sm text-red-600">
              {errors.delivery_time[0]}
            </p>
          )}
        </div>
      </div>

     

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 text-white font-semibold rounded-lg transition ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        }`}
      >
        {loading ? "Creating…" : "Create Gig"}
      </button>
    </form>
  );
}
