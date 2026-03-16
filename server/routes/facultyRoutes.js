const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const { url } = require('../config/db');
const { verifySession, checkRole, ROLES } = require('../middleware/auth');
const { hashPassword } = require('../utils/auth');
const {
    generateFacultyId,
    generateUniversityEmail,
    generateFacultyPassword,
    DEPARTMENT_CODES
} = require('../utils/idGenerator');

// Add Faculty - Manual Entry
router.post('/admin/add-faculty', verifySession, checkRole(ROLES.ADMIN), async (req, res) => {
    let client;
    try {
        const {
            joiningYear, department, designation, employeeType,
            firstName, middleName, lastName, dateOfBirth, gender,
            primaryMobile, personalEmail,
            qualifications
        } = req.body;

        client = new MongoClient(url);
        await client.connect();
        const db = client.db('MSWD');
        const faculty = db.collection('faculty');
        const users = db.collection('users');

        // Get department code
        const departmentCode = DEPARTMENT_CODES[department] || 'GEN';

        // Generate Faculty ID
        const facultyId = await generateFacultyId(joiningYear, departmentCode);

        // Generate University Email
        const universityEmail = generateUniversityEmail(facultyId);

        // Generate Password
        const defaultPassword = generateFacultyPassword(joiningYear);
        const hashedPassword = await hashPassword(defaultPassword);

        // Check if email already exists
        const existingUser = await users.findOne({
            $or: [
                { emailid: universityEmail },
                { emailid: personalEmail }
            ]
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Create faculty record
        const facultyRecord = {
            facultyId,
            universityEmail,
            personal: {
                firstName,
                middleName: middleName || '',
                lastName,
                dateOfBirth: new Date(dateOfBirth),
                gender
            },
            contact: {
                primaryMobile,
                personalEmail: personalEmail || '',
                currentAddress: {},
                permanentAddress: {}
            },
            professional: {
                joiningYear: parseInt(joiningYear),
                joiningDate: new Date(),
                department,
                departmentCode,
                designation,
                employeeType,
                qualifications: qualifications || []
            },
            account: {
                isActive: true,
                isProfileComplete: false,
                isFirstLogin: true,
                mustChangePassword: true
            },
            createdAt: new Date(),
            updatedAt: new Date()
        };

        await faculty.insertOne(facultyRecord);

        // Create user account
        const userRecord = {
            firstname: firstName,
            lastname: lastName,
            emailid: universityEmail,
            pwd: hashedPassword,
            role: 'faculty',
            mobileno: primaryMobile,
            facultyId,
            isFirstLogin: true,
            profileComplete: false,
            createdAt: new Date()
        };

        await users.insertOne(userRecord);

        res.json({
            success: true,
            message: 'Faculty added successfully',
            facultyId,
            universityEmail,
            defaultPassword
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (client) await client.close();
    }
});

// Bulk Upload Faculty
router.post('/admin/bulk-upload-faculty', verifySession, checkRole(ROLES.ADMIN), async (req, res) => {
    let client;
    try {
        const { faculty: facultyData } = req.body;

        if (!facultyData || !Array.isArray(facultyData)) {
            return res.status(400).json({ error: 'Invalid data format' });
        }

        client = new MongoClient(url);
        await client.connect();
        const db = client.db('MSWD');
        const facultyCollection = db.collection('faculty');
        const usersCollection = db.collection('users');

        const results = {
            total: facultyData.length,
            successful: 0,
            failed: 0,
            errors: []
        };

        for (let i = 0; i < facultyData.length; i++) {
            try {
                const fac = facultyData[i];

                const departmentCode = DEPARTMENT_CODES[fac.department] || 'GEN';
                const facultyId = await generateFacultyId(fac.joiningYear, departmentCode);
                const universityEmail = generateUniversityEmail(facultyId);
                const defaultPassword = generateFacultyPassword(fac.joiningYear);
                const hashedPassword = await hashPassword(defaultPassword);

                // Check duplicates
                const existing = await usersCollection.findOne({ emailid: universityEmail });
                if (existing) {
                    results.failed++;
                    results.errors.push({
                        row: i + 1,
                        name: `${fac.firstName} ${fac.lastName}`,
                        error: 'Email already exists'
                    });
                    continue;
                }

                // Create faculty record
                const facultyRecord = {
                    facultyId,
                    universityEmail,
                    personal: {
                        firstName: fac.firstName,
                        middleName: fac.middleName || '',
                        lastName: fac.lastName,
                        dateOfBirth: new Date(fac.dateOfBirth),
                        gender: fac.gender
                    },
                    contact: {
                        primaryMobile: fac.primaryMobile,
                        personalEmail: fac.personalEmail || ''
                    },
                    professional: {
                        joiningYear: parseInt(fac.joiningYear),
                        department: fac.department,
                        departmentCode,
                        designation: fac.designation,
                        employeeType: fac.employeeType
                    },
                    account: {
                        isActive: true,
                        isProfileComplete: false,
                        isFirstLogin: true
                    },
                    createdAt: new Date()
                };

                await facultyCollection.insertOne(facultyRecord);

                // Create user account
                await usersCollection.insertOne({
                    firstname: fac.firstName,
                    lastname: fac.lastName,
                    emailid: universityEmail,
                    pwd: hashedPassword,
                    role: 'faculty',
                    mobileno: fac.primaryMobile,
                    facultyId,
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

// Get all faculty
router.get('/admin/faculty', verifySession, checkRole(ROLES.ADMIN), async (req, res) => {
    let client;
    try {
        const { department, designation, search } = req.query;

        client = new MongoClient(url);
        await client.connect();
        const db = client.db('MSWD');
        const faculty = db.collection('faculty');

        let query = {};

        if (department) query['professional.department'] = department;
        if (designation) query['professional.designation'] = designation;

        if (search) {
            const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            query.$or = [
                { facultyId: new RegExp(escaped, 'i') },
                { 'personal.firstName': new RegExp(escaped, 'i') },
                { 'personal.lastName': new RegExp(escaped, 'i') }
            ];
        }

        const facultyList = await faculty.find(query).sort({ createdAt: -1 }).toArray();

        res.json({ success: true, faculty: facultyList });

    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (client) await client.close();
    }
});

// Get faculty by ID
router.get('/admin/faculty/:id', verifySession, checkRole(ROLES.ADMIN), async (req, res) => {
    let client;
    try {
        client = new MongoClient(url);
        await client.connect();
        const db = client.db('MSWD');
        const faculty = db.collection('faculty');

        const facultyMember = await faculty.findOne({ facultyId: req.params.id });

        if (!facultyMember) {
            return res.status(404).json({ error: 'Faculty not found' });
        }

        res.json({ success: true, faculty: facultyMember });

    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (client) await client.close();
    }
});

// Update faculty
router.put('/admin/faculty/:id', verifySession, checkRole(ROLES.ADMIN), async (req, res) => {
    let client;
    try {
        const updates = req.body;

        client = new MongoClient(url);
        await client.connect();
        const db = client.db('MSWD');
        const faculty = db.collection('faculty');

        await faculty.updateOne(
            { facultyId: req.params.id },
            {
                $set: {
                    ...updates,
                    updatedAt: new Date()
                }
            }
        );

        res.json({ success: true, message: 'Faculty updated successfully' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (client) await client.close();
    }
});

// Delete faculty
router.delete('/admin/faculty/:id', verifySession, checkRole(ROLES.ADMIN), async (req, res) => {
    let client;
    try {
        client = new MongoClient(url);
        await client.connect();
        const db = client.db('MSWD');
        const faculty = db.collection('faculty');
        const users = db.collection('users');

        const facultyMember = await faculty.findOne({ facultyId: req.params.id });

        if (facultyMember) {
            await faculty.deleteOne({ facultyId: req.params.id });
            await users.deleteOne({ facultyId: req.params.id });

            res.json({ success: true, message: 'Faculty deleted successfully' });
        } else {
            res.status(404).json({ error: 'Faculty not found' });
        }

    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (client) await client.close();
    }
});

module.exports = router;
