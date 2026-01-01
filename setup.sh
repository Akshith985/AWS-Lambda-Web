#!/bin/bash
# 1. Create DynamoDB Table
awslocal dynamodb create-table --table-name TasksTable \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5

# 2. Package and Deploy Lambda
cd backend
zip -r function.zip index.js
awslocal lambda create-function --function-name TaskHandler \
    --runtime nodejs18.x --handler index.handler \
    --zip-file fileb://function.zip --role arn:aws:iam::000000000000:role/lambda-role

# 3. Enable the URL
awslocal lambda create-function-url-config --function-name TaskHandler --auth-type NONE
echo "Backend setup complete!"