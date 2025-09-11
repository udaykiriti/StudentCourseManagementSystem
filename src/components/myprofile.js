import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Loader2, ServerCrash } from 'lucide-react';

/**
 * A component to display the logged-in user's profile information.
 */
function MyProfile() {
    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const sid = sessionStorage.getItem("sid");
        if (!sid) {
            // Use parent to redirect the whole page, not just the iframe
            window.parent.location.replace("/");
            return;
        }

        const fetchProfileData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch("http://localhost:5000/myprofile/info", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ emailid: sid }),
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch profile information.');
                }

                const data = await response.json();
                if (data && data.length > 0) {
                    setProfileData(data[0]);
                } else {
                    throw new Error('No profile data found for this user.');
                }
            } catch (err) {
                console.error("Error fetching profile data:", err);
                setError(err.message || "An unexpected error occurred.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    const ProfileField = ({ icon, label, value }) => (
        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
                {React.cloneElement(icon, { className: "w-5 h-5 mr-2 text-blue-500" })}
                {label}
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{value || 'N/A'}</dd>
        </div>
    );

    return (
        <div className="bg-gradient-to-br from-slate-50 to-blue-100 min-h-screen w-full p-4 flex items-center justify-center">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold leading-6 text-gray-800">My Profile</h2>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and information.</p>
                </div>

                <div className="p-4 sm:p-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center space-x-3 text-gray-600 p-8">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                            <span className="text-lg">Loading Profile...</span>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center space-y-3 text-red-600 p-8 text-center">
                            <ServerCrash className="w-12 h-12" />
                            <p className="text-lg font-medium">{error}</p>
                        </div>
                    ) : profileData ? (
                        <dl className="divide-y divide-gray-200">
                            <ProfileField icon={<User />} label="First Name" value={profileData.firstname} />
                            <ProfileField icon={<User />} label="Last Name" value={profileData.lastname} />
                            <ProfileField icon={<Phone />} label="Contact No." value={profileData.contactno} />
                            <ProfileField icon={<Mail />} label="Email Address" value={profileData.emailid} />
                        </dl>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

export default MyProfile;

