require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const studentRoutes = require('./routes/studentRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const menuRoutes = require('./routes/menuRoutes');
const profileRoutes = require('./routes/profileRoutes');

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.get('/klef/test', (req, res) => {
    res.json("Koneru Lakshmaiah Education Foundation");
});

app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/', courseRoutes);
app.use('/', studentRoutes);
app.use('/', facultyRoutes);
app.use('/', attendanceRoutes);
app.use('/', feedbackRoutes);
app.use('/', menuRoutes);
app.use('/', profileRoutes);

app.post('/submitAssignment', (req, res) => {
    res.status(500).json({ success: false, message: 'File upload not implemented on the server.' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;