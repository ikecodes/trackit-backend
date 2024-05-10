const User = require('../models/User.model')
const catchAsync = require('../helpers/catchAsync')
const AppError = require('../helpers/appError')
const { uploadToS3 } = require('../services/s3')

module.exports = {
    /**
     * @function updateMe
     * @route /api/v1/users/update-me
     * @method PATCH
     */
    updateMe: catchAsync(async (req, res, next) => {
        if (req.body.password || req.body.passwordConfirm) {
            next(
                new AppError(
                    'this route is not for password update, please /updateMyPassword',
                    400
                )
            )
        }
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        )
        res.status(200).json({
            status: 'success',
            data: updatedUser,
        })
    }),
    /**
     * @function upload
     * @route /api/v1/users/upload
     * @method POST
     */
    upload: catchAsync(async (req, res) => {
        const files = req.files
        const { folder } = req.body
        // console.log('///FILES', files, folder, files)
        const result = []
        const errors = []
        for (const file of files) {
            try {
                if (file.mimetype.includes('image')) {
                    try {
                        const uploadResult = await uploadToS3(file, folder)
                        result.push(`${process.env.S3_BASE_URL}${uploadResult}`)
                    } catch (error) {
                        errors.push(error)
                    }
                } else {
                    const resp = await uploadToS3(file, folder)
                    result.push(`${process.env.S3_BASE_URL}${resp}`)
                }
            } catch (err) {
                errors.push(err)
            }
        }
        return res.status(201).json({
            message: 'File(s) uploaded successfully',
            files: result,
        })
    }),
    /**
     * @function getAllUsers
     * @route /api/v1/users
     * @method GET
     */
    getAllUsers: catchAsync(async (req, res) => {
        const users = await User.find()
        res.status(200).json({
            status: 'success',
            data: users,
        })
    }),
    /**
     * @function user
     * @route /api/v1/users/user
     * @method GET
     */
    getUser: catchAsync(async (req, res, next) => {
        const user = await User.findOne({ _id: req.params.id })
        if (!user) return next(new AppError('No user with this Id found', 403))

        res.status(200).json({
            status: 'success',
            data: user,
        })
    }),

    /**
     * @function verifyUser
     * @route /api/v1/users/verify-user
     * @method PATCH
     */
    verifyUser: catchAsync(async (req, res) => {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { isVerified: true },
            { new: true }
        )
        res.status(200).json({
            status: 'success',
            data: updatedUser,
        })
    }),
    /**
     * @function deactivateMe
     * @route /api/v1/users/deactivate-me
     * @method PATCH
     */
    deactivateMe: catchAsync(async (req, res) => {
        await User.findByIdAndUpdate(req.user._id, { active: false })
        res.status(200).json({
            status: 'success',
        })
    }),
}
