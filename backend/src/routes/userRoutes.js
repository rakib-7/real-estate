// backend/src/routes/userRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  submitInquiry,
  getUserInquiries,
  bookmarkProperty,
  removeBookmark,
  getBookmarkedProperties,
  getUserProfile,
  updateUserProfile,
  createPropertyByUser,
  getPropertiesCreatedByUser, // NEW
  updatePropertyByUser,       // NEW
  deletePropertyByUser        // NEW
} = require('../controllers/userController.js');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware.js');

const router = express.Router();

// --- ADD THIS ENTIRE MULTER CONFIGURATION BLOCK ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // All user-submitted images go to the 'properties' folder.
        cb(null, 'uploads/properties/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

router.use(authenticateToken);
router.use(authorizeRole(['USER', 'ADMIN'])); // User-specific routes can be accessed by both users and admins

// User Profile Management
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);

// Inquiry Management
router.post('/inquiries', submitInquiry);
router.get('/inquiries', getUserInquiries);

// Bookmark Management
router.post('/bookmarks', bookmarkProperty);
router.delete('/bookmarks/:propertyId', removeBookmark);
router.get('/bookmarks', getBookmarkedProperties);

// User-Added Properties Management
//router.post('/properties', createPropertyByUser); // User adds a new property
router.post('/properties', upload.array('images', 10), createPropertyByUser);
router.get('/properties', getPropertiesCreatedByUser); // Get properties created by the current user
//router.put('/properties/:id', updatePropertyByUser); // User updates their own property
router.put('/properties/:id', upload.array('images', 10), updatePropertyByUser);
router.delete('/properties/:id', deletePropertyByUser); // User deletes their own property

module.exports = router;