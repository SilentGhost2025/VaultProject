#!/bin/bash
set -e

REGISTRY=${1:-ghcr.io/your-org}
TAG=${2:-latest}

echo "=== Docker Build & Push ==="
echo "Registry: $REGISTRY"
echo "Tag: $TAG"

SERVICES=("quote-service" "user-service" "api-gateway")

for svc in "${SERVICES[@]}"; do
  echo ""
  echo "--- Building $svc ---"
  docker build -t "$REGISTRY/$svc:$TAG" "./backend/$svc"
  echo "--- Pushing $svc ---"
  docker push "$REGISTRY/$svc:$TAG"
  echo "✓ $svc:$TAG pushed"
done

echo ""
echo "=== All images pushed to $REGISTRY ==="
