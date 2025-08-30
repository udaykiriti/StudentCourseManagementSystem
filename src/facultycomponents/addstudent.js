import React, { useState } from 'react';
import './addstudent.css';
import Axios from 'axios';

function AddStudent() {
    const [studentId, setStudentId] = useState('');
    const [studentName, setStudentName] = useState('');
    const [sectionNo, setSectionNo] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (studentId && studentName && sectionNo) {
            const url = "http://localhost:5000/addstudent";
            Axios.post(url, {
                studentId: studentId,
                studentName: studentName,
                sectionNo: sectionNo
            })
            .then(res => {
                setStudentId('');
                setStudentName('');
                setSectionNo('');
                setError('');
                window.alert("Student added successfully.");
            })
            .catch(err => {
                console.error("Error adding student:", err);
                if (err.response && err.response.data && err.response.data.error) {
                    setError(err.response.data.error);
                    window.alert(err.response.data.error);
                } else {
                    setError("Error adding student. Please try again.");
                    window.alert("Error adding student. Please try again.");
                }
            });
        } else {
            setError("Please fill in all fields before submitting.");
            window.alert("Please fill in all fields before submitting.");
        }
    };

    return (
        <div className='add-student-form'>
            <h3>Add Student</h3>
            <input type="text" placeholder="Student ID" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
            <input type="text" placeholder="Student Name" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
            <input type="text" placeholder="Section Number" value={sectionNo} onChange={(e) => setSectionNo(e.target.value)} />
            {error && <p className="error-message">{error}</p>}
            <button className='submit-button' onClick={handleSubmit}>Submit</button>
        </div>
    );
}

export default AddStudent;
