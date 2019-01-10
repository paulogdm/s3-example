// Local dependencies
const { handleErrors } = require('../helpers/error')
const { postS3 } = require('../helpers/s3')

module.exports = handleErrors(postS3)