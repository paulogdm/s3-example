// Are we in NOW.SH?
const isNow = process.env.NOW_REGION

module.exports = {
  bucket_name: isNow ? process.env.bucket_name : 'MYBUCKET',
  access_key: isNow ? process.env.access_key : 'ACCESSKEY',
  secret_key: isNow ? process.env.secret_key : 'SECRETKEY',
  region: isNow ? process.env.region : 'us-west-1'
}
