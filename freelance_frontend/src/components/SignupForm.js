// src/components/SignupForm.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import { toast } from "react-toastify";
import { UserAddIcon, MailIcon, KeyIcon, UserIcon } from "@heroicons/react/outline";

export default function SignupForm() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ username: "", email: "", password: "" });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      await client.post("register/", form);
      toast.success("Account created! Please log in.");
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err.response || err);
      if (err.response?.status === 400) {
        setErrors(err.response.data);
      } else {
        toast.error("Registration failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-16 p-6 bg-white rounded-2xl shadow-lg space-y-6"
    >
      <h2 className="text-3xl font-extrabold text-indigo-600 text-center">
        <UserAddIcon className="w-8 h-8 inline-block mr-2" />
        Sign Up
      </h2>

      <div className="space-y-4">
        <label className="block">
          <span className="text-gray-700 font-medium flex items-center">
            <UserIcon className="w-5 h-5 mr-2 text-gray-500" /> Username
          </span>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            disabled={loading}
            required
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">{errors.username[0]}</p>
          )}
        </label>

        <label className="block">
          <span className="text-gray-700 font-medium flex items-center">
            <MailIcon className="w-5 h-5 mr-2 text-gray-500" /> Email
          </span>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            disabled={loading}
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email[0]}</p>
          )}
        </label>

        <label className="block">
          <span className="text-gray-700 font-medium flex items-center">
            <KeyIcon className="w-5 h-5 mr-2 text-gray-500" /> Password
          </span>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            disabled={loading}
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password[0]}</p>
          )}
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full flex items-center justify-center py-3 font-semibold text-white rounded-lg transition ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        }`}
      >
        {loading ? "Signing up…" : "Sign Up"}
      </button>
    </form>
  );
}
