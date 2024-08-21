#!/bin/bash

# URL
URL="http://localhost:3000/generate-users"

# Parameter limit, by default 2000000
LIMIT=${1:-2000000}

# Calling the API using curl with the limit parameter in the request body
response=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" -d "{\"limit\": $LIMIT}" $URL)

# Check the status of the response
if [ $response -eq 200 ]; then
  echo "$LIMIT users generated successfully"
else
  echo "Failed to generate $LIMIT users. HTTP status code: $response"
fi
