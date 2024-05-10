const mongoose = require('mongoose')

const projectNotificationSchema = new mongoose.Schema(
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

projectNotificationSchema.pre(/^find/, function (next) {
    this.populate('user')
    next()
})
const ProjectNotification = mongoose.model(
    'Project_Notification',
    projectNotificationSchema
)

module.exports = ProjectNotification
