const express = require('express');
const multer = require('multer');
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const cloudinary = require('cloudinary').v2;

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


// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // This function creates a new storage engine for Cloudinary.
// const createCloudinaryStorage = (folder) => {
//     return new CloudinaryStorage({
//         cloudinary: cloudinary,
//         params: {
//             folder: `real_estate/${folder}`, // Organizes uploads into folders in Cloudinary
//             allowed_formats: ['jpg', 'png', 'jpeg'],
//         },
//     });
// };

// It can handle uploads to different folders (properties vs. avatars).
// const createMulterStorage = (folder) => {
//     return multer.diskStorage({
//         destination: (req, file, cb) => {
//             // We create subfolders for organization
//             cb(null, `uploads/${folder}/`);
//         },
//         filename: (req, file, cb) => {
//             const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//             const filename = `${file.fieldname}-${req.user.userId}-${uniqueSuffix}${path.extname(file.originalname)}`;
//             cb(null, filename);
//         }
//     });
// };
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({storage, fileFilter });

// Create separate uploaders for each type of upload
// const uploadProperties = multer({ storage: createMulterStorage('properties'), fileFilter });
// const uploadAvatar = multer({ storage: createMulterStorage('avatars'), fileFilter });
// const uploadProperties = multer({ storage: createCloudinaryStorage('properties'), fileFilter });
// const uploadAvatar = multer({ storage: createCloudinaryStorage('avatars'), fileFilter });


router.use(authenticateToken);

// User Profile Management
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
// This route now correctly uses the 'uploadAvatar' middleware
//router.post('/profile/avatar', uploadAvatar.single('avatar'), handleUploadAvatar);
router.post('/profile/avatar', upload.single('avatar'), handleUploadAvatar);

// Bookmark Management
router.post('/bookmarks', bookmarkProperty);
router.delete('/bookmarks/:propertyId', removeBookmark);
router.get('/bookmarks', getBookmarkedProperties);

// User-Added Properties Management
// These routes now correctly use the 'uploadProperties' middleware
//router.post('/properties', uploadProperties.array('images', 10), createPropertyByUser);
router.post('/properties', upload.array('images', 10), createPropertyByUser);
router.get('/properties', getPropertiesCreatedByUser);
router.put('/properties/:id', upload.array('images', 10), updatePropertyByUser);
router.delete('/properties/:id', deletePropertyByUser);

module.exports = router;