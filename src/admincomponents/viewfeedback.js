import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import './viewfeedback.css'

function AdminFeedback() {
  const [feedbackData, setFeedbackData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeedbackData();
  }, []);

  const fetchFeedbackData = async () => {
    try {
      const response = await Axios.get('http://localhost:5000/viewfeedback');
      if (response.status === 200) {
        setFeedbackData(response.data);
      }
    } catch (error) {
      console.error('Error fetching feedback data:', error);
      setError('Failed to fetch feedback data');
    }
  };

  return (
    <div>
      <h2>Feedback Data</h2>
      {error && <p>Error: {error}</p>}
      <ul>
        {feedbackData.map((feedback, index) => (
          <li key={index}>
            <p>Course: {feedback.courseName}</p>
            <p>Feedback: {JSON.stringify(feedback.feedback)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminFeedback;