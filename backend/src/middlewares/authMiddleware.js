// backend/src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
  // const authHeader = req.headers['authorization'];
  // const token = authHeader && authHeader.split(' ')[1]; // Expects "Bearer TOKEN"
  const token = req.cookies.token;

  console.log('AuthMiddleware: Received token from cookie:', token ? 'YES' : 'NO');
  if (token) {
    // For debugging, you can log a part of the token, but be careful with sensitive info
    console.log('AuthMiddleware: Token starts with:', token.substring(0, 10), '...');
  }

  if (token == null) {
     console.log('AuthMiddleware: No token found. Sending 401.');
    return res.status(401).json({ message: 'Authentication token required.' }); // Unauthorized
  }

  // Check if JWT_SECRET is available
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
      // If token is invalid or expired, clear the cookie on the client side
      // This helps prevent infinite loops for expired tokens
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
      });
      return res.status(403).json({ message: 'Invalid or expired token.' });
    }
    console.log('AuthMiddleware: JWT verification SUCCESS. User:', user);
    
    req.user = user; // Attach decoded user payload
    console.log('AuthMiddleware: JWT verification SUCCESS. User:', req.user.email, 'Role:', req.user.role); // Log correctly

    next();
  });
};

exports.authorizeRole = (roles) => { // roles array contains lowercase strings like ['user', 'admin']
  return (req, res, next) => {
    // req.user.role will be 'ADMIN' or 'USER' (uppercase from enum)
    const userRole = req.user.role; // e.g., 'ADMIN'

    console.log('AuthMiddleware: Authorizing role. User role:', userRole, 'Required roles:', roles);

    // PROBLEM HERE: userRole is already uppercase, but roles.includes expects lowercase
    if (!req.user || !roles.includes(userRole.toUpperCase())) { // <--- INCORRECT: userRole is already upper. Should be userRole.toLowerCase()
      console.log('AuthMiddleware: Role authorization FAILED. Sending 403.');
      return res.status(403).json({ message: 'Forbidden: You do not have the required role.' });
    }
    console.log('AuthMiddleware: Role authorization SUCCESS.');
    next();
  };
};