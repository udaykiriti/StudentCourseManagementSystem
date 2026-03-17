import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen, User, LogOut, Menu, X, GraduationCap,
    Users, ClipboardCheck, Settings, Bell, Home
} from 'lucide-react';
import { FACULTY_MENU } from './utils/constants';

function FacultyHome() {
    const [userInfo, setUserInfo] = useState({ firstname: '', lastname: '' });
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const sid = sessionStorage.getItem("sid");
        const role = sessionStorage.getItem("role");

        if (!sid || role !== 'faculty') {
            navigate('/');
            return;
        }

        const fetchUserInfo = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const response = await fetch("http://localhost:5000/uname", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ emailid: sid })
                });
                const data = await response.json();
                if (data && data.length > 0) {
                    setUserInfo(data[0]);
                }
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };

        fetchUserInfo();
    }, [navigate]);

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/');
    };

    const menuItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: Home
        },
        ...FACULTY_MENU.map(item => ({
            id: item.mid,
            label: item.mtitle,
            icon: getMenuIcon(item.mid),
            submenu: item.subMenus.map(sub => ({
                id: sub.smid,
                label: sub.smtitle,
                icon: BookOpen,
                path: sub.path
            }))
        }))
    ];

    function getMenuIcon(mid) {
        const iconMap = {
            'F001': BookOpen,
            'F101': Settings,
            'F201': Users,
            'F301': ClipboardCheck
        };
        return iconMap[mid] || Menu;
    }

    const renderContent = () => {
        if (activeTab === 'dashboard') {
            return <FacultyDashboard userInfo={userInfo} setActiveTab={setActiveTab} />;
        }

        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center max-w-3xl mx-auto mt-8">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">🚧</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{getPageTitle()}</h2>
                <p className="text-gray-600 text-lg mb-8">This module is currently under development and will be available soon.</p>
                <button 
                    onClick={() => setActiveTab('dashboard')}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                    Return to Dashboard
                </button>
            </div>
        );
    };

    const getPageTitle = () => {
        if (activeTab === 'dashboard') return 'Dashboard';

        for (const menu of FACULTY_MENU) {
            const subItem = menu.subMenus.find(sub => sub.smid === activeTab);
            if (subItem) return subItem.smtitle;
        }
        return 'Dashboard';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
            {/* Sidebar */}
            <aside className={`fixed left-0 top-0 h-full bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white transition-all duration-300 z-40 ${sidebarOpen ? 'w-72' : 'w-20'
                }`}>
                <div className="h-16 flex items-center justify-center border-b border-gray-700">
                    <div className={`flex items-center space-x-3 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                        {sidebarOpen && (
                            <>
                                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                    <GraduationCap className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="font-bold text-lg">Faculty Portal</h1>
                                    <p className="text-xs text-gray-400">Teaching Dashboard</p>
                                </div>
                            </>
                        )}
                    </div>
                    {!sidebarOpen && (
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                    )}
                </div>

                <nav className="flex-1 overflow-y-auto py-4">
                    <div className="space-y-1 px-3">
                        {menuItems.map((item) => (
                            <MenuItem
                                key={item.id}
                                item={item}
                                isOpen={sidebarOpen}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                            />
                        ))}
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}>
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {sidebarOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
                        </button>
                        <h1 className="text-xl font-semibold text-gray-900">{getPageTitle()}</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="p-2 hover:bg-gray-100 rounded-lg relative transition-colors">
                            <Bell className="w-5 h-5 text-gray-600" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm font-medium">Logout</span>
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}

function MenuItem({ item, isOpen, activeTab, setActiveTab }) {
    const [expanded, setExpanded] = useState(false);
    const Icon = item.icon;
    const hasSubmenu = item.submenu && item.submenu.length > 0;

    return (
        <div>
            <button
                onClick={() => hasSubmenu ? setExpanded(!expanded) : setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${activeTab === item.id && !hasSubmenu
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600'
                        : 'hover:bg-gray-800'
                    }`}
            >
                <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5" />
                    {isOpen && <span className="font-medium">{item.label}</span>}
                </div>
                {hasSubmenu && isOpen && (
                    <svg className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                )}
            </button>

            {hasSubmenu && expanded && isOpen && (
                <div className="ml-4 mt-1 space-y-1">
                    {item.submenu.map((subItem) => {
                        const SubIcon = subItem.icon;
                        return (
                            <button
                                key={subItem.id}
                                onClick={() => setActiveTab(subItem.id)}
                                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-all ${activeTab === subItem.id
                                        ? 'bg-green-600 text-white'
                                        : 'text-gray-300 hover:bg-gray-800'
                                    }`}
                            >
                                <SubIcon className="w-4 h-4" />
                                <span>{subItem.label}</span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function FacultyDashboard({ userInfo, setActiveTab }) {
    const quickActions = [
        { label: 'Create Course', icon: BookOpen, action: 'F00101', gradient: 'from-blue-500 to-blue-600' },
        { label: 'View Students', icon: Users, action: 'F20101', gradient: 'from-green-500 to-green-600' },
        { label: 'Mark Attendance', icon: ClipboardCheck, action: 'F30101', gradient: 'from-purple-500 to-purple-600' },
        { label: 'My Profile', icon: User, action: 'F10101', gradient: 'from-orange-500 to-orange-600' }
    ];

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">Welcome back, {userInfo.firstname}!</h2>
                <p className="text-green-100">Ready to inspire and educate today's students.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="My Courses" value="0" icon={BookOpen} />
                <StatCard label="Total Students" value="0" icon={Users} />
                <StatCard label="Attendance Today" value="0%" icon={ClipboardCheck} />
                <StatCard label="Pending Tasks" value="0" icon={Bell} />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => {
                        const Icon = action.icon;
                        return (
                            <button
                                key={index}
                                onClick={() => setActiveTab(action.action)}
                                className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 text-left"
                            >
                                <Icon className="w-6 h-6 mb-2 text-gray-700" />
                                <p className="font-medium text-gray-900">{action.label}</p>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon: Icon }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-gray-700" />
                </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">{label}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
    );
}

export default FacultyHome;
