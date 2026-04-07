# Library Management System (MERN Stack)

A completely functional Library Management System built with MongoDB, Express.js, React (Vite), and Node.js.

## Prerequisites
Before you begin, ensure you have met the following requirements:
* You have installed the latest version of [Node.js](https://nodejs.org/en/)
* You have a locally running instance of [MongoDB](https://www.mongodb.com/try/download/community) on port `27017`

## Setting Up from Scratch

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vermamayank7176/LMS.git
   cd LMS
   ```

2. **Install all dependencies**
   There are several dependency trees to install (root, server, and client).
   ```bash
   npm install
   cd server && npm install
   cd ../client && npm install
   cd ..
   ```

3. **Seed the Admin Account (Optional)**
   We have included a seed script to generate a default admin account.
   ```bash
   node server/seed.js
   ```
   *Email: `admin@lms.com`* 
   *Password: `password123`*

4. **Run the Application**
   You can start both the Node server (at port 5001) and the React frontend (at port 5173) with a single command from the root directory:
   ```bash
   npm run dev
   ```

## Features
- **Authentication**: JWT-based secure login and registration
- **Role Management**: Separate dashboards for Users and Admins 
- **Book Catalog**: Browse, add, and manage library inventory
- **Transactions System**: Issue books and mark them returned
- **Fines**: Automatic tracking of overdue assets (₹10/day)
