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
    next();
};

module.exports = { ROLES, checkRole, verifySession };
