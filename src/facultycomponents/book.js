import React from 'react';
import { Book, Hash, User, Calendar, FileText, BookPlus, Loader2, ServerCrash, CheckCircle2 } from 'lucide-react';

/**
 * A form component for administrators or faculty to define and add a new course to the system.
 * This is different from a student adding an existing course to their schedule.
 */
function AddNewCourseForm() {
    const [formData, setFormData] = React.useState({
        courseName: '',
        courseCode: '',
        sectionNumber: '',
        facultyName: '',
        semester: '',
        year: '',
        description: ''
    });

    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [successMessage, setSuccessMessage] = React.useState('');

    // Session check on component mount
    React.useEffect(() => {
        const sid = sessionStorage.getItem("sid");
        if (!sid) {
            // Use parent to redirect the whole page, not just the iframe
            window.parent.location.replace("/");
        }
    }, []);

    // Handles changes in form inputs
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        setError(null);
        setSuccessMessage('');
    };

    // Handles form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        for (const key in formData) {
            if (!formData[key]) {
                setError("All fields are required. Please fill out the entire form.");
                return;
            }
        }

        setIsSubmitting(true);
        setError(null);
        setSuccessMessage('');

        try {
            const response = await fetch("http://localhost:5000/book/addnewcourse", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (!response.ok) {
                // Handle specific backend errors
                if (result.error && result.error.includes("already exists")) {
                    throw new Error("A course with the same name or code already exists.");
                }
                throw new Error(result.error || 'An unexpected error occurred.');
            }
            
            setSuccessMessage(`Course "${formData.courseName}" has been successfully created!`);
            // Reset form
            setFormData({
                courseName: '', courseCode: '', sectionNumber: '', facultyName: '',
                semester: '', year: '', description: ''
            });

        } catch (err) {
            console.error("Error adding new course:", err);
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Generate academic years for the dropdown
    const academicYears = Array.from({ length: 10 }, (_, index) => {
        const startYear = new Date().getFullYear() - index;
        return `${startYear}-${startYear + 1}`;
    });

    return (
        <div className="bg-gradient-to-br from-slate-50 to-blue-100 min-h-screen flex items-center justify-center p-4">
            <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-200">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800">Create New Course</h2>
                    <p className="text-gray-500 mt-2">Define a new course to be offered in the system.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <InputField icon={<Book/>} label="Course Name" id="courseName" value={formData.courseName} onChange={handleChange} disabled={isSubmitting} />
                    <InputField icon={<Hash/>} label="Course Code" id="courseCode" value={formData.courseCode} onChange={handleChange} disabled={isSubmitting} />
                    <InputField icon={<Hash/>} label="Section Number" id="sectionNumber" value={formData.sectionNumber} onChange={handleChange} disabled={isSubmitting} />
                    <InputField icon={<User/>} label="Faculty Name" id="facultyName" value={formData.facultyName} onChange={handleChange} disabled={isSubmitting} />

                    {/* Semester Select */}
                    <div>
                        <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                        <select id="semester" value={formData.semester} onChange={handleChange} disabled={isSubmitting} className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:bg-gray-200">
                            <option value="">-- Select Semester --</option>
                            <option value="Odd">Odd</option>
                            <option value="Even">Even</option>
                        </select>
                    </div>

                    {/* Academic Year Select */}
                    <div>
                        <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
                         <select id="year" value={formData.year} onChange={handleChange} disabled={isSubmitting} className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:bg-gray-200">
                            <option value="">-- Select Year --</option>
                            {academicYears.map(year => <option key={year} value={year}>{year}</option>)}
                        </select>
                    </div>

                    {/* Description Textarea */}
                    <div className="md:col-span-2">
                         <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                         <div className="relative">
                             <div className="absolute top-3.5 left-3.5 flex items-center pointer-events-none text-gray-400">
                                 <FileText className="w-5 h-5" />
                             </div>
                             <textarea id="description" value={formData.description} onChange={handleChange} disabled={isSubmitting} rows="4" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:bg-gray-200" placeholder="Enter course description..."></textarea>
                         </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <BookPlus className="w-5 h-5" />}
                    <span>{isSubmitting ? 'Creating Course...' : 'Create Course'}</span>
                </button>

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

// Helper component for standard input fields
const InputField = ({ icon, label, id, value, onChange, disabled }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                {React.cloneElement(icon, { className: 'w-5 h-5' })}
            </div>
            <input 
                type="text" 
                id={id}
                placeholder={`Enter ${label.toLowerCase()}`} 
                value={value} 
                onChange={onChange}
                disabled={disabled}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:bg-gray-200"
            />
        </div>
    </div>
);

export default AddNewCourseForm;

