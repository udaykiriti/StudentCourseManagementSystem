const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const { url } = require('../config/db');
const { verifySession, checkRole, ROLES } = require('../middleware/auth');
const { hashPassword } = require('../utils/auth');
const {
    generateStudentId,
    generateUniversityEmail,
    generateStudentPassword,
    DEGREE_CODES,
    BRANCH_CODES
} = require('../utils/idGenerator');

// Add Student - Manual Entry
router.post('/admin/add-student', verifySession, checkRole(ROLES.ADMIN), async (req, res) => {
    let client;
    try {
        const {
            admissionYear, degree, branch, section, regulation,
            firstName, middleName, lastName, dateOfBirth, gender, bloodGroup,
            category, nationality,
            primaryMobile, personalEmail,
            tenthBoard, tenthPercentage, tenthYear,
            twelfthBoard, twelfthPercentage, twelfthYear, twelfthStream,
            entranceExam, entranceRank, entranceScore
        } = req.body;

        client = new MongoClient(url);
        await client.connect();
        const db = client.db('MSWD');
        const students = db.collection('students');
        const users = db.collection('users');

        // Get degree and branch codes
        const degreeCode = DEGREE_CODES[degree];
        const branchCode = BRANCH_CODES[branch];

        // Generate Student ID
        const studentId = await generateStudentId(admissionYear, degreeCode, branchCode);

        // Generate University Email
        const universityEmail = generateUniversityEmail(studentId);

        // Generate Password from DOB
        const defaultPassword = generateStudentPassword(dateOfBirth);
        const hashedPassword = await hashPassword(defaultPassword);

        // Check if email or mobile already exists
        const existingUser = await users.findOne({
            $or: [
                { emailid: universityEmail },
                { emailid: personalEmail }
            ]
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Create student record
        const studentRecord = {
            studentId,
            universityEmail,
            personal: {
                firstName,
                middleName: middleName || '',
                lastName,
                dateOfBirth: new Date(dateOfBirth),
                gender,
                bloodGroup: bloodGroup || '',
                nationality: nationality || 'Indian',
                category: category || 'General'
            },
            contact: {
                primaryMobile,
                personalEmail: personalEmail || '',
                currentAddress: {},
                permanentAddress: {}
            },
            academic: {
                admissionYear: parseInt(admissionYear),
                admissionDate: new Date(),
                degree,
                degreeCode,
                branch,
                branchCode,
                section,
                regulation,
                currentSemester: 1,
                currentYear: 1,
                tenth: {
                    board: tenthBoard || '',
                    percentage: parseFloat(tenthPercentage) || 0,
                    yearOfPassing: parseInt(tenthYear) || 0
                },
                twelfth: {
                    board: twelfthBoard || '',
                    percentage: parseFloat(twelfthPercentage) || 0,
                    yearOfPassing: parseInt(twelfthYear) || 0,
                    stream: twelfthStream || ''
                },
                entrance: {
                    examName: entranceExam || '',
                    rank: parseInt(entranceRank) || 0,
                    score: parseFloat(entranceScore) || 0
                }
            },
            account: {
                isActive: true,
                isProfileComplete: false,
                profileCompletionPercentage: 30,
                isFirstLogin: true,
                mustChangePassword: true,
                emailVerified: false,
                mobileVerified: false
            },
            createdAt: new Date(),
            updatedAt: new Date()
        };

        await students.insertOne(studentRecord);

        // Create user account
        const userRecord = {
            firstname: firstName,
            lastname: lastName,
            emailid: universityEmail,
            pwd: hashedPassword,
            role: 'student',
            mobileno: primaryMobile,
            studentId,
            isFirstLogin: true,
            profileComplete: false,
            createdAt: new Date()
        };

        await users.insertOne(userRecord);

        res.json({
            success: true,
            message: 'Student added successfully',
            studentId,
            universityEmail,
            defaultPassword // Send this in response for admin to share
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (client) await client.close();
    }
});

// Bulk Upload Students
router.post('/admin/bulk-upload-students', verifySession, checkRole(ROLES.ADMIN), async (req, res) => {
    let client;
    try {
        const { students: studentsData } = req.body;

        if (!studentsData || !Array.isArray(studentsData)) {
            return res.status(400).json({ error: 'Invalid data format' });
        }

        client = new MongoClient(url);
        await client.connect();
        const db = client.db('MSWD');
        const studentsCollection = db.collection('students');
        const usersCollection = db.collection('users');

        const results = {
            total: studentsData.length,
            successful: 0,
            failed: 0,
            errors: []
        };

        for (let i = 0; i < studentsData.length; i++) {
            try {
                const student = studentsData[i];

                const degreeCode = DEGREE_CODES[student.degree];
                const branchCode = BRANCH_CODES[student.branch];

                const studentId = await generateStudentId(
                    student.admissionYear,
                    degreeCode,
                    branchCode
                );

                const universityEmail = generateUniversityEmail(studentId);
                const defaultPassword = generateStudentPassword(student.dateOfBirth);
                const hashedPassword = await hashPassword(defaultPassword);

                // Check duplicates
                const existing = await usersCollection.findOne({ emailid: universityEmail });
                if (existing) {
                    results.failed++;
                    results.errors.push({
                        row: i + 1,
                        name: `${student.firstName} ${student.lastName}`,
                        error: 'Email already exists'
                    });
                    continue;
                }

                // Create student record
                const studentRecord = {
                    studentId,
                    universityEmail,
                    personal: {
                        firstName: student.firstName,
                        middleName: student.middleName || '',
                        lastName: student.lastName,
                        dateOfBirth: new Date(student.dateOfBirth),
                        gender: student.gender,
                        bloodGroup: student.bloodGroup || '',
                        nationality: student.nationality || 'Indian',
                        category: student.category || 'General'
                    },
                    contact: {
                        primaryMobile: student.primaryMobile,
                        personalEmail: student.personalEmail || ''
                    },
                    academic: {
                        admissionYear: parseInt(student.admissionYear),
                        degree: student.degree,
                        degreeCode,
                        branch: student.branch,
                        branchCode,
                        section: student.section,
                        regulation: student.regulation,
                        currentSemester: 1,
                        currentYear: 1,
                        tenth: {
                            board: student.tenthBoard || '',
                            percentage: parseFloat(student.tenthPercentage) || 0,
                            yearOfPassing: parseInt(student.tenthYear) || 0
                        },
                        twelfth: {
                            board: student.twelfthBoard || '',
                            percentage: parseFloat(student.twelfthPercentage) || 0,
                            yearOfPassing: parseInt(student.twelfthYear) || 0,
                            stream: student.twelfthStream || ''
                        }
                    },
                    account: {
                        isActive: true,
                        isProfileComplete: false,
                        isFirstLogin: true
                    },
                    createdAt: new Date()
                };

                await studentsCollection.insertOne(studentRecord);

                // Create user account
                await usersCollection.insertOne({
                    firstname: student.firstName,
                    lastname: student.lastName,
                    emailid: universityEmail,
                    pwd: hashedPassword,
                    role: 'student',
                    mobileno: student.primaryMobile,
                    studentId,
                    isFirstLogin: true,
                    profileComplete: false,
                    createdAt: new Date()
                });

                results.successful++;

            } catch (err) {
                results.failed++;
                results.errors.push({
                    row: i + 1,
                    error: err.message
                });
            }
        }

        res.json({
            success: true,
            results
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (client) await client.close();
    }
});

// Get all students
router.get('/admin/students', verifySession, checkRole(ROLES.ADMIN), async (req, res) => {
    let client;
    try {
        const { year, degree, branch, section, search } = req.query;

        client = new MongoClient(url);
        await client.connect();
        const db = client.db('MSWD');
        const students = db.collection('students');

        let query = {};

        if (year) query['academic.admissionYear'] = parseInt(year);
        if (degree) query['academic.degree'] = degree;
        if (branch) query['academic.branch'] = branch;
        if (section) query['academic.section'] = section;

        if (search) {
            query.$or = [
                { studentId: new RegExp(search, 'i') },
                { 'personal.firstName': new RegExp(search, 'i') },
                { 'personal.lastName': new RegExp(search, 'i') },
                { 'contact.primaryMobile': new RegExp(search, 'i') }
            ];
        }

        const studentsList = await students.find(query).sort({ createdAt: -1 }).toArray();

        res.json({ success: true, students: studentsList });

    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (client) await client.close();
    }
});

// Get student by ID
router.get('/admin/students/:id', verifySession, checkRole(ROLES.ADMIN), async (req, res) => {
    let client;
    try {
        client = new MongoClient(url);
        await client.connect();
        const db = client.db('MSWD');
        const students = db.collection('students');

        const student = await students.findOne({ studentId: req.params.id });

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json({ success: true, student });

    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (client) await client.close();
    }
});

// Update student
router.put('/admin/students/:id', verifySession, checkRole(ROLES.ADMIN), async (req, res) => {
    let client;
    try {
        const updates = req.body;

        client = new MongoClient(url);
        await client.connect();
        const db = client.db('MSWD');
        const students = db.collection('students');

        await students.updateOne(
            { studentId: req.params.id },
            {
                $set: {
                    ...updates,
                    updatedAt: new Date()
                }
            }
        );

        res.json({ success: true, message: 'Student updated successfully' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (client) await client.close();
    }
});

// Delete student
router.delete('/admin/students/:id', verifySession, checkRole(ROLES.ADMIN), async (req, res) => {
    let client;
    try {
        client = new MongoClient(url);
        await client.connect();
        const db = client.db('MSWD');
        const students = db.collection('students');
        const users = db.collection('users');

        const student = await students.findOne({ studentId: req.params.id });

        if (student) {
            await students.deleteOne({ studentId: req.params.id });
            await users.deleteOne({ studentId: req.params.id });

            res.json({ success: true, message: 'Student deleted successfully' });
        } else {
            res.status(404).json({ error: 'Student not found' });
        }

    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (client) await client.close();
    }
});

module.exports = router;
