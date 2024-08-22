#!/bin/bash

# URL
URL="http://localhost:3000/users/generate-users"

# Parameter limit, by default 2000000
LIMIT=${1:-2000000}

# Calling the API using curl with the limit parameter in the request body
curl -X POST -H "Content-Type: application/json" -d "{\"limit\": $LIMIT}" $URL
