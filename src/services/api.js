const API_BASE_URL = 'http://localhost:5000';

export const api = {
    post: async (endpoint, data) => {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    get: async (endpoint) => {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`);
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    delete: async (endpoint, data = null) => {
        try {
            const options = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            };
            if (data) {
                options.body = JSON.stringify(data);
            }
            const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    put: async (endpoint, data) => {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
};

export const AUTH_ENDPOINTS = {
    LOGIN: '/login/signin',
    REGISTER: '/registration/signup',
    SEND_OTP: '/sendotp',
    RESET_PASSWORD: '/resetpassword'
};

export const USER_ENDPOINTS = {
    GET_NAME: '/uname',
    GET_PROFILE: '/myprofile/info',
    UPDATE_PASSWORD: '/cp/updatepwd'
};

export const COURSE_ENDPOINTS = {
    ADD_NEW_COURSE: '/book/addnewcourse',
    VIEW_COURSES: '/viewcourses',
    GET_COURSE_NAMES: '/coursenames',
    ADD_COURSE: '/addcourse',
    DELETE_COURSE: '/deletecourse',
    STUDENT_COURSES: '/studentcourse'
};

export const STUDENT_ENDPOINTS = {
    ADD: '/addstudent',
    VIEW_ALL: '/viewstudents',
    DELETE: '/deletestudent'
};

export const FACULTY_ENDPOINTS = {
    ADD: '/addfaculty',
    VIEW_ALL: '/getfaculty',
    DELETE: '/deletefaculty'
};

export const ATTENDANCE_ENDPOINTS = {
    SUBMIT: '/submitattendance',
    VIEW: '/viewattendance'
};

export const FEEDBACK_ENDPOINTS = {
    SUBMIT: '/feedback',
    VIEW: '/viewfeedback'
};

export const MENU_ENDPOINTS = {
    STUDENT_MENU: '/home/menu',
    STUDENT_SUBMENU: '/home/menus',
    FACULTY_MENU: '/fmenu',
    FACULTY_SUBMENU: '/fmenus',
    ADMIN_MENU: '/amenu',
    ADMIN_SUBMENU: '/amenus'
};

export default api;
