const express = require('express');
const router = express.Router();
const { getDB } = require('../config/db');

router.post('/home/menu', async (req, res) => {
    try {
        const db = getDB();
        const menu = db.collection('menu');
        const data = await menu.find({}).sort({ mid: 1 }).toArray();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/home/menus', async (req, res) => {
    try {
        const db = getDB();
        const menus = db.collection('menus');
        const data = await menus.find(req.body).sort({ smid: 1 }).toArray();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/fmenu', async (req, res) => {
    try {
        const db = getDB();
        const fmenu = db.collection('fmenu');
        const data = await fmenu.find({}).sort({ mid: 1 }).toArray();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/fmenus', async (req, res) => {
    try {
        const db = getDB();
        const fmenus = db.collection('fmenus');
        const data = await fmenus.find(req.body).sort({ smid: 1 }).toArray();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/amenu', async (req, res) => {
    try {
        const db = getDB();
        const amenu = db.collection('amenu');
        const data = await amenu.find({}).sort({ mid: 1 }).toArray();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/amenus', async (req, res) => {
    try {
        const db = getDB();
        const amenus = db.collection('amenus');
        const data = await amenus.find(req.body).sort({ smid: 1 }).toArray();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
