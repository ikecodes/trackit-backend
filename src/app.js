const express = require('express')
const cors = require('cors')
const routes = require('./routes')
const errorHandler = require('./middleware/errorHandler')

const app = express()

app.set('veiw engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//app.use(helmet());
app.use(cors())

// app.post('/api/v1/test-notifee', async (req, res) => {
//     const title = 'testing notification'
//     const body = 'this is a test notifications'
//     const type = 'milestones'
//     try {
//         await sendNotification({
//             userId: '64a6dbf995e328cd0277981e',
//             title,
//             body,
//             type,
//         })
//         res.send('Success')
//     } catch (error) {
//         console.log(error)
//     }
// })
app.use('/api/v1/', routes)

app.get('/home', (req, res) => {
    res.status(200).json({
        status: true,
        message: 'Welcome to Exectracker api',
    })
})

app.get('/', (req, res) => {
    res.status(200).json({
        status: true,
        message: 'Welcome to Exectracker api',
    })
})

app.use(errorHandler)
module.exports = app
