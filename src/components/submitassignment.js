import React, { useState, useEffect } from 'react';
import { UploadCloud, Loader2, ServerCrash, CheckCircle2, BookOpen, Send, File, X } from 'lucide-react';

/**
 * A component for students to submit assignments for a selected course.
 */
function SubmitAssignment() {
    const [courseNames, setCourseNames] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [file, setFile] = useState(null);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const sid = sessionStorage.getItem("sid");
        if (!sid) {
            window.parent.location.replace("/");
            return;
        }

        const fetchCourseNames = async () => {
            setIsLoading(true);
            setError('');
            try {
                const response = await fetch('http://localhost:5000/viewcourses');
                if (!response.ok) throw new Error('Failed to fetch courses.');
                
                const data = await response.json();
                if (data.length > 0) {
                    setCourseNames(data.map(course => course.courseName));
                    setSelectedCourse(data[0].courseName);
                } else {
                    setError('No courses available for assignment submission.');
                }
            } catch (err) {
                console.error('Error fetching course names:', err);
                setError('Failed to fetch course names. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourseNames();
    }, []);

    const handleFileChange = (e) => {
        setError('');
        setSuccessMessage('');
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) {
            setError('Please select a file to submit.');
            return;
        }
        if (!selectedCourse) {
            setError('Please select a course.');
            return;
        }

        setIsSubmitting(true);
        setError('');
        setSuccessMessage('');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('courseName', selectedCourse);

        try {
            const response = await fetch('http://localhost:5000/submitAssignment', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Failed to submit assignment.');
            }
            
            setSuccessMessage('Your assignment has been submitted successfully!');
            setFile(null); // Clear the file input
        } catch (err) {
            console.error('Error submitting assignment:', err);
            setError(err.message || 'An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-slate-50 to-blue-100 min-h-screen w-full p-4 sm:p-8 flex items-center justify-center">
            <div className="w-full max-w-2xl">
                <header className="text-center mb-8">
                    <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight">Submit Assignment</h2>
                    <p className="text-gray-600 mt-3">Upload your completed work for the selected course.</p>
                </header>

                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                    {isLoading ? (
                        <div className="flex items-center justify-center space-x-3 text-gray-600 p-8">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                            <span className="text-lg">Loading Courses...</span>
                        </div>
                    ) : error && !courseNames.length > 0 ? (
                        <div className="flex flex-col items-center justify-center space-y-3 text-red-600 text-center p-8">
                            <ServerCrash className="w-12 h-12" />
                            <p className="text-lg font-medium">{error}</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="courseSelect" className="block text-md font-semibold text-gray-800 mb-2">
                                    <BookOpen className="inline-block w-5 h-5 mr-2 text-blue-600"/>
                                    Select Course
                                </label>
                                <select 
                                    id="courseSelect" 
                                    onChange={(e) => setSelectedCourse(e.target.value)} 
                                    value={selectedCourse}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {courseNames.map((name) => <option key={name} value={name}>{name}</option>)}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-md font-semibold text-gray-800 mb-2">
                                     <UploadCloud className="inline-block w-5 h-5 mr-2 text-blue-600"/>
                                     Upload File
                                </label>
                                {!file ? (
                                    <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                                        <input 
                                            type="file" 
                                            onChange={handleFileChange} 
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            disabled={isSubmitting}
                                        />
                                        <div className="text-gray-500">
                                            <UploadCloud className="mx-auto h-12 w-12" />
                                            <p className="mt-2">Drag & drop your file here, or <span className="text-blue-600 font-semibold">browse</span></p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
                                        <div className="flex items-center space-x-3">
                                            <File className="w-6 h-6 text-blue-600 flex-shrink-0"/>
                                            <div>
                                                <p className="font-semibold text-gray-800 text-sm">{file.name}</p>
                                                <p className="text-gray-500 text-xs">{(file.size / 1024).toFixed(2)} KB</p>
                                            </div>
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={() => setFile(null)}
                                            className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors"
                                            disabled={isSubmitting}
                                        >
                                            <X className="w-5 h-5"/>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {error && (
                                <div className="text-red-600 text-center font-medium p-3 bg-red-50 rounded-lg border border-red-200">
                                    {error}
                                </div>
                            )}
                            {successMessage && (
                                 <div className="text-green-600 text-center font-medium p-3 bg-green-50 rounded-lg border border-green-200">
                                    {successMessage}
                                </div>
                            )}

                            <button 
                                type="submit" 
                                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                                disabled={isSubmitting || !file}
                            >
                                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin"/> : <Send className="w-6 h-6"/>}
                                <span>{isSubmitting ? 'Submitting...' : 'Submit Assignment'}</span>
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SubmitAssignment;
