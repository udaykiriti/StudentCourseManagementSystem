const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');

router.post('/book/addnewcourse', async (req, res) => {
    try {
        const db = getDB();
        const courses = db.collection('addnewcourse');
        const existingCourse = await courses.findOne({
            $or: [{ courseCode: req.body.courseCode }, { courseName: req.body.courseName }]
        });
        if (existingCourse) {
            return res.status(400).json({ error: "Course with the same courseCode or courseName already exists." });
        }
        await courses.insertOne(req.body);
        res.json("Course added successfully...");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/viewcourses', async (req, res) => {
    try {
        const db = getDB();
        const courses = db.collection('addnewcourse');
        const courseData = await courses.find().toArray();
        res.json(courseData.length > 0 ? courseData : []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/coursenames', async (req, res) => {
    try {
        const db = getDB();
        const courses = db.collection('addnewcourse');
        const courseData = await courses.find({}, {
            projection: { _id: 0, courseName: 1, sectionNumber: 1, facultyName: 1, semester: 1, year: 1, description: 1 }
        }).toArray();
        res.json(courseData.length > 0 ? courseData : []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/addcourse', async (req, res) => {
    try {
        const db = getDB();
        const courses = db.collection('addcourse');
        await courses.insertOne(req.body);
        res.json("Course added successfully...");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/deletecourse', async (req, res) => {
    try {
        const db = getDB();
        const courses = db.collection('addnewcourse');
        const { courseName } = req.body;
        const result = await courses.deleteOne({ courseName: courseName });
        if (result.deletedCount > 0) {
            res.json({ alert: 'Course deleted successfully' });
        } else {
            res.status(404).json({ error: 'Course not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/deletecourse/:id', async (req, res) => {
    try {
        const db = getDB();
        const courses = db.collection('addcourse');
        const result = await courses.deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 1) {
            res.json({ message: 'Course deleted successfully' });
        } else {
            res.status(404).json({ error: 'Course not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/studentcourse', async (req, res) => {
    try {
        const db = getDB();
        const courses = db.collection('addcourse');
        const courseData = await courses.find().toArray();
        res.json(courseData.length > 0 ? courseData : []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
