// submitAssignment.js
import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import './submitassignment.css'; // Import the CSS file for styling

function SubmitAssignment() {
    const [courseNames, setCourseNames] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [file, setFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchCourseNames();
    }, []);

    const fetchCourseNames = async () => {
        try {
            const response = await Axios.get('http://localhost:5000/viewcourses');
            if (response.status === 200 && response.data.length > 0) {
                setCourseNames(response.data.map(course => course.courseName));
                setSelectedCourse(response.data[0].courseName);
            }
        } catch (error) {
            console.error('Error fetching course names:', error);
            setErrorMessage('Failed to fetch course names');
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = () => {
        if (!file) {
            setErrorMessage('Please select a file to submit');
            return;
        }
    
        if (!selectedCourse) {
            setErrorMessage('Please select a course');
            return;
        }
    
        const formData = new FormData();
        formData.append('file', file);
        formData.append('courseName', selectedCourse);
    
        Axios.post('http://localhost:5000/submitAssignment', formData)
            .then(res => {
                console.log(res.data);
                if (res.data && res.data.success) {
                    window.alert('Assignment submitted successfully');
                } else {
                    window.alert('Failed to submit assignment');
                }
            })
            .catch(err => {
                console.error('Error submitting assignment:', err);
                window.alert('Submitted an assignment');
            });
    };

    return (
        <div className="assignment-container">
            <h3>Submit Assignment</h3>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <div>
                <label htmlFor="courseSelect">Select Course:</label>
                <select id="courseSelect" onChange={(e) => setSelectedCourse(e.target.value)} value={selectedCourse}>
                    {courseNames.map((courseName, index) => (
                        <option key={index} value={courseName}>{courseName}</option>
                    ))}
                </select>
            </div>
            <input className="file-input" type="file" onChange={handleFileChange} />
            <button className="submit-button-1" onClick={handleSubmit}>Submit</button>
        </div>
    );
}

export default SubmitAssignment;