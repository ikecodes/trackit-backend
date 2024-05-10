const mongoose = require('mongoose')
const milestoneSchema = new mongoose.Schema(
    {
        proposal: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Proposal',
            required: [true, 'Please provide a proposal id'],
        },

        milestoneName: {
            type: String,
            required: [true, 'Please provide your name'],
        },
        milestoneDescription: {
            type: String,
            required: [true, 'Please provide a milestonedescription'],
        },
        milestoneBudget: {
            type: Number,
            required: [true, 'Please provide your budget'],
        },
        startDate: {
            type: Date,
            // required: [true, 'Please provide your budget'],
        },
        endDate: {
            type: Date,
            // required: [true, 'Please provide your budget'],
        },
        tasks: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'MilestoneTask',
            },
        ],
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)

milestoneSchema.pre(/^find/, function (next) {
    this.populate('tasks')
    next()
})
const Milestone = mongoose.model('Milestone', milestoneSchema)

module.exports = Milestone
