const { v4 } = require('uuid')
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const dotenv = require('dotenv')

dotenv.config()

const s3Client = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
})

const uploadToS3 = async (file, folder) => {
    console.log('FILE', file, folder)
    const splits = file.originalname.split('.')
    const fileName = splits[0].trim().replaceAll(' ', '')
    const extension = splits[splits.length - 1]
    const bucketParams = {
        Bucket: process.env.S3_BUCKET,
        Key: `${folder}/${fileName}-${v4()}.${extension}`,
        Body: file.buffer,
        ContentType: file.mimetype,
    }

    try {
        await s3Client.send(new PutObjectCommand(bucketParams))
        return bucketParams.Key
    } catch (err) {
        return err
    }
}

module.exports = {
    uploadToS3,
}
