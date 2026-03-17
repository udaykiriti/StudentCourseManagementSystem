const express = require('express');
const router = express.Router();
const { getDB } = require('../config/db');
const { generateOTP, storeOTP, verifyOTP, clearOTP, sendEmail } = require('../utils/helpers');
const { hashPassword, comparePassword, generateToken } = require('../utils/auth');

router.post('/login/signin', async (req, res) => {
    try {
        const db = getDB();
        const users = db.collection('users');

        const user = await users.findOne({ emailid: req.body.emailid });

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        let isMatch = false;
        if (user.pwd && !user.pwd.startsWith('$2a$') && !user.pwd.startsWith('$2b$')) {
            // Legacy plaintext password — compare and migrate to hashed
            isMatch = user.pwd === req.body.pwd;
            if (isMatch) {
                const hashedPwd = await hashPassword(req.body.pwd);
                await users.updateOne({ emailid: req.body.emailid }, { $set: { pwd: hashedPwd } });
            }
        } else {
            isMatch = await comparePassword(req.body.pwd, user.pwd);
        }

        if (isMatch) {
            const token = generateToken({
                email: user.emailid,
                role: user.role,
                name: `${user.firstname} ${user.lastname}`
            });

            // Check if first login or profile incomplete
            const isFirstLogin = user.isFirstLogin || false;
            const profileComplete = user.profileComplete || false;

            res.json({
                success: true,
                role: user.role,
                token,
                isFirstLogin,
                profileComplete,
                studentId: user.studentId,
                facultyId: user.facultyId
            });
        } else {
            res.json({ success: false, message: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/sendotp', async (req, res) => {
    try {
        const email = req.body.emailid;
        if (!email) {
            return res.status(400).json({ error: 'Email ID is required' });
        }

        const db = getDB();
        const users = db.collection('users');
        const user = await users.findOne({ emailid: email });

        if (!user) {
            return res.status(404).json({ error: 'Email not found. Please enter a registered email address.' });
        }

        const otp = generateOTP();
        storeOTP(email, otp);
        await sendEmail(email, 'Password Reset OTP', `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`);
        res.json({ message: 'OTP sent successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/resetpassword', async (req, res) => {
    try {
        const { emailid, otp, newPassword } = req.body;
        const otpResult = verifyOTP(emailid, otp);

        if (otpResult.expired) {
            return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
        }

        if (!otpResult.valid) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        const hashedPassword = await hashPassword(newPassword);

        const db = getDB();
        const users = db.collection('users');
        await users.updateOne({ emailid: emailid }, { $set: { pwd: hashedPassword } });
        clearOTP(emailid);
        res.json({ message: 'Password reset successful' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Complete first login profile
router.post('/complete-profile', async (req, res) => {
    try {
        const { emailid, role } = req.body;

        const db = getDB();
        const users = db.collection('users');

        await users.updateOne(
            { emailid },
            {
                $set: {
                    isFirstLogin: false,
                    profileComplete: true,
                    profileCompletedAt: new Date()
                }
            }
        );

        res.json({ success: true, message: 'Profile completed successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
