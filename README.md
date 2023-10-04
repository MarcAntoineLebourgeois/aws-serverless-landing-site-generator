# aws-serverless-landing-site-generator
Here is the tutorial for building a simple landing site generator with aws serverless services, typescript and pulumi

Landing Site Generation with Pulumi, TypeScript and AWS Serverless Services
In the vast digital ocean, there's no shortage of online platforms boasting the ability to craft pixel-perfect websites with a few clicks. 
However, our ambition here diverges a bit: we're keen on mass-producing custom landing sites through simple API calls. Leveraging Pulumi's infrastructure-as-code, TypeScript, and AWS's serverless services, this goal is wholly attainable. Dive into this article, and let's embark on a journey to construct a landing site generator that's not only efficient and scalable but also seamlessly deployable and cost-conscious.
To check the full code, here it is:
https://github.com/MarcAntoineLebourgeois/aws-serverless-landing-site-generator
Requirements:
Typescript
Pulumi CLI
Pulumi account
AWS account with credentials

Steps:
1. Create the project directory:
mkdir aws-serverless-landing-site-generator && cd aws-serverless-landing-site-generator
2. Set Up Pulumi:
Firstly, ensure you have signed up for a Pulumi account and installed the Pulumi CLI. Once that's done, follow the steps below to create an AWS TypeScript project with Pulumi:
pulumi new aws-typescript -name aws-serverless-landing-site-generator -s YOUR_PULUMI_ACCOUNT/aws-serverless-landing-site-generator/dev
This command generates a template and installs dependencies for you.
You can check the creation of your stack on your pulumi account
And here is the generated template:
In the index.ts, it will suppose to create a s3 bucket called my-bucket
3. Configure AWS Credentials
Start by inputting your AWS credentials in your terminal. To verify the configuration, navigate to the root of your directory and execute the following command:
pulumi up
You should expect to see the following output:
Upon seeing this output, choose "yes."
Terminal Output:
AWS Console (S3 Service) Output:
Fantastic! All systems are now correctly set up and ready to go.
4. Understanding Our Technical Blueprint
Before we proceed, let's take a moment to delve into our architectural strategy.
Our primary aim is to make an `index.html` template from an S3 bucket publicly accessible and be able to inject data into this template via an API call. How do we achieve this?
- API Gateway: Our starting point is setting up an API Gateway. This acts as the main conduit to route incoming calls.
- Lambda Function: The API Gateway will direct calls to a Lambda function. This function is responsible for executing several tasks: creating the bucket, generating the `index.html` template, injecting the required data, and finally, publishing it to the bucket.
5. Setting Up the API Gateway and Integrating a Lambda Function
To start, ensure you install the `@pulumi/aws-apigateway` package using your preferred package manager.
Setting Up the API Gateway:
1. Create a file named `apiGateway.ts` and incorporate the code below:

Take note of the exported URL; it'll be the endpoint we'll interact with.
Creating the Lambda Handler:
1. In a new file named `lambdaHandler.ts`, insert the following:

This Lambda function involves decoding a base64-encoded body, so make sure your data adheres to this format when making API requests.
Integrating with Pulumi:
Since the `tsconfig` template indicates that Pulumi reads only the `index.ts` file, update this file with the following:

This structure ensures a singular entry point for your Pulumi application, which many find convenient.
Now, execute the `pulumi up` command. This will initiate the creation of your API gateway, the associated Lambda function, the requisite permissions (IAM roles), and will remove any initial bucket that exists.
It's important to note that without specifying IAM roles at this point, the default permissions granted will include a broad range of AWS service accesses like `AWSLambda_FullAccess`, `AmazonS3FullAccess`, and many others.
Once executed, you'll see the Pulumi output displaying the URL of the newly created API Gateway.
Testing the Setup:
Use tools like Postman to test this setup. Insert the provided URL, select the POST method, and add a raw JSON body. If set up correctly, you should receive a response echoing the value from your inputted body.
Congratulations on the successful setup!
6. Deepening the Dive: Dynamic HTML Template Generation
Next, our goal is to dynamically generate an HTML template that incorporates the data received.
Generating the HTML Template:
1. Start by creating a `buildLandingPage.ts` file.
2. The function outlined below accepts a value and returns a complete, stringified HTML page that embeds this value.

Updating the Lambda Handler:
1. Make modifications to `lambdaHandler.ts` as follows:
2. Import the new function and generate the HTML string to be returned in the response.

After incorporating these changes, run `pulumi up` and test the setup using Postman.
Voilà! You should be able to view the HTML preview with your injected data.
7. Constructing an S3 Bucket via Lambda
The next step involves programming our Lambda function to create an S3 bucket.
Preparation Steps:
1. Start by installing the `aws-sdk` package.
Creating the Bucket:
1. Generate a new file and name it `createBucket.ts`.
2. Fill the file with the following code:

This asynchronous function accepts `bucketName` as its parameter and proceeds to set up an S3 bucket configured for public access, targeting an index.html file.
Lambda Handler Update:
Now, let's refine the Lambda handler to incorporate our new bucket creation logic:

Recap of Changes:
- Added explicit typing for our request body.
- Configured IAM role and policies for the Lambda to have adequate permissions to interact with the S3 service. Remember to restrict access as needed to ensure security.
- Integrated the `createBucket` function and returned the bucket's URL from our handler. Note the region "eu-west-3" was used, but yours might differ.
Finally, run `pulumi up` and test your function using Postman.
Ensure you modify your POST request's body to align with the handler's expectations. When crafting your bucket's name, ensure it's unique. Although navigating to the URL will initially display a 404 error due to the missing `index.html`, this will be addressed in the upcoming steps.
Verify the creation by inspecting the AWS S3 console.
Impressive, right? Our Lambda now effortlessly spins up an S3 bucket.
8. Generating a Signed URL for AWS Lambda to Store `index.html` in the Bucket
While simpler methods to achieve this using the `aws-sdk` exist, for the purpose of this guide, I'd like to showcase how to generate a presigned URL. This approach ensures a secure interaction with an S3 bucket, whether from a Lambda function or from a client-side application.
Firstly, we'll craft a file titled `createS3PreSignedUrl.ts` and insert the subsequent code:

This function provides a temporary URL, granting permission to deposit an object within the specified bucket.
Next, let's craft a distinct file named `putRequest.ts` and integrate the following code:

This function facilitates fetching a URL via the PUT method, specifying an HTML content type. It requires both the presigned URL and the HTML string.
To integrate these functions into your Lambda handler, incorporate the subsequent lines immediately after the bucket creation:
await createBucket(bucketName);
const presignedUrl = await createS3PreSignedUrl(bucketName);
await putRequest(presignedUrl, html);
Upon updating your infrastructure with `Pulumi up`, test it using Postman. When doing so, remember to update the `bucketName` in the body of your request since the original bucket already exists. We'll delve into deletion procedures shortly.
Finally, upon accessing the provided link in your web browser, you should observe the triumphant deployment of a website on S3, complete with text dynamically derived from your API request's body.
Tadaaaaa!
9. Dismantling the Entire Stack
Initiate the process by executing the `pulumi destroy` command. Your terminal should reflect the subsequent output:
IMPORTANT: While Pulumi oversees the destruction of all resources it manages, it doesn't account for buckets generated by your lambda. Ensure you manually purge these buckets, either directly, via the CLI, or any other preferred method.
10. Advancements and Enhancements
Should you desire to elevate and refine this process further, consider the following strategies:
- Integrate and align a Cloudfront CDN with your bucket, allowing global caching of your site. This optimization significantly trims loading durations.
- Leverage the Route53 service to link a DNS domain name to your CDN, offering a sleek, memorable URL for your platform's access.
This tutorial is my first one. Hope you enjoyed it. Feel free to contact me if you have any remarks.
marc.antoine.lebourgeois@gmail.com
