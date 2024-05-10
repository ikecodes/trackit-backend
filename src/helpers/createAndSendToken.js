const jwt = require('jsonwebtoken')

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES,
    })
}
// const decryptSignToken = (token) => {
//     return jwt.verify(token, process.env.JWT_EXPIRES)
// }
const createAndSendToken = (user, statusCode, res, workspaces) => {
    const token = signToken(user._id)
    user.password = undefined
    res.status(statusCode).json({
        status: 'success',
        token,
        user,
        workspaces,
    })
}

module.exports = createAndSendToken
