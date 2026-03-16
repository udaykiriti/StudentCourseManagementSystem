const { verifyToken } = require('../utils/auth');

const ROLES = {
    STUDENT: 'student',
    FACULTY: 'faculty',
    ADMIN: 'admin'
};

const checkRole = (role) => {
    return (req, res, next) => {
        const userRole = req.user?.role;
        if (userRole === role) {
            next();
        } else {
            res.status(403).json({ error: 'Unauthorized' });
        }
    };
};

const verifySession = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

module.exports = { ROLES, checkRole, verifySession };
