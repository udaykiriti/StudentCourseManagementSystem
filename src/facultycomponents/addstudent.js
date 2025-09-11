import React, { useState, useEffect } from 'react';
import { UserPlus, Loader2, ServerCrash, CheckCircle2, Hash, User, ListTree } from 'lucide-react';

/**
 * A component for faculty to add a new student to the system.
 */
function AddStudent() {
    const [studentId, setStudentId] = useState('');
    const [studentName, setStudentName] = useState('');
    const [sectionNo, setSectionNo] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const sid = sessionStorage.getItem("sid");
        if (!sid) {
            // Redirect to login if not authenticated
            window.parent.location.replace("/");
        }
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!studentId || !studentName || !sectionNo) {
            setError("Please fill in all fields before submitting.");
            return;
        }

        setIsSubmitting(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await fetch("http://localhost:5000/addstudent", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId,
                    studentName,
                    sectionNo
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to add student.');
            }
            
            setSuccessMessage(`Student "${studentName}" has been added successfully!`);
            // Clear the form fields
            setStudentId('');
            setStudentName('');
            setSectionNo('');

        } catch (err) {
            console.error("Error adding student:", err);
            setError(err.message || "An unexpected error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-slate-50 to-blue-100 min-h-screen w-full flex items-center justify-center p-4">
            <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-200">
                <header className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800">Add New Student</h2>
                    <p className="text-gray-500 mt-2">Enter the details of the student to enroll them.</p>
                </header>

                <div className="space-y-4">
                    <InputField
                        icon={<Hash />}
                        label="Student ID"
                        value={studentId}
                        onChange={setStudentId}
                        placeholder="e.g., 2100030123"
                        disabled={isSubmitting}
                    />
                    <InputField
                        icon={<User />}
                        label="Student Name"
                        value={studentName}
                        onChange={setStudentName}
                        placeholder="e.g., John Doe"
                        disabled={isSubmitting}
                    />
                    <InputField
                        icon={<ListTree />}
                        label="Section Number"
                        value={sectionNo}
                        onChange={setSectionNo}
                        placeholder="e.g., C01"
                        disabled={isSubmitting}
                    />
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
                    disabled={isSubmitting}
                >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
                    <span>{isSubmitting ? 'Adding Student...' : 'Add Student'}</span>
                </button>
            </form>
        </div>
    );
}

// Helper component for consistent input fields
const InputField = ({ icon, label, value, onChange, placeholder, disabled }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                {React.cloneElement(icon, { className: 'w-5 h-5' })}
            </div>
            <input 
                type="text" 
                placeholder={placeholder} 
                value={value} 
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-200"
            />
        </div>
    </div>
);

export default AddStudent;

