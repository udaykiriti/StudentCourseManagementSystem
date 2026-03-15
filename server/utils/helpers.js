const nodemailer = require('nodemailer');

let otps = {};

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const storeOTP = (email, otp) => {
    otps[email] = { otp: otp, timestamp: Date.now() };
};

const verifyOTP = (email, otp) => {
    const storedOtpData = otps[email];
    if (storedOtpData && storedOtpData.otp === otp) {
        const now = Date.now();
        if (now - storedOtpData.timestamp > 10 * 60 * 1000) {
            delete otps[email];
            return { valid: false, expired: true };
        }
        return { valid: true, expired: false };
    }
    return { valid: false, expired: false };
};

const clearOTP = (email) => {
    delete otps[email];
};

const sendEmail = async (to, subject, text) => {
    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'prasanthgolla29@gmail.com',
            pass: 'psrm brca mndy klbk'
        }
    });

    const mailOptions = {
        from: 'prasanthgolla29@gmail.com',
        to: to,
        subject: subject,
        text: text
    };

    await transport.sendMail(mailOptions);
};

module.exports = { generateOTP, storeOTP, verifyOTP, clearOTP, sendEmail };
