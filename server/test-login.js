const { MongoClient } = require('mongodb');
const { url } = require('./config/db');
const { comparePassword } = require('./utils/auth');

async function testLogin() {
    let client;
    try {
        client = new MongoClient(url);
        await client.connect();
        console.log('Connected to MongoDB...\n');

        const db = client.db('MSWD');
        const users = db.collection('users');

        // Test credentials
        const testCases = [
            { email: 'admin@university.edu', password: 'admin123', role: 'admin' },
            { email: 'stu-26-bte-csen-001@university.edu', password: 'Univ@150305', role: 'student' },
            { email: 'fac-2026-cse-001@university.edu', password: 'Prof@2026!', role: 'faculty' }
        ];

        console.log('=== TESTING LOGIN CREDENTIALS ===\n');

        for (const test of testCases) {
            console.log(`Testing ${test.role.toUpperCase()}: ${test.email}`);

            const user = await users.findOne({ emailid: test.email });

            if (!user) {
                console.log('❌ User NOT FOUND in database\n');
                continue;
            }

            console.log(`✅ User found in database`);
            console.log(`   Name: ${user.firstname} ${user.lastname}`);
            console.log(`   Password in DB: ${user.pwd.substring(0, 30)}...`);
            console.log(`   Is Hashed: ${user.pwd.startsWith('$2')}`);

            // Test password
            let isMatch = false;
            if (user.pwd && !user.pwd.startsWith('$2a$') && !user.pwd.startsWith('$2b$')) {
                // Plain text password
                isMatch = user.pwd === test.password;
                console.log(`   Password Type: Plain Text`);
            } else {
                // Hashed password
                isMatch = await comparePassword(test.password, user.pwd);
                console.log(`   Password Type: Hashed (bcrypt)`);
            }

            console.log(`   Testing password: "${test.password}"`);
            console.log(`   Password Match: ${isMatch ? '✅ YES' : '❌ NO'}`);
            console.log('');
        }

        // Show all users
        console.log('\n=== ALL USERS IN DATABASE ===\n');
        const allUsers = await users.find({}).toArray();
        allUsers.forEach((user, index) => {
            console.log(`${index + 1}. ${user.emailid}`);
            console.log(`   Role: ${user.role}`);
            console.log(`   Name: ${user.firstname} ${user.lastname}`);
            console.log(`   Password: ${user.pwd.substring(0, 20)}...`);
            console.log('');
        });

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        if (client) await client.close();
        console.log('Database connection closed.');
    }
}

testLogin();
