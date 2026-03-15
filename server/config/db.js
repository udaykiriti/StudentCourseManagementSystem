const { MongoClient } = require('mongodb');

const url = process.env.MONGODB_URI;
const client = new MongoClient(url);
const dbName = 'MSWD';

const connectDB = async () => {
    try {
        await client.connect();
        console.log('Connected to MongoDB Atlas');
        return client.db(dbName);
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

const getDB = () => client.db(dbName);
const getClient = () => client;

module.exports = { connectDB, getDB, getClient, url };
