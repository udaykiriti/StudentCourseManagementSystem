import React from 'react';
import { Menu, ChevronRight, ChevronDown, BookOpen, Settings, MessageSquare, FileText, Users, ClipboardCheck } from 'lucide-react';

const getMenuIcon = (mid) => {
    const iconMap = {
        'M001': <BookOpen className="w-4 h-4" />,
        'M101': <Settings className="w-4 h-4" />,
        'M201': <MessageSquare className="w-4 h-4" />,
        'M301': <FileText className="w-4 h-4" />,
        'F001': <BookOpen className="w-4 h-4" />,
        'F101': <Settings className="w-4 h-4" />,
        'F201': <Users className="w-4 h-4" />,
        'F301': <ClipboardCheck className="w-4 h-4" />,
        'F401': <MessageSquare className="w-4 h-4" />,
        'A001': <BookOpen className="w-4 h-4" />,
        'A101': <Users className="w-4 h-4" />,
        'A102': <Settings className="w-4 h-4" />,
        'A201': <MessageSquare className="w-4 h-4" />
    };
    return iconMap[mid] || <Menu className="w-4 h-4" />;
};

function Sidebar({
    menuItems = [],
    subMenus = {},
    expandedMenus = {},
    loadingSubMenu = {},
    onMenuClick,
    onSubMenuClick
}) {
    return (
        <div className="w-80 bg-white shadow-lg border-r border-gray-200 flex flex-col">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4">
                <div className="flex items-center space-x-3">
                    <Menu className="w-5 h-5" />
                    <h2 className="text-lg font-semibold">Navigation Menu</h2>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                <nav className="space-y-2">
                    {menuItems.map((item) => (
                        <div key={item.mid} className="border border-gray-200 rounded-xl overflow-hidden">
                            <button
                                onClick={() => onMenuClick(item.mid)}
                                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-blue-50 transition-colors duration-200"
                            >
                                <div className="flex items-center space-x-3">
                                    {getMenuIcon(item.mid)}
                                    <span className="font-medium text-gray-700">{item.mtitle}</span>
                                </div>
                                {expandedMenus[item.mid] ?
                                    <ChevronDown className="w-4 h-4 text-gray-500" /> :
                                    <ChevronRight className="w-4 h-4 text-gray-500" />
                                }
                            </button>

                            {expandedMenus[item.mid] && (
                                <div className="bg-white border-t border-gray-100">
                                    {loadingSubMenu[item.mid] ? (
                                        <div className="px-8 py-4">
                                            <div className="flex items-center space-x-2 text-gray-500 text-sm">
                                                <div className="animate-spin rounded-full h-3 w-3 border-b border-gray-400"></div>
                                                <span>Loading submenu...</span>
                                            </div>
                                        </div>
                                    ) : subMenus[item.mid] && subMenus[item.mid].length > 0 ? (
                                        subMenus[item.mid].map((subItem, index) => (
                                            <button
                                                key={subItem.smid}
                                                onClick={() => onSubMenuClick(subItem.smid, subItem.smtitle)}
                                                className={`w-full text-left px-8 py-3 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 flex items-center justify-between group ${index < subMenus[item.mid].length - 1 ? 'border-b border-gray-50' : ''
                                                    }`}
                                            >
                                                <span>{subItem.smtitle}</span>
                                                <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-8 py-4 text-sm text-gray-500">
                                            No submenu items available
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>
            </div>
        </div>
    );
}

export default Sidebar;
