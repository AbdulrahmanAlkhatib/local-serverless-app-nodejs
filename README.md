##
in this demo, I used AWS SAM CLI command to initialize a serverless api application from an AWS QuickStart template.

to be able to perform this Demo you need AWS CLI, AWS SAM CLI and Docker installed.

Getting the Source Code

run the following command and proceed. from  “AWS Quick Start Templates” make sure to choose “Serverless API“ option.

sam init

 after finishing, you’ll end up with the source code, including the sam template, handlers for lambda functions.

if you check the template.yaml file youll find the resources defined, which includes CRUD Lambda functions, dynamoDB table, and the API Gateway which is defined as a trigger event inside the lambda functions.

## Running DynamoDB Locally

next you have to download dynamoDB-local image and run it locally. 

download the image using the following command:

docker pull amazon/dynamodb-local

then run the image locally from the project directory:

docker run -p 8000:00 -v $(pwd)/local/dynamodb:/data/ amazon/dynamodb-local -jar DynamoDBLocal.jar -sharedDb -dbPath /data

the a persistent containerized version which will save data in //data file that is passed as flag, you can try a non-persistent containerized version using the following command instead

docker run -p 8000:8000 amazon/dynamodb-local

  Creating DynamoDB Table Locally 

when you run SAM app locally, SAM CLI locates the template file to invoke the function, locate its code and run it, bu it doesnt create dynamodb, so you2ll have to create it yourself before running the app.

we will create the table using the command aws dynamodb create-table, and we have to either pass the attributes to the command, or pass the path of a json file that contains the attributes.

aws dynamodb create-table --cli-input-json file://create-table.json --endpoint-url http://localhost:8000

then CLI prints the result as following

## Lambda Functions Handlers

in order to connect to our local DynamoDB local we have to modify the source code of the lambda functions handlers to initialize DynamoDB differently so it could work locally

lastly, run the following command from the root directory

sam local start-api --port 3030

and you should be able to http request your api from Postman or the browser.

## Deploy the application to AWS

To build and deploy your application for the first time, run the following in your shell:

```bash
sam build
sam deploy --guided
```

The first command will build the source of your application. The second command will package and deploy your application to AWS, with a series of prompts:

* **Stack Name**: The name of the stack to deploy to CloudFormation. This should be unique to your account and region, and a good starting point would be something matching your project name.
* **AWS Region**: The AWS region you want to deploy your app to.
* **Confirm changes before deploy**: If set to yes, any change sets will be shown to you before execution for manual review. If set to no, the AWS SAM CLI will automatically deploy application changes.
* **Allow SAM CLI IAM role creation**: Many AWS SAM templates, including this example, create AWS IAM roles required for the AWS Lambda function(s) included to access AWS services. By default, these are scoped down to minimum required permissions. To deploy an AWS CloudFormation stack which creates or modifies IAM roles, the `CAPABILITY_IAM` value for `capabilities` must be provided. If permission isn't provided through this prompt, to deploy this example you must explicitly pass `--capabilities CAPABILITY_IAM` to the `sam deploy` command.
* **Save arguments to samconfig.toml**: If set to yes, your choices will be saved to a configuration file inside the project, so that in the future you can just re-run `sam deploy` without parameters to deploy changes to your application.

The API Gateway endpoint API will be displayed in the outputs when the deployment is complete.