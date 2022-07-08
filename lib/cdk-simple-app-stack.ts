import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from "aws-cdk-lib/aws-s3";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";


export class CdkSimpleAppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'FileStoreBucket')

    const handler = new lambda.Function(this, 'MyLambdaHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('./resources'),
      handler: "handler.handler",
      environment: {
        BUCKET: bucket.bucketName
      }
    })

    bucket.grantReadWrite(handler);

    const api = new apigateway.RestApi(this, "file-api", {
      restApiName: "File Service",
      description: "This service serves files."
    });

    const getLambdaIntegration = new apigateway.LambdaIntegration(handler);
    api.root.addResource('file-id').addMethod('GET', getLambdaIntegration)
  }
}
