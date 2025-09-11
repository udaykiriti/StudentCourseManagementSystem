import React, { useState, useEffect } from 'react';
import { Loader2, ServerCrash, ClipboardCheck, Info } from 'lucide-react';

/**
 * A component for faculty to view student attendance records across different courses.
 */
function ViewAttendance() {
    const [attendanceData, setAttendanceData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const sid = sessionStorage.getItem("sid");
        if (!sid) {
            window.parent.location.replace("/");
            return;
        }

        const fetchAttendanceData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch('http://localhost:5000/viewattendance');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setAttendanceData(data);
            } catch (err) {
                console.error('Error fetching attendance data:', err);
                setError('Failed to fetch attendance data. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAttendanceData();
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
                    <p className="text-lg font-medium">Loading Attendance Records...</p>
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

        if (attendanceData.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500 bg-gray-50 rounded-lg">
                    <Info className="w-12 h-12 mb-4" />
                    <p className="text-lg font-bold">No Attendance Records Found</p>
                    <p>There is currently no attendance data to display.</p>
                </div>
            );
        }

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {['Course Name', 'Student ID', 'Status'].map(header => (
                                <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {attendanceData.flatMap((courseAttendance, index) =>
                            courseAttendance.attendanceData.map((attendance, idx) => (
                                <tr key={`${index}-${idx}`} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{courseAttendance.course}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{attendance.studentId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            attendance.attendanceStatus 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                        }`}>
                                            {attendance.attendanceStatus ? 'Present' : 'Absent'}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
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
                        <ClipboardCheck className="w-8 h-8 mr-3 text-blue-600"/>
                        Attendance Records
                    </h2>
                    <p className="text-gray-600 mt-2">A detailed log of student attendance for all courses.</p>
                </header>
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default ViewAttendance;
