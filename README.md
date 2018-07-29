# Micro with S3 bucket example.

Simple example using Zeit's micro and the AWS SDK to upload files to the cloud.

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

[![Deploy to now](https://deploy.now.sh/static/button.svg)](https://deploy.now.sh/?repo=https://github.com/paulogdm/micro-s3-example)

## How to use

### Getting Started

Clone this [repo](https://github.com/paulogdm/micro-s3-example):

Edit `config.js`:

```javascript
// ...
  BUCKET_NAME: isNOW ? process.env.BUCKET_NAME : 'micro-s3-example',
  ACCESS_KEY: isNOW ? process.env.ACCESS_KEY : 'ACCESSKEY',
  SECRET_KEY: isNOW ? process.env.SECRET_KEY : 'SECRETKEY',
  REGION: isNOW ? process.env.REGION : 'us-west-1'
// ...
```

If you are running this example locally, you should edit the fields on the left. If you are planning to test it on [now.sh](https://now.sh) you need to add secrets. Please refer to the section "[deploying to now.sh](https://github.com/paulogdm/micro-s3-example#deploying-to-nowsh)".

### Running and installing

```bash
npm install
npm install -g micro-dev micro
npm run start
```

### Rest Clients

You can also see this example in action with [Insomnia](https://insomnia.rest/) importing the requests from [insomnia.json](insomnia.json).

### Deploying to `now.sh`

First install `now`:

```bash
npm install -g now
```

Second you need to add a few `now` [secrets](https://zeit.co/docs/getting-started/secrets):

```bash
now secrets add BUCKET_NAME "micro-s3-example"
now secrets add ACCESS_KEY "ACCESSKEY"
now secrets add SECRET_KEY "SECRETKEY"
now secrets add REGION "us-west-1"
```

*PS: The key of those secrets will always be lower case (E.g: `BUCKET_NAME` will be `process.env.bucket_name`)*

Deploy it to the cloud with [now](https://zeit.co/now):

```bash
npm run deploy
```
Check the script "deploy" inside "package.json" if you are trying 

## Packages Used In This Example

 * [micro](https://github.com/zeit/micro)
 * [AWS SDK](https://github.com/aws/aws-sdk-js)

## Author

[@paulogdm](https://github.com/paulogdm)

## License

MIT
