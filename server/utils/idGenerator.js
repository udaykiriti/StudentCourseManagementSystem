const { MongoClient } = require('mongodb');
const { url } = require('../config/db');

/**
 * Generate Student ID: STU-YY-DDD-BBBB-NNN
 * Example: STU-22-BTE-CSEN-047
 */
async function generateStudentId(admissionYear, degreeCode, branchCode) {
    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db('MSWD');
        const students = db.collection('students');

        // Get last 2 digits of year
        const yy = admissionYear.toString().slice(-2);

        // Create prefix: STU-YY-DDD-BBBB
        const prefix = `STU-${yy}-${degreeCode}-${branchCode}`;

        // Find the last student with this prefix
        const lastStudent = await students
            .find({ studentId: new RegExp(`^${prefix}`) })
            .sort({ studentId: -1 })
            .limit(1)
            .toArray();

        let sequentialNumber = 1;

        if (lastStudent.length > 0) {
            // Extract the last 3 digits and increment
            const lastId = lastStudent[0].studentId;
            const lastSeq = parseInt(lastId.slice(-3));
            sequentialNumber = lastSeq + 1;
        }

        // Format sequential number with leading zeros (001, 002, etc.)
        const seqStr = sequentialNumber.toString().padStart(3, '0');

        return `${prefix}-${seqStr}`;

    } finally {
        await client.close();
    }
}

/**
 * Generate Faculty ID: FAC-YYYY-DDD-NNN
 * Example: FAC-2020-CSE-012
 */
async function generateFacultyId(joiningYear, departmentCode) {
    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db('MSWD');
        const faculty = db.collection('faculty');

        // Create prefix: FAC-YYYY-DDD
        const prefix = `FAC-${joiningYear}-${departmentCode}`;

        // Find the last faculty with this prefix
        const lastFaculty = await faculty
            .find({ facultyId: new RegExp(`^${prefix}`) })
            .sort({ facultyId: -1 })
            .limit(1)
            .toArray();

        let sequentialNumber = 1;

        if (lastFaculty.length > 0) {
            const lastId = lastFaculty[0].facultyId;
            const lastSeq = parseInt(lastId.slice(-3));
            sequentialNumber = lastSeq + 1;
        }

        const seqStr = sequentialNumber.toString().padStart(3, '0');

        return `${prefix}-${seqStr}`;

    } finally {
        await client.close();
    }
}

/**
 * Generate University Email from ID
 */
function generateUniversityEmail(id) {
    return `${id.toLowerCase()}@university.edu`;
}

/**
 * Generate Student Password from DOB
 * Format: Univ@DDMMYY
 */
function generateStudentPassword(dateOfBirth) {
    const date = new Date(dateOfBirth);
    const dd = date.getDate().toString().padStart(2, '0');
    const mm = (date.getMonth() + 1).toString().padStart(2, '0');
    const yy = date.getFullYear().toString().slice(-2);

    return `Univ@${dd}${mm}${yy}`;
}

/**
 * Generate Faculty Password from Joining Year
 * Format: Prof@YYYY!
 */
function generateFacultyPassword(joiningYear) {
    return `Prof@${joiningYear}!`;
}

// Degree Codes
const DEGREE_CODES = {
    'B.Tech': 'BTE',
    'M.Tech': 'MTE',
    'MBA': 'MBA',
    'BBA': 'BBA',
    'MCA': 'MCA',
    'B.Sc': 'BSC',
    'M.Sc': 'MSC',
    'Ph.D': 'PHD'
};

// Branch Codes
const BRANCH_CODES = {
    'Computer Science & Engineering': 'CSEN',
    'Electronics & Communication': 'ECEN',
    'AI & Data Science': 'AIDS',
    'CS & Information Technology': 'CSIT',
    'Mechanical Engineering': 'MECH',
    'Civil Engineering': 'CIVI',
    'Electrical & Electronics': 'EEEN',
    'Information Technology': 'ITEN',
    'Aeronautical Engineering': 'AERO',
    'Automobile Engineering': 'AUTO',
    'Chemical Engineering': 'CHEM',
    'Biomedical Engineering': 'BIOM'
};

// Department Codes (for Faculty)
const DEPARTMENT_CODES = {
    'Computer Science': 'CSE',
    'Electronics': 'ECE',
    'Mechanical': 'MECH',
    'Civil': 'CIVI',
    'Electrical': 'EEE',
    'IT': 'IT',
    'MBA': 'MBA',
    'Science': 'SCI'
};

module.exports = {
    generateStudentId,
    generateFacultyId,
    generateUniversityEmail,
    generateStudentPassword,
    generateFacultyPassword,
    DEGREE_CODES,
    BRANCH_CODES,
    DEPARTMENT_CODES
};
