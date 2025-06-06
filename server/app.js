const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const app = express();
app.use(express.json());
app.use(cors());
const nodemailer = require('nodemailer');
const { ObjectId } = require('mongodb');
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// Configuration (MongoDB)
const url = "mongodb+srv://admin:admin@cluster0.jlh9clx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(url);
// Define roles
const ROLES = {
  STUDENT: 'student',
  FACULTY: 'faculty',
  ADMIN: 'admin'
};
// Middleware to check user role
function checkRole(role) {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (userRole === role) {
      next();
    } else {
      res.status(403).json({ error: 'Unauthorized' });
    }
  };
}
// Routes
// TESTING
app.get('/klef/test', async function(req, res){
    res.json("Koneru Lakshmaiah Education Foundation");
});
// REGISTRATION MODULE
app.post('/registration/signup', async function(req, res){
    try {
        const conn = await client.connect();
        const db = conn.db('MSWD');
        const users = db.collection('users');
        const data = await users.insertOne(req.body);
        conn.close();
        res.json("Registered successfully...");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// LOGIN MODULE
app.post('/login/signin', async function(req, res){
    try {
        const conn = await client.connect();
        const db = conn.db('MSWD');
        const users = db.collection('users');
        const data = await users.count(req.body);
        conn.close();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// HOME MODULE
app.post('/uname', async function(req, res){
    try {
        const conn = await client.connect();
        const db = conn.db('MSWD');
        const users = db.collection('users');
        const data = await users.find(req.body, { projection: { firstname: true, lastname: true } }).toArray();
        conn.close();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Faculty UNAME
// HOME MENU
app.post('/home/menu', async function(req, res){
    try {
        const conn = await client.connect();
        const db = conn.db('MSWD');
        const menu = db.collection('menu');
        const data = await menu.find({}).sort({mid: 1}).toArray();
        conn.close();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// HOME MENUS
app.post('/home/menus', async function(req, res){
    try {
        const conn = await client.connect();
        const db = conn.db('MSWD');
        const menus = db.collection('menus');
        const data = await menus.find(req.body).sort({smid: 1}).toArray();
        conn.close();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Faculty Menu
app.post('/fmenu', async function(req, res){
    try {
        const conn = await client.connect();
        const db = conn.db('MSWD');
        const fmenu = db.collection('fmenu'); // Assuming 'fmenu' is the collection name for faculty menu items
        const data = await fmenu.find({}).sort({mid: 1}).toArray();
        conn.close();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Faculty Menus
app.post('/fmenus', async function(req, res){
    try {
        const conn = await client.connect();
        const db = conn.db('MSWD');
        const fmenus = db.collection('fmenus'); // Assuming 'fmenus' is the collection name for faculty submenus
        const data = await fmenus.find(req.body).sort({smid: 1}).toArray();
        conn.close();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Admin Menu
app.post('/amenu', async function(req, res){
    try {
        const conn = await client.connect();
        const db = conn.db('MSWD');
        const amenu = db.collection('amenu'); // Assuming 'amenu' is the collection name for admin menu items
        const data = await amenu.find({}).sort({mid: 1}).toArray();
        conn.close();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Admin Menus
app.post('/amenus', async function(req, res){
    try {
        const conn = await client.connect();
        const db = conn.db('MSWD');
        const amenus = db.collection('amenus'); // Assuming 'amenus' is the collection name for admin submenus
        const data = await amenus.find(req.body).sort({smid: 1}).toArray();
        conn.close();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// CHANGE PASSWORD
app.post('/cp/updatepwd', async function(req, res){
    try {
        const conn = await client.connect();
        const db = conn.db('MSWD');
        const users = db.collection('users');
        const data = await users.updateOne({ emailid: req.body.emailid }, { $set: { pwd: req.body.pwd }});
        conn.close();
        res.json("Password has been updated");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// ADD COURSE
app.post('/book/addnewcourse', async function(req, res){
    try {
        const conn = await client.connect();
        const db = conn.db('MSWD');
        const courses = db.collection('addnewcourse');
        const existingCourse = await courses.findOne({ $or: [{ courseCode: req.body.courseCode }, { courseName: req.body.courseName }] });
        if (existingCourse) {
            conn.close();
            return res.status(400).json({ error: "Course with the same courseCode or courseName already exists. Please choose another." });
        }
        const data = await courses.insertOne(req.body);
        conn.close();
        res.json("Course added successfully...");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// MY PROFILE
app.post('/myprofile/info', async (req, res) => {
    try {
        const conn = await client.connect();
        const db = conn.db('MSWD');
        const users = db.collection('users');
        const userData = await users.findOne({ emailid: req.body.emailid });
        conn.close();
        
        if (userData) {
            res.json([userData]);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// VIEW COURSES
app.get('/viewcourses', async (req, res) => {
    try {
        const conn = await client.connect();
        const db = conn.db('MSWD');
        const courses = db.collection('addnewcourse');
        const courseData = await courses.find().toArray();
        conn.close();
        if (courseData.length > 0) {
            res.json(courseData);
        } else {
            res.status(404).json({ error: 'No courses found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// routes for different roles
// Faculty 
app.post('/facultypage', checkRole(ROLES.FACULTY), async function (req, res) {
    try {
        // Logic specific to faculty 
        res.json({ message: 'Welcome to Faculty ' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Admin 
app.post('/adminpage', checkRole(ROLES.ADMIN), async function (req, res) {
    try {
        // Logic specific to admin page
        res.json({ message: 'Welcome to Admin ' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// ADD COURSE(student for fetching)
app.get('/coursenames', async (req, res) => {
    try {
        const conn = await client.connect();
        const db = conn.db('MSWD');
        const courses = db.collection('addnewcourse');
        const courseData = await courses.find({}, { projection: { _id: 0, courseName: 1, sectionNumber: 1, facultyName: 1, semester: 1, year: 1,description:1 } }).toArray();
        conn.close();

        if (courseData.length > 0) {
            res.json(courseData);
        } else {
            res.status(404).json({ error: 'No courses found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
//posting add course of student to database 
app.post('/addcourse', async function(req, res){
    try {
        const conn = await client.connect();
        const db = conn.db('MSWD');
        const courses = db.collection('addcourse');
        const data = await courses.insertOne(req.body);
        conn.close();
        res.json("Course added successfully...");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE COURSE(Admin Module)
app.delete('/deletecourse', async (req, res) => {
    try {
        const conn = await client.connect();
        const db = conn.db('MSWD');
        const courses = db.collection('addnewcourse');
        const { courseName } = req.body;
        const result = await courses.deleteOne({ courseName: courseName });
        conn.close();
        if (result.deletedCount > 0) {
            res.json({ alert: 'Course deleted successfully' });
        } else {
            res.status(404).json({ error: 'Course not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
//AddStudent(Faculty Modules)
app.post('/addstudent', async (req, res) => {
    try {
        const conn = await client.connect();
        const db = conn.db('MSWD');
        const students = db.collection('Addstudent');
        
        const existingStudent = await students.findOne({ studentId: req.body.studentId });
        if (existingStudent) {
            conn.close();
            return res.status(400).json({ error: "Student ID already exists. Please choose another ID." });
        }
        const data = await students.insertOne(req.body);
        conn.close();
        res.json("Student added successfully...");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//View Students(Faculty Module)
app.get('/viewstudents', async (req, res) => {
    try {
        const conn = await client.connect();
        const db = conn.db('MSWD');
        const students = db.collection('Addstudent');
        const data = await students.find({}).toArray();
        conn.close();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
//View Faculty(Admin Module)
app.get('/api/faculty', async (req, res) => {
    try {
      const conn = await client.connect();
      const db = conn.db('MSWD');
      const users = db.collection('users');
      const facultyData = await users.find({ role: 'faculty' }).toArray();
      conn.close();
      res.json(facultyData);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post('/addfaculty', async (req, res) => {
    try {
        const conn = await client.connect();
        const db = conn.db('MSWD');
        const faculties = db.collection('addfaculty');
        
        // Check if faculty ID already exists
        const existingFaculty = await faculties.findOne({ facultyId: req.body.facultyId });
        if (existingFaculty) {
            conn.close();
            return res.status(400).json({ error: "Faculty ID already exists. Please choose another ID." });
        }

        // If faculty ID is unique, proceed to add the faculty
        const data = await faculties.insertOne(req.body);
        conn.close();
        res.json("Faculty added successfully...");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/getfaculty', async (req, res) => {
    try {
        const conn = await client.connect();
        const db = conn.db('MSWD');
        const facultyCollection = db.collection('addfaculty');
        const facultyData = await facultyCollection.find({}).toArray();
        conn.close();
        res.json(facultyData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.delete('/deletefaculty/:id', async (req, res) => {
    try {
        const facultyId = req.params.id;
        const conn = await client.connect();
        const db = conn.db('MSWD');
        const facultyCollection = db.collection('addfaculty');
        const deletedFaculty = await facultyCollection.deleteOne({ facultyId: facultyId });
        conn.close();

        if (deletedFaculty.deletedCount === 1) {
            res.json("Faculty deleted successfully.");
        } else {
            res.status(404).json({ error: "Faculty not found." });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
//Student Course(Viewing Courses)
app.get('/studentcourse', async (req, res) => {
    try {
        const conn = await client.connect();
        const db = conn.db('MSWD');
        const courses = db.collection('addcourse');
        const courseData = await courses.find().toArray();
        conn.close();

        if (courseData.length > 0) {
            res.json(courseData);
        } else {
            res.status(404).json({ error: 'No courses found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.delete('/deletecourse/:id', async (req, res) => {
    try {
        const courseId = req.params.id;
        const conn = await client.connect();
        const db = conn.db('MSWD');
        const courses = db.collection('addcourse');
        // Delete the course from the database
        const result = await courses.deleteOne({ _id: ObjectId(courseId) });
        conn.close();

        if (result.deletedCount === 1) {
            res.json({ message: 'Course deleted successfully' });
        } else {
            res.status(404).json({ error: 'Course not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.delete('/deletestudent/:id', async (req, res) => {
    try {
        const studentId = req.params.id; // Corrected variable name from facultyId to studentId
        const conn = await client.connect();
        const db = conn.db('MSWD');
        const studentCollection = db.collection('Addstudent');
        const deletedStudent = await studentCollection.deleteOne({ studentId: studentId }); // Corrected variable name from deletedFaculty to deletedStudent
        conn.close();

        if (deletedStudent.deletedCount === 1) { // Corrected variable name from deletedFaculty to deletedStudent
            res.json("Student deleted successfully.");
        } else {
            res.status(404).json({ error: "Student not found." }); // Changed error message to match the context
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.post('/sendemail', async function(req, res){
    try
    {
        var transport = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 445,
            secure: true,
            auth:{user: "gollaprashanth5@gmail.com", pass: "acfhxzispfidsduc"}
        });

        var emaildata = {
            from: "gollaprashanth5@gmail.com",
            to: "prasanthgolla29@gmail.com",
            subject: "Testing Email 2.0",
            text: "This is a testing email message..."
        };

        transport.sendMail(emaildata, function(err, info){
            if(err)
                return res.json("Failed to sent Email");

            res.json("Email sent successfully");
        });
    }catch(err)
    {
        res.json(err).status(404);
    }
});
app.post('/sendotp', async function(req, res) {
    try {
        const email = req.body.email;
        const otp = generateOTP();
        otps[email] = otp;
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'gollaprashanth5@gmail.com', 
                pass: 'acfhxzispfidsduc'
            }
        });
        const mailOptions = {
            from: 'gollaprashanth5@gmail.com',
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}`
        };
        await transport.sendMail(mailOptions);
        res.json({ message: 'OTP sent successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.post('/resetpassword', async function(req, res) {
    try {
        const email = req.body.email;
        const otp = req.body.otp;
        const newPassword = req.body.newPassword;
        if (otps[email] && otps[email] === parseInt(otp)) {
            const conn = await client.connect();
            const db = conn.db('MSWD');
            const users = db.collection('users');
            await users.updateOne({ email: email }, { $set: { password: newPassword } });
            delete otps[email];
            res.json({ message: 'Password reset successful' });
        } else {
            res.status(400).json({ error: 'Invalid OTP' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
//ATTENDANCE
// Endpoint to submit attendance
app.post('/submitattendance', async (req, res) => {
    try {
        const db = client.db('MSWD');
        const attendanceCollection = db.collection('attendance');

        const { course, attendanceData } = req.body;

        const result = await attendanceCollection.insertOne({
            course: course,
            attendanceData: attendanceData,
        });

        if (result.insertedCount === 1) {
            res.status(200).json({ message: 'Attendance data stored successfully' });
        } else {
            res.status(500).json({ error: 'Failed to store attendance data' });
        }
    } catch (error) {
        console.error('Error storing attendance data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Endpoint to fetch attendance data
app.get('/viewattendance', async (req, res) => {
    try {
        const conn = await client.connect();
        const db = conn.db('MSWD');
        const attendanceCollection = db.collection('attendance');
        const attendanceData = await attendanceCollection.find().toArray();
        conn.close();
        const formattedAttendanceData = attendanceData.map(item => ({
            course: item.course,
            attendanceData: item.attendanceData
        }));

        res.json(formattedAttendanceData);
    } catch (err) {
        console.error('Error fetching attendance data:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/feedback', async (req, res) => {
    try {
        const client = new MongoClient(url);
        await client.connect();
        const db = client.db('MSWD');
        const feedbackCollection = db.collection('feedback');
        const result = await feedbackCollection.insertOne(req.body);
        if (result.insertedCount === 1) {
            res.status(200).json({ message: 'Feedback submitted successfully' });
        } else {
            res.status(500).json({ error: 'Failed to store feedback data' });
        }
        client.close();
    } catch (error) {
        console.error('Error storing feedback data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/viewfeedback', async (req, res) => {
    try {
        const client = new MongoClient(url);
        await client.connect();
        const db = client.db('MSWD');
        const feedbackCollection = db.collection('feedback');
        const feedbackData = await feedbackCollection.find({}).toArray();
        await client.close();
        res.status(200).json(feedbackData);
    } catch (error) {
        console.error('Error fetching feedback data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/viewfeedback', async (req, res) => {
    try {
      const client = new MongoClient(url);
      await client.connect();
      const db = client.db('MSWD');
      const feedbackCollection = db.collection('feedback');
      const feedbackData = await feedbackCollection.find({}).toArray();
      res.status(200).json(feedbackData);
      
      client.close();
    } catch (error) {
      console.error('Error fetching feedback data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  app.post('/submitAttendance', async (req, res) => {
    try {
        await client.connect();
        const db = client.db('MSWDPro');
        const attendanceCollection = db.collection('attendance');
        const attendanceDocument = {
            courseName: req.body.courseName, // Include the course name in the document
            date: req.body.date,
            presentStudents: req.body.presentStudents.map(student => ({
                emailid: student.emailid,
                studentName: student.studentName,
                attendance: student.present ? 'present' : 'absent'
            }))
        };

        const result = await attendanceCollection.insertOne(attendanceDocument);

        if (result.insertedCount === 1) {
            res.status(200).json({ message: 'Attendance submitted successfully' });
        } else {
            res.status(200).json({ message: 'Failed to submit attendance' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        await client.close();
    }
});