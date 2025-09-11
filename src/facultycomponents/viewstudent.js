import React, { useState, useEffect } from 'react';
import { Loader2, ServerCrash, Users, Info } from 'lucide-react';

/**
 * A component for faculty to view a list of all enrolled students.
 */
function ViewStudents() {
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const sid = sessionStorage.getItem("sid");
        if (!sid) {
            window.parent.location.replace("/");
            return;
        }

        const fetchStudents = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch("http://localhost:5000/viewstudents");
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setStudents(data);
            } catch (err) {
                console.error("Error fetching students:", err);
                setError("Failed to fetch student data. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
                    <p className="text-lg font-medium">Loading Students...</p>
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

        if (students.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500 bg-gray-50 rounded-lg">
                    <Info className="w-12 h-12 mb-4" />
                    <p className="text-lg font-bold">No Students Found</p>
                    <p>There are currently no students to display.</p>
                </div>
            );
        }

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {['Student ID', 'Student Name', 'Section'].map(header => (
                                <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {students.map((student, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.studentId}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.studentName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.sectionNo}</td>
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
                        <Users className="w-8 h-8 mr-3 text-blue-600"/>
                        Student Roster
                    </h2>
                    <p className="text-gray-600 mt-2">A complete list of all enrolled students.</p>
                </header>
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

export default ViewStudents;
