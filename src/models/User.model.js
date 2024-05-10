const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema(
    {
        // fullName: {
        //     type: String,
        //     required: [true, 'Please provide your full name'],
        // },
        firstName: {
            type: String,
            required: [true, 'Please provide your first name'],
        },
        lastName: {
            type: String,
            required: [true, 'Please provide your last name'],
        },
        email: {
            type: String,
            required: [true, 'Please provide your email'],
            unique: true,
            lowercase: true,
        },
        phone: {
            type: String,
            required: [true, 'Please provide a phone number'],
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: 8,
            select: false,
        },
        photo: {
            type: String,
            default:
                'https://png.pngitem.com/pimgs/s/22-223968_default-profile-picture-circle-hd-png-download.png',
        },
        bvn: {
            type: String,
        },
        nimc: {
            type: String,
        },
        role: {
            type: String,
            enum: ['executive', 'collaborator', 'contractor'],
            default: 'executive',
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        emailConfirmToken: {
            type: Number,
        },
        passwordChangedAt: Date,
        passwordResetToken: Number,
        passwordResetExpires: Date,
        active: {
            type: Boolean,
            default: true,
        },
        onboardingDone: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 12)
    next()
})

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next()
    this.passwordChangedAt = Date.now() - 1000
    next()
})

userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        )
        return JWTTimestamp < changedTimestamp
    }
    return false
}

userSchema.methods.createEmailConfirmToken = function () {
    const confirmToken = Math.floor(10000 + Math.random() * 90000)
    this.emailConfirmToken = confirmToken
    return confirmToken
}

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = Math.floor(10000 + Math.random() * 90000)
    this.passwordResetToken = resetToken
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000
    return resetToken
}

const User = mongoose.model('User', userSchema)

module.exports = User
