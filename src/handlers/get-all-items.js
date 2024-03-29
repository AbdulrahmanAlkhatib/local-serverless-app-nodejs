const tableName = process.env.SAMPLE_TABLE;

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = tableName ? new dynamodb.DocumentClient({
    endpoint: "http://localhost:8000" 
  }) : new dynamodb.DocumentClient();


exports.getAllItemsHandler = async (event) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`getAllItems only accept GET method, you tried: ${event.httpMethod}`);
    }
    console.info('received:', event);
    console.log(tableName);

    let response = {};

    try {
        const params = {
            TableName : tableName
        };
        const data = await docClient.scan(params).promise();
        const items = data.Items;

        response = {
            statusCode: 200,
            body: JSON.stringify(items)
        };
    } catch (ResourceNotFoundException) {
        response = {
            statusCode: 404,
            body: "Unable to call DynamoDB. Table resource not found."
        };
    }

    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}
