#!/bin/bash

# Load environment variables from .env
if [ -f .env ]; then
  export $(cat .env | xargs)
fi

# Default values if .env is missing or variables are unset
PORT=${PORT:-3000}
ENV=${ENV:-development}

# Determine the stage to build and run
if [ "$ENV" = "development" ]; then
  TARGET="dev"
  IMAGE_NAME="benchy-dev"
else
  TARGET="prod"
  IMAGE_NAME="benchy"
fi

# Build the Docker image
echo "Building Docker image for $ENV..."
docker build -t $IMAGE_NAME --target $TARGET .

# Run the Docker container
echo "Starting Docker container on port $PORT..."
docker run -p $PORT:$PORT --env PORT=$PORT $IMAGE_NAME
