const mongoose = require('mongoose')

const TokenSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        deviceType: {
            type: String,
            enum: ['android', 'ios'],
        },
        deviceName: {
            type: String,
        },
        pushToken: {
            type: String,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)

const Token = mongoose.model('Token', TokenSchema)

module.exports = Token
