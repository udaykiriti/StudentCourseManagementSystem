import React, { useState, useEffect } from 'react';
import { Book, Loader2, ServerCrash, SearchX, User, Hash, Calendar, Layers } from 'lucide-react';

/**
 * A component for students to view the courses they have selected.
 */
function ViewCourses() {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const sid = sessionStorage.getItem("sid");
        if (!sid) {
            // Redirect to login if not authenticated
            window.parent.location.replace("/");
            return;
        }

        const fetchStudentCourses = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch("http://localhost:5000/studentcourse");
                if (!response.ok) {
                    throw new Error("Network response was not successful.");
                }
                const data = await response.json();
                setCourses(data);
            } catch (err) {
                console.error("Error fetching student courses:", err);
                setError("Failed to fetch your course data. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudentCourses();
    }, []);

    return (
        <div className="bg-gradient-to-br from-slate-50 to-blue-100 min-h-screen w-full p-4 sm:p-8 flex items-center justify-center">
            <div className="w-full max-w-5xl">
                <header className="text-center mb-8">
                    <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight">My Enrolled Courses</h2>
                    <p className="text-gray-600 mt-3">Here is a list of the courses you are currently enrolled in.</p>
                </header>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    {isLoading ? (
                        <div className="flex items-center justify-center space-x-3 text-gray-600 p-12">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                            <span className="text-lg font-medium">Loading Your Courses...</span>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center space-y-3 text-red-600 text-center p-12">
                            <ServerCrash className="w-12 h-12" />
                            <p className="text-lg font-semibold">{error}</p>
                        </div>
                    ) : courses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center space-y-3 text-gray-500 text-center p-12">
                            <SearchX className="w-12 h-12" />
                            <h3 className="text-xl font-semibold">No Courses Found</h3>
                            <p>You have not enrolled in any courses yet.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider"><Book className="inline-block w-4 h-4 mr-2"/>Course Name</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider"><Hash className="inline-block w-4 h-4 mr-2"/>Section</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider"><User className="inline-block w-4 h-4 mr-2"/>Faculty</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider"><Layers className="inline-block w-4 h-4 mr-2"/>Semester</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider"><Calendar className="inline-block w-4 h-4 mr-2"/>Year</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {courses.map((course, index) => (
                                        <tr key={index} className="hover:bg-blue-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">{course.course}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{course.sectionNumber}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{course.facultyName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{course.semester}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{course.academicYear}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ViewCourses;
