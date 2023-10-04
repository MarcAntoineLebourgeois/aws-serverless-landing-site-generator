import * as aws from "@pulumi/aws";
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { buildLandingPage } from "./buildLandingPage";
import { createBucket } from "./createBucket";
import { createS3PreSignedUrl } from "./createS3PreSignedUrl";
import { putRequest } from "./putRequest";

type Body = {
  bucketName: string;
};

// Define the IAM Role with permissions for Lambda, CloudWatch, S3, and CloudFront
const lambdaRole = new aws.iam.Role("landingSiteGeneratorLambdaRole", {
  assumeRolePolicy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Action: "sts:AssumeRole",
        Effect: "Allow",
        Principal: {
          Service: "lambda.amazonaws.com",
        },
      },
    ],
  }),
});

// Attach a managed policy with the desired permissions
const managedPolicyNames = [
  "AWSLambda_FullAccess",
  "CloudWatchFullAccess",
  "CloudWatchEventsFullAccess",
  "AmazonS3FullAccess",
  "CloudFrontFullAccess",
];

for (const policyName of managedPolicyNames) {
  new aws.iam.RolePolicyAttachment(`${policyName}-attachment`, {
    policyArn: `arn:aws:iam::aws:policy/${policyName}`,
    role: lambdaRole.name,
  });
}

export const landingSiteGeneratorLambdaHandler =
  new aws.lambda.CallbackFunction("landing-site-generator", {
    callback: async (
      event: APIGatewayEvent
    ): Promise<APIGatewayProxyResult> => {
      try {
        const body = event.body;
        const base64toString = Buffer.from(body || "", "base64").toString();
        const bucketName = (JSON.parse(base64toString) as Body).bucketName;
        const html = buildLandingPage(bucketName);
        await createBucket(bucketName);
        const presignedUrl = await createS3PreSignedUrl(bucketName);
        await putRequest(presignedUrl, html);

        return {
          statusCode: 200,
          body: JSON.stringify({
            s3Url: `http://${bucketName}.s3-website.eu-west-3.amazonaws.com`,
          }),
        };
      } catch (error) {
        return {
          statusCode: 500,
          body: `${error}`,
        };
      }
    },
  });
