const express = require('express');
const router = express.Router();
const { getDB } = require('../config/db');

// Student Profile Setup
router.post('/student/profile/setup', async (req, res) => {
    try {
        const { studentId, profile } = req.body;

        const db = getDB();
        const students = db.collection('students');
        const users = db.collection('users');

        // Update student profile
        await students.updateOne(
            { studentId },
            {
                $set: {
                    profile,
                    'account.profileComplete': true,
                    'account.isFirstLogin': false,
                    'account.profileCompletionPercentage': 100,
                    updatedAt: new Date()
                }
            }
        );

        // Update users collection
        await users.updateOne(
            { studentId },
            {
                $set: {
                    profileComplete: true,
                    isFirstLogin: false
                }
            }
        );

        res.json({ success: true, message: 'Profile completed successfully' });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Faculty Profile Setup
router.post('/faculty/profile/setup', async (req, res) => {
    try {
        const { facultyId, profile } = req.body;

        const db = getDB();
        const faculty = db.collection('faculty');
        const users = db.collection('users');

        // Update faculty profile
        await faculty.updateOne(
            { facultyId },
            {
                $set: {
                    profile,
                    'account.profileComplete': true,
                    'account.isFirstLogin': false,
                    'account.profileCompletionPercentage': 100,
                    updatedAt: new Date()
                }
            }
        );

        // Update users collection
        await users.updateOne(
            { facultyId },
            {
                $set: {
                    profileComplete: true,
                    isFirstLogin: false
                }
            }
        );

        res.json({ success: true, message: 'Profile completed successfully' });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get Student Profile
router.get('/student/profile/:studentId', async (req, res) => {
    try {
        const db = getDB();
        const students = db.collection('students');

        const student = await students.findOne({ studentId: req.params.studentId });

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        res.json({ success: true, student });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get Faculty Profile
router.get('/faculty/profile/:facultyId', async (req, res) => {
    try {
        const db = getDB();
        const faculty = db.collection('faculty');

        const facultyMember = await faculty.findOne({ facultyId: req.params.facultyId });

        if (!facultyMember) {
            return res.status(404).json({ success: false, message: 'Faculty not found' });
        }

        res.json({ success: true, faculty: facultyMember });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Update Student Profile
router.put('/student/profile/:studentId', async (req, res) => {
    try {
        const { profile } = req.body;

        const db = getDB();
        const students = db.collection('students');

        await students.updateOne(
            { studentId: req.params.studentId },
            {
                $set: {
                    profile,
                    updatedAt: new Date()
                }
            }
        );

        res.json({ success: true, message: 'Profile updated successfully' });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Update Faculty Profile
router.put('/faculty/profile/:facultyId', async (req, res) => {
    try {
        const { profile } = req.body;

        const db = getDB();
        const faculty = db.collection('faculty');

        await faculty.updateOne(
            { facultyId: req.params.facultyId },
            {
                $set: {
                    profile,
                    updatedAt: new Date()
                }
            }
        );

        res.json({ success: true, message: 'Profile updated successfully' });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
