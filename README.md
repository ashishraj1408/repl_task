# Employee Management System

A simple MERN stack application for managing employee records.

## Tech Stack

- React with Vite
- Node.js
- Express.js
- MongoDB with Mongoose
- Axios
- React Router

## Features

- Add employee details
- View employee list
- Filter employees by department
- Search employees by name
- Delete employee records
- View average age by department

## Folder Structure

```text
backend/
  controllers/
  models/
  routes/
  server.js

frontend/
  src/
    api/
    components/
    pages/
    App.jsx
    main.jsx
```

## Setup

Install dependencies for both folders.

```bash
cd backend
npm install
```

```bash
cd frontend
npm install
```

## Environment Variables

Create a `.env` file inside the `backend` folder.

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/employee-management
```

Create a `.env` file inside the `frontend` folder.

```env
VITE_API_URL=http://localhost:5000/api
```

## Run the Project

Start the backend server.

```bash
cd backend
npm start
```

Start the frontend.

```bash
cd frontend
npm run dev
```

Frontend runs on:

```text
http://localhost:3000
```

Backend runs on:

```text
http://localhost:5000
```

## API Routes

```text
POST   /api/employees
GET    /api/employees
GET    /api/employees/:id
PUT    /api/employees/:id
DELETE /api/employees/:id
GET    /api/employees/departments/list
GET    /api/employees/average-age/by-department
```

Example employee body:

```json
{
  "name": "John Doe",
  "dateOfBirth": "1995-06-10",
  "department": "Engineering"
}
```

## Notes

- MongoDB should be running before starting the backend.
- Department and name filters are handled through query parameters.
- Employee age is calculated from date of birth.
