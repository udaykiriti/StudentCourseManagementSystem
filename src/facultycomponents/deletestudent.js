import React, { useState, useEffect } from 'react';
import { Trash2, Loader2, ServerCrash, CheckCircle2, UserX, Hash } from 'lucide-react';

/**
 * A component for faculty to delete a student from the system by their ID.
 */
function DeleteStudent() {
    const [studentId, setStudentId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const sid = sessionStorage.getItem("sid");
        if (!sid) {
            // Redirect to login if not authenticated, ensuring the parent page redirects
            window.parent.location.replace("/");
        }
    }, []);

    const handleDelete = async (event) => {
        event.preventDefault(); // Prevent default form submission
        
        if (!studentId.trim()) {
            setError("Please enter a Student ID before submitting.");
            return;
        }

        setIsSubmitting(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await fetch(`http://localhost:5000/deletestudent/${studentId}`, {
                method: 'DELETE',
            });
            
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to delete student.');
            }
            
            setSuccessMessage(`Student with ID "${studentId}" has been deleted successfully!`);
            setStudentId(''); // Clear the input field on success

        } catch (err) {
            console.error("Error deleting student:", err);
            setError(err.message || "An unexpected error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-slate-50 to-blue-100 min-h-screen w-full flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                 <form onSubmit={handleDelete} className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 space-y-6">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                           <UserX className="w-8 h-8 text-blue-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">Delete Student</h2>
                        <p className="text-gray-500 mt-2">Enter the ID of the student you wish to remove.</p>
                    </div>
                    
                    <div>
                        <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-2">
                            Student ID
                        </label>
                        <div className="relative">
                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <Hash className="w-5 h-5"/>
                            </div>
                            <input 
                                type="text" 
                                id="studentId"
                                placeholder="Enter Student ID" 
                                value={studentId} 
                                onChange={(e) => {
                                    setStudentId(e.target.value);
                                    setError('');
                                    setSuccessMessage('');
                                }}
                                disabled={isSubmitting}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:bg-gray-200"
                            />
                        </div>
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

                    <button
                        type="submit"
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
                        disabled={isSubmitting || !studentId}
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                        <span>{isSubmitting ? 'Deleting...' : 'Delete Student'}</span>
                    </button>
                </form>
            </div>
        </div>
    );
}

export default DeleteStudent;

