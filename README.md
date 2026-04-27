# Helper4U — Maid & Nanny Service Management Platform

> A full-stack web platform connecting households with verified maids, nannies, and babysitters. Built with Next.js, Node.js/Express, and MongoDB.

![Helper4U](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Stack](https://img.shields.io/badge/Stack-Next.js%20%7C%20Node.js%20%7C%20MongoDB-blue)

---

## 📋 Features

### Household (User) Portal
- Browse and search verified helpers by type, location, plan
- View full helper profiles with ratings, skills, availability
- Book services (hourly / monthly / yearly plans)
- Track all bookings and service history
- Submit reviews after completed services

### Helper Portal
- Create and manage professional profile
- Set availability days and working hours
- Accept or reject incoming booking requests
- Track all jobs and earnings (view-only)
- Update skills, bio, and service rates

### Admin Portal
- Real-time platform statistics dashboard
- Verify or reject helper profiles
- Monitor all bookings across the platform
- Manage user accounts (activate/suspend)
- Handle complaints and dispute resolution

---

## 🛠 Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | Next.js 14 (App Router), React 18 |
| Backend    | Node.js, Express.js               |
| Database   | MongoDB (Mongoose ODM)            |
| Auth       | JWT (JSON Web Tokens)             |
| Deployment | Vercel (frontend), Railway (backend) |

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free) OR MongoDB locally
- Git

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/helper4u.git
cd helper4u
```

### 2. Setup Backend
```bash
cd backend
cp .env.example .env
# Edit .env and fill in your MONGODB_URI and JWT_SECRET
npm install
npm run seed       # Seed sample data
npm run dev        # Starts on http://localhost:5000
```

### 3. Setup Frontend
```bash
cd ../frontend
cp .env.example .env.local
# Edit .env.local → NEXT_PUBLIC_API_URL=http://localhost:5000/api
npm install
npm run dev        # Starts on http://localhost:3000
```

### 4. Login with demo accounts

| Role    | Email                  | Password   |
|---------|------------------------|------------|
| Admin   | admin@helper4u.com     | admin123   |
| User    | arjun@email.com        | user123    |
| Helper  | priya@email.com        | helper123  |

---

## 📁 Project Structure

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
│   │   └── auth.js            # JWT middleware
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
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── app/
│   │   ├── page.js            # Landing page
│   │   ├── login/page.js
│   │   ├── register/page.js
│   │   ├── helpers/
│   │   │   ├── page.js        # Browse helpers
│   │   │   └── [id]/page.js   # Helper detail
│   │   ├── dashboard/page.js  # User dashboard
│   │   ├── helper/page.js     # Helper portal
│   │   ├── admin/page.js      # Admin portal
│   │   ├── globals.css
│   │   └── layout.js
│   ├── components/
│   │   ├── layout/Navbar.js
│   │   └── ui/
│   │       ├── HelperCard.js
│   │       └── BookingModal.js
│   ├── lib/
│   │   ├── api.js             # Axios API client
│   │   └── auth.js            # Auth context
│   ├── .env.example
│   └── package.json
│
├── .gitignore
├── README.md
└── package.json
```

---

## 🌐 Deployment Guide

### Step 1: MongoDB Atlas (Free tier)
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) → Create free cluster
2. **Database Access** → Add a DB user (username + password)
3. **Network Access** → Add IP `0.0.0.0/0` (allow all)
4. **Connect** → Drivers → Copy your connection string:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/helper4u
   ```

### Step 2: Deploy Backend → Railway
1. Go to [railway.app](https://railway.app) → **New Project** → Deploy from GitHub
2. Select your repo → set **Root Directory** = `backend`
3. Go to **Variables** tab and add:
   ```
   MONGODB_URI     = mongodb+srv://...your atlas URI...
   JWT_SECRET      = some_super_secret_random_string_here
   NODE_ENV        = production
   FRONTEND_URL    = https://YOUR-SITE.netlify.app
   PORT            = 5000
   ```
4. Railway auto-deploys → copy your URL e.g. `https://helper4u-api.up.railway.app`

### Step 3: Deploy Frontend → Netlify
1. Go to [netlify.com](https://netlify.com) → **Add new site** → Import from GitHub
2. Select your repo
3. Netlify auto-detects `netlify.toml` — build settings are already configured:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/out`
4. Go to **Site settings → Environment variables** → Add:
   ```
   NEXT_PUBLIC_API_URL = https://YOUR-RAILWAY-URL.up.railway.app/api
   ```
5. **Trigger deploy** → Get your Netlify URL e.g. `https://helper4u.netlify.app`

### Step 4: Update CORS on Railway
Go back to Railway → Variables → update:
```
FRONTEND_URL = https://helper4u.netlify.app
```
Then redeploy.

### Step 5: Seed the database
Run locally once with your production MongoDB URI:
```bash
cd backend
# Add MONGODB_URI=your_atlas_uri to .env
npm run seed
```
This creates the 3 demo accounts on your live database.

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user/helper |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/updateprofile` | Update profile |

### Helpers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/helpers` | List helpers (with filters) |
| GET | `/api/helpers/:id` | Get helper by ID |
| POST | `/api/helpers/profile` | Create helper profile |
| PUT | `/api/helpers/profile` | Update helper profile |
| GET | `/api/helpers/my/profile` | Get own helper profile |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings/my` | Get user's bookings |
| GET | `/api/bookings/helper` | Get helper's jobs |
| PUT | `/api/bookings/:id/status` | Update booking status |
| GET | `/api/bookings` | All bookings (admin) |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reviews` | Submit review |
| GET | `/api/reviews/helper/:id` | Get helper reviews |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Platform statistics |
| GET | `/api/admin/helpers` | All helpers |
| PUT | `/api/admin/helpers/:id/verify` | Verify helper |
| GET | `/api/admin/users` | All users |
| PUT | `/api/admin/users/:id/toggle` | Toggle user status |
| GET | `/api/admin/complaints` | All complaints |
| PUT | `/api/admin/complaints/:id/resolve` | Resolve complaint |

---

## 🔒 Security
- Passwords hashed with bcryptjs (salt rounds: 10)
- JWT authentication with 7-day expiry
- Role-based access control (user / helper / admin)
- CORS restricted to frontend URL in production

---

## 🗺 Roadmap (Phase 2)
- [ ] Online payments (Razorpay integration)
- [ ] Native mobile app (React Native)
- [ ] Attendance & leave tracking
- [ ] Real-time notifications (WebSockets)
- [ ] Multi-language support
- [ ] Emergency SOS feature

---

## 📄 License
MIT License — Helper4U © 2026
