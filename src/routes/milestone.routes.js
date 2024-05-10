const { Router } = require('express')
const auth = require('../middleware/auth')
const { MilestoneController } = require('../controllers')

const router = Router()

router.route('/invite-contractor')
.post(MilestoneController.inviteSubcontractorHandler)
router.post('/task',MilestoneController.createMilestoneTaskHandler);

module.exports = router
