const axios = require('axios')
const baseURL = process.env.YOUVERIFY_SANDBOX_URL

exports.verifyBvn = async (data) => {
    const options = {
        url: `${baseURL}/v2/api/identity/ng/bvn`,
        headers: {
            Authorization: `Bearer ${process.env.YOUVERIFY_SANDBOX_KEY}`,
            'content-type': 'application/json',
        },
        method: 'POST',
        data,
    }
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.request(options)
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}

exports.verifyNin = async (data) => {
    const options = {
        url: `${baseURL}/v2/api/identity/ng/nin`,
        headers: {
            Authorization: `Bearer ${process.env.YOUVERIFY_SANDBOX_KEY}`,
            'content-type': 'application/json',
        },
        method: 'POST',
        data,
    }
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.request(options)
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}
