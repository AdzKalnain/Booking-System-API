# 📚 Booking System API

A RESTful API built with **Node.js**, **Express**, and **MongoDB** (via Mongoose) that powers a course booking and enrollment platform. Developed during my time at Zuitt Coding Bootcamp (2022).

---

## 📖 Overview

This API enables users to browse and enroll in courses, while giving administrators full control over course management. Authentication and authorization are handled using **JSON Web Tokens (JWT)** and **bcrypt** password hashing to ensure secure access control.

---

## ✨ Features

- **User Management** — Register, log in, and retrieve user profile details
- **Course Management** — Admins can create, update, archive, and retrieve all courses; public users can browse active courses
- **Enrollment System** — Authenticated users can enroll in courses using a two-way embedding strategy between User and Course documents
- **Role-Based Access Control** — Routes are protected by JWT middleware, with additional admin-only guards on sensitive endpoints
- **Secure Authentication** — Passwords are hashed with bcrypt; sessions are managed via signed JWTs

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Authentication | JSON Web Tokens (jsonwebtoken) |
| Password Hashing | bcrypt |

---

## 🗂️ Data Models

### User
Stores personal details and an embedded `enrollments` subdocument array.

```
User
├── firstName       String (required)
├── lastName        String (required)
├── email           String (required)
├── password        String (required, hashed)
├── mobileNo        String (required)
├── isAdmin         Boolean (default: false)
└── enrollments[]
    ├── courseId    String (required)
    ├── enrolledOn  Date
    └── status      String (default: "Enrolled")
```

### Course
Stores course details and an embedded `enrollees` subdocument array.

```
Course
├── name            String (required)
├── description     String (required)
├── price           Number (required)
├── isActive        Boolean (default: true)
├── createdOn       Date
└── enrollees[]
    ├── userId      String (required)
    ├── dateEnrolled Date
    └── status      String (default: "Enrolled")
```

> **Two-Way Embedding** — Enrollment data is embedded in both the User and Course documents for efficient querying across both collections.

---

## 🔌 API Endpoints

### 👤 User Routes — `/users`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/users` | Public | Register a new user |
| POST | `/users/login` | Public | Log in and receive a JWT |
| POST | `/users/details` | Authenticated | Get logged-in user's profile |
| POST | `/users/checkEmail` | Public | Check if an email is already registered |
| POST | `/users/enroll` | Authenticated | Enroll in a course |

### 📘 Course Routes — `/courses`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/courses` | Admin | Get all courses (active & inactive) |
| POST | `/courses` | Admin | Add a new course |
| GET | `/courses/activeCourses` | Public | Get all active courses |
| GET | `/courses/singleCourse/:courseId` | Public | Get a single course by ID |
| PUT | `/courses/updateCourse/:courseId` | Admin | Update a course |
| DELETE | `/courses/archiveCourse/:courseId` | Admin | Archive (soft delete) a course |

---

## 🔐 Authentication

This API uses **Bearer Token Authorization** via JWT. To access protected routes, include the token in the request header:

```
Authorization: Bearer <your_token_here>
```

Tokens are issued upon successful login and contain the user's `id`, `email`, and `isAdmin` status.

---

## 🚀 Getting Started

### Prerequisites
- Node.js
- MongoDB Atlas account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/booking-system-api.git
   cd booking-system-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure your MongoDB connection**

   In `index.js`, update the connection string with your own MongoDB Atlas credentials:
   ```js
   mongoose.connect("your-mongodb-connection-string", { ... });
   ```

4. **Start the server**
   ```bash
   node index.js
   ```

   The server will run at **http://localhost:4000**

---

## 📁 Project Structure

```
├── index.js                  # Entry point, DB connection, and middleware setup
├── auth.js                   # JWT creation and verification middleware
├── models/
│   ├── User.js               # Mongoose User schema and model
│   └── Course.js             # Mongoose Course schema and model
├── controllers/
│   ├── userControllers.js    # Business logic for user routes
│   └── courseControllers.js  # Business logic for course routes
└── routes/
    ├── userRoutes.js         # User route definitions
    └── courseRoutes.js       # Course route definitions
```

---

## 👨‍💻 Author

Developed as part of the **Zuitt Coding Bootcamp** (2022).
