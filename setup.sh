#!/bin/bash

# 1. Install AWS CLI if it's missing
if ! command -v aws &> /dev/null; then
    echo "Installing AWS CLI..."
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip -q awscliv2.zip
    sudo ./aws/install
    rm -rf aws awscliv2.zip
fi

# 2. Set Dummy Credentials
echo "Configuring Dummy Credentials..."
aws configure set aws_access_key_id test
aws configure set aws_secret_access_key test
aws configure set default.region us-east-1
aws configure set default.output json

# 3. Create Lambda Zip (Assumes your file is index.js)
echo "Zipping Lambda function..."
zip -q function.zip index.js

# 4. Deploy to LocalStack
echo "Deploying TaskHandler to LocalStack..."
aws --endpoint-url=http://localhost:4566 lambda create-function \
    --function-name TaskHandler \
    --runtime nodejs18.x \
    --handler index.handler \
    --role arn:aws:iam::000000000000:role/lambda-role \
    --zip-file fileb://function.zip

echo "Setup Complete! Testing function list..."
aws --endpoint-url=http://localhost:4566 lambda list-functions
