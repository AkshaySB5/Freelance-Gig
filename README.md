# Freelance Gig Marketplace

A full-stack Freelance Gig Marketplace application, comprising a **Django REST Framework** backend (`freelance_backend/`) and a **React** frontend (`freelance_frontend/`). Users can browse gigs, book services, pay via Razorpay, leave reviews, and raise disputes. Administrators can manage users, gigs, bookings, reviews, and disputes through the Django admin interface.

---

## Table of Contents

1. [Project Overview](#project-overview)  
2. [Features](#features)  
3. [Tech Stack](#tech-stack)  


---

## Project Overview

This project provides a platform where:

- **Freelancers** can create profiles, list their services (gigs), and manage bookings.  
- **Clients** can browse gigs, place bookings, make payments via Razorpay, submit reviews, and raise disputes if needed.  
- **Administrators** can manage all data (users, gigs, bookings, transactions, reviews, disputes) through the Django admin panel.

Both the frontend (React + Tailwind CSS) and backend (Django REST Framework + PostgreSQL) are designed to be modular, scalable, and secure.

---

## Features

- **User Authentication**: JWT-based login/registration for clients and freelancers.  
- **Profiles & Portfolios**: Freelancers can manage their bio, skills, and portfolio links.  
- **Gig Management**: Create, read, update, and delete gigs.  
- **Search & Filtering**: Browse gigs by category, skill tags, and price range.  
- **Booking System**: Clients can book gigs, view booking details, and cancel when necessary.  
- **Payment Integration**: Secure payments via Razorpay (order creation and webhook handling).  
- **Review & Rating**: Clients can leave ratings and written reviews after service completion.  
- **Dispute Management**: Clients can raise disputes, and admins can resolve them.  
- **Admin Panel**: Full CRUD access to all models (User, Profile, Gig, Booking, Transaction, Review, Dispute).  
- **CORS & Security**: Proper CORS setup, JWT token expiration, and environment-based settings.  

---

## Tech Stack

- **Backend**  
  - Python 3.x  
  - Django 4.x  
  - Django REST Framework  
  - djangorestframework-simplejwt (JWT Authentication)  
  - django-cors-headers  
  - PostgreSQL  
  - Razorpay Python SDK (for payment orders/webhooks)  

- **Frontend**  
  - React 18.x  
  - Tailwind CSS v3.x  
  - Axios (for HTTP requests)  
  - React Router v6.x  
  - react-toastify (for notifications)  
  - jwt-decode (to parse and store JWT tokens)  

- **Other**  
  - Git (version control)  
  - Docker (optional: for containerization)  
  - Postman (API testing)  

---



