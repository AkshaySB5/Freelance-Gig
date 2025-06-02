// src/components/Login.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { toast } from "react-toastify";
import { LockClosedIcon, UserIcon } from "@heroicons/react/outline";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("token/", { username, password });
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      toast.success("Logged in!");
      navigate("/me/profile");
    } catch (err) {
      console.error("Login error response:", err.response);
      const message = err.response?.data?.detail || "Login failed";
      toast.error(message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-20 p-6 bg-white rounded-2xl shadow-lg space-y-6"
    >
      <h2 className="text-3xl font-extrabold text-indigo-600 text-center">
        <UserIcon className="w-8 h-8 inline-block mr-2" />
        Log In
      </h2>

      <div className="space-y-4">
        <label className="block">
          <span className="text-gray-700 font-medium">Username</span>
          <input
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>

        <label className="block">
          <span className="text-gray-700 font-medium">Password</span>
          <input
            type="password"
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
      </div>

      <button
        type="submit"
        className="w-full flex items-center justify-center py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow hover:from-indigo-700 hover:to-purple-700 transition"
      >
        <LockClosedIcon className="w-5 h-5 mr-2" />
        Log In
      </button>
    </form>
  );
}
