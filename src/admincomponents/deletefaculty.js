import React, { useState } from 'react';
import './deletefaculty.css'; // Import the CSS file for styling
import Axios from 'axios';

function DeleteFaculty() {
    const [facultyId, setFacultyId] = useState('');

    const handleDelete = () => {
        if (facultyId) {
            const url = `http://localhost:5000/deletefaculty/${facultyId}`;
            Axios.delete(url)
                .then(res => {
                    console.log("Faculty deleted successfully:", res.data);
                    // Show alert after successful deletion
                    window.alert("Faculty deleted successfully");
                    // Optionally, you can reset the form field after successful deletion
                    setFacultyId('');
                })
                .catch(err => {
                    console.error("Error deleting faculty:", err);
                });
        } else {
            console.error("Please fill in the Faculty ID before submitting.");
        }
    };

    return (
        <div className='delete-faculty-form'>
            <h3>Delete Faculty</h3>
            <input type="text" placeholder="Faculty ID" value={facultyId} onChange={(e) => setFacultyId(e.target.value)} />
            <button className='delete-button' onClick={handleDelete}>Delete</button>
        </div>
    );
}

export default DeleteFaculty;
