import { S3 } from "aws-sdk";

export const createBucket = async (bucketName: string) => {
  const s3 = new S3();
  await s3.createBucket({ Bucket: bucketName }).promise();

  // Disable PublicAccessBlock
  await s3
    .putPublicAccessBlock({
      Bucket: bucketName,
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: false,
        IgnorePublicAcls: false,
        BlockPublicPolicy: false,
        RestrictPublicBuckets: false,
      },
    })
    .promise();

  // Attach a public read policy to the bucket
  const bucketPolicy = {
    Version: "2012-10-17",
    Statement: [
      {
        Sid: "PublicReadGetObject",
        Effect: "Allow",
        Principal: "*",
        Action: "s3:GetObject",
        Resource: `arn:aws:s3:::${bucketName}/*`,
      },
    ],
  };

  await s3
    .putBucketPolicy({
      Bucket: bucketName,
      Policy: JSON.stringify(bucketPolicy),
    })
    .promise();

  // Configure the default index document
  const websiteConfig = {
    IndexDocument: {
      Suffix: "index.html",
    },
  };

  await s3
    .putBucketWebsite({
      Bucket: bucketName,
      WebsiteConfiguration: websiteConfig,
    })
    .promise();
};
