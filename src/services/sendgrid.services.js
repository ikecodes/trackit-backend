const sgMail = require('@sendgrid/mail')
const dotenv = require('dotenv')
dotenv.config()

sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const sendEmail = async ({
    to = [],
    subject = '',
    content = '',
    from = 'contact@loubby.ai',
}) => {
    const msg = {
        to: to,
        from: {
            email: from,
            name: 'TrackiT',
        },
        fromname: 'TrackiT',
        subject: subject,
        html: `<p>${content}</p>`,
    }
    console.log('send griddddd')
    await sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
            return error
        })
}

module.exports = {
    sendEmail,
}
