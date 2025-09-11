import React, { useState, useEffect } from 'react';
import { MessageSquare, Star, Loader2, ServerCrash, BookOpen } from 'lucide-react';

/**
 * A component for administrators to view submitted student feedback for courses.
 */
function AdminFeedback() {
    const [feedbackData, setFeedbackData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Session check and data fetching on component mount
    useEffect(() => {
        const sid = sessionStorage.getItem("sid");
        if (!sid) {
            window.parent.location.replace("/");
            return;
        }

        const fetchFeedbackData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch('http://localhost:5000/viewfeedback');
                if (!response.ok) {
                    throw new Error('Network response was not successful.');
                }
                const data = await response.json();
                setFeedbackData(data);
            } catch (err) {
                console.error('Error fetching feedback data:', err);
                setError('Failed to fetch feedback data. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchFeedbackData();
    }, []);

    // Helper to render star ratings
    const renderStars = (rating) => {
        const totalStars = 5;
        return (
            <div className="flex items-center">
                {[...Array(totalStars)].map((_, index) => (
                    <Star
                        key={index}
                        className={`w-5 h-5 ${index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                ))}
                <span className="ml-2 text-sm font-semibold text-gray-700">{rating}/5</span>
            </div>
        );
    };

    return (
        <div className="bg-gradient-to-br from-slate-50 to-blue-100 min-h-screen w-full p-4 sm:p-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Student Feedback</h2>
                    <p className="text-gray-500 mt-2">Review of submitted feedback across all courses.</p>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center space-x-3 text-gray-600 p-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        <span className="text-lg">Loading Feedback...</span>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center space-y-3 bg-white p-12 rounded-2xl shadow-lg text-red-600 text-center">
                        <ServerCrash className="w-12 h-12" />
                        <p className="text-lg font-medium">{error}</p>
                    </div>
                ) : feedbackData.length === 0 ? (
                     <div className="flex flex-col items-center justify-center space-y-3 bg-white p-12 rounded-2xl shadow-lg text-gray-500 text-center">
                        <MessageSquare className="w-12 h-12" />
                        <p className="text-lg font-medium">No Feedback Available</p>
                        <p className="text-sm">There is no feedback to display at the moment.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {feedbackData.map((item, index) => (
                            <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                                <div className="p-5 border-b border-gray-100 bg-gray-50">
                                    <div className="flex items-center space-x-3">
                                        <BookOpen className="w-6 h-6 text-blue-600"/>
                                        <h3 className="text-xl font-semibold text-gray-800">{item.courseName}</h3>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <dl className="space-y-4">
                                        {Object.entries(item.feedback).map(([key, value]) => (
                                            <div key={key} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                                                <dt className="text-sm font-medium text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</dt>
                                                <dd className="md:col-span-2">{renderStars(value)}</dd>
                                            </div>
                                        ))}
                                    </dl>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminFeedback;

