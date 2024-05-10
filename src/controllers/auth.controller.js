const User = require('../models/User.model')
const catchAsync = require('../helpers/catchAsync')
const AppError = require('../helpers/appError')
const createAndSendToken = require('../helpers/createAndSendToken')
const { default: axios } = require('axios')
const { getAllWorkspace } = require('../services/workspace.service')
const { sendEmail } = require('../services/sendgrid.services')
module.exports = {
    /**
     * @function signup
     * @route /api/v1/users
     * @method POST
     */
    signup: catchAsync(async (req, res, next) => {
        const { firstName, lastName, email, phone, password, role } = req.body
        const user = await User.findOne({ email: email })

        if (user && user.onboardingDone && user.email === email)
            return next(new AppError('User with email already exists', 401))

        if (user && !user.onboardingDone) {
            await User.findByIdAndDelete(user._id)
        }

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            phone,
            password,
            role,
        })

        const token = newUser.createEmailConfirmToken()
        await newUser.save({ validateBeforeSave: false })
        console.log('///TOKEN', token)
        // TODO
        // Send ses email with token generated to user
        const options = {
            to: [newUser.email],
            subject: 'Welcome to Exectracker!',
            content: `Your verification token is ${token}`,
        }

        try {
            await sendEmail(options)
            res.status(200).json({
                status: 'success',
                message:
                    'signup successful, email verification token sent to your mail',
                data: newUser,
            })
        } catch (error) {
            newUser.passwordResetToken = undefined
            newUser.passwordResetExpires = undefined
            await newUser.save({ validateBeforeSave: false })
            return next(
                new AppError(
                    'There was an error sending the email. Try again later!'
                ),
                500
            )
        }
    }),

    /**
     * @function reSendEmail
     * @route /api/v1/users/resend-email
     * @method POST
     */
    reSendEmail: catchAsync(async (req, res, next) => {
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return next(
                new AppError('There is no user with email address.', 404)
            )
        }
        const token = user.createEmailConfirmToken()
        await user.save({ validateBeforeSave: false })
        // TODO
        // Resend ses email
        const options = {
            to: [user.email],
            subject: 'Welcome to Exectracker!',
            content: `Your verification token is ${token}`,
        }
        try {
            await sendEmail(options)
            res.status(200).json({
                status: 'success',
                message: 'token sent to mail',
            })
        } catch (error) {
            user.passwordResetToken = undefined
            user.passwordResetExpires = undefined
            await user.save({ validateBeforeSave: false })

            return next(
                new AppError(
                    'There was an error sending the email. Try again later!'
                ),
                500
            )
        }
    }),

    /**
     * @function confirmEmail
     * @route /api/v1/users/confirm-email
     * @method POST
     */
    confirmEmail: catchAsync(async (req, res, next) => {
        const { code, email } = req.body
        const user = await User.findOne({
            emailConfirmToken: code,
            email,
        })
        if (!user) {
            return next(new AppError('token is invalid or has expired', 400))
        }
        user.emailConfirmToken = undefined
        user.onboardingDone = true // adding this here to finish the sign up sign we are not using bvn yet
        await user.save()
        res.status(200).json({
            status: 'success',
            message: 'Token confirmation successful, you can now login',
        })
    }),
    /**
     * @function onboarding
     * @route /api/v1/users/onboarding
     * @method POST
     */
    onboarding: catchAsync(async (req, res, next) => {
        const { email, bvn, nimc } = req.body
        const user = await User.findOne({
            email: email,
        })

        if (!user)
            return next(new AppError('No user found with this email', 400))

        const onboardingDone = true // indicates user completed onboarding

        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            {
                bvn,
                nimc,
                onboardingDone,
            },
            {
                new: true,
            }
        )
        createAndSendToken(updatedUser, 200, res)
    }),
    /**
     * @function verify
     * @route /api/v1/users/verify
     * @method POST
     */
    verify: catchAsync(async (req, res) => {
        console.log('//REQ.BODY', req.body)

        try {
            const options = {
                url: `${process.env.YOUVERIFY_SANDBOX_URL}/v2/api/identity/ng/bvn`,
                headers: {
                    Authorization: `Bearer ${process.env.YOUVERIFY_SANDBOX_KEY}`,
                    'content-type': 'application/json',
                },
                method: 'POST',
                data: req.body,
            }
            const result = await axios.request(options)

            res.status(200).json({
                result,
            })
        } catch (error) {
            res.status(400).json({
                error,
            })
        }
    }),

    /**
     * @function login
     * @route /api/v1/users/session
     * @method POST
     */
    login: catchAsync(async (req, res, next) => {
        const { email, password } = req.body
        if (!email || !password) {
            return next(new AppError('please provide email and password!', 400))
        }
        const user = await User.findOne({ email }).select('+password')

        if (!user)
            return next(new AppError('Incorrect email or password!', 401))

        if (user.active === false)
            return next(new AppError('Incorrect email or password!', 401))

        if (user.emailConfirmToken) {
            const token = user.createEmailConfirmToken()

            const options = {
                to: [user.email],
                subject: 'Welcome to Exectracker!',
                content: `Your verification token is ${token}`,
            }
            await user.save()
            // RESEND VERIFICATION MAIL
            await sendEmail(options)
            return res.status(401).json({
                message: 'You have to verify your email',
                emailVerified: false,
            })
        }

        if (!user.onboardingDone) {
            return res.status(401).json({
                message: 'You have to finish onboarding to login',
                onboardingDone: false,
            })
        }
        if (user.emailConfirmToken)
            return next(new AppError('Please verify your email address', 401))

        if (!user || !(await user.correctPassword(password, user.password)))
            return next(new AppError('Incorrect email or password!', 401))
        const workspaces = await getAllWorkspace({ user: user._id })
        createAndSendToken(user, 200, res, workspaces)
    }),
    /**
     * @function me
     * @route /api/v1/users/me
     * @method GET
     */
    getMe: catchAsync(async (req, res, next) => {
        const user = await User.findOne({ _id: req.user._id })
        if (!user) return next(new AppError('Please login to gain access', 403))
        res.status(200).json({
            status: 'success',
            data: user,
        })
    }),

    /**
     * @function forgotPassword
     * @route /api/v1/users/forgot-password
     * @method POST
     */
    forgotPassword: catchAsync(async (req, res, next) => {
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return next(
                new AppError('There is no user with email address.', 404)
            )
        }

        // const resetToken = user.createPasswordResetToken()
        await user.save({ validateBeforeSave: false })

        // TODO
        // Send ses email
        try {
            res.status(200).json({
                status: 'success',
                message: 'Password reset token sent to email!',
            })
        } catch (err) {
            user.passwordResetToken = undefined
            user.passwordResetExpires = undefined
            await user.save({ validateBeforeSave: false })
            return next(
                new AppError(
                    'There was an error sending the email. Try again later!'
                ),
                500
            )
        }
    }),

    /**
     * @function passwordResetConfirm
     * @route /api/v1/users/password-reset-confirm
     * @method PATCH
     */
    passwordResetConfirm: catchAsync(async (req, res, next) => {
        const user = await User.findOne({
            email: req.body.email,
            passwordResetToken: req.body.token,
            passwordResetExpires: { $gt: Date.now() },
        })
        if (!user) {
            return next(new AppError('token is invalid or has expired', 400))
        }
        user.passwordResetExpires = undefined
        user.passwordResetToken = undefined
        await user.save()
        res.status(200).json({
            status: 'success',
            message:
                'Token confirmation successful, you can now reset passsword',
        })
    }),

    /**
     * @function resetPassword
     * @route /api/v1/users/reset-password
     * @method PATCH
     */
    resetPassword: catchAsync(async (req, res, next) => {
        const user = await User.findOne({
            email: req.body.email,
        })

        if (user.passwordResetExpires)
            return next(
                new AppError('you have not verified your reset token', 400)
            )

        user.password = req.body.password
        await user.save()
        res.status(200).json({
            status: 'success',
            message: 'password reset successful',
        })
    }),

    /**
     * @function updatePassword
     * @route /api/v1/users/update-passwword
     * @method PATCH
     */
    updatePassword: catchAsync(async (req, res, next) => {
        const user = await User.findById(req.user.id).select('+password')
        if (
            !(await user.correctPassword(
                req.body.passwordCurrent,
                user.password
            ))
        ) {
            return next(new AppError('your current password is incorrect', 401))
        }
        user.password = req.body.password
        user.passwordConfirm = req.body.passwordConfirm
        await user.save()
        res.status(200).json({
            status: 'success',
            message: 'Your password has been updated',
        })
    }),
}
