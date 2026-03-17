const { MongoClient } = require('mongodb');

const url = process.env.MONGODB_URI;
const client = new MongoClient(url);
const dbName = 'MSWD';

let db = null;

const connectDB = async () => {
    try {
        await client.connect();
        db = client.db(dbName);
        console.log('Connected to MongoDB Atlas');
        return db;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

const getDB = () => {
    if (!db) {
        throw new Error('Database not initialized. Call connectDB() first.');
    }
    return db;
};

const getClient = () => client;

module.exports = { connectDB, getDB, getClient, url };
