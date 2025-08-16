# RealEstate - A Modern Real Estate Platform for Bangladesh

RealEstate is a full-stack web application designed to modernize the property buying, selling, and renting experience in Bangladesh. The platform connects property owners and agents with potential buyers and tenants through a user-friendly, mobile-first interface. Key features include detailed property listings, advanced search functionality, and a real-time chat system for direct communication between users and administrators.

## Live Application URL

**Frontend Deployed on Vercel:** 
**Backend Deployed on Render:** 

---

## Key Features

* **Dual User Roles:** Separate dashboard and functionalities for regular **Users** and **Admins**.
* **Full Property Management (CRUD):** Users can create, update, and delete their own property listings, which are then subject to admin approval.
* **Admin Approval System:** Admins have complete oversight to approve, reject, or manage all properties on the platform.
* **Advanced Search:** Users can search for properties using a simple text search or expand for advanced filters like property type and price range.
* **Real-time Chat:** A live chat system for direct communication between users and the admin team, replacing a static inquiry system.
* **User Bookmarks:** Authenticated users can save their favorite properties to their dashboard.
* **Admin Analytics Dashboard:** A comprehensive overview of site statistics, including total users, properties, and recent activity.
* **Dynamic Banner System:** Admins can manage promotional banners on the homepage.
* **Secure Authentication:** User registration and login are handled with JWT (JSON Web Tokens) stored in secure, httpOnly cookies.

---

## Technology Stack

### Frontend
* **Framework:** Next.js (React)
* **Styling:** Tailwind CSS
* **Real-time Communication:** Socket.IO Client
* **State Management:** React Context API
* **Internationalization:** i18next

### Backend
* **Framework:** Node.js with Express.js
* **Database:** PostgreSQL
* **ORM:** Prisma
* **Authentication:** JWT (jsonwebtoken) & bcrypt
* **Real-time Communication:** Socket.IO
* **File Uploads:** Multer

### Deployment
* **Frontend:** Vercel
* **Backend:** Render
* **Database:** Render PostgreSQL

---

## Local Setup and Installation

### Prerequisites
* Node.js (v18.x or later)
* npm or yarn
* PostgreSQL database

### 1. Backend Setup
```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create the .env file and add your database URL and JWT secret
# Example:
# DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
# JWT_SECRET="your_super_secret_and_long_string_for_jwt"

# Run database migrations to set up the schema
npx prisma migrate dev

# Start the backend server
npm start
```

### 2. Frontend Setup
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Create the .env.local file and add the backend API URL
# Example:
# NEXT_PUBLIC_API_BASE_URL="http://localhost:5000"

# Start the frontend development server
npm run dev
```

---

## Application Usage & Credentials

The application can be tested using the following sample credentials:

* **Admin Account:**
    * **Email:** `admin@gmail.com`
    * **Password:** `admin123`

* **User Account:**
    * **Email:** `rakib@gmail.com` (or any newly registered user)
    * **Password:** `user123`

---

## Team Members

* [Ifthekhar Hossain Akib] [20701063]
* [Md Moin Uddin] [21701021]
* [Mohammad Rakib] [21701077]

