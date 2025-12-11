const express = require('express');
const router = express.Router();
const { analyzeResume } = require('../controllers/atsController');
const { getSuggestions } = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');

// ATS Score endpoint
router.post('/score', protect, analyzeResume);

// AI Suggestions endpoint  
router.post('/suggestions', protect, getSuggestions);

module.exports = router;
