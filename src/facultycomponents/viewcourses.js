import React, { useState, useEffect } from 'react';
import { Loader2, ServerCrash, Book, Info, X } from 'lucide-react';

/**
 * A component for faculty to view all available courses in the system.
 * Includes a modal to view full course descriptions.
 */
function ViewCourses() {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    useEffect(() => {
        const sid = sessionStorage.getItem("sid");
        if (!sid) {
            window.parent.location.replace("/");
            return;
        }
        
        const fetchCourses = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch("http://localhost:5000/viewcourses");
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setCourses(data);
            } catch (err) {
                console.error("Error fetching courses:", err);
                setError("Failed to fetch course data. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const openModal = (course) => {
        setSelectedCourse(course);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        // Delay clearing to allow for fade-out animation
        setTimeout(() => setSelectedCourse(null), 300);
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
                    <p className="text-lg font-medium">Loading Courses...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center h-64 text-red-600 bg-red-50 rounded-lg">
                    <ServerCrash className="w-12 h-12 mb-4" />
                    <p className="text-lg font-bold">An Error Occurred</p>
                    <p>{error}</p>
                </div>
            );
        }

        if (courses.length === 0) {
            return (
                 <div className="flex flex-col items-center justify-center h-64 text-gray-500 bg-gray-50 rounded-lg">
                    <Info className="w-12 h-12 mb-4" />
                    <p className="text-lg font-bold">No Courses Found</p>
                    <p>There are currently no courses to display.</p>
                </div>
            );
        }

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {['Course Name', 'Code', 'Section', 'Faculty', 'Semester', 'Year', 'Description'].map(header => (
                                <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {courses.map((course, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course.courseName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{course.courseCode}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{course.sectionNumber}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{course.facultyName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{course.semester}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{course.year}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                     <button
                                        onClick={() => openModal(course)}
                                        className="text-left text-blue-600 hover:underline focus:outline-none"
                                        title="Click to view full description"
                                    >
                                        Click to see description
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="bg-gradient-to-br from-slate-50 to-blue-100 min-h-screen w-full p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight flex items-center">
                        <Book className="w-8 h-8 mr-3 text-blue-600"/>
                        Course Catalog
                    </h2>
                    <p className="text-gray-600 mt-2">A comprehensive list of all available courses.</p>
                </header>
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    {renderContent()}
                </div>
            </div>

            {/* Description Modal */}
            <div className={`fixed inset-0 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ${isModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeModal}></div>
                <div className={`bg-white rounded-2xl shadow-xl w-full max-w-lg transition-all duration-300 ${isModalOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}>
                    {selectedCourse && (
                         <div className="p-6 relative">
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                               <Info className="w-6 h-6 mr-3 text-blue-600 flex-shrink-0"/>
                               <span>{selectedCourse.courseName}</span>
                            </h3>
                            <div className="text-gray-600 max-h-80 overflow-y-auto pr-2">
                                <p className="whitespace-pre-wrap">{selectedCourse.description}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}

export default ViewCourses;


