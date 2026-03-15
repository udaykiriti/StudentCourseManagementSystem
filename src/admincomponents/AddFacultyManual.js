import React, { useState } from 'react';
import { Save, RefreshCw, CheckCircle, AlertCircle, Sparkles, Plus, Trash2 } from 'lucide-react';

const DEPARTMENT_OPTIONS = [
    'Computer Science',
    'Electronics',
    'Mechanical',
    'Civil',
    'Electrical',
    'IT',
    'MBA',
    'Science'
];

const DESIGNATION_OPTIONS = [
    'Professor',
    'Associate Professor',
    'Assistant Professor',
    'Lecturer',
    'Senior Lecturer',
    'Guest Faculty'
];

const EMPLOYEE_TYPE_OPTIONS = ['Permanent', 'Contract', 'Guest'];
const GENDER_OPTIONS = ['Male', 'Female', 'Other'];

function AddFacultyManual({ onSuccess }) {
    const [formData, setFormData] = useState({
        joiningYear: new Date().getFullYear(),
        department: '',
        designation: '',
        employeeType: 'Permanent',
        firstName: '',
        middleName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        primaryMobile: '',
        personalEmail: ''
    });

    const [qualifications, setQualifications] = useState([
        { degree: '', university: '', specialization: '', yearOfPassing: '' }
    ]);

    const [generatedData, setGeneratedData] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleQualificationChange = (index, field, value) => {
        const updated = [...qualifications];
        updated[index][field] = value;
        setQualifications(updated);
    };

    const addQualification = () => {
        setQualifications([
            ...qualifications,
            { degree: '', university: '', specialization: '', yearOfPassing: '' }
        ]);
    };

    const removeQualification = (index) => {
        if (qualifications.length > 1) {
            setQualifications(qualifications.filter((_, i) => i !== index));
        }
    };

    const generateFacultyId = async () => {
        if (!formData.joiningYear || !formData.department) {
            setMessage({ type: 'error', text: 'Please select Joining Year and Department first' });
            return;
        }

        setIsGenerating(true);
        setMessage({ type: '', text: '' });

        const year = formData.joiningYear;
        const deptCode = formData.department === 'Computer Science' ? 'CSE' :
            formData.department === 'Electronics' ? 'ECE' :
                formData.department === 'Mechanical' ? 'MECH' :
                    formData.department === 'Civil' ? 'CIVI' :
                        formData.department.toUpperCase().slice(0, 3);

        const previewId = `FAC-${year}-${deptCode}-XXX`;
        const previewEmail = `${previewId.toLowerCase()}@university.edu`;

        setGeneratedData({
            facultyId: previewId,
            universityEmail: previewEmail,
            note: 'Final ID will be generated upon submission'
        });

        setIsGenerating(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (!formData.firstName || !formData.lastName || !formData.dateOfBirth ||
            !formData.gender || !formData.primaryMobile) {
            setMessage({ type: 'error', text: 'Please fill all required fields' });
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('http://localhost:5000/admin/add-faculty', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    qualifications: qualifications.filter(q => q.degree)
                })
            });

            const data = await response.json();

            if (data.success) {
                setMessage({
                    type: 'success',
                    text: `Faculty added successfully! ID: ${data.facultyId}, Password: ${data.defaultPassword}`
                });

                setGeneratedData({
                    facultyId: data.facultyId,
                    universityEmail: data.universityEmail,
                    defaultPassword: data.defaultPassword
                });

                setTimeout(() => {
                    setFormData({
                        joiningYear: new Date().getFullYear(),
                        department: '',
                        designation: '',
                        employeeType: 'Permanent',
                        firstName: '',
                        middleName: '',
                        lastName: '',
                        dateOfBirth: '',
                        gender: '',
                        primaryMobile: '',
                        personalEmail: ''
                    });
                    setQualifications([{ degree: '', university: '', specialization: '', yearOfPassing: '' }]);
                    if (onSuccess) onSuccess();
                }, 3000);
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to add faculty' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Connection error. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Add New Faculty</h2>
                    <p className="text-gray-600 mt-1">Enter faculty details to create a new account</p>
                </div>

                {message.text && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
                            'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                        {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <span>{message.text}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Professional Assignment */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-2">1</span>
                            Professional Assignment
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Joining Year <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="joiningYear"
                                    value={formData.joiningYear}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Department <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    required
                                >
                                    <option value="">Select Department</option>
                                    {DEPARTMENT_OPTIONS.map(dept => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Designation <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="designation"
                                    value={formData.designation}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    required
                                >
                                    <option value="">Select Designation</option>
                                    {DESIGNATION_OPTIONS.map(des => (
                                        <option key={des} value={des}>{des}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Employee Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="employeeType"
                                    value={formData.employeeType}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    required
                                >
                                    {EMPLOYEE_TYPE_OPTIONS.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-end md:col-span-2">
                                <button
                                    type="button"
                                    onClick={generateFacultyId}
                                    disabled={isGenerating}
                                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                                >
                                    {isGenerating ? (
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Sparkles className="w-4 h-4" />
                                    )}
                                    <span>Preview Faculty ID</span>
                                </button>
                            </div>
                        </div>

                        {generatedData && (
                            <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                                <p className="text-sm font-medium text-purple-900 mb-2">Generated Details:</p>
                                <div className="space-y-1 text-sm text-purple-700">
                                    <p><strong>Faculty ID:</strong> {generatedData.facultyId}</p>
                                    <p><strong>University Email:</strong> {generatedData.universityEmail}</p>
                                    {generatedData.defaultPassword && (
                                        <p><strong>Default Password:</strong> {generatedData.defaultPassword}</p>
                                    )}
                                    {generatedData.note && (
                                        <p className="text-purple-600 italic">{generatedData.note}</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Personal Details */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-2">2</span>
                            Personal Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                                <input
                                    type="text"
                                    name="middleName"
                                    value={formData.middleName}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date of Birth <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Gender <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    required
                                >
                                    <option value="">Select Gender</option>
                                    {GENDER_OPTIONS.map(g => (
                                        <option key={g} value={g}>{g}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-2">3</span>
                            Contact Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Primary Mobile <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="primaryMobile"
                                    value={formData.primaryMobile}
                                    onChange={handleChange}
                                    pattern="[0-9]{10}"
                                    placeholder="10-digit mobile number"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Personal Email</label>
                                <input
                                    type="email"
                                    name="personalEmail"
                                    value={formData.personalEmail}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Qualifications */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-2">4</span>
                                Qualifications
                            </h3>
                            <button
                                type="button"
                                onClick={addQualification}
                                className="flex items-center space-x-1 px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add More</span>
                            </button>
                        </div>

                        <div className="space-y-4">
                            {qualifications.map((qual, index) => (
                                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-sm font-medium text-gray-700">Qualification {index + 1}</p>
                                        {qualifications.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeQualification(index)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                        <input
                                            type="text"
                                            value={qual.degree}
                                            onChange={(e) => handleQualificationChange(index, 'degree', e.target.value)}
                                            placeholder="Degree (e.g., Ph.D)"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        />
                                        <input
                                            type="text"
                                            value={qual.university}
                                            onChange={(e) => handleQualificationChange(index, 'university', e.target.value)}
                                            placeholder="University"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        />
                                        <input
                                            type="text"
                                            value={qual.specialization}
                                            onChange={(e) => handleQualificationChange(index, 'specialization', e.target.value)}
                                            placeholder="Specialization"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        />
                                        <input
                                            type="number"
                                            value={qual.yearOfPassing}
                                            onChange={(e) => handleQualificationChange(index, 'yearOfPassing', e.target.value)}
                                            placeholder="Year"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                            {isSubmitting ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            <span>{isSubmitting ? 'Adding...' : 'Add Faculty'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddFacultyManual;
