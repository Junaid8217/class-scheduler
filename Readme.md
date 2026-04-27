# 📅 Class Scheduler

A full-stack class scheduling web application that allows teachers to create time slots and students to book them — built with **React (Vite)** on the frontend and **Node.js / Express** on the backend, backed by **MongoDB Atlas**.

---

## 👤 Credentials (Login)

> The app uses role-based access without a traditional login form. Credentials are pre-set in the code:

| Role    | Name / Username | Password       |
|---------|-----------------|----------------|
| Teacher | `Mr. Rahman`    | *(no password — click "Login as Teacher")* |
| Student | `Rahim`         | *(no password — click "Login as Student")* |

Simply open the app and click the appropriate role button on the home screen.

---

## 🚀 How to Run the Project

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)
- Internet connection (required for MongoDB Atlas)

---

### 1. Clone the Repository

```bash
git clone https://github.com/Junaid8217/class-scheduler.git
cd class-scheduler
```

---

### 2. Run the Backend

```bash
cd class-scheduler-backend
npm install
npm start
```

The backend server will start at: **http://localhost:5000**

> MongoDB Atlas is already configured in the code — no `.env` setup needed.

---

### 3. Run the Frontend

Open a **new terminal tab/window**:

```bash
cd class-scheduler-client
npm install
npm run dev
```

The frontend will be available at: **http://localhost:5173**

---

## 🛠️ What Was Implemented

### Backend (`class-scheduler-backend/`)

Built with **Node.js**, **Express**, and **MongoDB Atlas** (`mongodb` driver):

- **`GET /api/slots`** — Fetch all available and booked slots, sorted by date and time
- **`POST /api/slots`** — Create a new 15-minute time slot with validation:
  - Rejects slots set in the **past**
  - Rejects slots that **overlap** with existing ones
  - Auto-calculates `endTime` by adding 15 minutes to `startTime`
- **`DELETE /api/slots/:id`** — Delete a slot by its MongoDB ID
- **`GET /api/bookings`** — Fetch all booking records
- **`POST /api/bookings`** — Book an available slot by its ID:
  - Prevents double-booking (checks `status === 'booked'`)
  - Updates the slot's status to `booked`
  - Creates a booking record with student name and slot details

---

### Frontend (`class-scheduler-client/`)

Built with **React + Vite**:

- **Home / Role Selection Screen** — User picks either "Teacher" or "Student" to enter the app
- **Teacher Dashboard** (`TeacherDashboard.jsx`)
  - Add new time slots by selecting a date and start time
  - View all slots with their status (Available / Booked) highlighted in color
  - Real-time feedback with success and error messages
- **Student View** (`StudentView.jsx`)
  - Browse all available slots
  - Book a slot with a single click
- **API Layer** (`src/api/index.js`) — Centralized Axios calls to the backend

---

## 📁 Project Structure

```
class-scheduler/
├── class-scheduler-backend/
│   ├── index.js          # Express server & all API routes
│   └── package.json
└── class-scheduler-client/
    ├── src/
    │   ├── App.jsx                        # Role selection & routing
    │   ├── api/index.js                   # Axios API functions
    │   └── components/
    │       ├── TeacherDashboard.jsx       # Teacher UI
    │       └── StudentView.jsx            # Student UI
    ├── index.html
    └── package.json
```

---

## 🗄️ Database

- **MongoDB Atlas** (cloud-hosted)
- Database: `class-scheduler`
- Collections: `slots`, `bookings`
- Connection is pre-configured in `class-scheduler-backend/index.js`