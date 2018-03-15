# Micro with S3 bucket example.

Simple example using Zeit's micro and the AWS SDK to upload files to the cloud.

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

## How to use

### Getting Started

Clone this [repo](https://github.com/paulogdm/micro-s3-example):

Edit the index.js:

```javascript
const BUCKET_NAME = 'cultofthepartyparrot'
const ACCESS_KEY = 'MY_ACCESS_KEY'
const SECRET_KEY = 'MY_SECRET_KEY'
const REGION = 'us-west-1'
```
### Running and installing

```bash
npm install
npm install -g micro-dev micro
npm run start
```

### Using

Upload file:

```bash
curl  --request POST --data-binary "./1.png" localhost:3000/1.png
```

Fetch file:

```bash
curl  --request GET localhost:3000/1.png
```

### Rest Clients

You can also see this example action with [Insomnia](https://insomnia.rest/) importing the request from [insomnia.json](insomnia.json).

A "HTTP Archive" file is also provided [here](HttpArchive.har).

### Deploying to `now.sh`

Deploy it to the cloud with [now](https://zeit.co/now)

```bash
now
```

## Note

This example uploads the file to a server and then save it to S3.
However you may want to just upload from the client directly to the S3 bucket with [Pre Signed Post](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#createPresignedPost-property)

## Packages Used In This Example

 * [micro](https://github.com/zeit/micro)
 * [AWS SDK](https://github.com/aws/aws-sdk-js)
 * [microrouter](https://github.com/pedronauck/micro-router)

## Author

[@paulogdm](https://github.com/paulogdm)

## License

MIT
