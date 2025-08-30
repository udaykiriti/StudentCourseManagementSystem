import React, { useState } from 'react';
import './addfaculty.css';
import Axios from 'axios';

function AddFaculty() {
    const [facultyId, setFacultyId] = useState('');
    const [facultyName, setFacultyName] = useState('');
    const [department, setDepartment] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (facultyId && facultyName && department) {
            const url = "http://localhost:5000/addfaculty";
            Axios.post(url, {
                facultyId: facultyId,
                facultyName: facultyName,
                department: department
            })
            .then(res => {
                window.alert("Faculty Added Successfully");
                setFacultyId('');
                setFacultyName('');
                setDepartment('');
                setError('');
            })
            .catch(err => {
                console.error("Error adding faculty:", err);
                window.alert("Error adding faculty. Please try again.");
            });
        } else {
            window.alert("Please fill in all fields before submitting.");
        }
    };

    return (
        <div className='add-faculty-form'>
            <h3>Add Faculty</h3>
            <input type="text" placeholder="Faculty ID" value={facultyId} onChange={(e) => setFacultyId(e.target.value)} />
            <input type="text" placeholder="Faculty Name" value={facultyName} onChange={(e) => setFacultyName(e.target.value)} />
            <input type="text" placeholder="Department" value={department} onChange={(e) => setDepartment(e.target.value)} />
            {error && <p className="error-message">{error}</p>}
            <button className='submit-button' onClick={handleSubmit}>Submit</button>
        </div>
    );
}

export default AddFaculty;
