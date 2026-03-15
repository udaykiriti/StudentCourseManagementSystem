import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

function AnimatedSidebar({
    isOpen,
    menuItems,
    activeTab,
    setActiveTab,
    logo,
    userInfo
}) {
    const [expandedMenus, setExpandedMenus] = useState({});

    const toggleMenu = (menuId) => {
        setExpandedMenus(prev => ({
            ...prev,
            [menuId]: !prev[menuId]
        }));
    };

    return (
        <aside
            className={`fixed left-0 top-0 h-full bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white transition-all duration-300 ease-in-out z-40 ${isOpen ? 'w-72' : 'w-20'
                }`}
            style={{ boxShadow: '4px 0 20px rgba(0, 0, 0, 0.3)' }}
        >
            {/* Logo Section */}
            <div className="h-16 flex items-center justify-center border-b border-gray-700 bg-gray-900">
                <div className={`flex items-center space-x-3 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'
                    }`}>
                    {isOpen && (
                        <>
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                                {logo}
                            </div>
                            <div>
                                <h1 className="font-bold text-lg">{userInfo.title}</h1>
                                <p className="text-xs text-gray-400">{userInfo.subtitle}</p>
                            </div>
                        </>
                    )}
                </div>
                {!isOpen && (
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                        {logo}
                    </div>
                )}
            </div>

            {/* Menu Items */}
            <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
                <div className="space-y-1 px-3">
                    {menuItems.map((item) => (
                        <MenuItem
                            key={item.id}
                            item={item}
                            isOpen={isOpen}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            isExpanded={expandedMenus[item.id]}
                            toggleMenu={toggleMenu}
                        />
                    ))}
                </div>
            </nav>

            {/* User Info at Bottom */}
            <div className="border-t border-gray-700 p-4 bg-gray-900">
                <div className={`flex items-center space-x-3 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'
                    }`}>
                    {isOpen && (
                        <>
                            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                {userInfo.initial}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{userInfo.name}</p>
                                <p className="text-xs text-gray-400 truncate">{userInfo.role}</p>
                            </div>
                        </>
                    )}
                </div>
                {!isOpen && (
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold mx-auto">
                        {userInfo.initial}
                    </div>
                )}
            </div>
        </aside>
    );
}

function MenuItem({ item, isOpen, activeTab, setActiveTab, isExpanded, toggleMenu }) {
    const Icon = item.icon;
    const hasSubmenu = item.submenu && item.submenu.length > 0;

    const handleClick = () => {
        if (hasSubmenu) {
            toggleMenu(item.id);
        } else {
            setActiveTab(item.id);
        }
    };

    return (
        <div>
            <button
                onClick={handleClick}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group ${activeTab === item.id && !hasSubmenu
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                        : 'hover:bg-gray-800'
                    }`}
            >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <Icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${activeTab === item.id && !hasSubmenu ? 'scale-110' : 'group-hover:scale-110'
                        }`} />
                    <span className={`font-medium truncate transition-all duration-300 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                        }`}>
                        {item.label}
                    </span>
                </div>
                {hasSubmenu && isOpen && (
                    <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''
                        }`} />
                )}
            </button>

            {/* Submenu */}
            {hasSubmenu && isExpanded && isOpen && (
                <div className="ml-4 mt-1 space-y-1 animate-slideDown">
                    {item.submenu.map((subItem) => {
                        const SubIcon = subItem.icon;
                        return (
                            <button
                                key={subItem.id}
                                onClick={() => setActiveTab(subItem.id)}
                                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${activeTab === subItem.id
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                    }`}
                            >
                                <SubIcon className="w-4 h-4 flex-shrink-0" />
                                <span className="truncate">{subItem.label}</span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default AnimatedSidebar;
