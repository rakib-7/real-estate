// backend/src/routes/propertyRoutes.js
const express = require('express');
const { getAllProperties, getPropertyById } = require('../controllers/propertyController');
const { getPublicBanners } = require('../controllers/adminController.js');
const {authenticateToken} = require('../middlewares/authMiddleware.js');

const router = express.Router();

// These routes are public (no authentication middleware)
router.get('/banners', getPublicBanners); // Get public banners for the homepage
router.get('/', getAllProperties); // Browse and search properties
router.get('/',authenticateToken, getAllProperties); // Browse and search properties

router.get('/:id', getPropertyById); // View detailed property information

module.exports = router;