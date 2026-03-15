const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const { url } = require('../config/db');
const { hashPassword } = require('../utils/auth');

router.post('/uname', async (req, res) => {
    let client;
    try {
        client = new MongoClient(url);
        await client.connect();
        const db = client.db('MSWD');
        const users = db.collection('users');
        const data = await users.find({ emailid: req.body.emailid }, {
            projection: { firstname: 1, lastname: 1, _id: 0 }
        }).toArray();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (client) await client.close();
    }
});

router.post('/myprofile/info', async (req, res) => {
    let client;
    try {
        client = new MongoClient(url);
        await client.connect();
        const db = client.db('MSWD');
        const users = db.collection('users');
        const userData = await users.findOne({ emailid: req.body.emailid });
        if (userData) {
            res.json([userData]);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (client) await client.close();
    }
});

router.post('/cp/updatepwd', async (req, res) => {
    let client;
    try {
        const { emailid, pwd } = req.body;
        const hashedPassword = await hashPassword(pwd);

        client = new MongoClient(url);
        await client.connect();
        const db = client.db('MSWD');
        const users = db.collection('users');
        await users.updateOne({ emailid: emailid }, { $set: { pwd: hashedPassword } });
        res.json("Password has been updated");
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (client) await client.close();
    }
});

module.exports = router;
