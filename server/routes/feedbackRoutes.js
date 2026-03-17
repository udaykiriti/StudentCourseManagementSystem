const express = require('express');
const router = express.Router();
const { getDB } = require('../config/db');

router.post('/feedback', async (req, res) => {
    try {
        const db = getDB();
        const feedbackCollection = db.collection('feedback');
        const result = await feedbackCollection.insertOne(req.body);
        if (result.insertedId) {
            res.status(200).json({ message: 'Feedback submitted successfully' });
        } else {
            throw new Error('Failed to store feedback data');
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/viewfeedback', async (req, res) => {
    try {
        const db = getDB();
        const feedbackCollection = db.collection('feedback');
        const feedbackData = await feedbackCollection.find({}).toArray();
        res.status(200).json(feedbackData);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
