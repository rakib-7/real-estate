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
  getBannerById,
  updateBanner,
  deleteBanner
} = require('../controllers/adminController.js');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware.js');

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req,file,cb) {
//  if (req.baseUrl.includes('banners')) {
//       cb(null, 'uploads/banners/');
//     } else {
//       cb(null, 'uploads/properties/');
//     }
   if (req.originalUrl.includes('/banners')) {
        cb(null, 'uploads/banners/');
    } else {
        cb(null, 'uploads/properties/');
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 15 * 1024 * 1024 // 15MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }

});

router.use(authenticateToken);
router.use(authorizeRole(['ADMIN'])); // All routes in this router require 'admin' role

// Property Management (Admin can manage all properties)
router.get('/properties', getAllPropertiesAdmin);
router.post('/properties',upload.array('images',10), createProperty);
router.put('/properties/:id',upload.array('images', 10), updateProperty);
router.delete('/properties/:id', deleteProperty);
router.put('/properties/:id/status', updatePropertyStatus);

// // Inquiry Management
// router.get('/inquiries', getInquiries);
// router.put('/inquiries/:id/respond', respondToInquiry);

// Banner Management
router.get('/banners', getAllBanners);
router.get('/banners/:id', getBannerById);
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