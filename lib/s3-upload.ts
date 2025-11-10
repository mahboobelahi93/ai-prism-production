import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

// Create an S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadFileToS3(
  file: File,
  bucketName: string,
  key: string,
) {
  const params = {
    Bucket: bucketName,
    Key: key, // The name of the file on S3
    Body: file,
    ContentType: file.type,
  };

  try {
    const data = await s3Client.send(new PutObjectCommand(params));
    return `https://${bucketName}.s3.amazonaws.com/${key}`;
  } catch (error) {
    throw new Error(`Failed to upload file to S3: ${error}`);
  }
}
