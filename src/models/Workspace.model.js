const mongoose = require('mongoose')

const workspaceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide your email'],
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        description: {
            type: String,
            default: 'No Description',
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)

workspaceSchema.pre(/^find/, function (next) {
    this.populate('owner')
    next()
})
const Workspace = mongoose.model('Workspace', workspaceSchema)

module.exports = Workspace
