import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, AlertCircle, Sparkles, ArrowLeft, ArrowRight, Save, CheckCircle } from 'lucide-react';
import PhotoUpload from '../components/common/PhotoUpload';
import ProgressSteps from '../components/common/ProgressSteps';

function StudentProfileSetup() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [studentData, setStudentData] = useState(null);

    const [formData, setFormData] = useState({
        // Personal
        photo: null,
        photoPreview: null,
        bio: '',
        bloodGroup: '',

        // Contact
        alternateMobile: '',
        currentAddress: {
            street: '',
            city: '',
            state: '',
            pincode: ''
        },
        permanentAddress: {
            street: '',
            city: '',
            state: '',
            pincode: ''
        },
        sameAsCurrent: false,

        // Emergency
        emergencyContact: {
            name: '',
            relationship: '',
            mobile: '',
            email: ''
        },

        // Additional
        hobbies: '',
        skills: '',
        languages: '',
        linkedin: '',
        github: ''
    });

    const steps = ['Personal Info', 'Contact Details', 'Emergency Contact', 'Additional Info'];

    useEffect(() => {
        const studentId = sessionStorage.getItem('studentId');
        if (!studentId) {
            navigate('/');
            return;
        }

        fetchStudentData(studentId);
    }, [navigate]);

    const fetchStudentData = async (studentId) => {
        try {
            const response = await fetch(`http://localhost:5000/admin/students/${studentId}`);
            const data = await response.json();
            if (data.success) {
                setStudentData(data.student);
            }
        } catch (error) {
            console.error('Error fetching student data:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked }));

            // Copy current address to permanent if checkbox is checked
            if (name === 'sameAsCurrent' && checked) {
                setFormData(prev => ({
                    ...prev,
                    permanentAddress: { ...prev.currentAddress }
                }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handlePhotoChange = (file, preview) => {
        setFormData(prev => ({
            ...prev,
            photo: file,
            photoPreview: preview
        }));
    };

    const validateStep = () => {
        switch (currentStep) {
            case 0: // Personal
                if (!formData.bloodGroup) {
                    alert('Please select blood group');
                    return false;
                }
                return true;
            case 1: // Contact
                if (!formData.currentAddress.street || !formData.currentAddress.city ||
                    !formData.currentAddress.state || !formData.currentAddress.pincode) {
                    alert('Please fill all current address fields');
                    return false;
                }
                if (formData.currentAddress.pincode.length !== 6) {
                    alert('PIN code must be 6 digits');
                    return false;
                }
                return true;
            case 2: // Emergency
                if (!formData.emergencyContact.name || !formData.emergencyContact.relationship ||
                    !formData.emergencyContact.mobile) {
                    alert('Please fill all emergency contact fields');
                    return false;
                }
                if (formData.emergencyContact.mobile.length !== 10) {
                    alert('Emergency contact mobile must be 10 digits');
                    return false;
                }
                return true;
            case 3: // Additional
                return true;
            default:
                return true;
        }
    };

    const handleNext = () => {
        if (validateStep()) {
            if (currentStep < steps.length - 1) {
                setCurrentStep(currentStep + 1);
            }
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        if (!validateStep()) return;

        setLoading(true);
        try {
            const studentId = sessionStorage.getItem('studentId');

            const profileData = {
                studentId,
                profile: {
                    photo: formData.photoPreview,
                    bio: formData.bio,
                    contact: {
                        alternateMobile: formData.alternateMobile,
                        currentAddress: formData.currentAddress,
                        permanentAddress: formData.sameAsCurrent ? formData.currentAddress : formData.permanentAddress
                    },
                    emergency: formData.emergencyContact,
                    additional: {
                        hobbies: formData.hobbies.split(',').map(h => h.trim()).filter(h => h),
                        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
                        languages: formData.languages.split(',').map(l => l.trim()).filter(l => l),
                        social: {
                            linkedin: formData.linkedin,
                            github: formData.github
                        }
                    }
                }
            };

            const response = await fetch('http://localhost:5000/student/profile/setup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileData)
            });

            const data = await response.json();

            if (data.success) {
                // Show success message
                alert('Profile completed successfully!');
                // Redirect to student dashboard
                navigate('/studenthome');
            } else {
                alert('Error: ' + (data.message || 'Failed to save profile'));
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Error saving profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="space-y-6">
                        <div className="flex justify-center">
                            <PhotoUpload
                                value={formData.photoPreview}
                                onChange={handlePhotoChange}
                                name="student-photo"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name <span className="text-gray-400">(Read-only)</span>
                            </label>
                            <input
                                type="text"
                                value={studentData ? `${studentData.personal.firstName} ${studentData.personal.lastName}` : ''}
                                disabled
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Date of Birth <span className="text-gray-400">(Read-only)</span>
                                </label>
                                <input
                                    type="text"
                                    value={studentData ? new Date(studentData.personal.dateOfBirth).toLocaleDateString() : ''}
                                    disabled
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Gender <span className="text-gray-400">(Read-only)</span>
                                </label>
                                <input
                                    type="text"
                                    value={studentData?.personal.gender || ''}
                                    disabled
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Blood Group <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="bloodGroup"
                                value={formData.bloodGroup}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Select Blood Group</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bio / About Me
                            </label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                rows="4"
                                placeholder="Tell us about yourself..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                );

            case 1:
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Primary Mobile <span className="text-gray-400">(Read-only)</span>
                            </label>
                            <input
                                type="text"
                                value={studentData?.contact.primaryMobile || ''}
                                disabled
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Alternate Mobile
                            </label>
                            <input
                                type="tel"
                                name="alternateMobile"
                                value={formData.alternateMobile}
                                onChange={handleInputChange}
                                placeholder="10-digit mobile number"
                                maxLength="10"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="border-t pt-4">
                            <h3 className="text-lg font-semibold mb-4">Current Address <span className="text-red-500">*</span></h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                                    <input
                                        type="text"
                                        name="currentAddress.street"
                                        value={formData.currentAddress.street}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                        <input
                                            type="text"
                                            name="currentAddress.city"
                                            value={formData.currentAddress.city}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                                        <input
                                            type="text"
                                            name="currentAddress.state"
                                            value={formData.currentAddress.state}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">PIN Code</label>
                                    <input
                                        type="text"
                                        name="currentAddress.pincode"
                                        value={formData.currentAddress.pincode}
                                        onChange={handleInputChange}
                                        maxLength="6"
                                        placeholder="6-digit PIN code"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="sameAsCurrent"
                                checked={formData.sameAsCurrent}
                                onChange={handleInputChange}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <label className="ml-2 text-sm text-gray-700">
                                Permanent address same as current address
                            </label>
                        </div>

                        {!formData.sameAsCurrent && (
                            <div className="border-t pt-4">
                                <h3 className="text-lg font-semibold mb-4">Permanent Address</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                                        <input
                                            type="text"
                                            name="permanentAddress.street"
                                            value={formData.permanentAddress.street}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                            <input
                                                type="text"
                                                name="permanentAddress.city"
                                                value={formData.permanentAddress.city}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                                            <input
                                                type="text"
                                                name="permanentAddress.state"
                                                value={formData.permanentAddress.state}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">PIN Code</label>
                                        <input
                                            type="text"
                                            name="permanentAddress.pincode"
                                            value={formData.permanentAddress.pincode}
                                            onChange={handleInputChange}
                                            maxLength="6"
                                            placeholder="6-digit PIN code"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
                            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
                            <p className="text-sm text-yellow-800">
                                This information will be used to contact someone in case of emergency. Please provide accurate details.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Contact Person Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="emergencyContact.name"
                                value={formData.emergencyContact.name}
                                onChange={handleInputChange}
                                placeholder="Parent/Guardian name"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Relationship <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="emergencyContact.relationship"
                                value={formData.emergencyContact.relationship}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Select Relationship</option>
                                <option value="Father">Father</option>
                                <option value="Mother">Mother</option>
                                <option value="Guardian">Guardian</option>
                                <option value="Sibling">Sibling</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mobile Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                name="emergencyContact.mobile"
                                value={formData.emergencyContact.mobile}
                                onChange={handleInputChange}
                                placeholder="10-digit mobile number"
                                maxLength="10"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="emergencyContact.email"
                                value={formData.emergencyContact.email}
                                onChange={handleInputChange}
                                placeholder="email@example.com"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
                            <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                            <p className="text-sm text-blue-800">
                                Help us know you better! This information is optional but helps create a complete profile.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Hobbies / Interests
                            </label>
                            <input
                                type="text"
                                name="hobbies"
                                value={formData.hobbies}
                                onChange={handleInputChange}
                                placeholder="Reading, Sports, Music (comma separated)"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <p className="mt-1 text-xs text-gray-500">Separate multiple hobbies with commas</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Skills
                            </label>
                            <input
                                type="text"
                                name="skills"
                                value={formData.skills}
                                onChange={handleInputChange}
                                placeholder="Python, React, Leadership (comma separated)"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <p className="mt-1 text-xs text-gray-500">Separate multiple skills with commas</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Languages Known
                            </label>
                            <input
                                type="text"
                                name="languages"
                                value={formData.languages}
                                onChange={handleInputChange}
                                placeholder="English, Hindi, Telugu (comma separated)"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <p className="mt-1 text-xs text-gray-500">Separate multiple languages with commas</p>
                        </div>

                        <div className="border-t pt-4">
                            <h3 className="text-lg font-semibold mb-4">Social Media (Optional)</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        LinkedIn Profile
                                    </label>
                                    <input
                                        type="url"
                                        name="linkedin"
                                        value={formData.linkedin}
                                        onChange={handleInputChange}
                                        placeholder="https://linkedin.com/in/yourprofile"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        GitHub Profile
                                    </label>
                                    <input
                                        type="url"
                                        name="github"
                                        value={formData.github}
                                        onChange={handleInputChange}
                                        placeholder="https://github.com/yourusername"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
                    <p className="text-gray-600">Let's get to know you better!</p>
                </div>

                <ProgressSteps steps={steps} current={currentStep} />

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                            {currentStep === 0 && <><User className="w-6 h-6 mr-2 text-blue-600" /> Personal Information</>}
                            {currentStep === 1 && <><Phone className="w-6 h-6 mr-2 text-purple-600" /> Contact Details</>}
                            {currentStep === 2 && <><AlertCircle className="w-6 h-6 mr-2 text-yellow-600" /> Emergency Contact</>}
                            {currentStep === 3 && <><Sparkles className="w-6 h-6 mr-2 text-pink-600" /> Additional Information</>}
                        </h2>
                    </div>

                    {renderStepContent()}

                    <div className="flex justify-between mt-8 pt-6 border-t">
                        <button
                            onClick={handlePrevious}
                            disabled={currentStep === 0}
                            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${currentStep === 0
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-gray-600 text-white hover:bg-gray-700 shadow-md hover:shadow-lg'
                                }`}
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Previous
                        </button>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => alert('Draft saved to local storage')}
                                className="flex items-center px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
                            >
                                <Save className="w-5 h-5 mr-2" />
                                Save Draft
                            </button>

                            {currentStep < steps.length - 1 ? (
                                <button
                                    onClick={handleNext}
                                    className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all"
                                >
                                    Next
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                                >
                                    {loading ? (
                                        <>Processing...</>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-5 h-5 mr-2" />
                                            Complete Profile
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentProfileSetup;
