"use server";

import crypto from "crypto";
import AWS from "aws-sdk";

import { env } from "@/env.mjs";

const s3 = new AWS.S3({
  accessKeyId: env.S3_ACCESS_KEY_ID,
  secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  signatureVersion: "v4",
  region: env.REGION,
});
const bucketName = env.S3_BUCKET;

const presignedUrlCache = new Map();
const signedUrlExpireSeconds = 60 * 60;

export const uploadFileToS3 = async (
  file: File,
  fileContainer: string,
  ContentType: string = "application/pdf",
) => {
  try {
    const { name } = file;
    const randomValue = crypto.randomBytes(4).readUInt32LE(0);

    // Convert file to Buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    // Set up parameters for S3 upload
    const params: any = {
      Bucket: bucketName,
      Key: `${fileContainer}/${randomValue}-${name}`,
      Body: fileBuffer,
      ContentDisposition: "inline",
      ContentType: ContentType,
    };

    const response = await s3.upload(params).promise();
    return {
      success: true,
      data: response,
      message: "File uploaded to S3 bucket successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: `Error while uploadind file to s3 bucket: ${error}`,
    };
  }
};

export async function getUploadPresignedURL(
  fileName: string,
  fileContainer: string,
  ContentType: string = "application/pdf",
) {
  try {
    const randomValue = crypto.randomBytes(4).readUInt32LE(0);
    const key = `${fileContainer}/${randomValue}-${fileName}`;

    const url = s3.getSignedUrl("putObject", {
      Bucket: bucketName,
      Key: key,
      Expires: signedUrlExpireSeconds,
      ContentDisposition: "inline",
      ContentType: ContentType,
    });

    const expiryTime = Date.now() + signedUrlExpireSeconds * 1000;

    return {
      success: true,
      url: url,
      key: key,
      expiry: expiryTime,
      message: "Presigned URL generated successfully",
    };
  } catch (error) {
    throw new Error(`Error while generating presigned url: ${error}`);
  }
}

export async function getPresignedURL(key: string) {
  try {
    // Check if the URL is cached
    if (presignedUrlCache.has(key)) {
      const cached = presignedUrlCache.get(key);
      // Check if the cached URL has expired
      if (cached.expiry > Date.now()) {
        return cached.url as string;
      } else {
        presignedUrlCache.delete(key); // Remove expired URL from cache
      }
    }

    AWS.config.update({
      accessKeyId: "id-omitted",
      secretAccessKey: "key-omitted",
    });

    const myBucket = bucketName;
    const myKey = key;
    const signedUrlExpireSeconds = 60 * 60;

    const url = s3.getSignedUrl("getObject", {
      Bucket: myBucket,
      Key: myKey,
      Expires: signedUrlExpireSeconds,
    });

    // Cache the newly generated URL with an expiry timestamp
    const expiryTime = Date.now() + signedUrlExpireSeconds * 1000;
    presignedUrlCache.set(key, { url, expiry: expiryTime });

    return url;
  } catch (error) {
    return `Error while generating presigned url: ${error}`;
  }
}

export async function deleteS3Object(key: string) {
  const params = {
    Bucket: bucketName,
    Key: key, //if any sub folder-> path/of/the/folder.ext
  };
  try {
    s3.headObject(params, function (err, _) {
      if (err)
        return {
          success: false,
          message: "File not Found ERROR : " + JSON.stringify(err),
        };
      else {
        try {
          s3.deleteObject(params).promise();
          console.log("File deleted successfully");
          return {
            success: true,
            message: "File deleted successfully",
          };
        } catch (err) {
          console.log("ERROR in file Deleting : " + JSON.stringify(err));
          return {
            success: false,
            message: "ERROR in file Deleting : " + JSON.stringify(err),
          };
        }
      }
    });
  } catch (err) {
    console.log("File not Found ERROR : " + err);
    return {
      success: false,
      message: "File not Found ERROR : " + JSON.stringify(err),
    };
  }
}
