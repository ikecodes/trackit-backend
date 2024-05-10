const catchAsync = require('../helpers/catchAsync')
const Token = require('../models/Token.model')

module.exports = {
    /**
     * @function savePushToken
     * @description save Push token
     * @param {Object} request - the request object
     * @param {Object} response - the response object
     */
    savePushToken: catchAsync(async (req, res) => {
        const { _id } = req.user
        const { pushToken, deviceType, deviceName } = req.body
        const savedAccountToken = await Token.findOne({
            userId: _id,
        })
        if (savedAccountToken) {
            savedAccountToken.pushToken = pushToken
            savedAccountToken.save()
        } else {
            await Token.create({
                userId: _id,
                pushToken: pushToken,
                deviceType,
                deviceName,
            })
        }
        return res.status(200).json({
            status: 'success',
            message: 'push token set successfully',
        })
    }),

    /**
     * @function getPushToken
     * @description get saved Push token
     * @param {Object} request - the request object
     * @param {Object} response - the response object
     */
    getPushToken: catchAsync(async (req, res) => {
        const { _id } = req.user
        const savedAccount = await Token.findOne({
            userId: _id,
        })
        //record not found
        if (!savedAccount)
            return res.status(400).json({
                status: false,
                message: 'No token found',
            })
        const token = savedAccount.pushToken
        return res.status(200).json({
            status: true,
            data: token,
        })
    }),
}
