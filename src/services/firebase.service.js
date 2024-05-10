const admin = require('firebase-admin')
const Token = require('../models/Token.model')
const Notification = require('../models/Notification.model')

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
// })

/**
 * @module firebase
 * @description provides an abstraction layer firebase services
 */
module.exports = {
    /**
     * @function sendNotification
     * @description an generic API to send message to a single device
     * @param {String} deviceToken - fcmToken of target device
     * @param {Object} data - payload data
     * @param {Object} notification - payload notification
     */
    sendNotification: async ({
        userId,
        title,
        body,
        data = {},
        type,
        projectId,
    }) => {
        try {
            await Notification.create({
                user: userId,
                title,
                body,
                type,
                project: projectId,
            })
            const token = await Token.findOne({ userId })
            const deviceToken = token.pushToken
            const notification = {
                title,
                body,
            }
            const fcmData = {
                message: JSON.stringify(data),
                time: `${Date.now()}`,
            }
            const message = {
                notification,
                token: deviceToken,
                data: fcmData,
                apns: {
                    payload: {
                        aps: {
                            contentAvailable: true,
                            sound: 'default',
                            alert: notification,
                        },
                    },
                    headers: {
                        'apns-push-type': 'alert',
                        'apns-priority': '5',
                    },
                },
            }
            await admin.messaging().send(message)
            console.log('Successfully sent message:')
        } catch (error) {
            console.log('Error sending message:', error)
        }
    },
}
