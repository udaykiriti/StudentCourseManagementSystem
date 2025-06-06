import React from 'react';
import ReactDOM from 'react-dom'; 
import StudentHome from './studenthome';
import Login from './login';
import ChangePassword from './components/changepassword';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Book from './facultycomponents/book';
import MyProfile from './components/myprofile';
import MyCourses from './facultycomponents/viewcourses';
import FacultyTitlePage from './facultypage'; 
import FacultyHome from './facultyhome'
import AdminHome from './adminhome'; 
import AddCourse from './components/addcourse';
import DeleteCourse from './admincomponents/deletecourse'; 
import AddStudent from './facultycomponents/addstudent'; 
import ViewStudents from './facultycomponents/viewstudent';
import ViewFaculty from './admincomponents/viewfaculty';
import StudentPage from './studentpage';
import AdminPage from './adminpage';
import AddFaculty from './admincomponents/addfaculty'
import DeleteFaculty from './admincomponents/deletefaculty'
import StudentCourse from  "./components/studentcourse";
import DeleteStudent from "./facultycomponents/deletestudent"
import Attendance from "./facultycomponents/attendance"
import ViewAttendance from "./facultycomponents/viewattendance"
import FeedBack from './components/feedback';
import ViewFeedBack from './admincomponents/viewfeedback';
import SubmitAssignment from './components/submitassignment';
function Website() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/studenthome" element={<StudentHome/>} />
        <Route path="/components/changepassword" element={<ChangePassword />} />
        <Route path="/facultyhome" element={<FacultyHome />} />
        <Route path="/facultycomponents/book" element={<Book />} />
        <Route path="/components/myprofile" element={<MyProfile />} />
        <Route path="/facultycomponents/viewcourses" element={<MyCourses />} /> 
        <Route path="/facultypage" element={<FacultyTitlePage />} />
        <Route path="/studentpage" element={<StudentPage />} />
        <Route path="/adminpage" element={<AdminPage />} />
        <Route path="/adminhome" element={<AdminHome/>} />
        <Route path="/components/addcourse" element={<AddCourse/>} />
        <Route path="/admincomponents/deletecourse" element={<DeleteCourse />} /> 
        <Route path="/facultycomponents/addstudent" element={<AddStudent />} />
        <Route path="/facultycomponents/viewstudent" element={<ViewStudents />} /> 
        <Route path="/admincomponents/viewfaculty" element={<ViewFaculty />} />
        <Route path="/admincomponents/addfaculty" element={<AddFaculty />} /> 
        <Route path="/admincomponents/deletefaculty" element={<DeleteFaculty />} />
        <Route path='/components/studentcourse' element={<StudentCourse />} /> 
        <Route path="/facultycomponents/deletestudent" element={<DeleteStudent />} /> 
        <Route path="/facultycomponents/attendance" element={<Attendance />} />
        <Route path="/facultycomponents/viewattendance" element={<ViewAttendance />} />
        <Route path="/components/feedback" element={<FeedBack />} />
        <Route path="/admincomponents/viewfeedback" element={<ViewFeedBack />} />
        <Route path="/components/submitassignment" element={<SubmitAssignment />} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.render(<Website />, document.getElementById('root'));
