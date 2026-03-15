const { MongoClient } = require('mongodb');
const { hashPassword } = require('./utils/auth');
const { url } = require('./config/db');

async function createTestUsers() {
    const client = new MongoClient(url);

    try {
        await client.connect();
        console.log('Connected to MongoDB...');

        const db = client.db('MSWD');
        const users = db.collection('users');
        const students = db.collection('students');
        const faculty = db.collection('faculty');

        // Clear existing test users
        await users.deleteMany({
            emailid: {
                $in: [
                    'admin@university.edu',
                    'faculty@university.edu',
                    'student@university.edu'
                ]
            }
        });

        console.log('Cleared existing test users...');

        // Hash passwords
        const adminPassword = await hashPassword('admin123');
        const facultyPassword = await hashPassword('faculty123');
        const studentPassword = await hashPassword('student123');

        // 1. Create Admin User
        await users.insertOne({
            firstname: 'Admin',
            lastname: 'User',
            emailid: 'admin@university.edu',
            pwd: adminPassword,
            role: 'admin',
            mobileno: '9999999999',
            isFirstLogin: false,
            profileComplete: true,
            createdAt: new Date()
        });
        console.log('✅ Admin user created');
        console.log('   Email: admin@university.edu');
        console.log('   Password: admin123');

        // 2. Create Faculty User
        const facultyId = 'FAC-2020-CSE-001';
        const facultyEmail = 'faculty@university.edu';

        await faculty.insertOne({
            facultyId,
            universityEmail: facultyEmail,
            personal: {
                firstName: 'Dr. John',
                middleName: 'Kumar',
                lastName: 'Smith',
                dateOfBirth: new Date('1985-05-15'),
                gender: 'Male'
            },
            contact: {
                primaryMobile: '9876543210',
                personalEmail: 'john.smith@email.com',
                currentAddress: {},
                permanentAddress: {}
            },
            professional: {
                joiningYear: 2020,
                joiningDate: new Date('2020-07-01'),
                department: 'Computer Science',
                departmentCode: 'CSE',
                designation: 'Associate Professor',
                employeeType: 'Permanent',
                qualifications: [
                    {
                        degree: 'Ph.D',
                        university: 'IIT Delhi',
                        specialization: 'Machine Learning',
                        yearOfPassing: 2015
                    },
                    {
                        degree: 'M.Tech',
                        university: 'NIT Warangal',
                        specialization: 'Computer Science',
                        yearOfPassing: 2010
                    }
                ]
            },
            account: {
                isActive: true,
                isProfileComplete: true,
                isFirstLogin: false,
                mustChangePassword: false
            },
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await users.insertOne({
            firstname: 'Dr. John',
            lastname: 'Smith',
            emailid: facultyEmail,
            pwd: facultyPassword,
            role: 'faculty',
            mobileno: '9876543210',
            facultyId,
            isFirstLogin: false,
            profileComplete: true,
            createdAt: new Date()
        });
        console.log('✅ Faculty user created');
        console.log('   Email: faculty@university.edu');
        console.log('   Password: faculty123');

        // 3. Create Student User
        const studentId = 'STU-22-BTE-CSEN-001';
        const studentEmail = 'student@university.edu';

        await students.insertOne({
            studentId,
            universityEmail: studentEmail,
            personal: {
                firstName: 'Aarav',
                middleName: 'Kumar',
                lastName: 'Sharma',
                dateOfBirth: new Date('2004-08-15'),
                gender: 'Male',
                bloodGroup: 'A+',
                nationality: 'Indian',
                category: 'General'
            },
            contact: {
                primaryMobile: '9123456789',
                personalEmail: 'aarav.sharma@email.com',
                currentAddress: {},
                permanentAddress: {}
            },
            academic: {
                admissionYear: 2022,
                admissionDate: new Date('2022-08-01'),
                degree: 'B.Tech',
                degreeCode: 'BTE',
                branch: 'Computer Science & Engineering',
                branchCode: 'CSEN',
                section: 'A',
                regulation: 'R22',
                currentSemester: 5,
                currentYear: 3,
                tenth: {
                    board: 'CBSE',
                    percentage: 95.5,
                    yearOfPassing: 2020
                },
                twelfth: {
                    board: 'State Board',
                    percentage: 92.3,
                    yearOfPassing: 2022,
                    stream: 'MPC'
                },
                entrance: {
                    examName: 'EAMCET',
                    rank: 1234,
                    score: 145.5
                }
            },
            account: {
                isActive: true,
                isProfileComplete: true,
                profileCompletionPercentage: 100,
                isFirstLogin: false,
                mustChangePassword: false,
                emailVerified: true,
                mobileVerified: true
            },
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await users.insertOne({
            firstname: 'Aarav',
            lastname: 'Sharma',
            emailid: studentEmail,
            pwd: studentPassword,
            role: 'student',
            mobileno: '9123456789',
            studentId,
            isFirstLogin: false,
            profileComplete: true,
            createdAt: new Date()
        });
        console.log('✅ Student user created');
        console.log('   Email: student@university.edu');
        console.log('   Password: student123');

        console.log('\n' + '='.repeat(50));
        console.log('✅ ALL TEST USERS CREATED SUCCESSFULLY!');
        console.log('='.repeat(50));
        console.log('\n📋 LOGIN CREDENTIALS:\n');
        console.log('1️⃣  ADMIN:');
        console.log('   Email: admin@university.edu');
        console.log('   Password: admin123\n');
        console.log('2️⃣  FACULTY:');
        console.log('   Email: faculty@university.edu');
        console.log('   Password: faculty123\n');
        console.log('3️⃣  STUDENT:');
        console.log('   Email: student@university.edu');
        console.log('   Password: student123\n');
        console.log('='.repeat(50));
        console.log('🚀 You can now login and test the system!');
        console.log('='.repeat(50));

    } catch (error) {
        console.error('❌ Error creating test users:', error);
    } finally {
        await client.close();
        console.log('\nDatabase connection closed.');
    }
}

createTestUsers();
