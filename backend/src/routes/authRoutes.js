// backend/src/routes/authRoutes.js
const express = require('express');
// Correct relative paths for controllers
const { register, login, logout } = require('../controllers/authController.js'); // Added .js extension
// Correct relative path for middlewares
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware.js'); // Corrected path and added .js extension

const router = express.Router();

// Route to check authentication status (requires a valid token in cookie)
router.get('/status', authenticateToken, (req, res) => {
    console.log('AuthRoutes: /status endpoint called. User:', req.user);
    // If authenticateToken middleware passes, req.user will be populated
    const response = { userId: req.user.userId, email: req.user.email, role: req.user.role };
    console.log('AuthRoutes: Sending response:', response);
    res.status(200).json(response);
});

// User registration route
router.post('/register', register);

// User login route (sets HttpOnly cookie)
router.post('/login', login);

// User logout route (clears HttpOnly cookie)
router.post('/logout', logout);

module.exports = router;