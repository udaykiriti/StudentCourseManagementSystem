import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Award, BookOpen, ArrowLeft, ArrowRight, Save, CheckCircle } from 'lucide-react';
import PhotoUpload from '../components/common/PhotoUpload';
import ProgressSteps from '../components/common/ProgressSteps';

function FacultyProfileSetup() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [facultyData, setFacultyData] = useState(null);

    const [formData, setFormData] = useState({
        // Professional
        photo: null,
        photoPreview: null,
        bio: '',

        // Personal
        bloodGroup: '',
        maritalStatus: '',

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

        // Qualifications
        qualifications: [
            { degree: '', specialization: '', institution: '', year: '', percentage: '' }
        ],

        // Professional Details
        researchInterests: '',
        experience: '',
        certifications: ''
    });

    const steps = ['Professional Info', 'Personal Details', 'Contact Information', 'Qualifications'];

    useEffect(() => {
        const facultyId = sessionStorage.getItem('facultyId');
        if (!facultyId) {
            navigate('/');
            return;
        }

        fetchFacultyData(facultyId);
    }, [navigate]);

    const fetchFacultyData = async (facultyId) => {
        try {
            const response = await fetch(`http://localhost:5000/faculty/profile/${facultyId}`);
            const data = await response.json();
            if (data.success) {
                setFacultyData(data.faculty);
            }
        } catch (error) {
            console.error('Error fetching faculty data:', error);
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

    const handleQualificationChange = (index, field, value) => {
        const newQualifications = [...formData.qualifications];
        newQualifications[index][field] = value;
        setFormData(prev => ({ ...prev, qualifications: newQualifications }));
    };

    const addQualification = () => {
        setFormData(prev => ({
            ...prev,
            qualifications: [...prev.qualifications, { degree: '', specialization: '', institution: '', year: '', percentage: '' }]
        }));
    };

    const removeQualification = (index) => {
        if (formData.qualifications.length > 1) {
            const newQualifications = formData.qualifications.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, qualifications: newQualifications }));
        }
    };

    const validateStep = () => {
        switch (currentStep) {
            case 0: // Professional
                if (!formData.bloodGroup) {
                    alert('Please select blood group');
                    return false;
                }
                return true;
            case 1: // Personal
                return true;
            case 2: // Contact
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
            case 3: // Qualifications
                const firstQual = formData.qualifications[0];
                if (!firstQual.degree || !firstQual.institution) {
                    alert('Please fill at least one qualification');
                    return false;
                }
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
            const facultyId = sessionStorage.getItem('facultyId');

            const profileData = {
                facultyId,
                profile: {
                    photo: formData.photoPreview,
                    bio: formData.bio,
                    contact: {
                        alternateMobile: formData.alternateMobile,
                        currentAddress: formData.currentAddress,
                        permanentAddress: formData.sameAsCurrent ? formData.currentAddress : formData.permanentAddress
                    },
                    professional: {
                        researchInterests: formData.researchInterests.split(',').map(r => r.trim()).filter(r => r),
                        experience: parseInt(formData.experience) || 0,
                        certifications: formData.certifications.split(',').map(c => c.trim()).filter(c => c)
                    },
                    qualifications: formData.qualifications.filter(q => q.degree && q.institution)
                }
            };

            const response = await fetch('http://localhost:5000/faculty/profile/setup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileData)
            });

            const data = await response.json();

            if (data.success) {
                alert('Profile completed successfully!');
                navigate('/facultyhome');
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
                                name="faculty-photo"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name <span className="text-gray-400">(Read-only)</span>
                            </label>
                            <input
                                type="text"
                                value={facultyData ? `${facultyData.personal.firstName} ${facultyData.personal.lastName}` : ''}
                                disabled
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Department <span className="text-gray-400">(Read-only)</span>
                                </label>
                                <input
                                    type="text"
                                    value={facultyData?.professional.department || ''}
                                    disabled
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Designation <span className="text-gray-400">(Read-only)</span>
                                </label>
                                <input
                                    type="text"
                                    value={facultyData?.professional.designation || ''}
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
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                                placeholder="Tell us about yourself, your teaching philosophy, research interests..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                );

            case 1:
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Date of Birth <span className="text-gray-400">(Read-only)</span>
                                </label>
                                <input
                                    type="text"
                                    value={facultyData ? new Date(facultyData.personal.dateOfBirth).toLocaleDateString() : ''}
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
                                    value={facultyData?.personal.gender || ''}
                                    disabled
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Marital Status
                            </label>
                            <select
                                name="maritalStatus"
                                value={formData.maritalStatus}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                                <option value="">Select Status</option>
                                <option value="Single">Single</option>
                                <option value="Married">Married</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Years of Experience
                            </label>
                            <input
                                type="number"
                                name="experience"
                                value={formData.experience}
                                onChange={handleInputChange}
                                placeholder="Total years of teaching experience"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Research Interests
                            </label>
                            <input
                                type="text"
                                name="researchInterests"
                                value={formData.researchInterests}
                                onChange={handleInputChange}
                                placeholder="AI, Machine Learning, Data Science (comma separated)"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                            <p className="mt-1 text-xs text-gray-500">Separate multiple interests with commas</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Certifications
                            </label>
                            <input
                                type="text"
                                name="certifications"
                                value={formData.certifications}
                                onChange={handleInputChange}
                                placeholder="AWS Certified, Google Cloud (comma separated)"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                            <p className="mt-1 text-xs text-gray-500">Separate multiple certifications with commas</p>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Primary Mobile <span className="text-gray-400">(Read-only)</span>
                            </label>
                            <input
                                type="text"
                                value={facultyData?.contact.primaryMobile || ''}
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
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                                        <input
                                            type="text"
                                            name="currentAddress.state"
                                            value={formData.currentAddress.state}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
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
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                                            <input
                                                type="text"
                                                name="permanentAddress.state"
                                                value={formData.permanentAddress.state}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Educational Qualifications <span className="text-red-500">*</span></h3>
                            <button
                                type="button"
                                onClick={addQualification}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                            >
                                + Add More
                            </button>
                        </div>

                        {formData.qualifications.map((qual, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4 relative">
                                {formData.qualifications.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeQualification(index)}
                                        className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                                    >
                                        ✕
                                    </button>
                                )}

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Degree</label>
                                            <input
                                                type="text"
                                                value={qual.degree}
                                                onChange={(e) => handleQualificationChange(index, 'degree', e.target.value)}
                                                placeholder="B.Tech, M.Tech, Ph.D"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                                            <input
                                                type="text"
                                                value={qual.specialization}
                                                onChange={(e) => handleQualificationChange(index, 'specialization', e.target.value)}
                                                placeholder="Computer Science"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Institution</label>
                                        <input
                                            type="text"
                                            value={qual.institution}
                                            onChange={(e) => handleQualificationChange(index, 'institution', e.target.value)}
                                            placeholder="University/College Name"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Year of Passing</label>
                                            <input
                                                type="text"
                                                value={qual.year}
                                                onChange={(e) => handleQualificationChange(index, 'year', e.target.value)}
                                                placeholder="2020"
                                                maxLength="4"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Percentage/CGPA</label>
                                            <input
                                                type="text"
                                                value={qual.percentage}
                                                onChange={(e) => handleQualificationChange(index, 'percentage', e.target.value)}
                                                placeholder="85% or 8.5 CGPA"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
                    <p className="text-gray-600">Help us know you better as an educator!</p>
                </div>

                <ProgressSteps steps={steps} current={currentStep} />

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                            {currentStep === 0 && <><User className="w-6 h-6 mr-2 text-green-600" /> Professional Information</>}
                            {currentStep === 1 && <><BookOpen className="w-6 h-6 mr-2 text-emerald-600" /> Personal Details</>}
                            {currentStep === 2 && <><Phone className="w-6 h-6 mr-2 text-teal-600" /> Contact Information</>}
                            {currentStep === 3 && <><Award className="w-6 h-6 mr-2 text-green-600" /> Qualifications</>}
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
                                    className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all"
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

export default FacultyProfileSetup;
