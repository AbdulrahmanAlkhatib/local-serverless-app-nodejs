const tableName = process.env.SAMPLE_TABLE;

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = tableName ? new dynamodb.DocumentClient({
    endpoint: "http://localhost:8000"
  }) : new dynamodb.DocumentClient();


exports.putItemHandler = async (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
    }
    console.info('received:', event);
    console.log(tableName);

    const body = JSON.parse(event.body);
    const id = body.id;
    const name = body.name;

    let response = {};

    try {
        const params = {
            TableName : tableName,
            Item: { id : id, name: name }
        };
        const result = await docClient.put(params).promise();
        response = {
            statusCode: 200,
            body: JSON.stringify(body)
        };
    } catch (ResourceNotFoundException) {
        response = {
            statusCode: 404,
            body: "Unable to call DynamoDB. Table resource not found."
        };
    }

    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};
