const express = require('express');
const { getOrCreateUserChat, postMessage } = require('../controllers/userController.js');
const { getAllChatsForAdmin, getChatMessagesForAdmin } = require('../controllers/adminController.js');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware.js');

const router = express.Router();

// All chat routes require a user to be logged in.
router.use(authenticateToken);

// --- User-facing chat routes ---
router.get('/', getOrCreateUserChat);      // A user gets their own chat thread
router.post('/messages', postMessage);     // A user (or admin) sends a message

// --- Admin-only chat routes ---
router.get('/admin/all', authorizeRole(['ADMIN']), getAllChatsForAdmin);           // Admin gets a list of all chats
router.get('/admin/:userId', authorizeRole(['ADMIN']), getChatMessagesForAdmin); // Admin gets messages for a specific user

module.exports = router;