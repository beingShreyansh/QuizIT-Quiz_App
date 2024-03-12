const aws = require("aws-sdk");
const { randomBytes } = require("crypto");
const { promisify } = require("util");

const region = "ap-south-1";
const bucketName = "quiz-it-bucket";

const s3 = new aws.S3({
  region,
  signatureVersion: "v4",
});

const randomBytesAsync = promisify(randomBytes);

async function generateUploadURL() {
  const rawBytes = await randomBytesAsync(16);
  const imageName = rawBytes.toString("hex");

  const params = {
    Bucket: bucketName,
    Key: imageName,
    Expires: 60,
  };

  const uploadURL = await s3.getSignedUrlPromise("putObject", params);

  // Include the generated image name in the response
  return { uploadURL, imageName };
}

module.exports = {
  generateUploadURL,
};
