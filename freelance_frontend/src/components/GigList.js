// src/components/GigList.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import { StarIcon, CurrencyRupeeIcon } from "@heroicons/react/solid";

export default function GigList() {
  const navigate = useNavigate();

  // All gigs fetched from the server
  const [gigs, setGigs] = useState([]);

  // The result of applying text + price filters
  const [filtered, setFiltered] = useState([]);

  // Text‐search query
  const [query, setQuery] = useState("");

  // New: minimum and maximum price filters
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Fetch gig list once, on mount
  useEffect(() => {
    client.get("gigs/").then((res) => {
      setGigs(res.data);
      setFiltered(res.data);
    });
  }, []);

  // Recompute `filtered` whenever gigs, query, minPrice, or maxPrice change
  useEffect(() => {
    // Convert strings to numbers where possible; else treat as “no limit”
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);

    setFiltered(
      gigs.filter((g) => {
        // 1) Title must include the text query (case-insensitive)
        const matchesText = g.title.toLowerCase().includes(query.toLowerCase());

        // 2) If minPrice is set (and is a valid number), gig.price must be >= min
        const matchesMin =
          !isNaN(min) ? parseFloat(g.price) >= min : true;

        // 3) If maxPrice is set (and is a valid number), gig.price must be <= max
        const matchesMax =
          !isNaN(max) ? parseFloat(g.price) <= max : true;

        return matchesText && matchesMin && matchesMax;
      })
    );
  }, [gigs, query, minPrice, maxPrice]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Search + Price Filters */}
      <div className="max-w-4xl mx-auto mb-8 space-y-4">
        <input
          type="text"
          placeholder="Search gigs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Min Price Input */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Min Price (₹)
            </label>
            <input
              type="number"
              placeholder="e.g. 100"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Max Price Input */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Max Price (₹)
            </label>
            <input
              type="number"
              placeholder="e.g. 1000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400"
            />
          </div>
        </div>
      </div>

      {/* Gig Grid */}
      <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((gig) => (
          <div
            key={gig.id}
            className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden cursor-pointer"
            onClick={() => navigate(`/gigs/${gig.id}`)}
          >
            <div className="h-40 bg-gray-100 flex items-center justify-center text-gray-400">
              No Image
            </div>

            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1 truncate">
                {gig.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {gig.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="inline-flex items-center bg-green-100 text-green-800 text-sm font-semibold px-2 py-1 rounded-full">
                  <CurrencyRupeeIcon className="w-4 h-4 mr-1" />
                  {gig.price}
                </div>
                <div className="flex items-center text-yellow-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-4 h-4 ${
                        i < (gig.rating || 4) ? "" : "text-gray-200"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-gray-600 text-sm">
                    {(gig.rating || 4).toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="text-center col-span-full text-gray-600">
            No gigs match your filters.
          </p>
        )}
      </div>
    </div>
  );
}
