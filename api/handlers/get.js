// Local dependencies
const { handleErrors } = require('../helpers/error')
const { getS3 } = require('../helpers/s3')

module.exports = handleErrors(getS3)
