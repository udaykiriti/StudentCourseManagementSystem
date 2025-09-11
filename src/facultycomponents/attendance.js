import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, ServerCrash, CheckCircle2, ClipboardList, Send, BookOpen, Info } from 'lucide-react';

/**
 * A component for faculty to take and submit attendance for a selected course.
 */
function Attendance() {
    // State based on the original component's logic
    const [students, setStudents] = useState([]);
    const [attendanceList, setAttendanceList] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');

    // UI states
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const sid = sessionStorage.getItem("sid");
        if (!sid) {
            window.parent.location.replace("/");
            return;
        }

        const fetchStudents = async () => {
            try {
                const response = await axios.get('http://localhost:5000/viewstudents');
                setStudents(response.data);
                // Set initial attendance list based on student data, defaulting to absent (false)
                const initialAttendanceList = response.data.map(student => ({
                    studentId: student.studentId,
                    studentName: student.studentName,
                    present: false
                }));
                setAttendanceList(initialAttendanceList);
            } catch (error) {
                console.error('Error fetching students:', error);
                // Set an error message that will be displayed to the user
                setError('Failed to fetch student data.');
                throw error; // Throw error to be caught by the main fetch function
            }
        };

        const fetchCourses = async () => {
            try {
                const response = await axios.get('http://localhost:5000/viewcourses');
                const coursesData = response.data;
                if (coursesData && coursesData.length > 0) {
                    setCourses(coursesData);
                    setSelectedCourse(coursesData[0].courseName);
                } else {
                    setError('No courses available to take attendance for.');
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
                setError('Failed to fetch course data.');
                throw error;
            }
        };

        const loadAllData = async () => {
            setIsLoading(true);
            setError('');
            try {
                await fetchStudents();
                await fetchCourses();
            } catch (err) {
                console.error("A failure occurred during data loading:", err);
                // Error state is already set by individual fetch functions
            } finally {
                setIsLoading(false);
            }
        };

        loadAllData();
    }, []);

    const handleToggle = (studentId) => {
        const updatedAttendanceList = attendanceList.map(student => {
            if (student.studentId === studentId) {
                return { ...student, present: !student.present };
            }
            return student;
        });
        setAttendanceList(updatedAttendanceList);
    };

    const handleSelectAll = (isPresent) => {
        const updatedAttendanceList = attendanceList.map(student => ({
            ...student,
            present: isPresent
        }));
        setAttendanceList(updatedAttendanceList);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedCourse) {
            setError('Please select a course before submitting.');
            return;
        }

        setIsSubmitting(true);
        setError('');
        setSuccessMessage('');

        try {
            const formattedAttendanceData = attendanceList.map(student => ({
                studentId: student.studentId,
                // Sending a boolean as this is what the ViewAttendance component expects
                attendanceStatus: student.present, 
            }));

            const requestBody = {
                course: selectedCourse,
                attendanceData: formattedAttendanceData,
            };

            const response = await axios.post('http://localhost:5000/submitattendance', requestBody);

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Failed to submit attendance.');
            }

            setSuccessMessage(`Attendance for "${selectedCourse}" submitted successfully!`);
            // You can use the styled success message or fall back to the alert:
            // window.alert('Attendance added successfully');

        } catch (error) {
            console.error('Error submitting attendance:', error);
            setError(error.response?.data?.message || error.message || 'An unexpected error occurred during submission.');
            // You can use the styled error message or fall back to the alert:
            // window.alert('Error submitting attendance.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderContent = () => {
         if (isLoading) {
            return <div className="flex justify-center items-center h-64"><Loader2 className="w-10 h-10 animate-spin text-blue-600"/></div>;
        }
        if (error && students.length === 0) {
            return <div className="text-center py-10 text-red-600 bg-red-50 rounded-lg"><ServerCrash className="mx-auto w-12 h-12 mb-2"/>{error}</div>;
        }
        if (students.length === 0) {
            return <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg"><Info className="mx-auto w-12 h-12 mb-2"/>No students found to mark attendance.</div>;
        }

        return (
             <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                     <div>
                        <label htmlFor="courseSelect" className="block text-md font-semibold text-gray-800 mb-2">
                           <BookOpen className="inline-block w-5 h-5 mr-2 text-blue-600"/> Course
                        </label>
                        <select
                            id="courseSelect"
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {courses.map(course => <option key={course._id} value={course.courseName}>{course.courseName}</option>)}
                        </select>
                    </div>
                    
                    <div className="border-t border-b border-gray-200 divide-y divide-gray-200">
                        <div className="p-4 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-gray-700">Student List</h3>
                            <div className="flex items-center space-x-2">
                                <button type="button" onClick={() => handleSelectAll(true)} className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200">All Present</button>
                                <button type="button" onClick={() => handleSelectAll(false)} className="px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200">All Absent</button>
                            </div>
                        </div>

                        <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                            {students.map(student => {
                                const attendanceRecord = attendanceList.find(s => s.studentId === student.studentId);
                                const isPresent = attendanceRecord ? attendanceRecord.present : false;
                                return (
                                <li key={student.studentId} className="p-4 flex justify-between items-center">
                                    <div>
                                        <p className="font-medium text-gray-800">{student.studentName}</p>
                                        <p className="text-sm text-gray-500">ID: {student.studentId}</p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span className={`text-sm font-semibold ${isPresent ? 'text-green-600' : 'text-red-600'}`}>
                                            {isPresent ? 'Present' : 'Absent'}
                                        </span>
                                        <button type="button" onClick={() => handleToggle(student.studentId)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isPresent ? 'bg-blue-600' : 'bg-gray-300'}`}>
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isPresent ? 'translate-x-6' : 'translate-x-1'}`}/>
                                        </button>
                                    </div>
                                </li>
                            )})}
                        </ul>
                    </div>

                    {error && <div className="text-sm text-center font-medium text-red-600 p-3 bg-red-50 rounded-lg"><ServerCrash className="inline w-4 h-4 mr-2"/>{error}</div>}
                    {successMessage && <div className="text-sm text-center font-medium text-green-600 p-3 bg-green-50 rounded-lg"><CheckCircle2 className="inline w-4 h-4 mr-2"/>{successMessage}</div>}

                    <button type="submit" disabled={isSubmitting || !selectedCourse} className="w-full flex justify-center items-center space-x-2 py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors">
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin"/> : <Send className="w-5 h-5"/>}
                        <span>{isSubmitting ? 'Submitting...' : 'Submit Attendance'}</span>
                    </button>
                </form>
            </div>
        );
    }
    
    return (
        <div className="bg-gradient-to-br from-slate-50 to-blue-100 min-h-screen w-full p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="text-center mb-8">
                    <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight flex items-center justify-center">
                        <ClipboardList className="w-8 h-8 mr-3 text-blue-600"/>
                        Mark Attendance
                    </h2>
                    <p className="text-gray-600 mt-2">Select a course and mark the attendance for each student.</p>
                </header>
                {renderContent()}
            </div>
        </div>
    );
};

export default Attendance;

