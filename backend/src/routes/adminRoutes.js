// backend/src/routes/adminRoutes.js
const express = require('express');
const multer = require('multer');
//const upload = require('../middlewares/upload');
const path = require('path');
const { createProperty, updateProperty, deleteProperty } = require('../controllers/propertyController.js');
const {
  // getInquiries, respondToInquiry,
  uploadBanner,
  createAdminUser, getAllUsers, updateUserByAdmin, deleteUserByAdmin, // User Management
  getSiteAnalytics, // Analytics
  getAllPropertiesAdmin,
  updatePropertyStatus,
  // Banner management
  getAllBanners,
  getPublicBanners,
  updateBanner,
  deleteBanner,
  //getPublicBanners
} = require('../controllers/adminController.js');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware.js');

const router = express.Router();


const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); 
    } else {
        cb(new Error('Only image files are allowed!'), false);
    } 
};
const upload = multer({storage, fileFilter });

router.use(authenticateToken);
router.use(authorizeRole(['ADMIN'])); // All routes in this router require 'admin' role

// Property Management (Admin can manage all properties)
router.get('/properties', getAllPropertiesAdmin);
router.post('/properties',upload.array('images',10), createProperty);
router.put('/properties/:id',upload.array('images', 10), updateProperty);
router.delete('/properties/:id', deleteProperty);
router.put('/properties/:id/status', updatePropertyStatus);

// Banner Management
router.get('/banners', getAllBanners);
router.get('/banners/:id', getPublicBanners);
router.post('/banners', upload.single('image'), uploadBanner);
router.put('/banners/:id', upload.single('image'), updateBanner);
router.delete('/banners/:id', deleteBanner);

// User Management (Admin can manage all users)
router.post('/users', createAdminUser); // Endpoint for admin to create new users (including other admins)
router.get('/users', getAllUsers); // Get all users
router.put('/users/:id', updateUserByAdmin); // Update user by ID
router.delete('/users/:id', deleteUserByAdmin); // Delete user by ID

// Site Analytics
router.get('/analytics', getSiteAnalytics); // Get site analytics

module.exports = router;
