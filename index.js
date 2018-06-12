// Micro deps
const { buffer, createError, send } = require('micro')

// Configs
const BUCKET_NAME = 'cultofthepartyparrot'
const ACCESS_KEY = 'MY_ACCESS_KEY'
const SECRET_KEY = 'MY_SECRET_KEY'
const REGION = 'us-west-1'

// AWS
const aws = require('aws-sdk')
aws.config.update({
  'accessKeyId': ACCESS_KEY,
  'secretAccessKey': SECRET_KEY,
  'region': REGION,
  'bucketname': BUCKET_NAME
})

// Set AWS to use native promises
aws.config.setPromisesDependency(null)

// New S3 class
const s3 = new aws.S3()

/**
 * Uploads a buffer to the AWS
 * @param  {Buffer} fileBuffer  File binary.
 * @param  {String} contentType Type of content, usually the header of http request.
 * @param  {String} s3key       File key to S3 bucket.
 * @return {Promise}            Promise to be resolved or rejected.
 */
const uploadBuffer = async (fileBuffer, contentType, s3key) => {
  return s3.putObject({
    ACL: 'private',
    Bucket: BUCKET_NAME,
    Key: s3key,
    Body: fileBuffer,
    ContentType: contentType
  }).promise()
}

/**
 * Get file binary and `content-type`.
 * Then uploads it to AWS.
 * @param  {Object} req
 * @param  {Object} res
 * @return {String}     filename
 */
const set = async (req, res) => {
  const buf = await buffer(req, {limit: '5mb'})
  const fileName = req.url.split('/').pop()
  const contentType = req.headers['content-type']

  if (!fileName || !contentType) {
    throw createError(400, 'Bad Params')
  }

  await uploadBuffer(buf, contentType, fileName)

  return fileName
}

/**
 * Redirect a request to a given location.
 * @param  {Object} req
 * @param  {Object} res
 * @param  {String} location Redirect URI
 */
const redirect = async (req, res, location) => {
  res.setHeader('Location', location)
  res.statusCode = 302
  res.end()
}

/**
 * Intercepts a request and try to fetch it from S3.
 * ES6 Proxy could be very useful here.
 * @param  {Object} req
 * @param  {Object} res
 */
const fetch = async (req, res) => {
  const filename = req.url.split('/').pop()

  try {
    await s3.headObject({
      Bucket: BUCKET_NAME,
      Key: filename
    }).promise()

    const uri = s3.getSignedUrl('getObject', {
      Bucket: BUCKET_NAME,
      Key: filename
    })

    return redirect(req, res, uri)
  } catch (err) {
    if (err.statusCode === 404) {
      throw createError(404, 'Not Found')
    } else throw err
  }
}

/**
 * Handle our errors nicely.
 * @param  {Function} fn function to try-catch
 */
const handleErrors = fn => async (req, res) => {
  try {
    return await fn(req, res)
  } catch (err) {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal Server Error'
    console.error(err)
    return send(res, statusCode, message)
  }
}

const router = async (req, res) => {
  if (req.method === 'POST') {
    return set(req, res)
  } else if (req.method === 'GET') {
    return fetch(req, res)
  } else {
    throw createError(405, 'Invalid method')
  }
}

/**
 * Exporting http server created by `microrouter`
 */
module.exports = handleErrors(router)
