const { Router } = require('express')
const auth = require('../middleware/auth')
const { ProjectController } = require('../controllers')

const router = Router()

router
    .route('/')
    .get(auth, ProjectController.getUserProjects)
    .post(auth, ProjectController.createProject)
router.route('/all').get(auth, ProjectController.getAllAvailableProjects)
router.route('/all-tracked').get(auth, ProjectController.getUserTrackedProjects)
router
    .route('/notifications')
    .get(auth, ProjectController.getProjectNotifications)
router.route('/proposal/:id').get(auth, ProjectController.getApprovedProposal)
router.route('/create-board/:id').patch(auth, ProjectController.createBoard)
router.route('/remove-board/:id').patch(auth, ProjectController.removeBoard)
router.route('/:project').patch(auth, ProjectController.updateProject)
router
    .route('/total-proposal/:id')
    .get(auth, ProjectController.getTotalProposals)

module.exports = router
