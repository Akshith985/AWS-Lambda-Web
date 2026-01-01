const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");

// Connect to LocalStack DynamoDB
const client = new DynamoDBClient({
    endpoint: "http://localhost.localstack.cloud:4566",
    region: "us-east-1"
});
const ddbDocClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
    // Required headers for browser security (CORS)
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json"
    };

    // Answer the browser's security check (Preflight)
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: "" };
    }

    try {
        if (event.httpMethod === 'GET') {
            const data = await ddbDocClient.send(new ScanCommand({ TableName: "TasksTable" }));
            return { statusCode: 200, headers, body: JSON.stringify(data.Items) };
        }

        if (event.httpMethod === 'POST') {
            const body = JSON.parse(event.body || "{}");
            const newItem = { id: Date.now().toString(), task: body.task };
            await ddbDocClient.send(new PutCommand({ TableName: "TasksTable", Item: newItem }));
            return { statusCode: 201, headers, body: JSON.stringify(newItem) };
        }
    } catch (err) {
        return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
    }
};