export const API_BASE_URL = 'http://localhost:5000';

export const ROLES = {
    STUDENT: 'student',
    FACULTY: 'faculty',
    ADMIN: 'admin'
};

export const ROUTES = {
    LOGIN: '/',
    FORGOT_PASSWORD: '/forgotpassword',
    STUDENT_HOME: '/studenthome',
    FACULTY_HOME: '/facultyhome',
    ADMIN_HOME: '/adminhome',
    STUDENT_PROFILE_SETUP: '/student-profile-setup',
    FACULTY_PROFILE_SETUP: '/faculty-profile-setup'
};

// Note: These menu structures are kept for reference but the paths are placeholders
// Features will be implemented as proper React components in the dashboards

export const STUDENT_MENU = [
    {
        mid: 'M001',
        mtitle: 'Courses',
        subMenus: [
            { smid: 'M00101', smtitle: 'Enroll in Course', path: '#' },
            { smid: 'M00102', smtitle: 'View All Courses', path: '#' },
            { smid: 'M00103', smtitle: 'My Enrolled Courses', path: '#' }
        ]
    },
    {
        mid: 'M101',
        mtitle: 'Profile',
        subMenus: [
            { smid: 'M10101', smtitle: 'My Profile', path: '#' },
            { smid: 'M10102', smtitle: 'Change Password', path: '#' }
        ]
    },
    {
        mid: 'M201',
        mtitle: 'Feedback',
        subMenus: [
            { smid: 'M20101', smtitle: 'Submit Feedback', path: '#' }
        ]
    },
    {
        mid: 'M301',
        mtitle: 'Assignments',
        subMenus: [
            { smid: 'M30101', smtitle: 'Submit Assignment', path: '#' }
        ]
    }
];

export const FACULTY_MENU = [
    {
        mid: 'F001',
        mtitle: 'Courses',
        subMenus: [
            { smid: 'F00101', smtitle: 'Create New Course', path: '#' },
            { smid: 'F00102', smtitle: 'View All Courses', path: '#' }
        ]
    },
    {
        mid: 'F101',
        mtitle: 'Profile',
        subMenus: [
            { smid: 'F10101', smtitle: 'My Profile', path: '#' },
            { smid: 'F10102', smtitle: 'Change Password', path: '#' }
        ]
    },
    {
        mid: 'F201',
        mtitle: 'Students',
        subMenus: [
            { smid: 'F20101', smtitle: 'View All Students', path: '#' },
            { smid: 'F20102', smtitle: 'Add Student', path: '#' },
            { smid: 'F20103', smtitle: 'Remove Student', path: '#' }
        ]
    },
    {
        mid: 'F301',
        mtitle: 'Attendance',
        subMenus: [
            { smid: 'F30101', smtitle: 'Mark Attendance', path: '#' },
            { smid: 'F30102', smtitle: 'View Attendance', path: '#' }
        ]
    }
];

export const ADMIN_MENU = [
    {
        mid: 'A001',
        mtitle: 'Courses',
        subMenus: [
            { smid: 'A00101', smtitle: 'Create New Course', path: '#' },
            { smid: 'A00102', smtitle: 'Delete Course', path: '#' }
        ]
    },
    {
        mid: 'A101',
        mtitle: 'Faculty Management',
        subMenus: [
            { smid: 'A10101', smtitle: 'Add Faculty', path: '#' },
            { smid: 'A10102', smtitle: 'View All Faculty', path: '#' },
            { smid: 'A10103', smtitle: 'Remove Faculty', path: '#' }
        ]
    },
    {
        mid: 'A102',
        mtitle: 'Profile',
        subMenus: [
            { smid: 'A10201', smtitle: 'My Profile', path: '#' },
            { smid: 'A10202', smtitle: 'Change Password', path: '#' }
        ]
    },
    {
        mid: 'A201',
        mtitle: 'Feedback',
        subMenus: [
            { smid: 'A20101', smtitle: 'View All Feedback', path: '#' }
        ]
    }
];
