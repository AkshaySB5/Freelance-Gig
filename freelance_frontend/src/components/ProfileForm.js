// src/components/ProfileForm.jsx

import React, { useState, useEffect } from "react";
import client from "../api/client";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  UserCircleIcon,
  AnnotationIcon,
  LightningBoltIcon,
  LinkIcon,
  PencilAltIcon,
  MailIcon,
  PhoneIcon,
} from "@heroicons/react/outline";

export default function ProfileForm() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    bio: "",
    skills: "",
    portfolio_url: "",
    contact_email: "",
    contact_phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    client
      .get("profiles/me/")
      .then(({ data }) => {
        setProfile({
          bio: data.bio || "",
          skills: (data.skills || []).join(", "),
          portfolio_url: data.portfolio_url || "",
          contact_email: data.contact_email || "",
          contact_phone: data.contact_phone || "",
        });
      })
      .catch(() => {
        toast.error("Failed to load your profile.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    setErrors({});

    try {
      const payload = {
        bio: profile.bio.trim(),
        skills: profile.skills.split(",").map((s) => s.trim()),
        portfolio_url: profile.portfolio_url.trim(),
        contact_email: profile.contact_email.trim(),
        contact_phone: profile.contact_phone.trim(),
      };
      await client.patch("profiles/me/", payload);
      toast.success("Profile updated!");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      if (err.response?.status === 400) {
        setErrors(err.response.data);
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading profile…</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-white rounded-3xl shadow-xl overflow-hidden">
      {/* Banner + Avatar */}
      <div className="relative h-40 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
          <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
            <UserCircleIcon className="w-full h-full text-gray-300" />
          </div>
        </div>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="pt-20 px-8 pb-8 space-y-8">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-gray-800">Your Profile</h2>
          <p className="text-gray-500 mt-1">Update your bio, skills & portfolio</p>
        </div>

        {/* Bio & Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Bio */}
          <div className="space-y-2">
            <label className="flex items-center text-gray-700 font-medium">
              <AnnotationIcon className="w-5 h-5 mr-2 text-indigo-500" />
              Bio
            </label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              rows="5"
              className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {errors.bio && <p className="text-sm text-red-600">{errors.bio[0]}</p>}
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <label className="flex items-center text-gray-700 font-medium">
              <LightningBoltIcon className="w-5 h-5 mr-2 text-yellow-500" />
              Skills (comma-separated)
            </label>
            <input
              name="skills"
              value={profile.skills}
              onChange={handleChange}
              className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {errors.skills && <p className="text-sm text-red-600">{errors.skills[0]}</p>}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Portfolio URL */}
        <div className="space-y-2">
          <label className="flex items-center text-gray-700 font-medium">
            <LinkIcon className="w-5 h-5 mr-2 text-purple-500" />
            Portfolio URL
          </label>
          <input
            name="portfolio_url"
            value={profile.portfolio_url}
            onChange={handleChange}
            placeholder="https://your-portfolio.com"
            className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          {errors.portfolio_url && (
            <p className="text-sm text-red-600">{errors.portfolio_url[0]}</p>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Contact Email */}
        <div className="space-y-2">
          <label className="flex items-center text-gray-700 font-medium">
            <MailIcon className="w-5 h-5 mr-2 text-green-500" />
            Contact Email
          </label>
          <input
            name="contact_email"
            type="email"
            value={profile.contact_email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          {errors.contact_email && (
            <p className="text-sm text-red-600">{errors.contact_email[0]}</p>
          )}
        </div>

        {/* Contact Phone */}
        <div className="space-y-2">
          <label className="flex items-center text-gray-700 font-medium">
            <PhoneIcon className="w-5 h-5 mr-2 text-green-500" />
            Contact Phone
          </label>
          <input
            name="contact_phone"
            value={profile.contact_phone}
            onChange={handleChange}
            placeholder="+1-555-1234"
            className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          {errors.contact_phone && (
            <p className="text-sm text-red-600">{errors.contact_phone[0]}</p>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Save Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={saving}
            className={`inline-flex items-center px-8 py-3 font-semibold text-white rounded-full transition ${
              saving
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            }`}
          >
            <PencilAltIcon className="w-5 h-5 mr-2" />
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
