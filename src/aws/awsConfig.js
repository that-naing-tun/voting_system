import AWS from "aws-sdk";

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.VUE_APP_AWS_ACCESS_KEY_ID, // Replace with your IAM user Access Key ID
  secretAccessKey: process.env.VUE_APP_AWS_SECRET_ACCESS_KEY, // Replace with your IAM user Secret Access Key
  region: process.env.VUE_APP_AWS_REGION, // e.g., 'ap-southeast-1'
});

const s3 = new AWS.S3();
export default s3;
