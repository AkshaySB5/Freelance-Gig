// src/components/LandingPage.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRightIcon } from "@heroicons/react/solid";

export default function LandingPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const handleBrowse = () => {
    if (token) {
      navigate("/gigs");
    } else {
      navigate("/login");
    }
  };

  return (
    // Push content toward top with less padding
    <div className="h-screen bg-white flex items-start pt-16">
      <div className="max-w-2xl mx-auto text-center px-4">
        <h1 className="text-6xl md:text-7xl font-extrabold text-indigo-600 mb-4">
          Find the Perfect{" "}
          <span className="text-green-400">Freelancer</span> Quickly
        </h1>
        <br></br>
        <p className="text-xl text-gray-900 mb-4">
          Browse thousands of skilled pros, book a gig in minutes, and get
          your work done—hassle free.
        </p>
        <br></br>
        <button
          onClick={handleBrowse}
          className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition -mt-2"
        >
          {token ? "Browse Gigs" : "Login to Browse Gigs"}
          <ArrowRightIcon className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );
}
