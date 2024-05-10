const mongoose = require('mongoose')

const workspaceCollaboratorSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },

        role: {
            type: String,
            enum: ['executive', 'collaborator'],
            default: 'executive',
        },
        workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Workspace',
        },
        email: {
            type: String,
        },
        isAccepted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)

workspaceCollaboratorSchema.pre(/^find/, function (next) {
    this.populate('user')
    next()
})
const WorkspaceCollaborator = mongoose.model(
    'Workspace_Collaborator',
    workspaceCollaboratorSchema
)

module.exports = WorkspaceCollaborator
