import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './viewattendance.css';

const ViewAttendance = () => {
    const [attendanceData, setAttendanceData] = useState([]);

    useEffect(() => {
        fetchAttendanceData();
    }, []);

    const fetchAttendanceData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/viewattendance');
            setAttendanceData(response.data);
        } catch (error) {
            console.error('Error fetching attendance data:', error);
        }
    };

    return (
        <div className="attendance-container">
            <h2>View Attendance</h2>
            <table className="attendance-table">
                <thead>
                    <tr>
                        <th>Student ID</th>
                        <th>Attendance Status</th>
                        <th>Course Name</th>
                    </tr>
                </thead>
                <tbody>
                    {attendanceData.map((courseAttendance, index) => (
                        <React.Fragment key={index}>
                            {courseAttendance.attendanceData.map((attendance, idx) => (
                                <tr key={idx}>
                                    <td>{attendance.studentId}</td>
                                    <td>{attendance.attendanceStatus ? 'Present' : 'Absent'}</td>
                                    <td>{courseAttendance.course}</td>
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ViewAttendance;
