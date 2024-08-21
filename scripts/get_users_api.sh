#!/bin/bash

# Default limit value
LIMIT=${1:-1000}

# Make a request to the /users endpoint with the specified limit
curl -G "http://localhost:3000/users" --data-urlencode "limit=$LIMIT"
