const mongoose = require('mongoose')

const Document = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    method: {
        type: String,
        enum: ['link', 'upload'],
        default: 'link',
        required: [true, 'doc is required'],
    },
})
const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide your name'],
        },
        description: {
            type: String,
            required: [true, 'Please provide your description'],
        },
        budget: {
            type: Number,
            required: [true, 'Please provide your budget'],
        },
        priority: {
            type: Number,
            required: [true, 'Please provide your priority'],
        },
        state: {
            type: String,
            required: [true, 'Please provide your state'],
        },
        workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Workspace',
            required: [true, 'Please provide your workspace'],
        },
        documents: {
            type: [Document],
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Please provide your owner'],
        },
        isTracking: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                default: [],
            },
        ],
        image_url: {
            type: String,
            required: [true, 'image url is required for project'],
        },
        type: {
            type: String,
            enum: ['public', 'private'],
            default: 'public',
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)

projectSchema.pre(/^find/, function (next) {
    this.populate('owner')
    next()
})
const Project = mongoose.model('Project', projectSchema)

module.exports = Project
