const AppError = require('../helpers/appError')
const catchAsync = require('../helpers/catchAsync')
const Project = require('../models/Project.model')
const ProjectNotification = require('../models/ProjectNotification.model')
const Proposal = require('../models/Proposal.model')

const {
    createProject,
    getAllUserProject,
    getAllProject,
    updateProject,
    getAllUserTrackedProject,
} = require('../services/project.service')
module.exports = {
    /**
     * @function createProject
     * @route /api/v1/project/
     * @method POST
     */
    createProject: catchAsync(async (req, res) => {
        const { body, user } = req
        const {
            name,
            description,
            budget,
            priority,
            type,
            workspace,
            documents,
            state,
            image_url = 'https://lmeservices.com/wp-content/uploads/2016/03/google-drive1.png',
        } = body
        const project = await createProject({
            name,
            description,
            owner: user._id,
            budget,
            documents,
            priority,
            type,
            workspace,
            state,
            image_url,
        })
        res.json(project)
    }),

    /**
     * @function createProject
     * @route /api/v1/project/
     * @method POST
     */
    updateProject: catchAsync(async (req, res) => {
        const { body, params } = req

        const project = await updateProject(params?.project, body)
        res.json(project)
    }),

    /**
     * @function updateProjectDocument
     * @route /api/v1/project/
     * @method POST
     */
    updateProjectDocument: catchAsync(async (req, res) => {
        const { body, params } = req

        const project = await updateProject(params?.project, body)
        res.json(project)
    }),
    /**
     * @function getProject
     * @route /api/v1/project/
     * @method GET
     */
    getUserProjects: catchAsync(async (req, res) => {
        const { user, query } = req
        const { sort_by, priority, lowBudget, highBudget, name, state } = query
        const project = await getAllUserProject({
            user: user._id,
            query: {
                sort_by,
                priority,
                lowBudget,
                highBudget,
                name,
                state,
            },
        })
        res.json(project)
    }),

    /**
     * @function getProject
     * @route /api/v1/project/
     * @method GET
     */
    getAllAvailableProjects: catchAsync(async (req, res) => {
        const { query } = req
        const { sort_by, priority, lowBudget, highBudget, name, state } = query
        const projects = await getAllProject({
            sort_by,
            priority,
            lowBudget,
            highBudget,
            name,
            state,
        })
        res.json(projects)
    }),
    /**
     * @function getProjectNotifications
     * @route /api/v1/project/notifications
     * @method GET
     */
    getProjectNotifications: catchAsync(async (req, res) => {
        const { query } = req
        const { type } = query
        const notifications = await ProjectNotification.find({ type })
        // console.log('///RETURNED', notifications)
        res.json(notifications)
    }),
    /**
     * @function getApprovedProposal
     * @route /api/v1/project/proposal/:id
     * @method GET
     */
    getApprovedProposal: catchAsync(async (req, res) => {
        const proposal = await Proposal.findOne({
            project: req.params.id,
            status: 'approved',
        })
        res.json(proposal)
    }),
    /**
     * @function createBoard
     * @route /api/v1/project/create-board/:id
     * @method PATCH
     */
    createBoard: catchAsync(async (req, res, next) => {
        const { _id } = req.user
        let project = await Project.findById(req.params.id)
        if (project.isTracking && project.isTracking.includes(_id))
            return next(
                new AppError('You are already tracking this project', 400)
            )
        project = await Project.findByIdAndUpdate(req.params.id, {
            $push: {
                isTracking: _id,
            },
        })
        res.json(project)
    }),

    /**
     * @function getUserTrackedProjects
     * @route /api/v1/project/all-tracked
     * @method GET
     */
    getUserTrackedProjects: catchAsync(async (req, res) => {
        const { _id } = req.user
        const projects = await getAllUserTrackedProject({ user: _id })
        res.json(projects)
    }),
    /**
     * @function removeBoard
     * @route /api/v1/project/remove-board/:id
     * @method PATCH
     */
    removeBoard: catchAsync(async (req, res) => {
        const { _id } = req.user
        let project = await Project.findById(req.params.id)
        project = await Project.findByIdAndUpdate(req.params.id, {
            $pull: {
                isTracking: _id,
            },
        })
        res.json(project)
    }),
    /**
     * @function getTotalProposals
     * @route /api/v1/project/total-proposals/:id
     * @method get
     */
    getTotalProposals: catchAsync(async (req, res) => {
        const projectId = req.params.id
        const totalApplicants = await Proposal.find({
            project: projectId,
        })

        res.json(totalApplicants)
    }),
}
