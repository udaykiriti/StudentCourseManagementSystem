const { MongoClient } = require('mongodb');
const { url } = require('./config/db');

async function checkUsers() {
    let client;
    try {
        client = new MongoClient(url);
        await client.connect();
        console.log('Connected to MongoDB...\n');

        const db = client.db('MSWD');
        const users = db.collection('users');

        // Get all users
        const allUsers = await users.find({}).toArray();

        console.log('=== ALL USERS IN DATABASE ===\n');

        allUsers.forEach((user, index) => {
            console.log(`${index + 1}. ${user.role.toUpperCase()}`);
            console.log(`   Email: ${user.emailid}`);
            console.log(`   Name: ${user.firstname} ${user.lastname}`);
            console.log(`   Password (hashed): ${user.pwd ? user.pwd.substring(0, 20) + '...' : 'NOT SET'}`);
            console.log(`   Password starts with $2: ${user.pwd ? user.pwd.startsWith('$2') : 'N/A'}`);
            console.log(`   Student ID: ${user.studentId || 'N/A'}`);
            console.log(`   Faculty ID: ${user.facultyId || 'N/A'}`);
            console.log(`   First Login: ${user.isFirstLogin}`);
            console.log(`   Profile Complete: ${user.profileComplete}`);
            console.log('');
        });

        console.log(`\nTotal users: ${allUsers.length}`);

        // Check students collection
        const students = db.collection('students');
        const studentCount = await students.countDocuments();
        console.log(`Students in students collection: ${studentCount}`);

        // Check faculty collection
        const faculty = db.collection('faculty');
        const facultyCount = await faculty.countDocuments();
        console.log(`Faculty in faculty collection: ${facultyCount}`);

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        if (client) await client.close();
        console.log('\nDatabase connection closed.');
    }
}

checkUsers();
