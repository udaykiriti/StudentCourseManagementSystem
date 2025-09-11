import React, { useState, useEffect } from 'react';
import { Lock, KeyRound, Eye, EyeOff, Loader2, ServerCrash, CheckCircle2 } from 'lucide-react';

/**
 * A component that allows a logged-in user to change their password.
 */
function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // Session check on component mount
    useEffect(() => {
        const sid = sessionStorage.getItem("sid");
        if (!sid) {
            // Use parent to redirect the whole page, not just the iframe
            window.parent.location.replace("/");
        }
    }, []);

    /**
     * Handles the form submission to change the password.
     */
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setSuccessMessage('');

        // 1. Client-side validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            setError("Please fill in all password fields.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("New password and confirmation do not match.");
            return;
        }
        if (newPassword.length < 6) {
            setError("New password must be at least 6 characters long.");
            return;
        }

        setIsSubmitting(true);

        try {
            const sid = sessionStorage.getItem("sid");
            // 2. Validate the current password first
            const validationResponse = await fetch("http://localhost:5000/login/signin", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emailid: sid, pwd: currentPassword, role: 'admin' }) // Role might be needed
            });

            const validationResult = await validationResponse.json();
            if (validationResult === 0 || !validationResponse.ok) {
                throw new Error("The current password you entered is incorrect.");
            }

            // 3. If current password is correct, update to the new one
            const updateResponse = await fetch("http://localhost:5000/cp/updatepwd", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emailid: sid, pwd: newPassword })
            });
            
            if (!updateResponse.ok) {
                 throw new Error('Failed to update password. Please try again.');
            }
            
            const updateResult = await updateResponse.json();
            setSuccessMessage(updateResult || "Password updated successfully!");
            
            // Clear all fields
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

        } catch (err) {
            console.error("Error changing password:", err);
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-slate-50 to-blue-100 min-h-screen w-full p-4 flex items-center justify-center">
            <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-200">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800">Change Password</h2>
                    <p className="text-gray-500 mt-2">Update your password for enhanced security.</p>
                </div>

                <div className="space-y-4">
                    <PasswordField
                        id="current-password"
                        label="Current Password"
                        icon={<Lock />}
                        value={currentPassword}
                        onChange={setCurrentPassword}
                        disabled={isSubmitting}
                    />
                    <PasswordField
                        id="new-password"
                        label="New Password"
                        icon={<KeyRound />}
                        value={newPassword}
                        onChange={setNewPassword}
                        disabled={isSubmitting}
                    />
                    <PasswordField
                        id="confirm-password"
                        label="Confirm New Password"
                        icon={<KeyRound />}
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                        disabled={isSubmitting}
                    />

                    <button
                        type="submit"
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <KeyRound className="w-5 h-5" />}
                        <span>{isSubmitting ? 'Updating...' : 'Update Password'}</span>
                    </button>
                </div>

                {/* Status Messages */}
                {error && (
                    <div className="flex items-center space-x-3 bg-red-50 text-red-700 p-3 rounded-lg border border-red-200">
                        <ServerCrash className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}
                {successMessage && (
                    <div className="flex items-center space-x-3 bg-green-50 text-green-700 p-3 rounded-lg border border-green-200">
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm font-medium">{successMessage}</p>
                    </div>
                )}
            </form>
        </div>
    );
}

// Helper component for password input fields
const PasswordField = ({ id, label, icon, value, onChange, disabled }) => {
    const [isVisible, setIsVisible] = useState(false);
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    {React.cloneElement(icon, { className: "w-5 h-5" })}
                </div>
                <input
                    id={id}
                    type={isVisible ? "text" : "password"}
                    className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    placeholder="••••••••"
                />
                <button
                    type="button"
                    onClick={() => setIsVisible(!isVisible)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gray-700"
                    aria-label={isVisible ? "Hide password" : "Show password"}
                >
                    {isVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
            </div>
        </div>
    );
};

export default ChangePassword;
