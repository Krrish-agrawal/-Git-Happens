const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { updateThemePreference } = require('../controllers/themeController');

// Theme routes
router.put('/', protect, updateThemePreference);

module.exports = router; 