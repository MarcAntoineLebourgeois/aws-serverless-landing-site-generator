import * as apigateway from "@pulumi/aws-apigateway";
import { landingSiteGeneratorLambdaHandler } from "./lambdaHandler";

// Define an endpoint that invokes a lambda to handle requests
const api = new apigateway.RestAPI("api", {
  routes: [
    {
      path: "/landing-site-generator",
      method: "POST",
      eventHandler: landingSiteGeneratorLambdaHandler,
    },
  ],
});

export const url = api.url;
