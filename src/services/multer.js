const multer = require('multer')
// const path = require('path')

// Multer config
const uploader = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        // let ext = path.extname(file.originalname)
        // if (
        //     ext !== '.jpg' &&
        //     ext !== '.jpeg' &&
        //     ext !== '.png' &&
        //     ext !== '.JPG'
        // ) {
        //     cb(
        //         new AppError(
        //             'This is not an image! please upload an image',
        //             400
        //         ),
        //         false
        //     )
        //     return
        // }
        cb(null, true)
    },
})

module.exports = uploader
