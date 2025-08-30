import React, { useState, useEffect } from 'react';
import './viewfaculty.css'; // Import the CSS file for styling
import Axios from 'axios';

function ViewFaculty() {
    const [facultyList, setFacultyList] = useState([]);

    useEffect(() => {
        fetchFacultyData();
    }, []); // Empty dependency array to ensure useEffect runs only once

    const fetchFacultyData = () => {
        const url = "http://localhost:5000/getfaculty";
        Axios.get(url)
            .then(res => {
                setFacultyList(res.data);
            })
            .catch(err => {
                console.error("Error fetching faculty data:", err);
            });
    };

    return (
        <div className='faculty-container'>
            <h3 className='faculty-title'>Faculty List</h3>
            <table className='faculty-table'>
                <thead>
                    <tr>
                        <th>Faculty ID</th>
                        <th>Name</th>
                        <th>Department</th>
                    </tr>
                </thead>
                <tbody>
                    {facultyList.map((faculty, index) => (
                        <tr key={index}>
                            <td>{faculty.facultyId}</td>
                            <td>{faculty.facultyName}</td>
                            <td>{faculty.department}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ViewFaculty;
