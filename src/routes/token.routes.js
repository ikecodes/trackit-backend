const { Router } = require('express')
const { TokenController } = require('../controllers')
const auth = require('../middleware/auth')
const router = Router()

router.route('/').post(auth, TokenController.savePushToken)
router.route('/').get(auth, TokenController.getPushToken)
module.exports = router
