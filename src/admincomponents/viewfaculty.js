import React, { useState, useEffect } from 'react';
import { Users, Loader2, ServerCrash, ShieldAlert } from 'lucide-react';

/**
 * A component to display a list of all faculty members in the system.
 */
function ViewFaculty() {
    const [facultyList, setFacultyList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Session check on component mount
    useEffect(() => {
        const sid = sessionStorage.getItem("sid");
        if (!sid) {
            // Use parent to redirect the whole page, not just the iframe
            window.parent.location.replace("/");
            return; // Stop execution if not logged in
        }
        fetchFacultyData();
    }, []);

    /**
     * Fetches the list of faculty members from the server.
     */
    const fetchFacultyData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch("http://localhost:5000/getfaculty");
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setFacultyList(data);
        } catch (err) {
            console.error("Error fetching faculty data:", err);
            setError("Failed to load faculty list. Please try refreshing the page.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-slate-50 to-blue-100 min-h-full w-full p-4 lg:p-6 flex items-start justify-center">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">Faculty List</h2>
                    <p className="text-gray-500 mt-1">A comprehensive list of all faculty members.</p>
                </div>

                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="flex items-center justify-center space-x-2 text-gray-600 p-8">
                            <Loader2 className="w-6 h-6 animate-spin" />
                            <span className="text-lg">Loading Faculty...</span>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center space-y-3 text-red-600 p-8">
                            <ServerCrash className="w-10 h-10" />
                            <p className="text-lg font-medium text-center">{error}</p>
                        </div>
                    ) : facultyList.length === 0 ? (
                        <div className="flex flex-col items-center justify-center space-y-3 text-gray-500 p-8">
                             <ShieldAlert className="w-10 h-10" />
                             <p className="text-lg font-medium text-center">No Faculty Found</p>
                             <p className="text-center text-sm">There are currently no faculty members to display.</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm text-left text-gray-700">
                            <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Faculty ID</th>
                                    <th scope="col" className="px-6 py-3">Name</th>
                                    <th scope="col" className="px-6 py-3">Department</th>
                                </tr>
                            </thead>
                            <tbody>
                                {facultyList.map((faculty, index) => (
                                    <tr key={index} className="bg-white border-b hover:bg-blue-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{faculty.facultyId}</td>
                                        <td className="px-6 py-4">{faculty.facultyName}</td>
                                        <td className="px-6 py-4">{faculty.department}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ViewFaculty;
