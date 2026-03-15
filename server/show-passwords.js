const { MongoClient } = require('mongodb');
const { url } = require('./config/db');

async function showPasswords() {
    let client;
    try {
        client = new MongoClient(url);
        await client.connect();

        const db = client.db('MSWD');
        const students = db.collection('students');
        const faculty = db.collection('faculty');

        console.log('\n=== STUDENT CREDENTIALS ===\n');

        const studentRecords = await students.find({}).toArray();
        for (const student of studentRecords) {
            console.log(`Name: ${student.personal.firstName} ${student.personal.lastName}`);
            console.log(`Student ID: ${student.studentId}`);
            console.log(`Email: ${student.universityEmail}`);
            console.log(`Date of Birth: ${student.personal.dateOfBirth}`);

            // Calculate password from DOB
            const dob = new Date(student.personal.dateOfBirth);
            const dd = String(dob.getDate()).padStart(2, '0');
            const mm = String(dob.getMonth() + 1).padStart(2, '0');
            const yy = String(dob.getFullYear()).slice(-2);
            const password = `Univ@${dd}${mm}${yy}`;

            console.log(`PASSWORD: ${password}`);
            console.log(`(Format: Univ@DDMMYY where DOB is ${dd}/${mm}/${dob.getFullYear()})`);
            console.log('');
        }

        console.log('\n=== FACULTY CREDENTIALS ===\n');

        const facultyRecords = await faculty.find({}).toArray();
        for (const fac of facultyRecords) {
            console.log(`Name: ${fac.personal.firstName} ${fac.personal.lastName}`);
            console.log(`Faculty ID: ${fac.facultyId}`);
            console.log(`Email: ${fac.universityEmail}`);
            console.log(`Joining Year: ${fac.professional.joiningYear}`);

            const password = `Prof@${fac.professional.joiningYear}!`;
            console.log(`PASSWORD: ${password}`);
            console.log('');
        }

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        if (client) await client.close();
    }
}

showPasswords();
