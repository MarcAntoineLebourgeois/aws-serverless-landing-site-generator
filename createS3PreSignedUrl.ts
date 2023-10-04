import { S3 } from "aws-sdk";

export const createS3PreSignedUrl = async (
  bucketName: string
): Promise<string> => {
  try {
    const params = {
      Bucket: bucketName,
      Key: "index.html",
    };
    const s3 = new S3();
    const url = await s3.getSignedUrlPromise("putObject", params);

    return url;
  } catch (error) {
    console.log(error);
    return `error: ${error}`;
  }
};
