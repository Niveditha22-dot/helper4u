# Helper4U — Maid & Nanny Service Management Platform

A centralized web-based platform that connects households with verified domestic helpers including maids, babysitters, and nannies. The platform offers flexible service plans and ensures trust, transparency, and convenience through profile verification, booking management, and service tracking.

---

## Problem Statement

Households often rely on informal networks or unverified agents to hire domestic help, leading to:
- Lack of background verification
- Unreliable service and sudden absenteeism
- No standardized pricing or service plans
- Poor communication and accountability
- Manual coordination and follow-ups

---

## Objectives

- Digitize the maid and nanny hiring process
- Provide verified and trustworthy service providers
- Enable flexible service plans (hourly, monthly, yearly)
- Improve reliability and service transparency
- Maintain service history and performance records
- Enable rating and feedback mechanisms

---

## Features

### Household Portal
- Register and create a household profile
- Browse and search verified helpers by type, location, and plan
- View helper profiles with skills, ratings, and availability
- Book services with hourly, monthly, or yearly plans
- Track bookings and service history
- Submit reviews after completed services

### Helper Portal
- Register and create a professional profile
- Upload identity and verification documents
- Set availability and preferred service plans
- Accept or reject incoming booking requests
- View assigned jobs and work history
- Track earnings (view-only)

### Admin Portal
- Verify and approve helper profiles
- Manage users and service categories
- Monitor bookings, cancellations, and attendance
- Handle complaints and dispute resolution
- View platform analytics and reports

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18 |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Authentication | JWT (JSON Web Tokens) |
| Styling | Custom CSS with Google Fonts |

---

## Project Structure

```
helper4u/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── seed.js            # Sample data seeder
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── helperController.js
│   │   ├── bookingController.js
│   │   ├── reviewController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Helper.js
│   │   ├── Booking.js
│   │   ├── Review.js
│   │   └── Complaint.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── helpers.js
│   │   ├── bookings.js
│   │   ├── reviews.js
│   │   └── admin.js
│   └── server.js
│
└── frontend/
    ├── app/
    │   ├── page.js            # Landing page
    │   ├── login/page.js
    │   ├── register/page.js
    │   ├── helpers/page.js    # Browse helpers
    │   ├── helpers/[id]/page.js
    │   ├── dashboard/page.js  # User dashboard
    │   ├── helper/page.js     # Helper portal
    │   └── admin/page.js      # Admin portal
    ├── components/
    │   ├── layout/Navbar.js
    │   └── ui/
    │       ├── HelperCard.js
    │       └── BookingModal.js
    └── lib/
        ├── api.js
        └── auth.js
```

---

## Core Entities

- **Users** — Household accounts
- **Helpers** — Maid / Nanny / Babysitter profiles
- **Bookings** — Service requests and subscriptions
- **Reviews** — Ratings and feedback
- **Complaints** — Dispute records

---

## Service Plans

| Plan | Description |
|------|-------------|
| Hourly | Pay per hour, minimum 1 hour |
| Monthly | Fixed monthly subscription |
| Yearly | Annual plan with up to 20% savings |

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user or helper |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Helpers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/helpers` | List helpers with filters |
| GET | `/api/helpers/:id` | Get helper by ID |
| POST | `/api/helpers/profile` | Create helper profile |
| PUT | `/api/helpers/profile` | Update helper profile |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings/my` | Get user bookings |
| GET | `/api/bookings/helper` | Get helper jobs |
| PUT | `/api/bookings/:id/status` | Update booking status |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reviews` | Submit review |
| GET | `/api/reviews/helper/:id` | Get helper reviews |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Platform statistics |
| PUT | `/api/admin/helpers/:id/verify` | Verify helper |
| GET | `/api/admin/complaints` | View complaints |
| PUT | `/api/admin/complaints/:id/resolve` | Resolve complaint |

---

## Key Performance Indicators

- Number of registered households
- Number of verified helpers
- Booking and subscription completion rate
- Helper reliability score
- Customer satisfaction rating
- Monthly active users

---

## Future Enhancements

- Online payments and salary management
- Native mobile application
- Attendance and leave tracking
- Real-time notifications
- Multi-language support
- Emergency SOS feature

---

## Project By

**Niveditha R**
💌 - nivedithar483@gmail.com
