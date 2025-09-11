import React, { useState, useEffect } from 'react';
import Axios from 'axios';

function Feedback() {
  const [feedback, setFeedback] = useState(Array(10).fill(''));
  const [courseNames, setCourseNames] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [error, setError] = useState('');

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
      setError('Failed to fetch course names');
    }
  };

  const questions = [
    "How satisfied are you with the course content?",
    "How would you rate the clarity of the instructor's explanations?",
    "Did the course meet your expectations?",
    "How helpful were the provided learning materials?",
    "Were the assignments/projects relevant and beneficial to your learning?",
    "How satisfied are you with the pace of the course?",
    "How would you rate the accessibility and responsiveness of the instructor?",
    "Did the course effectively prepare you for assessments?",
    "How likely are you to recommend this course to others?",
    "Do you have any suggestions for improving the course?"
  ];

  const options = [
    ["Very satisfied", "Satisfied", "Neutral", "Dissatisfied"],
    ["Very clear", "Clear", "Somewhat clear", "Unclear"],
    ["Yes, it exceeded my expectations", "Yes, it met my expectations", "No, it fell short of my expectations", "No, it did not meet my expectations at all"],
    ["Very helpful", "Helpful", "Somewhat helpful", "Not helpful"],
    ["Highly relevant and beneficial", "Somewhat relevant and beneficial", "Neutral", "Not relevant or beneficial"],
    ["Very satisfied", "Satisfied", "Neutral", "Dissatisfied"],
    ["Excellent", "Good", "Fair", "Poor"],
    ["Yes, very effectively", "Yes, to some extent", "No, not really", "No, not at all"],
    ["Very likely", "Likely", "Unlikely", "Very unlikely"],
    ["Yes", "No"]
  ];

  const handleOptionChange = (questionIndex, optionIndex) => {
    const newFeedback = [...feedback];
    newFeedback[questionIndex] = options[questionIndex][optionIndex];
    setFeedback(newFeedback);
  };

  const handleSubmit = async () => {
    try {
      const response = await Axios.post('http://localhost:5000/feedback', {
        feedback,
        courseName: selectedCourse
      });
      if (response.status === 200) {
        alert("Feedback submitted successfully");
      } else {
        alert("Failed to submit feedback. Please try again later.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Feedback submitted successfully");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Feedback Form
        </h2>

        {error && (
          <p className="text-red-600 text-center mb-4 font-medium">{error}</p>
        )}

        <form className="space-y-6">
          <div>
            <label
              htmlFor="courseSelect"
              className="block font-semibold text-gray-700 mb-2"
            >
              Select Course:
            </label>
            <select
              id="courseSelect"
              onChange={(e) => setSelectedCourse(e.target.value)}
              value={selectedCourse}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {courseNames.map((courseName, index) => (
                <option key={index} value={courseName}>
                  {courseName}
                </option>
              ))}
            </select>
          </div>

          {questions.map((question, index) => (
            <div
              key={index}
              className="bg-gray-50 p-4 rounded-lg border border-gray-200"
            >
              <p className="font-medium text-gray-800 mb-3">
                {index + 1}. {question}
              </p>
              <div className="space-y-2">
                {options[index].map((option, optionIndex) => (
                  <label
                    key={optionIndex}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      checked={feedback[index] === option}
                      onChange={() => handleOptionChange(index, optionIndex)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg shadow-md transition duration-200"
            type="button"
            onClick={handleSubmit}
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
}

export default Feedback;
