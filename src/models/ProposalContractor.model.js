const mongoose = require('mongoose')

const projectCollaboratorSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },

        role: {
            type: String,
            enum: ['collaborator', 'contractor'],
            default: 'collaborator',
        },
        workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Workspace',
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
        },
        proposal:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Proposal' 
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)

projectCollaboratorSchema.pre(/^find/, function (next) {
    this.populate('user')
    next()
})
const ProjectCollaborator = mongoose.model(
    'Project_Collaborator',
    projectCollaboratorSchema
)

module.exports = ProjectCollaborator
  