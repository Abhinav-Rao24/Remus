const fs = require('node:fs');
const path = require('node:path');
const Resume = require('../models/Resume');
const { create } = require('../models/User');
const { profile } = require('node:console');


//@desc create new resume
//@route POST /api/resume
//@access Private
const createResume = async (req, res) => {
    try {
        const { title, description } = req.body;

        const newResume = await Resume.create({
            userId: req.user._id,
            title: title || 'Untitled Resume',
            description: description || '',
            latexContent: '' // Will be populated in editor
        });

        res.status(201).json(newResume);

    } catch (error) {
        console.error('Create resume error:', error);
        res.status(500).json({ message: 'failed to create resume :(', error: error.message });
    }
};

//@desc get all resumes
//@route GET /api/resume
//@access Private
const getUserResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({ userId: req.user._id }).sort({
            updatedAt: -1,
        });
        res.json(resumes);
    } catch (error) {
        res.status(500).json({ message: 'failed to create resume :(', error: error.message });
    }

};

//@desc get resume by id
//@route GET /api/resume/:id
//@access Private
const getResumeById = async (req, res) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found :/' });
        }
        res.json(resume);

    } catch (error) {
        res.status(500).json({ message: 'failed to create resume :(', error: error.message });
    }
};

//@desc update resume by id
//@route PUT /api/resume/:id
//@access Private
const updateResumeById = async (req, res) => {
    try {
        const resume = await Resume.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });
        if (!resume) {
            return res.status(404).json({ message: 'resume not found or unauthorized' });
        }
        //merge updates from req.body 
        Object.assign(resume, req.body);
        //save updated resume
        const updatedResume = await resume.save();
        res.json(updatedResume);

    } catch (error) {
        res.status(500).json({ message: 'failed to create resume :(', error: error.message });
    }
};

//@desc delete resume by id
//@route DELETE /api/resume/:id
//@access Private
const deleteResume = async (req, res) => {
    try {
        const resume = await Resume.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!resume) {
            return res.status(404).json({ message: 'resume not found or unauthorized' });
        }

        //delete thumbnaillink and prefilepreview images form uplaods folder
        const uploadsFolder = path.join(__dirname, '..', 'uploads');
        const baseUrl = `${req.protocol}://${req.get('host')}`;

        if (resume.thumbnailLink) {
            const thumbnailPath = path.join(uploadsFolder, path.basename(resume.thumbnailLink));
            if (fs.existsSync(oldThumbnail)) fs.unlinkSync(oldThumbnail);
        }

        if (resume.profileInfo?.profilePreviewUrl) {
            const oldProfile = path.join(uploadsFolder, path.basename(resume.thumbnailLink));
            if (fs.existsSync(oldProfile)) fs.unlinkSync(oldThumbnail);
        }
        if (resume.profileInfo?.profilePreviewUrl) {
            const oldProfile = path.join(uploadsFolder, path.basename(resume.profileInfo.profilePreviewUrl));
            if (fs.existsSync(oldProfile)) fs.unlinkSync(oldProfile);
        }

        const deleted = await Resume.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!deleted) {
            return res.status(404).json({ message: 'resume not found or unauthorized' });
        }

        res.json({ message: 'resume deleted successfully :)' });
    } catch (error) {
        res.status(500).json({ message: 'failed to create resume :(', error: error.message });
    }

};

module.exports = {
    createResume,
    getUserResumes,
    getResumeById,
    updateResumeById,
    deleteResume
};