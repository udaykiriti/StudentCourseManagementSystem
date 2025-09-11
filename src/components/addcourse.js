import React, { useState, useEffect } from 'react';
import { BookPlus, Loader2, ServerCrash, CheckCircle2, User, Calendar, Hash, BookCopy } from 'lucide-react';

/**
 * A component to add a new course instance to the system.
 * It fetches a list of predefined course names and populates related data.
 * The user can then submit this information to add the course.
 */
function AddCourse() {
    const [courseNames, setCourseNames] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [semester, setSemester] = useState('');
    const [facultyName, setFacultyName] = useState('');
    const [academicYear, setAcademicYear] = useState('');
    const [sectionNumber, setSectionNumber] = useState('');

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch course names when the component mounts
    useEffect(() => {
        fetchCourseNames();
    }, []);

    /**
     * Fetches the list of predefined course names from the server.
     */
    const fetchCourseNames = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch("http://localhost:5000/coursenames");
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setCourseNames(data);
        } catch (err) {
            console.error("Error fetching course names:", err);
            setError("Failed to load course list. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Handles course selection and auto-fills related form fields.
     * @param {React.ChangeEvent<HTMLSelectElement>} event - The select change event.
     */
    const handleSelectCourse = (event) => {
        const courseName = event.target.value;
        setSelectedCourse(courseName);
        setError(null);
        setSuccessMessage('');

        if (courseName) {
            const selectedData = courseNames.find(course => course.courseName === courseName);
            if (selectedData) {
                setSemester(selectedData.semester || '');
                setFacultyName(selectedData.facultyName || '');
                setAcademicYear(selectedData.year || '');
                setSectionNumber(selectedData.sectionNumber || '');
            }
        } else {
            // Clear fields if no course is selected
            setSemester('');
            setFacultyName('');
            setAcademicYear('');
            setSectionNumber('');
        }
    };

    /**
     * Handles the form submission to add a new course.
     */
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission
        
        if (!selectedCourse || !semester || !facultyName || !academicYear || !sectionNumber) {
            setError("Please fill in all fields before submitting.");
            return;
        }

        setIsSubmitting(true);
        setError(null);
        setSuccessMessage('');

        try {
            const response = await fetch("http://localhost:5000/addcourse", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    course: selectedCourse,
                    semester,
                    facultyName,
                    academicYear,
                    sectionNumber
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add the course.');
            }
            
            const result = await response.json();
            console.log("Course added successfully:", result);
            setSuccessMessage(`Course "${selectedCourse}" has been added successfully!`);

            // Clear the form
            setSelectedCourse('');
            setSemester('');
            setFacultyName('');
            setAcademicYear('');
            setSectionNumber('');

        } catch (err) {
            console.error("Error adding course:", err);
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-slate-50 to-blue-100 min-h-screen flex items-center justify-center p-4">
            <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-200">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800">Add New Course</h2>
                    <p className="text-gray-500 mt-2">Select a course to auto-fill details, then submit.</p>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center space-x-2 text-gray-600 p-4">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Loading Course List...</span>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Course Selection */}
                        <div>
                            <label htmlFor="course-select" className="block text-sm font-medium text-gray-700 mb-2">
                                Course Name
                            </label>
                            <select
                                id="course-select"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                onChange={handleSelectCourse}
                                value={selectedCourse}
                                disabled={isSubmitting}
                            >
                                <option value="">-- Select a Course --</option>
                                {courseNames.map((course, index) => (
                                    <option key={index} value={course.courseName}>
                                        {course.courseName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Auto-filled fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField icon={<BookCopy/>} label="Semester" value={semester} onChange={setSemester} disabled={isSubmitting} />
                            <InputField icon={<User/>} label="Faculty Name" value={facultyName} onChange={setFacultyName} disabled={isSubmitting} />
                            <InputField icon={<Calendar/>} label="Academic Year" value={academicYear} onChange={setAcademicYear} disabled={isSubmitting} />
                            <InputField icon={<Hash/>} label="Section Number" value={sectionNumber} onChange={setSectionNumber} disabled={isSubmitting} />
                        </div>
                        
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
                            disabled={isSubmitting || !selectedCourse}
                        >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <BookPlus className="w-5 h-5" />}
                            <span>{isSubmitting ? 'Adding...' : 'Add Course'}</span>
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
            </form>
        </div>
    );
}

// Helper component for input fields
const InputField = ({ icon, label, value, onChange, disabled }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                {React.cloneElement(icon, { className: 'w-5 h-5' })}
            </div>
            <input 
                type="text" 
                placeholder={label} 
                value={value} 
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-200"
            />
        </div>
    </div>
);


export default AddCourse;
