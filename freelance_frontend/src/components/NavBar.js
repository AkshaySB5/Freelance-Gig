// src/components/NavBar.jsx

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BriefcaseIcon,
  HomeIcon,
  PlusCircleIcon,
  ClipboardListIcon,
  UserIcon,
  LogoutIcon,
} from "@heroicons/react/outline";

export default function NavBar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  return (
    // outer wrapper gives horizontal margins and sticks the bar
    <div className="sticky top-0 z-50 mx-6 my-6">
      <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white flex items-center justify-between shadow-2xl rounded-3xl max-w-6xl mx-auto">
        {/* App Logo */}
        <Link to="/" className="flex items-center space-x-2 hover:opacity-90 transition">
          <BriefcaseIcon className="w-6 h-6 text-white" />
          <span className="text-xl font-bold">Gigify</span>
        </Link>

        <div className="flex items-center space-x-6">
          <Link to="/gigs" className="flex items-center hover:opacity-90 transition">
            <HomeIcon className="w-5 h-5 mr-1" /> Gigs
          </Link>

          <Link to="/create-gig" className="flex items-center hover:opacity-90 transition">
            <PlusCircleIcon className="w-5 h-5 mr-1" /> Create Gig
          </Link>

          <Link to="/bookings" className="flex items-center hover:opacity-90 transition">
            <ClipboardListIcon className="w-5 h-5 mr-1" /> My Bookings
          </Link>

          <Link to="/me/profile" className="flex items-center hover:opacity-90 transition">
            <UserIcon className="w-5 h-5 mr-1" /> Profile
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            to="/signup"
            className="px-4 py-1 bg-green-400 hover:bg-green-500 rounded-full font-medium transition-shadow shadow-lg"
          >
            Sign Up
          </Link>

          {!token ? (
            <Link
              to="/login"
              className="px-4 py-1 border-2 border-white hover:bg-white hover:text-indigo-600 rounded-full font-medium transition-shadow shadow-lg"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-1 border-2 border-white hover:bg-white hover:text-indigo-600 rounded-full font-medium transition-shadow shadow-lg"
            >
              <LogoutIcon className="w-5 h-5 mr-1 text-white" />
              Logout
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}
