import React, { useState } from 'react';
import Axios from 'axios';
import { User, Building, CheckCircle, AlertCircle, UserPlus, Hash } from 'lucide-react';


function AddFaculty() {
    const [facultyId, setFacultyId] = useState('');
    const [facultyName, setFacultyName] = useState('');
    const [department, setDepartment] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (facultyId && facultyName && department) {
            setIsLoading(true);
            setError('');
            
            try {
                const url = "http://localhost:5000/addfaculty";
                await Axios.post(url, {
                    facultyId: facultyId,
                    facultyName: facultyName,
                    department: department
                });
                
                window.alert("Faculty Added Successfully");
                setFacultyId('');
                setFacultyName('');
                setDepartment('');
                setError('');
            } catch (err) {
                console.error("Error adding faculty:", err);
                window.alert("Error adding faculty. Please try again.");
            } finally {
                setIsLoading(false);
            }
        } else {
            window.alert("Please fill in all fields before submitting.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center space-x-3">
                        <UserPlus className="w-8 h-8 text-blue-600" />
                        <h2 className="text-2xl font-bold text-gray-800">Add New Faculty</h2>
                    </div>
                    <p className="text-gray-600 mt-2">Fill in the details below to add a new faculty member</p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <div className="space-y-6">
                        {/* Faculty ID Field */}
                        <div className="space-y-2">
                            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                <Hash className="w-4 h-4" />
                                <span>Faculty ID</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter Faculty ID"
                                value={facultyId}
                                onChange={(e) => setFacultyId(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-800 placeholder-gray-400"
                            />
                        </div>

                        {/* Faculty Name Field */}
                        <div className="space-y-2">
                            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                <User className="w-4 h-4" />
                                <span>Faculty Name</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter Faculty Name"
                                value={facultyName}
                                onChange={(e) => setFacultyName(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-800 placeholder-gray-400"
                            />
                        </div>

                        {/* Department Field */}
                        <div className="space-y-2">
                            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                <Building className="w-4 h-4" />
                                <span>Department</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter Department"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-800 placeholder-gray-400"
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <AlertCircle className="w-5 h-5 text-red-500" />
                                <p className="text-red-700 text-sm font-medium">{error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                                isLoading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                            } text-white shadow-sm hover:shadow-md`}
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Adding Faculty...</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Add Faculty</span>
                                </>
                            )}
                        </button>

                        {/* Help Text */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-blue-800 text-sm">
                                <strong>Note:</strong> Make sure all fields are filled correctly. The Faculty ID should be unique and the department name should match existing department records.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddFaculty;