import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import './studentcourse.css'; // Import the CSS file for styling

function ViewCourses() {
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStudentCourses();
    }, []);

    const fetchStudentCourses = () => {
        const url = "http://localhost:5000/studentcourse"; // Endpoint to fetch student course data
        Axios.get(url)
            .then(res => {
                setCourses(res.data);
            })
            .catch(err => {
                console.error("Error fetching student courses:", err);
                setError("Failed to fetch student course data");
            });
    };

    return (
        <div className='full-height'>
            <h3>Courses Selected</h3>
            {error && <p className="error-message">{error}</p>}
            <table className='tablestyle'>
                <thead>
                    <tr>
                        <th className='firstcolumn'>Course Name</th>
                        <th>Section Number</th>
                        <th>Faculty Name</th>
                        <th>Semester</th>
                        <th>Year</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course, index) => (
                        <tr key={index}>
                            <td>{course.course}</td>
                            <td>{course.sectionNumber}</td>
                            <td>{course.facultyName}</td>
                            <td>{course.semester}</td>
                            <td>{course.academicYear}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ViewCourses;
