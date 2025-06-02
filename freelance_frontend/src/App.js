// src/App.jsx

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContactPage from "./components/ContactPage";
import NavBar from "./components/NavBar";
import Login from "./components/Login";
import SignupForm from "./components/SignupForm";       // ← new
import LandingPage from "./components/LandingPage";
import GigList from "./components/GigList";
import GigDetail from "./components/GigDetail";
import CreateGig from "./components/CreateGig";
import ProfileForm from "./components/ProfileForm";
import BookingForm from "./components/BookingForm";
import BookingDetail from "./components/BookingDetail";
import ReviewForm from "./components/ReviewForm";
import DisputeForm from "./components/DisputeForm";
import PrivateRoute from "./components/PrivateRoute";
import MyBookings    from "./components/MyBookings";
import BookingAction from "./components/BookingAction";
export default function App() {
  return (
    <BrowserRouter>

      <ToastContainer position="top-right" autoClose={3000} />

      <NavBar />

      <Routes>

        <Route path="/" element={<LandingPage />} />


        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<Login />} />


        <Route
          path="/gigs"
          element={
            <PrivateRoute>
              <GigList />
            </PrivateRoute>
          }
        />
        <Route
          path="/gigs/:id"
          element={
            <PrivateRoute>
              <GigDetail />
            </PrivateRoute>
          }
        />


        <Route
          path="/gigs/:id/book"
          element={
            <PrivateRoute>
              <BookingForm />
            </PrivateRoute>
          }
        />
          <Route   path="/bookings"
    element={
      <PrivateRoute>
        <MyBookings />
      </PrivateRoute>
   }
  />
        <Route
          path="/bookings/:id"
          element={
            <PrivateRoute>
              <BookingDetail />
            </PrivateRoute>
          }
        />


        <Route
          path="/bookings/:id/review"
          element={
            <PrivateRoute>
              <ReviewForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/bookings/:id/dispute"
          element={
            <PrivateRoute>
              <DisputeForm />
            </PrivateRoute>
          }
        />


        <Route
          path="/create-gig"
          element={
            <PrivateRoute>
              <CreateGig />
            </PrivateRoute>
          }
        />
        <Route
          path="/me/profile"
          element={
            <PrivateRoute>
              <ProfileForm />
            </PrivateRoute>
          }
        />
        <Route
        path="/contact/:bookingId"
        element={
          <PrivateRoute>
            <ContactPage />
          </PrivateRoute>
        }
      />
          <Route
    path="/bookings/:id/action"
    element={
      <PrivateRoute>
        <BookingAction />
      </PrivateRoute>
    }
  />

        
        <Route
          path="*"
          element={<h1 className="text-center mt-20">Page Not Found</h1>}
        />
      </Routes>
    </BrowserRouter>
);
}
