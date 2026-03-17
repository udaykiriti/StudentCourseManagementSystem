import React, { useState } from 'react';
import { Save, RefreshCw, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import CustomDropdown from '../components/common/CustomDropdown';

const DEGREE_OPTIONS = ['B.Tech', 'M.Tech', 'MBA', 'BBA', 'MCA', 'B.Sc', 'M.Sc', 'Ph.D'];
const BRANCH_OPTIONS = [
    'Computer Science & Engineering',
    'Electronics & Communication',
    'AI & Data Science',
    'CS & Information Technology',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical & Electronics',
    'Information Technology',
    'Aeronautical Engineering',
    'Automobile Engineering'
];
const REGULATION_OPTIONS = ['R22', 'R20', 'R18', 'R16'];
const CATEGORY_OPTIONS = ['General', 'OBC', 'SC', 'ST', 'EWS'];
const GENDER_OPTIONS = ['Male', 'Female', 'Other'];
const BLOOD_GROUP_OPTIONS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

function AddStudentManual({ onSuccess }) {
    const [formData, setFormData] = useState({
        admissionYear: new Date().getFullYear(),
        degree: '',
        branch: '',
        regulation: 'R22',
        firstName: '',
        middleName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        bloodGroup: '',
        category: 'General',
        nationality: 'Indian',
        primaryMobile: '',
        personalEmail: '',
        tenthBoard: '',
        tenthPercentage: '',
        tenthYear: '',
        twelfthBoard: '',
        twelfthPercentage: '',
        twelfthYear: '',
        twelfthStream: '',
        entranceExam: '',
        entranceRank: '',
        entranceScore: ''
    });

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

    const handleDropdownChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const generateStudentId = async () => {
        if (!formData.admissionYear || !formData.degree || !formData.branch) {
            setMessage({ type: 'error', text: 'Please select Admission Year, Degree, and Branch first' });
            return;
        }

        setIsGenerating(true);
        setMessage({ type: '', text: '' });

        const year = formData.admissionYear.toString().slice(-2);
        const degreeCode = formData.degree === 'B.Tech' ? 'BTE' :
            formData.degree === 'M.Tech' ? 'MTE' :
                formData.degree.toUpperCase().slice(0, 3);
        const branchCode = formData.branch.includes('Computer') ? 'CSEN' :
            formData.branch.includes('Electronics') ? 'ECEN' :
                formData.branch.includes('AI') ? 'AIDS' :
                    formData.branch.includes('Mechanical') ? 'MECH' :
                        formData.branch.includes('Civil') ? 'CIVI' : 'GENR';

        const previewId = `STU-${year}-${degreeCode}-${branchCode}-XXX`;
        const previewEmail = `${previewId.toLowerCase()}@university.edu`;

        setGeneratedData({
            studentId: previewId,
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
            const token = sessionStorage.getItem('token');
            const response = await fetch('http://localhost:5000/admin/add-student', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    section: 'A' // Default section since we removed the field
                })
            });

            const data = await response.json();

            if (data.success) {
                setMessage({
                    type: 'success',
                    text: `Student added successfully! ID: ${data.studentId}, Password: ${data.defaultPassword}`
                });

                setGeneratedData({
                    studentId: data.studentId,
                    universityEmail: data.universityEmail,
                    defaultPassword: data.defaultPassword
                });

                setTimeout(() => {
                    setFormData({
                        admissionYear: new Date().getFullYear(),
                        degree: '',
                        branch: '',
                        regulation: 'R22',
                        firstName: '',
                        middleName: '',
                        lastName: '',
                        dateOfBirth: '',
                        gender: '',
                        bloodGroup: '',
                        category: 'General',
                        nationality: 'Indian',
                        primaryMobile: '',
                        personalEmail: '',
                        tenthBoard: '',
                        tenthPercentage: '',
                        tenthYear: '',
                        twelfthBoard: '',
                        twelfthPercentage: '',
                        twelfthYear: '',
                        twelfthStream: '',
                        entranceExam: '',
                        entranceRank: '',
                        entranceScore: ''
                    });
                    if (onSuccess) onSuccess();
                }, 3000);
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to add student' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Connection error. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto animate-fadeIn">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Add New Student</h2>
                    <p className="text-gray-600 mt-1">Enter student details to create a new account</p>
                </div>

                {message.text && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2 animate-slideDown ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
                            'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                        {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <span>{message.text}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Academic Assignment */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-2">1</span>
                            Academic Assignment
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Admission Year <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="admissionYear"
                                    value={formData.admissionYear}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    required
                                />
                            </div>

                            <CustomDropdown
                                label="Degree"
                                value={formData.degree}
                                onChange={(value) => handleDropdownChange('degree', value)}
                                options={DEGREE_OPTIONS}
                                placeholder="Select Degree"
                                required={true}
                            />

                            <CustomDropdown
                                label="Branch"
                                value={formData.branch}
                                onChange={(value) => handleDropdownChange('branch', value)}
                                options={BRANCH_OPTIONS}
                                placeholder="Select Branch"
                                required={true}
                            />

                            <CustomDropdown
                                label="Regulation"
                                value={formData.regulation}
                                onChange={(value) => handleDropdownChange('regulation', value)}
                                options={REGULATION_OPTIONS}
                                placeholder="Select Regulation"
                                required={true}
                            />

                            <div className="lg:col-span-2 flex items-end">
                                <button
                                    type="button"
                                    onClick={generateStudentId}
                                    disabled={isGenerating}
                                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg"
                                >
                                    {isGenerating ? (
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Sparkles className="w-4 h-4" />
                                    )}
                                    <span>Preview Student ID</span>
                                </button>
                            </div>
                        </div>

                        {generatedData && (
                            <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg animate-slideDown">
                                <p className="text-sm font-medium text-purple-900 mb-2">Generated Details:</p>
                                <div className="space-y-1 text-sm text-purple-700">
                                    <p><strong>Student ID:</strong> {generatedData.studentId}</p>
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
                            <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-2">2</span>
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    required
                                />
                            </div>

                            <CustomDropdown
                                label="Gender"
                                value={formData.gender}
                                onChange={(value) => handleDropdownChange('gender', value)}
                                options={GENDER_OPTIONS}
                                placeholder="Select Gender"
                                required={true}
                            />

                            <CustomDropdown
                                label="Blood Group"
                                value={formData.bloodGroup}
                                onChange={(value) => handleDropdownChange('bloodGroup', value)}
                                options={BLOOD_GROUP_OPTIONS}
                                placeholder="Select Blood Group"
                            />

                            <CustomDropdown
                                label="Category"
                                value={formData.category}
                                onChange={(value) => handleDropdownChange('category', value)}
                                options={CATEGORY_OPTIONS}
                                placeholder="Select Category"
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                                <input
                                    type="text"
                                    name="nationality"
                                    value={formData.nationality}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-2">3</span>
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Previous Education */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-2">4</span>
                            Previous Education
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-gray-700 mb-2">10th Standard</p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <input
                                        type="text"
                                        name="tenthBoard"
                                        value={formData.tenthBoard}
                                        onChange={handleChange}
                                        placeholder="Board (e.g., CBSE)"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    />
                                    <input
                                        type="number"
                                        name="tenthPercentage"
                                        value={formData.tenthPercentage}
                                        onChange={handleChange}
                                        placeholder="Percentage"
                                        step="0.01"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    />
                                    <input
                                        type="number"
                                        name="tenthYear"
                                        value={formData.tenthYear}
                                        onChange={handleChange}
                                        placeholder="Year of Passing"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-700 mb-2">12th/Intermediate</p>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <input
                                        type="text"
                                        name="twelfthBoard"
                                        value={formData.twelfthBoard}
                                        onChange={handleChange}
                                        placeholder="Board"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    />
                                    <input
                                        type="number"
                                        name="twelfthPercentage"
                                        value={formData.twelfthPercentage}
                                        onChange={handleChange}
                                        placeholder="Percentage"
                                        step="0.01"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    />
                                    <input
                                        type="number"
                                        name="twelfthYear"
                                        value={formData.twelfthYear}
                                        onChange={handleChange}
                                        placeholder="Year"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    />
                                    <input
                                        type="text"
                                        name="twelfthStream"
                                        value={formData.twelfthStream}
                                        onChange={handleChange}
                                        placeholder="Stream (MPC/BiPC)"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-700 mb-2">Entrance Exam</p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <input
                                        type="text"
                                        name="entranceExam"
                                        value={formData.entranceExam}
                                        onChange={handleChange}
                                        placeholder="Exam Name (JEE/EAMCET)"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    />
                                    <input
                                        type="number"
                                        name="entranceRank"
                                        value={formData.entranceRank}
                                        onChange={handleChange}
                                        placeholder="Rank"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    />
                                    <input
                                        type="number"
                                        name="entranceScore"
                                        value={formData.entranceScore}
                                        onChange={handleChange}
                                        placeholder="Score"
                                        step="0.01"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            {isSubmitting ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            <span>{isSubmitting ? 'Adding...' : 'Add Student'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddStudentManual;
