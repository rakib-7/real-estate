// backend/src/routes/authRoutes.js
const express = require('express');
const { register, login, logout, status, forgotPassword, resetPassword, verifyEmail } = require('../controllers/authController.js'); // Added .js extension

const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware.js'); // Corrected path and added .js extension

const router = express.Router();


router.get('/status', authenticateToken, status); 
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

router.post('/forgot-password', forgotPassword); 
router.post('/reset-password/:token', resetPassword);

router.get('/verify-email/:token', verifyEmail);

module.exports = router;