const WorkspaceCollaborator = require('../models/WorkspaceCollaborators.model')
const Workspace = require('../models/Workspace.model')
const Project = require('../models/Project.model')
const mongoose = require('mongoose')

const getWorkSpaceCollaborators = async ({ workspace }) => {
    return await WorkspaceCollaborator.find({ workspace })
}
const getWorkSpaceProjects = async ({ workspace }) => {
    return await Project.find({ workspace })
}

const createNewWorkSpace = async ({ name, owner, description }) => {
    return await Workspace.create({ name, owner, description })
}
const GetWorkspace = async ({ _id }) => {
    const workspacePromise = Workspace.findOne({ _id })
    const collaborators = await getWorkSpaceCollaborators({ workspace: _id })
    const result = await Promise.all([workspacePromise, collaborators])
    return {
        workspace: result[0],
        collaborators: result[1],
    }
}
const getAllWorkspace = async ({ user }) => {
    return await WorkspaceCollaborator.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(user) } },
        {
            $lookup: {
                from: Project.collection.name,
                localField: 'workspace',
                foreignField: 'workspace',
                as: 'projects',
            },
        },
        {
            $lookup: {
                from: Workspace.collection.name,
                localField: 'workspace',
                foreignField: '_id',
                as: 'workspace',
            },
        },
        {
            $unwind: '$workspace',
        },
    ])
}

const getAllWorkspacesWithProjects = async ({ user }) => {
    return await WorkspaceCollaborator.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(user) } },
        {
            $lookup: {
                from: Project.collection.name,
                localField: 'workspace',
                foreignField: 'workspace',
                as: 'projects',
            },
        },
        {
            $lookup: {
                from: Workspace.collection.name,
                localField: 'workspace',
                foreignField: '_id',
                as: 'workspace',
            },
        },
        {
            $unwind: '$workspace',
        },
    ])
}

const createCollaborator = async ({
    role,
    user,
    workspace,
    email,
    isAccepted,
}) => {
    // await sendCollaboratorEmails({ title: 'TheWorks', role, email })
    return await WorkspaceCollaborator.create({
        role,
        user,
        workspace,
        email,
        isAccepted,
    })
}
const createCollaborators = async (collaborators = [], workspace) => {
    const promises = collaborators.map((val) => {
        val.workspace = workspace
        return createCollaborator(val)
    })
    const response = await Promise.all(promises)
    return response
}
const deleteCollaborator = async ({ collaboratorId }) => {
    return await WorkspaceCollaborator.findByIdAndDelete(collaboratorId)
}

// const sendCollaboratorEmails = async ({ title, role, email }) => {
//     const html = await createHTMLEmail({ title, role }, 'workspaceInvite.ejs')
//     await sendGeneralEmail({
//         html,
//         subject: 'Invited To A Workspace',
//         emails: [email],
//     })
// }

const acceptWorkspace = async ({ email, workspace, user }) => {
    await WorkspaceCollaborator.updateMany(
        {
            email,
            workspace,
        },
        {
            user,
            isAccepted: true,
        }
    )
}
module.exports = {
    GetWorkspace,
    getWorkSpaceCollaborators,
    createCollaborator,
    deleteCollaborator,
    createCollaborators,
    getAllWorkspace,
    createNewWorkSpace,
    acceptWorkspace,
    getWorkSpaceProjects,
    getAllWorkspacesWithProjects,
}
