const express = require('express');
const multer = require('multer');
const path = require('path');
const {
    bookmarkProperty,
    removeBookmark,
    getBookmarkedProperties,
    getUserProfile,
    updateUserProfile,
    createPropertyByUser,
    getPropertiesCreatedByUser,
    updatePropertyByUser,
    deletePropertyByUser,
    // Ensure the new function is imported
    uploadAvatar: handleUploadAvatar 
} = require('../controllers/userController.js');
const { authenticateToken } = require('../middlewares/authMiddleware.js');

const router = express.Router();

// COMMENTED OUT: This entire old multer configuration block is now replaced by the new one below.
/*
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
*/

// CORRECTED: This is the single, correct multer configuration for this file.
// It can handle uploads to different folders (properties vs. avatars).
const createMulterStorage = (folder) => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            // We create subfolders for organization
            cb(null, `uploads/${folder}/`);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const filename = `${file.fieldname}-${req.user.userId}-${uniqueSuffix}${path.extname(file.originalname)}`;
            cb(null, filename);
        }
    });
};

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

// Create separate uploaders for each type of upload
const uploadProperties = multer({ storage: createMulterStorage('properties'), fileFilter });
const uploadAvatar = multer({ storage: createMulterStorage('avatars'), fileFilter });


router.use(authenticateToken);

// User Profile Management
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
// This route now correctly uses the 'uploadAvatar' middleware
router.post('/profile/avatar', uploadAvatar.single('avatar'), handleUploadAvatar);


// Bookmark Management
router.post('/bookmarks', bookmarkProperty);
router.delete('/bookmarks/:propertyId', removeBookmark);
router.get('/bookmarks', getBookmarkedProperties);

// User-Added Properties Management
// These routes now correctly use the 'uploadProperties' middleware
router.post('/properties', uploadProperties.array('images', 10), createPropertyByUser);
router.get('/properties', getPropertiesCreatedByUser);
router.put('/properties/:id', uploadProperties.array('images', 10), updatePropertyByUser);
router.delete('/properties/:id', deletePropertyByUser);

module.exports = router;