const catchAsync = require('../helpers/catchAsync')
const User = require('../models/User.model')
const {
    createNewWorkSpace,
    getAllWorkspacesWithProjects,
    getAllWorkspace,
    acceptWorkspace,
    getWorkSpaceCollaborators,
    createCollaborator,
    getWorkSpaceProjects,
    deleteCollaborator,
    createCollaborators,
} = require('../services/workspace.service')
module.exports = {
    /**
     * @function createWorkSpace
     * @route /api/v1/workspace/
     * @method POST
     */
    createWorkSpace: catchAsync(async (req, res) => {
        const { body, user } = req
        const { name, collaborators = [], description = '' } = body
        collaborators.push({
            role: user?.role,
            user: user._id,
            email: user.email,
            isAccepted: true,
        })
        const workspace = await createNewWorkSpace({
            name,
            description,
            owner: user._id,
        })
        await createCollaborators(collaborators, workspace._id)
        res.json(workspace)
    }),

    /**
     * @function getWorkspaces
     * @route /api/v1/workspace/
     * @method GET
     */
    getWorkspaces: catchAsync(async (req, res) => {
        const { user } = req
        console.log('user', user)
        const workspaces = await getAllWorkspace({ user: user._id })
        res.json(workspaces)
    }),
    acceptWorkspaceController: catchAsync(async (req, res) => {
        const { user, params } = req
        const workspaces = await acceptWorkspace({
            user: user._id,
            email: user.email,
            workspace: params.workspace,
        })
        res.json(workspaces)
    }),
    /**
     * @function getWorkspaceMembers
     * @route /api/v1/workspace/members/:id
     * @method GET
     */
    getWorkspaceMembers: catchAsync(async (req, res) => {
        const workspaces = await getWorkSpaceCollaborators({
            workspace: req.params.id,
        })
        res.json(workspaces)
    }),
    /**
     * @function workspaceProjects
     * @route /api/v1/workspace/projects/:id
     * @method GET
     */
    workspaceProjects: catchAsync(async (req, res) => {
        const projects = await getWorkSpaceProjects({
            workspace: req.params.id,
        })
        res.json(projects)
    }),

    /**
     * @function workspaceProjects
     * @route /api/v1/workspace/projects/:id
     * @method GET
     */
    allWorkspaceWithProjects: catchAsync(async (req, res) => {
        const workspaces = await getAllWorkspacesWithProjects({
            user: req.user._id,
        })
        res.json(workspaces)
    }),

    /**
     * @function addMember
     * @route /api/v1/workspace/members
     * @method POST
     */
    addMember: catchAsync(async (req, res) => {
        const { body } = req
        const { role, email, workspace } = body
        // TODO
        // Send email to newly added member
        const user = await User.findOne({ email })
        const newCollaborators = await createCollaborator({
            user: user?._id,
            role,
            email,
            workspace,
        })
        res.json(newCollaborators)
    }),
    /**
     * @function deleteMember
     * @route /api/v1/workspace/members/:id
     * @method DELETE
     */
    deleteMember: catchAsync(async (req, res) => {
        const { collaboratorId } = req.params
        console.log('COLLABORATOR ID', collaboratorId)
        await deleteCollaborator({
            collaboratorId,
        })
        res.status(204).json({
            status: 'Success',
        })
    }),
}
