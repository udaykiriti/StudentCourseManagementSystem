import React from 'react';
import { GraduationCap, User, LogOut } from 'lucide-react';

function Navbar({ userInfo, onLogout, title = 'Student Course Management System' }) {
    return (
        <div className="bg-white shadow-sm border-b-2 border-blue-600 py-3 px-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <GraduationCap className="w-6 h-6 text-blue-600" />
                    <h1 className="text-xl font-bold text-gray-800">{title}</h1>
                </div>

                <div className="flex items-center space-x-4">
                    {userInfo && (
                        <div className="flex items-center space-x-2 text-gray-700">
                            <User className="w-4 h-4" />
                            <span className="font-medium text-sm">
                                {userInfo.firstname} {userInfo.lastname}
                            </span>
                        </div>
                    )}
                    <button
                        onClick={onLogout}
                        className="flex items-center space-x-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors duration-200"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
