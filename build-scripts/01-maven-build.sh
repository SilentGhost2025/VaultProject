#!/bin/bash
set -e

echo "=== Maven Build: All Services ==="

SERVICES=("quote-service" "user-service" "api-gateway")

for svc in "${SERVICES[@]}"; do
  echo ""
  echo "--- Building $svc ---"
  cd "backend/$svc"
  mvn clean package -DskipTests -B
  cd ../..
  echo "✓ $svc built successfully"
done

echo ""
echo "=== All services built successfully ==="
