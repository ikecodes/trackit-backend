const { Router } = require('express')
const auth = require('../middleware/auth')
const { WorkspaceController } = require('../controllers')

const router = Router()

router
    .route('/')
    .get(auth, WorkspaceController.getWorkspaces)
    .post(auth, WorkspaceController.createWorkSpace)
router.route('/members').post(auth, WorkspaceController.addMember)
router
    .route('/with-projects')
    .get(auth, WorkspaceController.allWorkspaceWithProjects)
router
    .route('/:workspace')
    .patch(auth, WorkspaceController.acceptWorkspaceController)
router.route('/members/:id').get(auth, WorkspaceController.getWorkspaceMembers)
router
    .route('/members/:collaboratorId')
    .get(auth, WorkspaceController.deleteMember)
router.route('/projects/:id').get(auth, WorkspaceController.workspaceProjects)

module.exports = router
