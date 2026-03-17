# Student Course Management System (SCMS)

A comprehensive React-based system for managing students, faculty, and courses.

## Environment Setup

To run this project locally, you will need to set up environment variables for the backend server.

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Create a `.env` file in the `server` directory and add your credentials:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
   *(Note: The actual `.env` file is ignored by Git to keep your credentials secure.)*

## Running the Project

1. **Start the Backend Server**
   ```bash
   cd server
   npm install
   npm start
   ```

2. **Start the Frontend Application**
   ```bash
   npm install
   npm start
   ```

The application will run on `http://localhost:3000` and the backend on `http://localhost:5000`.
