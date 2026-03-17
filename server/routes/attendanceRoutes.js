const express = require('express');
const router = express.Router();
const { getDB } = require('../config/db');

router.post('/submitattendance', async (req, res) => {
    try {
        const db = getDB();
        const attendanceCollection = db.collection('attendance');
        const { course, attendanceData } = req.body;
        const result = await attendanceCollection.insertOne({
            course: course,
            attendanceData: attendanceData,
            date: new Date()
        });
        if (result.insertedId) {
            res.status(200).json({ message: 'Attendance data stored successfully' });
        } else {
            throw new Error('Failed to store attendance data');
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/viewattendance', async (req, res) => {
    try {
        const db = getDB();
        const attendanceCollection = db.collection('attendance');
        const attendanceData = await attendanceCollection.find().toArray();
        const formattedAttendanceData = attendanceData.map(item => ({
            course: item.course,
            attendanceData: item.attendanceData,
            date: item.date
        }));
        res.json(formattedAttendanceData);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
