const express = require('express');
const router = express.Router();
const { compileLatex } = require('../controllers/compileController');
const { analyzeResume } = require('../controllers/atsController');
const { protect } = require('../middlewares/authMiddleware');

// LaTeX compilation endpoint
router.post('/compile', protect, compileLatex);

// ATS analysis endpoint
router.post('/ats-analysis', protect, analyzeResume);

module.exports = router;