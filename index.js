// Micro dependencies
const { buffer, createError, send } = require('micro')

// Local dependencies
const { handleErrors } = require('./error')
const { getS3, postS3 } = require('./s3')

// Config object
const config = require('./config')

// Very simple router
// You can also use microrouter 
const router = async (req, res) => {
  if (req.method === 'POST') {
    return postS3(req, res)
  } else if (req.method === 'GET') {
    return getS3(req, res)
  } else {
    throw createError(405, 'Invalid method')
  }
}

module.exports = handleErrors(router)
