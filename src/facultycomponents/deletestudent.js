// DeleteStudent.js
import React, { useState } from 'react';
import './deletestudent.css'; // Import the CSS file for styling
import Axios from 'axios';

function DeleteStudent() {
    const [studentId, setStudentId] = useState('');

    const handleDelete = () => {
        if (studentId) {
            const url = `http://localhost:5000/deletestudent/${studentId}`;
            Axios.delete(url)
                .then(res => {
                    console.log("Student deleted successfully:", res.data);
                    // Optionally, you can reset the form field after successful deletion
                    setStudentId('');
                })
                .catch(err => {
                    console.error("Error deleting student:", err);
                });
        } else {
            console.error("Please fill in the Student ID before submitting.");
        }
    };

    return (
        <div className='delete-student-form'>
            <h3>Delete Student</h3>
            <input type="text" placeholder="Student ID" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
            <button className='delete-button' onClick={handleDelete}>Delete</button>
        </div>
    );
}

export default DeleteStudent;
