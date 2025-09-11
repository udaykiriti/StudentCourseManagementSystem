import React from 'react';
import { GraduationCap, Menu, LogOut, User, ChevronRight, ChevronDown, BookOpen, Settings, MessageSquare, FileText } from 'lucide-react';

// API utility functions
const callApi = async (method, url, data, successCallback, errorCallback) => {
  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    
    const result = await response.json();
    successCallback(JSON.stringify(result));
  } catch (error) {
    errorCallback(error);
  }
};

const errorResponse = (error) => {
  console.error('API Error:', error);
  alert('An error occurred. Please try again.');
};

const getSession = (key) => {
  return sessionStorage.getItem(key) || '';
};

const setSession = (key, value, minutes) => {
  if (minutes < 0) {
    sessionStorage.removeItem(key);
  } else {
    sessionStorage.setItem(key, value);
  }
};

// Menu icon mapping for student
const getMenuIcon = (mid) => {
  switch(mid) {
    case 'M001': return <BookOpen className="w-4 h-4" />;
    case 'M101': return <Settings className="w-4 h-4" />;
    case 'M201': return <MessageSquare className="w-4 h-4" />;
    case 'M301': return <FileText className="w-4 h-4" />;
    default: return <Menu className="w-4 h-4" />;
  }
};

class StudentHome extends React.Component {
    constructor() {
        super();
        this.state = {
            userInfo: { firstname: '', lastname: '' },
            menuItems: [],
            subMenus: {},
            expandedMenus: {},
            selectedModule: '',
            titlebarText: '',
            loading: true,
            loadingSubMenu: {}
        };
        
        this.sid = getSession("sid");
        console.log('Session ID:', this.sid); // Debug log
        
        if(this.sid === "" || this.sid === null) {
            console.log('No session found, redirecting to login');
            window.location.replace("/");
            return;
        }

        this.loadUserData();
        this.loadMenuData();
    }

    loadUserData = () => {
        const url = "http://localhost:5000/uname";
        const data = {
            emailid: this.sid
        };
        callApi("POST", url, data, this.loadUname, errorResponse);
    }

    loadMenuData = () => {
        const url = "http://localhost:5000/home/menu";
        callApi("POST", url, "", this.loadMenu, errorResponse);
    }

    loadUname = (res) => {
        try {
            const data = JSON.parse(res);
            if (data && data.length > 0) {
                this.setState({ 
                    userInfo: { 
                        firstname: data[0].firstname || '', 
                        lastname: data[0].lastname || ''
                    },
                    loading: false
                });
            } else {
                this.setState({ loading: false });
            }
        } catch (error) {
            console.error('Error parsing user data:', error);
            this.setState({ loading: false });
        }
    }

    loadMenu = (res) => {
        try {
            const data = JSON.parse(res);
            this.setState({ menuItems: data || [] });
        } catch (error) {
            console.error('Error parsing menu data:', error);
            this.setState({ menuItems: [] });
        }
    }

    showSMenu = (mid) => {
        // Set loading state for this submenu
        this.setState(prevState => ({
            loadingSubMenu: {
                ...prevState.loadingSubMenu,
                [mid]: true
            }
        }));

        const surl = "http://localhost:5000/home/menus"; 
        const ipdata = {
            mid: mid
        };
        
        callApi("POST", surl, ipdata, (res) => this.loadSMenu(res, mid), errorResponse);
        
        this.setState(prevState => ({
            expandedMenus: {
                ...prevState.expandedMenus,
                [mid]: !prevState.expandedMenus[mid]
            }
        }));
    }

    loadSMenu = (res, mid) => {
        try {
            const data = JSON.parse(res);
            this.setState(prevState => ({
                subMenus: {
                    ...prevState.subMenus,
                    [mid]: data || []
                },
                loadingSubMenu: {
                    ...prevState.loadingSubMenu,
                    [mid]: false
                }
            }));
        } catch (error) {
            console.error('Error parsing submenu data:', error);
            this.setState(prevState => ({
                subMenus: {
                    ...prevState.subMenus,
                    [mid]: []
                },
                loadingSubMenu: {
                    ...prevState.loadingSubMenu,
                    [mid]: false
                }
            }));
        }
    }

    loadModule = (smid, smtitle) => {
        let moduleSrc = "";
        let titleText = smtitle;
        
        switch(smid) {
            case "M10102":
                moduleSrc = "/components/changepassword";
                titleText = "Change Password";
                break;
            case "M00101":
                moduleSrc = "/components/addcourse";
                titleText = "Select a new Course";
                break;
            case "M00102":
                moduleSrc = "/facultycomponents/viewcourses";
                titleText = "View Courses";
                break;
            case "M00103":
                moduleSrc = "/components/studentcourse";
                titleText = "My Courses";
                break;
            case "M10101":
                moduleSrc = "/components/myprofile";
                titleText = "My Profile";
                break;
            case "M20101":
                moduleSrc = "/components/feedback";
                titleText = "My Feedback";
                break;
            case "M30101":
                moduleSrc = "/components/submitassignment";
                titleText = "Submit Assignment";
                break;
            default:
                moduleSrc = "";
                titleText = smtitle || "";
        }
        
        this.setState({
            selectedModule: moduleSrc,
            titlebarText: titleText
        });
    }

    logout = () => {
        setSession("sid", "", -1);
        window.location.replace("/");
    }

    render() {
        const { 
            userInfo, 
            menuItems, 
            subMenus, 
            expandedMenus, 
            selectedModule, 
            titlebarText, 
            loading, 
            loadingSubMenu 
        } = this.state;
        
        if (loading) {
            return (
                <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-xl shadow-lg">
                        <div className="flex items-center space-x-3">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            <span className="text-gray-700">Loading...</span>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
                {/* Header */}
                <div className="bg-white shadow-sm border-b-2 border-blue-600 py-3 px-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <GraduationCap className="w-6 h-6 text-blue-600" />
                            <h1 className="text-xl font-bold text-gray-800">
                                Student Course Management System
                            </h1>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 text-gray-700">
                                <User className="w-4 h-4" />
                                <span className="font-medium text-sm">
                                    {userInfo.firstname} {userInfo.lastname}
                                </span>
                            </div>
                            <button
                                onClick={this.logout}
                                className="flex items-center space-x-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors duration-200"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="text-sm font-medium">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Sidebar */}
                    <div className="w-80 bg-white shadow-lg border-r border-gray-200 flex flex-col">
                        {/* Menu Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4">
                            <div className="flex items-center space-x-3">
                                <Menu className="w-5 h-5" />
                                <h2 className="text-lg font-semibold">Navigation Menu</h2>
                            </div>
                        </div>
                        
                        {/* Menu Items */}
                        <div className="flex-1 overflow-y-auto p-4">
                            <nav className="space-y-2">
                                {menuItems.map((item) => (
                                    <div key={item.mid} className="border border-gray-200 rounded-xl overflow-hidden">
                                        <button
                                            onClick={() => this.showSMenu(item.mid)}
                                            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-blue-50 transition-colors duration-200"
                                        >
                                            <div className="flex items-center space-x-3">
                                                {getMenuIcon(item.mid)}
                                                <span className="font-medium text-gray-700">
                                                    {item.mtitle}
                                                </span>
                                            </div>
                                            {expandedMenus[item.mid] ? 
                                                <ChevronDown className="w-4 h-4 text-gray-500" /> : 
                                                <ChevronRight className="w-4 h-4 text-gray-500" />
                                            }
                                        </button>
                                        
                                        {/* Submenu */}
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
                                                            onClick={() => this.loadModule(subItem.smid, subItem.smtitle)}
                                                            className={`w-full text-left px-8 py-3 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 flex items-center justify-between group ${
                                                                index < subMenus[item.mid].length - 1 ? 'border-b border-gray-50' : ''
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

                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col p-6">
                        {/* Title Bar */}
                        {titlebarText && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-6 py-4 mb-6">
                                <h3 className="text-xl font-semibold text-gray-800">
                                    {titlebarText}
                                </h3>
                            </div>
                        )}
                        
                        {/* Module Content */}
                        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            {selectedModule ? (
                                <iframe 
                                    src={selectedModule}
                                    title="Module"
                                    className="w-full h-full border-0"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    <div className="text-center">
                                        <GraduationCap className="w-16 h-16 mx-auto mb-4 text-blue-300" />
                                        <p className="text-lg font-medium mb-2">Welcome to Student Dashboard</p>
                                        <p className="text-sm">Select a menu item to get started</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-white border-t border-gray-200 py-3 px-6">
                    <p className="text-center text-gray-600 text-sm">
                        Copyright @ KL University. All rights reserved.
                    </p>
                </div>
            </div>
        );
    }
}

export default StudentHome;