<<<<<<< HEAD
# AuraAI Smart Attendance Management System

A premium, role-based attendance management system featuring QR Code scanning, Geofencing (40m radius validation), and AI-powered insights.

---

## 🚀 Getting Started

Follow these steps to set up and run the project on your local machine.

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)
- **Web Browser** (Chrome or Edge recommended)

### 2. Installation

Open your terminal in the project root and run:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Configuration

You must create `.env` files for both the frontend and backend. 

1.  **Backend**: Copy `backend/.env.example` to `backend/.env`.
2.  **Frontend**: Copy `frontend/.env.example` to `frontend/.env`.

> [!NOTE]
> The `.env.example` files are already pre-configured with a shared test database and API keys. You simply need to rename them to `.env`.

### 4. Database Setup (Initial Run Only)
To populate the database with branches, subjects, and test users:
```bash
cd backend
node seed.js
```

### 5. Running the Project

You need two terminal windows open:

**Terminal 1 (Backend):**
```bash
cd backend
npm start
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

The application will be available at [**https://localhost:5173**](https://localhost:5173).

---

## 🔑 Test Credentials

Use these accounts to explore the different roles:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Faculty** | `faculty1@aura.com` | `aura123` | Prof. Alan Turing (CSE) |
| **Student** | `student1@aura.com` | `aura123` | John Student (CSE, Year 3) |
| **Admin** | `admin1@aura.com` | `aura123` | System Administrator |

---

## 🛠 Features for Testing
- **Faculty Side**: Select CSE -> Year 3 -> Operating Systems and click **"Generate Secure QR"**.
- **Student Side**: Log in from a separate browser or phone, find the subject, and click **"Mark Attendance"** to scan the QR.
- **Geofence**: The system enforces a strict **40-meter radius**. Students must be close to the faculty to succeed!

---
*Created with AuraAI - Advanced Attendance Intelligence*
=======
# ATTENDANCE-MANAGEMENT-SYSTEM
Scanova is an intelligent attendance management system that leverages QR code scanning and geofencing technology to ensure secure, accurate, and real-time attendance tracking. The system allows users to mark attendance only when they are physically present within a predefined location, reducing proxy attendance and improving reliability.
>>>>>>> ba17b9466f3d25a20af6cf8717ba680ca158b5d3
