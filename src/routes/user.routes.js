const { Router } = require('express')
const auth = require('../middleware/auth')
const { AuthController, UserController } = require('../controllers')
const uploader = require('../services/multer')

const router = Router()

router.route('/').post(AuthController.signup)
router.route('/verify').post(AuthController.verify)
router.route('/session').post(AuthController.login)
router.route('/resend-email').post(AuthController.reSendEmail)
router.route('/confirm-email').post(AuthController.confirmEmail)
router.route('/onboarding').patch(AuthController.onboarding)
router.route('/forgot-password').post(AuthController.forgotPassword)
router.route('/upload').post(uploader.array('files'), UserController.upload)
router
    .route('/password-reset-confirm')
    .patch(AuthController.passwordResetConfirm)
router.route('/reset-password').patch(AuthController.resetPassword)

router.use(auth) // Needs authentication
// router.route('/').delete(AuthController.deleteMe)
router.route('/me').get(AuthController.getMe)
router.route('/update-password').patch(AuthController.updatePassword)

router.route('/update-me').patch(UserController.updateMe)

router.route('/user/:id').get(UserController.getUser)
router.route('/deactivate-me').patch(UserController.deactivateMe)

router.route('/').get(UserController.getAllUsers)
router.route('/verify-user/:id').patch(UserController.verifyUser)

module.exports = router
