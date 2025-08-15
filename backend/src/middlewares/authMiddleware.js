const jwt = require('jsonwebtoken');

// CORRECTED: This is the complete, simplified, and correct authenticateToken function.
const authenticateToken = (req, res, next) => {
    // 1. Get the token from the httpOnly cookie.
    const token = req.cookies.token;

    // 2. If no token exists, the user is not logged in.
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        // 3. Verify the token is valid and not expired.
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Attach the user's info to the request for other functions to use.
        req.user = decoded;
        
        // 5. Allow the request to proceed to the controller.
        next();
    } catch (error) {
        // 6. If verification fails (invalid or expired), send a Forbidden error.
        return res.status(403).json({ error: 'Invalid or expired token. Please log in again.' });
    }
};

const authorizeRole = (roles) => {
    return (req, res, next) => {
        // This function runs AFTER authenticateToken and checks the user's role.
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: You do not have the required permissions.' });
        }
        next();
    };
};

module.exports = { authenticateToken, authorizeRole };
/*
// --- YOUR ENTIRE OLD authMiddleware.js CODE IS COMMENTED OUT BELOW ---

const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
    const token = req.cookies.token;

    console.log('AuthMiddleware: Received token from cookie:', token ? 'YES' : 'NO');
    if (token) {
        console.log('AuthMiddleware: Token starts with:', token.substring(0, 10), '...');
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
       return res.status(403).json({ error: 'Invalid or expired token.' });
    }
    
    if (token == null) {
        console.log('AuthMiddleware: No token found. Sending 401.');
        return res.status(401).json({ message: 'Authentication token required.' });
    }

    if (!process.env.JWT_SECRET) {
        console.log('AuthMiddleware: ERROR - JWT_SECRET is not set!');
        console.log('Available env vars:', Object.keys(process.env).filter(key => key.includes('JWT')));
        return res.status(500).json({ message: 'Server configuration error.' });
    }

    console.log('AuthMiddleware: JWT_SECRET is set, attempting verification...');

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log('AuthMiddleware: JWT verification FAILED:', err.message);
            console.log('AuthMiddleware: Error details:', err);
            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Lax',
            });
            return res.status(403).json({ message: 'Invalid or expired token.' });
        }
        console.log('AuthMiddleware: JWT verification SUCCESS. User:', user);
        
        req.user = user;
        console.log('AuthMiddleware: JWT verification SUCCESS. User:', req.user.email, 'Role:', req.user.role);

        next();
    });
};

exports.authorizeRole = (roles) => {
    return (req, res, next) => {
        const userRole = req.user.role;
        console.log('AuthMiddleware: Authorizing role. User role:', userRole, 'Required roles:', roles);
        if (!req.user || !roles.includes(userRole.toUpperCase())) {
            console.log('AuthMiddleware: Role authorization FAILED. Sending 403.');
            return res.status(403).json({ message: 'Forbidden: You do not have the required role.' });
        }
        console.log('AuthMiddleware: Role authorization SUCCESS.');
        next();
    };
};
*/