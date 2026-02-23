#!/bin/bash
set -e

REGISTRY=${1:-ghcr.io/your-org}
TAG=${2:-latest}

echo "=== Kubernetes Deploy ==="
echo "Registry: $REGISTRY"
echo "Tag: $TAG"

SERVICES=("quote-service" "user-service" "api-gateway")

# Apply manifests first (if not already applied)
for svc in "${SERVICES[@]}"; do
  echo ""
  echo "--- Applying manifests for $svc ---"
  kubectl apply -f "k8s/$svc/"
done

# Update images
for svc in "${SERVICES[@]}"; do
  echo ""
  echo "--- Updating image for $svc to $TAG ---"
  kubectl set image "deployment/$svc" "$svc=$REGISTRY/$svc:$TAG"
done

echo ""
echo "--- Waiting for rollouts ---"
for svc in "${SERVICES[@]}"; do
  kubectl rollout status "deployment/$svc" --timeout=120s
  echo "✓ $svc rolled out"
done

echo ""
echo "=== Deployment complete ==="
echo "Access gateway: kubectl get svc api-gateway"
