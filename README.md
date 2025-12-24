# Job Application Tracker

A full-stack web application designed for local development to help job seekers track their job applications. Built with Node.js, Express, PostgreSQL, and Vanilla JavaScript.

## 🚀 Features

- **User Authentication**: Secure registration and login using JWT and bcrypt.
- **Dashboard**: Overview of total applications and status breakdown.
- **Job Management**:
  - Create new job applications.
  - View all applications in a list.
  - Update application status (Applied, Interview, Offer, Rejected).
  - Delete applications.
  - Filter applications by status.
- **Responsive Design**: Clean and simple UI.

## 🛠 Tech Stack

**Backend:**
- Node.js
- Express.js
- PostgreSQL (Database)
- JWT (Authentication)
- bcrypt (Password Hashing)
- dotenv (Environment Variables)

**Frontend:**
- HTML5
- CSS3
- Vanilla JavaScript
- Fetch API

## 📸 Screenshots

*(Screenshots to be added manually)*

## ⚙️ Local Setup Instructions

### Prerequisites
- Node.js installed
- PostgreSQL installed and running

### 1. Clone the repository
```bash
git clone <repository-url>
cd job-application-tracker
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup
1. Create a PostgreSQL database named `job_tracker`.
2. Run the SQL commands in `schema.sql` to create the necessary tables. You can use a tool like pgAdmin or the command line:
```bash
psql -U postgres -d job_tracker -f schema.sql
```

### 4. Environment Configuration
1. Rename `.env.example` to `.env`.
2. Update the variables with your local database credentials:
```env
PORT=3000
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=job_tracker
JWT_SECRET=your_super_secret_key
```

### 5. Run the Application
Start the development server:
```bash
npm run dev
```
The server will start on `http://localhost:3000`.

### 6. Access the App
Open your browser and go to `http://localhost:3000`. You will be redirected to the login page.

## 🔐 Authentication
Authentication is handled via JSON Web Tokens (JWT).
1. When a user logs in, the server verifies credentials and issues a signed JWT.
2. The frontend stores this token in `localStorage`.
3. All subsequent requests to protected API endpoints include this token in the `Authorization` header (`Bearer <token>`).
4. The backend middleware verifies the token before granting access to user-specific data.

## ⚠️ Note
This project is designed for **LOCAL DEVELOPMENT ONLY**. It is not intended for production deployment. Screenshots are provided as visual proof of functionality.
