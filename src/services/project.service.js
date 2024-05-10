const mongoose = require('mongoose')
const Milestone = require('../models/Milstone.model')
const Project = require('../models/Project.model')
const ProjectCollaborator = require('../models/ProjectCollaborator.model')
const Proposal = require('../models/Proposal.model')
const Workspace = require('../models/Workspace.model')
const { getWorkSpaceCollaborators } = require('./workspace.service')

const filterGenerator = (
    { priority, name, state, lowBudget, highBudget },
    prefix = ''
) => {
    let filter = []
    if (priority != undefined) {
        filter.push({ [`${prefix}priority`]: Number(priority) })
    }
    if (state) {
        filter.push({ [`${prefix}state`]: { $regex: state, $options: 'i' } })
    }
    if (name) {
        filter.push({
            $or: [
                { [`${prefix}name`]: { $regex: name, $options: 'i' } },
                { [`${prefix}state`]: { $regex: name, $options: 'i' } },
            ],
        })
    }
    if (lowBudget != undefined && highBudget) {
        filter.push({
            $or: [
                { [`${prefix}budget`]: { $gte: Number(lowBudget) } },
                { [`${prefix}budget`]: { $gte: Number(highBudget) } },
            ],
        })
    }
    if (filter.length) {
        return filter
    } else {
        return [{}]
    }
}
const getProjectCollaborators = async ({ project }) => {
    return await ProjectCollaborator.find({ project })
}
const GetProject = async ({ _id }) => {
    const getProjectAndWorkspace = async () => {
        const project = await Project.findOne({ _id }).populate('workspace')
        const workSpaceCollaborators = await getWorkSpaceCollaborators({
            workspace: project?.workspace?._id || project.workspace,
        })
        return {
            project,
            workSpaceCollaborators,
        }
    }
    const projectPromise = getProjectAndWorkspace()
    const projectCollaborationPromise = getProjectCollaborators({
        project: _id,
    })
    const [{ project, workSpaceCollaborators }, projectCollaborators] =
        await Promise.all([projectPromise, projectCollaborationPromise])
    return {
        project,
        workSpaceCollaborators,
        projectCollaborators,
    }
}

const getAllUserProject = async ({
    user,
    query: { sort_by, priority, lowBudget, highBudget, name, state },
}) => {
    const filter = filterGenerator(
        {
            sort_by,
            priority,
            lowBudget,
            highBudget,
            name,
            state,
        },
        'project.'
    )
    const sort = {}
    if (sort_by === 'alphabetic') {
        sort['project.name'] = 1
    } else {
        sort['project.createdAt'] = -1
    }
    const value = await ProjectCollaborator.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(user),
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
        {
            $lookup: {
                from: Project.collection.name,
                localField: 'project',
                foreignField: '_id',
                as: 'project',
            },
        },
        {
            $unwind: '$project',
        },
        {
            $match: {
                $and: filter,
            },
        },
        {
            $sort: sort,
        },
    ]).exec()
    const promises = value.map((val) => {
        const func = async () => {
            const collaborators = await getProjectCollaborators({
                project: val?.project?._id || val?.project,
            })
            val.collaborators = collaborators || []
        }

        return func()
    })
    await Promise.all(promises)
    // console.log(JSON.stringify(value))
    return value
}

const getAllUserTrackedProject = async ({ user }) => {
    console.log(user)
    const returned = await ProjectCollaborator.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(user),
            },
        },
        {
            $lookup: {
                from: Project.collection.name,
                localField: 'project',
                foreignField: '_id',
                as: 'project',
            },
        },
        {
            $unwind: '$project',
        },
        {
            $match: {
                'project.isTracking': {
                    $in: [new mongoose.Types.ObjectId(user)],
                },
            },
        },
        {
            $lookup: {
                from: Proposal.collection.name,
                localField: 'project',
                foreignField: 'project',
                as: 'proposal',
            },
        },
    ])

    const promises = returned.map((value) => {
        const func = async () => {
            const result = await Proposal.findOne({
                project: value.project?._id || value.project,
                status: 'approved',
            })
            value.proposal = result
        }
        return func()
    })
    await Promise.all(promises)
    return returned
}

const getAllProject = async ({
    sort_by,
    priority,
    lowBudget,
    highBudget,
    name,
    state,
}) => {
    const filter = filterGenerator({
        sort_by,
        priority,
        lowBudget,
        highBudget,
        name,
        state,
    })
    const sort = {}
    if (sort_by === 'alphabetic') {
        sort.name = 1
    } else {
        sort.createdAt = -1
    }
    const value = await Project.find({ $and: filter }).sort(sort).lean()
    const promises = value.map((val) => {
        const func = async () => {
            const collaborators = await getProjectCollaborators({
                project: val?._id,
            })
            val.collaborators = collaborators || []
        }
        return func()
    })
    await Promise.all(promises)
    return value
}
const createProject = async ({
    budget,
    description,
    documents,
    name,
    owner,
    priority,
    type,
    state,
    workspace,
    image_url,
}) => {
    const project = await Project.create({
        budget,
        description,
        documents,
        name,
        owner,
        type,
        priority,
        workspace,
        state,
        image_url,
    })
    createCollaborator({
        user: owner,
        project: project._id,
        role: 'collaborator',
        workspace: workspace,
    })
    return project
}

const updateProject = async (_id, update) => {
    const project = await Project.findByIdAndUpdate(_id, update)
    return project
}
const createCollaborator = async ({ role, user, workspace, project }) => {
    return await ProjectCollaborator.create({ user, project, role, workspace })
}

const createCollaborators = async (collaborators = []) => {
    const promises = collaborators.map((val) => {
        return createCollaborator(val)
    })
    const response = await Promise.all(promises)
    return response
}

module.exports = {
    GetProject,
    getProjectCollaborators,
    createCollaborator,
    getAllUserProject,
    createCollaborators,
    createProject,
    getAllProject,
    updateProject,
    getAllUserTrackedProject,
}
