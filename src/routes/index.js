const { Router } = require('express')
const userRouter = require('./user.routes')
const workspaceRouter = require('./workspace.routes')
const projectRouter = require('./project.routes')
const proposalRouter = require('./proposal.routes')
const tokenRouter = require('./token.routes')
const milestoneRoutes = require('./milestone.routes');

const router = Router()

router.use('/users', userRouter)
router.use('/workspace', workspaceRouter)
router.use('/project', projectRouter)
router.use('/token', tokenRouter)
router.use('/proposal', proposalRouter)
router.use('/milestone',milestoneRoutes)


module.exports = router
