import React, { useState, useEffect } from 'react';
import { Trash2, Loader2, ServerCrash, CheckCircle2 } from 'lucide-react';

/**
 * A component to delete a course from the system.
 * It fetches a list of courses, allows the user to select one,
 * and then sends a request to delete the selected course.
 */
function DeleteCourse() {
    const [courseData, setCourseData] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch course data when the component mounts
    useEffect(() => {
        fetchCourseData();
    }, []);

    /**
     * Fetches the list of available courses from the server.
     */
    const fetchCourseData = async () => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage('');
        try {
            const response = await fetch("http://localhost:5000/viewcourses");
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setCourseData(data);
        } catch (err) {
            console.error("Error fetching course data:", err);
            setError("Failed to load courses. Please check the connection and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Handles changes to the course selection dropdown.
     * @param {React.ChangeEvent<HTMLSelectElement>} event - The select change event.
     */
    const handleSelectCourse = (event) => {
        setSelectedCourse(event.target.value);
        setError(null); // Clear previous errors on new selection
        setSuccessMessage(''); // Clear success message on new selection
    };

    /**
     * Handles the course deletion process when the delete button is clicked.
     */
    const handleDeleteCourse = async () => {
        if (!selectedCourse) {
            setError("Please select a course to delete.");
            return;
        }

        setIsDeleting(true);
        setError(null);
        setSuccessMessage('');

        try {
            const response = await fetch("http://localhost:5000/deletecourse", {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ courseName: selectedCourse }),
            });

            if (!response.ok) {
                 const errorData = await response.json();
                 throw new Error(errorData.message || 'Failed to delete the course.');
            }

            const result = await response.json();
            console.log("Course deleted successfully:", result);
            setSuccessMessage(`Course "${selectedCourse}" deleted successfully!`);
            
            // Refresh course data after deletion and reset selection
            fetchCourseData(); 
            setSelectedCourse('');

        } catch (err) {
            console.error("Error deleting course:", err);
            setError(err.message || "An unexpected error occurred. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };
    
    // Main component render
    return (
        <div className="bg-gradient-to-br from-slate-50 to-blue-100 min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-200">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800">Delete Course</h2>
                    <p className="text-gray-500 mt-2">Select a course from the list to permanently remove it.</p>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center space-x-2 text-gray-600 p-4">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Loading Courses...</span>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="course-select" className="block text-sm font-medium text-gray-700 mb-2">
                                Course Name
                            </label>
                            <select
                                id="course-select"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                                onChange={handleSelectCourse}
                                value={selectedCourse}
                                disabled={isDeleting}
                            >
                                <option value="">-- Select a Course --</option>
                                {courseData.map((course, index) => (
                                    <option key={index} value={course.courseName}>
                                        {course.courseName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <button
                            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400 disabled:cursor-not-allowed"
                            onClick={handleDeleteCourse}
                            disabled={isDeleting || !selectedCourse}
                        >
                            {isDeleting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Trash2 className="w-5 h-5" />
                            )}
                            <span>{isDeleting ? 'Deleting...' : 'Delete Course'}</span>
                        </button>
                    </div>
                )}

                {/* Status Messages */}
                {error && (
                    <div className="flex items-center space-x-3 bg-red-50 text-red-700 p-3 rounded-lg border border-red-200">
                         <ServerCrash className="w-5 h-5 flex-shrink-0"/>
                         <p className="text-sm font-medium">{error}</p>
                    </div>
                )}
                {successMessage && (
                     <div className="flex items-center space-x-3 bg-green-50 text-green-700 p-3 rounded-lg border border-green-200">
                         <CheckCircle2 className="w-5 h-5 flex-shrink-0"/>
                         <p className="text-sm font-medium">{successMessage}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DeleteCourse;
