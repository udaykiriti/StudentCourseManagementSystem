import React, { useState, useEffect } from 'react';
import { UserX, Hash, Loader2, ServerCrash, CheckCircle2 } from 'lucide-react';

/**
 * A component for administrators to delete a faculty member from the system by their ID.
 */
function DeleteFaculty() {
    const [facultyId, setFacultyId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // Session check on component mount
    useEffect(() => {
        const sid = sessionStorage.getItem("sid");
        if (!sid) {
            // Use parent to redirect the whole page, not just the iframe
            window.parent.location.replace("/");
        }
    }, []);

    /**
     * Handles the form submission to delete a faculty member.
     */
    const handleDelete = async (event) => {
        event.preventDefault();

        if (!facultyId) {
            setError("Please enter a Faculty ID to delete.");
            return;
        }

        setIsSubmitting(true);
        setError(null);
        setSuccessMessage('');

        try {
            const response = await fetch(`http://localhost:5000/deletefaculty/${facultyId}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to delete faculty.');
            }
            
            setSuccessMessage(`Faculty with ID "${facultyId}" has been deleted successfully!`);
            setFacultyId(''); // Clear the input field

        } catch (err) {
            console.error("Error deleting faculty:", err);
            setError(err.message || "An unexpected error occurred. The faculty ID may not exist.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-slate-50 to-blue-100 min-h-screen w-full p-4 flex items-center justify-center">
            <form onSubmit={handleDelete} className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-200">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800">Delete Faculty</h2>
                    <p className="text-gray-500 mt-2">Enter the ID of the faculty member to remove them.</p>
                </div>

                <div className="space-y-4">
                    {/* Faculty ID Input */}
                    <div>
                        <label htmlFor="faculty-id" className="block text-sm font-medium text-gray-700 mb-2">
                            Faculty ID
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                <Hash className="w-5 h-5" />
                            </div>
                            <input
                                id="faculty-id"
                                type="text"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                                placeholder="Enter Faculty ID"
                                value={facultyId}
                                onChange={(e) => {
                                    setFacultyId(e.target.value);
                                    setError(null);
                                    setSuccessMessage('');
                                }}
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400 disabled:cursor-not-allowed"
                        disabled={isSubmitting || !facultyId}
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserX className="w-5 h-5" />}
                        <span>{isSubmitting ? 'Deleting...' : 'Delete Faculty'}</span>
                    </button>
                </div>

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

export default DeleteFaculty;

