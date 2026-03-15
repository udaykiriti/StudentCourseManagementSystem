const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const { url } = require('../config/db');

router.post('/home/menu', async (req, res) => {
    let client;
    try {
        client = new MongoClient(url);
        await client.connect();
        const db = client.db('MSWD');
        const menu = db.collection('menu');
        const data = await menu.find({}).sort({ mid: 1 }).toArray();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (client) await client.close();
    }
});

router.post('/home/menus', async (req, res) => {
    let client;
    try {
        client = new MongoClient(url);
        await client.connect();
        const db = client.db('MSWD');
        const menus = db.collection('menus');
        const data = await menus.find(req.body).sort({ smid: 1 }).toArray();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (client) await client.close();
    }
});

router.post('/fmenu', async (req, res) => {
    let client;
    try {
        client = new MongoClient(url);
        await client.connect();
        const db = client.db('MSWD');
        const fmenu = db.collection('fmenu');
        const data = await fmenu.find({}).sort({ mid: 1 }).toArray();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (client) await client.close();
    }
});

router.post('/fmenus', async (req, res) => {
    let client;
    try {
        client = new MongoClient(url);
        await client.connect();
        const db = client.db('MSWD');
        const fmenus = db.collection('fmenus');
        const data = await fmenus.find(req.body).sort({ smid: 1 }).toArray();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (client) await client.close();
    }
});

router.post('/amenu', async (req, res) => {
    let client;
    try {
        client = new MongoClient(url);
        await client.connect();
        const db = client.db('MSWD');
        const amenu = db.collection('amenu');
        const data = await amenu.find({}).sort({ mid: 1 }).toArray();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (client) await client.close();
    }
});

router.post('/amenus', async (req, res) => {
    let client;
    try {
        client = new MongoClient(url);
        await client.connect();
        const db = client.db('MSWD');
        const amenus = db.collection('amenus');
        const data = await amenus.find(req.body).sort({ smid: 1 }).toArray();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (client) await client.close();
    }
});

module.exports = router;
