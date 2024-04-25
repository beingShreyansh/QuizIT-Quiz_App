const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const fetch = require("node-fetch");
const region = process.env.region;
const accessKeyId = process.env.accessKeyId;
const secretAccessKey = process.env.secretAccessKey;
const bucketName = process.env.bucketName;
const { URL } = require("url");

const s3Client = new S3Client({
  region: region,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});

const getObjectUrl = async (key) => {
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // Expiry time in seconds (e.g., 1 hour)
    return url;
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw error; // Propagate the error to the caller
  }
};

const putObject = async (fileName, contentType) => {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: `.uploads/users/${fileName}`,
    ContentType: contentType,
  });
  const url = await getSignedUrl(s3Client, command);
  return url;
};

const putQuestionObject = async (fileName, contentType) => {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: `.uploads/questions/${fileName}`,
    ContentType: contentType,
  });
  const url = await getSignedUrl(s3Client, command);
  return url;
};

const uploadImageToS3 = async (imageUrl, fileName) => {
  try {
    // If imageUrl is a relative URL, convert it into an absolute URL
    const absoluteUrl = new URL(imageUrl, "http://google.com"); // Provide a base URL (you can use any valid URL)
    imageUrl = absoluteUrl.toString();

    // Generate a pre-signed URL for uploading
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: `.uploads/questions/${fileName}`,
      ContentType: "image/jpeg", // Adjust the content type based on the image format
    });
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    }); // URL expires in 1 hour

    // Fetch the image from the URL
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    // Convert the response body to a buffer
    const buffer = Buffer.from(await response.arrayBuffer());

    // Upload the image to the pre-signed URL
    const uploadResponse = await fetch(signedUrl, {
      method: "PUT",
      body: buffer,
      headers: {
        "Content-Type": "image/jpeg", // Adjust the content type based on the image format
        "Content-Length": buffer.length.toString(), // Add Content-Length header
      },
    });

    if (!uploadResponse.ok) {
      throw new Error("Failed to upload image to S3");
    }

    return signedUrl;
  } catch (error) {
    console.error("Error uploading image to S3:", error);
    throw error;
  }
};

module.exports = { getObjectUrl, putObject, uploadImageToS3 ,putQuestionObject};
