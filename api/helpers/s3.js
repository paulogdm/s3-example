const config = require('../config')

if (!config.bucket_name) throw new Error('Please check your configuration!')

// AWS
const aws = require('aws-sdk')

aws.config.update({
  'accessKeyId': config.access_key,
  'secretAccessKey': config.secret_key,
  'region': config.region,
  'bucketname': config.bucket_name
})

// Set AWS to use native promises
aws.config.setPromisesDependency(null)

// New S3 class
const s3 = new aws.S3()

// Micro deps
const {createError, send, json} = require('micro')

// For generation of UUIDs
const { randomBytes } = require('crypto')

/**
 * This function retrieves a signed URL.
 * It is useful to programatically restrict access to some objects.
 * to S3 objects, like private files.
 * @param  {req}    req object from micro
 * @param  {res}    res object from micro
 * @return {String} URL response from S3
 */
const getSignedS3 = async (req, res) => {
  const s3key = `${req.url.split('/').pop()}`

  const params = {
    Bucket: config.bucket_name,
    Key: s3key,
    Expires: 60 * 60 * 24 // 1 day
  }

  try {
    // key exists?
    await s3.headObject({
      Bucket: params.Bucket,
      Key: params.Key
    }).promise()

    // if you want to programatically provide limited access to an S3 object:
    // const url = await s3.getSignedUrl('getObject', params)
    // return send(res, statusCode, url)

    // we will use Now 2.0 bultin CDN bellow
    const result = await s3.getObject(params).promise()
    console.info(result)
    return send(res, 200, result.data)
  } catch (err) {
    if (err.statusCode === 404) {
      throw createError(404, 'Not Found')
    } else throw err
  }
}

/**
 * This function sets cache readers to save content in the CDN.
 * @param  {req}    req object from micro
 * @param  {res}    res object from micro
 * @return {String} URL response from S3
 */
const getS3 = async (req, res) => {
  const s3key = `${req.url.split('/').pop()}`

  const params = {
    Bucket: config.bucket_name,
    Key: s3key
  }
  console.info(s3key)
  try {
    // key exists?
    await s3.headObject({
      Bucket: params.Bucket,
      Key: params.Key
    }).promise()

    // cache headers
    res.setHeader('Cache-Control', 's-maxage=31536000, maxage=0')
    // retrieving object from S3
    const result = await s3.getObject(params).promise()
    // set the right Content-Type
    res.setHeader('Content-Type', result['ContentType'])

    return send(res, 200, result.Body)
  } catch (err) {
    if (err.statusCode === 404) {
      throw createError(404, 'Not Found')
    } else throw err
  }
}

/**
 * This function can generate a UUID of any size.
 * Example of UUID: "I1tx0ssVk9"
 * @param  {Number} Size of UUID
 * @return {String} UUID generated
 */
const generateUUID = (size = 10) => {
  return randomBytes(Math.ceil(size * 3 / 4))
    .toString('base64')
    .slice(0, size)
    .replace(/\+/g, 'a')
    .replace(/\//g, 'b')
}

/**
 * This function will generate a post request to a S3 bucket
 * @param  {req}    req object from micro
 * @param  {res}    res object from micro
 * @return {String} Object response from S3
 */
const postS3 = async (req, res) => {
  const {contentType} = await json(req) // we are requiring the ContenType from the request

  const s3key = `${generateUUID()}.${contentType.split('/').pop()}` // this works for png, jpg, pdf, ...

  const params = {
    Bucket: config.bucket_name,
    Fields: {
      key: s3key
    },
    Expires: 60 * 10, // 10 min
    Conditions: [
      {
        'bucket': config.bucket_name
      },
      {
        'key': s3key // our generated key
      },
      {
        'acl': 'private' // private bucket
      },
      {
        'Content-Type': contentType
      },
      ['content-length-range', 8000, 8000000] // from 1KB to 1 MB
    ]
  }

  let signedPost = await s3.createPresignedPost(params)
  signedPost = Object.assign(signedPost,
    {
      'Content-Type': contentType,
      'acl': 'private'
    }
  )
  return send(res, 200, signedPost)
}

module.exports = {
  getS3,
  postS3
}
