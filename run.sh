#!/bin/sh
set -e

IMAGE_NAME="microprocessor-simulator"
CONTAINER_NAME="microprocessor-simulator"
PORT=8089

docker build -t "$IMAGE_NAME" .

docker rm -f "$CONTAINER_NAME" 2>/dev/null || true

docker run -d \
  --name "$CONTAINER_NAME" \
  -p "$PORT:$PORT" \
  --restart unless-stopped \
  "$IMAGE_NAME"

echo "Container started. App running at http://localhost:$PORT"
