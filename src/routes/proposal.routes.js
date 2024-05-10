const { Router } = require('express')
const auth = require('../middleware/auth')
const { ProposalController } = require('../controllers')

const router = Router()

router.route('/').post(auth, ProposalController.createProposal)

router.route('/all').get(auth, ProposalController.getAllProposals)
router.route('/:id').get(ProposalController.getProposalById)
router
    .route('/:projectId/proposals')
    .get(ProposalController.getProposalsByProjectId)
router.route('/:id').put(ProposalController.updateProposal)
router.route('/delete/:id').delete(ProposalController.deleteProposal)
router.route('/pend/:id').patch(ProposalController.pendProposal)
router.route('/approve/:id').patch(ProposalController.approveProposal)
router.route('/reject/:id').patch(ProposalController.rejectProposal)
router
    .route('/total-Approved-proposal/:id')
    .get(auth, ProposalController.getTotalApprovedProposals)

module.exports = router
