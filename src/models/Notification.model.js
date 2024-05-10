const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        type: {
            type: String,
            enum: ['milestones', 'tasks', 'checklists'],
        },
        title: {
            type: String,
        },
        message: {
            type: String,
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)

notificationSchema.pre(/^find/, function (next) {
    this.populate('user')
    next()
})
const Notification = mongoose.model('Notification', notificationSchema)

module.exports = Notification
