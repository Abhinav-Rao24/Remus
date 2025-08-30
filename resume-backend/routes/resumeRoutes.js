const express = require('express');

const{
    createResume,
    getUserResumes,
    getResumeById,
   // updateResume,
    deleteResume,
    updateResumeById,
} = require('../controllers/resumeController');

const { protect } = require('../middlewares/authMiddleware');

const upload = require('../middlewares/uploadMiddleware');
//const {uploadResumeImages} = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.post('/', protect, createResume);
router.get('/', protect, getUserResumes);
router.get('/:id', protect, getResumeById);
router.put('/:id', protect, updateResumeById);
//router.put('/:id/upload-images', protect, uploadResumeImages);
router.put('/:id/upload-images', protect, upload.single('image'), updateResumeById);
router.delete('/:id', protect, deleteResume);

module.exports = router;