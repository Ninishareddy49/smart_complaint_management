# Smart Complaint Management System (SCMS)

A robust, enterprise-grade full-stack solution designed to streamline the reporting, tracking, and resolution of institutional complaints. Featuring role-based access control, real-time status updates, and a comprehensive administrative command center.

---

## 🚀 Key Features

*   **Role-Based Access Control (RBAC):** Specialized dashboards and permissions for **Users**, **Staff**, and **Administrators**.
*   **Dynamic Dashboards:** Real-time metrics and role-specific overviews focusing on actionable tasks.
*   **End-to-End Complaint Lifecycle:** Submission, assignment, status tracking (Open, In Progress, Resolved, Closed), and historical audit trails.
*   **Admin Command Center:** High-level surveillance of users, personnel management, and global complaint logs with secure deletion capabilities.
*   **Intelligent Notification System:** Real-time updates on case developments and administrative alerts.
*   **Secure Authentication:** Secure login and registration using JWT (JSON Web Tokens) with encrypted password hashing.

---

## 🛠️ Technology Stack

### **Backend**
*   **Framework:** Spring Boot 3.4.3
*   **Security:** Spring Security with JWT (Stateless Authentication)
*   **Persistence:** Spring Data JPA
*   **Language:** Java 17
*   **Dependencies:** Lombok, Maven, Validation API

### **Frontend**
*   **Library:** React 18.3 (Vite template)
*   **Styling:** Tailwind CSS (Modern Glassmorphism & UI)
*   **Animations:** Framer Motion (Micro-interactions)
*   **Icons:** Lucide React
*   **State Management:** Axios (API interactions) & React Router DOM

### **Database**
*   **Engine:** PostgreSQL (Global records and surveillance matrix)
*   **Schema Management:** Automated Hibernate DDL management

---

## 📂 Project Architecture

```text
smart-complaint-management/
├── src/main/java/              # Backend Source Code (Spring Boot)
│   └── com/example/demo/
│       ├── config/             # DB Seeding & Security Config
│       ├── controllers/        # REST Endpoints (Admin, Auth, Complaints)
│       ├── entities/           # JPA Models (AppUser, Complaint, Notification)
│       ├── dto/                # Data Transfer Objects
│       └── services/           # Core Business Logic
├── src/                        # Frontend Source Code (React)
│   ├── pages/                  # Dashboard, Admin, Staff, MyComplaints
│   ├── components/             # Sidebar, Layout, ProtectedRoutes
│   └── services/               # Axios API Service Layer
├── frontend/                   # Redundant frontend container (can be used for dev)
└── public/                     # Static Assets
```

---

## 🚥 Getting Started

### **Prerequisites**
*   Java 17+ installed
*   PostgreSQL installed and running
*   Node.js & npm installed

### **1. Backend Configuration**
Configure your PostgreSQL credentials in `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/scms
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### **2. Running the Backend**
From the root directory:
```bash
./mvnw clean spring-boot:run
```

### **3. Running the Frontend**
From the root directory (or `/frontend` directory depending on setup):
```bash
npm install
npm run dev
```

---

## 🔐 Core Endpoints Overview

| Endpoint | Method | Role | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | POST | ALL | Create a new user account |
| `/api/auth/login` | POST | ALL | Authenticate and retrieve JWT |
| `/api/admin/users` | GET | ADMIN | Managed list of all registered users |
| `/api/admin/complaints`| GET | ADMIN | Global complaints ledger/vault |
| `/api/complaints` | POST | USER | Submit a new secure report |
| `/api/complaints/{id}` | GET | ALL | Retrieve detailed case intelligence |

---

## 📂 User Matrix

*   **Administrator:** Global surveillance, user management, and system-wide data removal.
*   **Staff:** Resolution specialized role; manages assignments and status updates.
*   **User:** Reporting role; submits and tracks individual case resolutions.

---

## 🏗️ Deployment & Professional Build

To package the entire application for production deployment:
```bash
./mvnw clean package
```
The resulting `.jar` file in `target/` contains the full production-ready server.

---
