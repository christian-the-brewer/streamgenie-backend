const mongoose = require('./connection')

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        userName: {
            type: String,
            required: true,
            unique: true,
        },
        hashedPassword: {
            type: String,
            required: true,
        },
        region: {
            type: String,
            required: true,
        },
        token: String,
    },
    {
        timestamps: true,
        toObject: {
            // remove `hashedPassword` field when we call `.toObject`
            transform: (_doc, user) => {
                delete user.hashedPassword
                return user
            },
        },
    }
)

module.exports = mongoose.model('User', userSchema)
