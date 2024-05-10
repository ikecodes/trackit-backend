const mongoose = require('mongoose')

const proposalSchema = new mongoose.Schema(
    {
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
        },
        milestones: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Milestone',
            },
        ],
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Please provide a user'],
        },

        userPitch: {
            type: String,
            required: [true, 'Please provide a pitch'],
        },

        link: {
            type: String,
        },

        documents: {
            type: String,
            required: [false, 'Please provide your budget'],
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)

proposalSchema.pre(/^find/, function (next) {
    this.populate('owner').populate('milestones').populate('project')
    next()
})

const Proposal = mongoose.model('Proposal', proposalSchema)

module.exports = Proposal
