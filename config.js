// Are we in NOW.SH?
const isNOW = process.env.NOW

module.exports = {
  bucket_name: isNOW ? process.env.bucket_name : 'micro-s3-example',
  access_key: isNOW ? process.env.access_key : 'ACCESSKEY',
  secret_key: isNOW ? process.env.secret_key : 'SECRETKEY',
  region: isNOW ? process.env.region : 'us-west-1'
}
