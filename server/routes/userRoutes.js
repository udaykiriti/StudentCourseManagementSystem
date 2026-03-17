const express = require('express');
const router = express.Router();
const { getDB } = require('../config/db');
const { hashPassword, comparePassword } = require('../utils/auth');
const { verifySession } = require('../middleware/auth');

router.post('/uname', verifySession, async (req, res) => {
    try {
        const db = getDB();
        const users = db.collection('users');
        const data = await users.find({ emailid: req.body.emailid }, {
            projection: { firstname: 1, lastname: 1, _id: 0 }
        }).toArray();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/myprofile/info', verifySession, async (req, res) => {
    try {
        const db = getDB();
        const users = db.collection('users');
        const userData = await users.findOne({ emailid: req.body.emailid });
        if (userData) {
            res.json([userData]);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/cp/updatepwd', verifySession, async (req, res) => {
    try {
        const { emailid, oldPassword, pwd } = req.body;

        if (!oldPassword || !pwd) {
            return res.status(400).json({ error: 'Old password and new password are required' });
        }

        const db = getDB();
        const users = db.collection('users');

        const user = await users.findOne({ emailid });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await comparePassword(oldPassword, user.pwd);
        if (!isMatch) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        const hashedPassword = await hashPassword(pwd);
        await users.updateOne({ emailid }, { $set: { pwd: hashedPassword } });
        res.json({ message: 'Password has been updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
