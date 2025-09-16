import React, { useState } from 'react';
import { Mail, Key, ShieldCheck, Lock, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

function ForgotPassword() {
    const [step, setStep] = useState(1); // 1: Enter email, 2: Enter OTP, 3: Success
    const [emailid, setEmailId] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await fetch('http://localhost:5000/sendotp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emailid })
            });
            const data = await response.json();
            if (response.ok) {
                setMessage(data.message);
                setStep(2);
            } else {
                setError(data.error || 'Failed to send OTP.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await fetch('http://localhost:5000/resetpassword', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emailid, otp, newPassword })
            });
            const data = await response.json();
            if (response.ok) {
                setMessage(data.message + '. You can now log in with your new password.');
                setStep(3); // Success step
            } else {
                setError(data.error || 'Failed to reset password.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
                <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mb-2">
                        <Key className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-800">Forgot Password</h2>
                </div>

                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
                {message && step !== 3 && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{message}</div>}

                {step === 1 && (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                        <p className="text-gray-600 text-xs text-center">Enter your email address to receive a password reset OTP.</p>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                <Mail className="inline w-3 h-3 mr-1" />
                                Email ID*
                            </label>
                            <input
                                type="email"
                                value={emailid}
                                onChange={(e) => setEmailId(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm disabled:bg-blue-400">
                            {loading ? 'Sending...' : 'Send OTP'}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                <ShieldCheck className="inline w-3 h-3 mr-1" />
                                OTP*
                            </label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                placeholder="Enter the 6-digit OTP"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                <Lock className="inline w-3 h-3 mr-1" />
                                New Password*
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                placeholder="Enter new password"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                <Lock className="inline w-3 h-3 mr-1" />
                                Confirm New Password*
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                placeholder="Confirm new password"
                                required
                            />
                        </div>
                        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm disabled:bg-blue-400">
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                           <GraduationCap className="w-6 h-6 text-green-600" />
                        </div>
                        <p className="text-green-700">{message}</p>
                        <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">
                            Back to Login
                        </Link>
                    </div>
                )}

                {step !== 3 && (
                     <div className="text-center pt-4">
                        <Link to="/" className="text-blue-600 hover:underline text-xs">
                            Back to Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ForgotPassword;