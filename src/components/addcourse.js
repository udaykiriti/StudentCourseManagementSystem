import React, { useState, useEffect } from 'react';
import './addcourse.css'; 
import Axios from 'axios';

function AddCourse() {
    const [courseNames, setCourseNames] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [semester, setSemester] = useState('');
    const [facultyName, setFacultyName] = useState('');
    const [academicYear, setAcademicYear] = useState('');
    const [sectionNumber, setSectionNumber] = useState('');

    useEffect(() => {
        fetchCourseNames();
    }, []);

    const fetchCourseNames = () => {
        const url = "http://localhost:5000/coursenames";
        Axios.get(url) 
            .then(res => {
                setCourseNames(res.data);
            })
            .catch(err => {
                console.error("Error fetching course names:", err);
            });
    };

    const handleSelectCourse = (event) => { 
        const selectedCourseData = courseNames.find(course => course.courseName === event.target.value);
        setSelectedCourse(event.target.value);
        setSemester(selectedCourseData.semester);
        setFacultyName(selectedCourseData.facultyName);
        setAcademicYear(selectedCourseData.year);
        setSectionNumber(selectedCourseData.sectionNumber);
    };

    const handleSubmit = () => {
        if (selectedCourse && semester && facultyName && academicYear && sectionNumber) {
            const url = "http://localhost:5000/addcourse";
            Axios.post(url, { 
                course: selectedCourse,
                semester: semester,
                facultyName: facultyName,
                academicYear: academicYear,
                sectionNumber: sectionNumber
            })
            .then(res => {
                console.log("Course added successfully:", res.data);
                setSelectedCourse('');
                setSemester('');
                setFacultyName('');
                setAcademicYear('');
                setSectionNumber('');
                window.alert("Course added successfully!");
            })
            .catch(err => {
                console.error("Error adding course:", err);
            });
        } else {
            console.error("Please fill in all fields before submitting.");
            window.alert("Please fill in all fields before submitting.");
        }
    };

    return (
        <div className='scrollable-textbox'>
            <h3>Select Course</h3>
            <div className="form-group">
                <select className='course-select' onChange={handleSelectCourse} value={selectedCourse}>
                    <option value=''>Select Course</option>
                    {courseNames.map((course, index) => (
                        <option key={index} value={course.courseName}>
                            {course.courseName}
                        </option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <input type="text" placeholder="Semester" value={semester} onChange={(e) => setSemester(e.target.value)} />
            </div>
            <div className="form-group">
                <input type="text" placeholder="Faculty Name" value={facultyName} onChange={(e) => setFacultyName(e.target.value)} />
            </div>
            <div className="form-group">
                <input type="text" placeholder="Academic Year" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} />
            </div>
            <div className="form-group">
                <input type="text" placeholder="Section Number" value={sectionNumber} onChange={(e) => setSectionNumber(e.target.value)} />
            </div>
            <div className="form-group">
                <button className='submit-button' onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    );
}

export default AddCourse;
