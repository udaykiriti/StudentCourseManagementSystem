import React from 'react';
import './index.css';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Core Components
import Login from './login';
import ForgotPassword from './forgotpassword';

// Dashboards
import StudentHome from './studenthome';
import FacultyHome from './facultyhome';
import AdminHome from './adminhome';

// Profile Setup
import StudentProfileSetup from './studentcomponents/StudentProfileSetup';
import FacultyProfileSetup from './facultycomponents/FacultyProfileSetup';

function Website() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Authentication */}
        <Route path="/" element={<Login />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />

        {/* Profile Setup */}
        <Route path="/student-profile-setup" element={<StudentProfileSetup />} />
        <Route path="/faculty-profile-setup" element={<FacultyProfileSetup />} />

        {/* Dashboards */}
        <Route path="/studenthome" element={<StudentHome />} />
        <Route path="/facultyhome" element={<FacultyHome />} />
        <Route path="/adminhome" element={<AdminHome />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Website />);