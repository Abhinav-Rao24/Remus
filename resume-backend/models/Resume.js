const mongoose = require('mongoose');

const ResumeVersionSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const ResumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title:{
        type: String,
        required: true
    },
    thumbnailLink :{type : String, default: null},

    template:{theme:String, colorPalette:String},

    profileInfo :{
        profilePreviewUrl: { type: String, default: null },
        fullName: { type: String, required: true },
        designation: { type: String, required: true },
        summary: {type: String},
    },

    contactInfo:{
        email: String,
        phone:String,
        location: String,
        linkedIn: String,
        github: String,
        website: String,
    },
    workExperience: [
        {
            company: String,
            position: String,
            startDate: String,
            endDate: String,
            description: String,
        },
    ],

    education: [
        {
            institution: String,
            degree: String,
            startDate: String,
            endDate: String,
            description: String,
        },
    ],

    skills: [String],
    projects: [
        {
            title: String,
            description: String,
            link: String,
        },
    ],
    languages: [String],
    certifications: [
        {
            title: String,
            issuer: String,
            date: String,
            link: String,
        },
    ],
    interests: [String]
},
    {
        timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
    }
);

module.exports = mongoose.model('Resume', ResumeSchema);
