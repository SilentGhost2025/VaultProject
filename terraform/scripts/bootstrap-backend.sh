#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# bootstrap-backend.sh
# Run this ONCE before your first `terraform init` to create the S3 bucket
# and DynamoDB table used for remote state storage and state locking.
#
# Usage: chmod +x bootstrap-backend.sh && ./bootstrap-backend.sh
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

REGION="us-east-1"
BUCKET_NAME="witty-tale-vault-tfstate"
DYNAMODB_TABLE="witty-tale-vault-tflock"

echo "=== Creating Terraform Remote State Backend ==="

# ── S3 Bucket ─────────────────────────────────────────────────────────────────
echo "Creating S3 bucket: $BUCKET_NAME"
aws s3api create-bucket \
  --bucket "$BUCKET_NAME" \
  --region "$REGION" \
  --create-bucket-configuration LocationConstraint="$REGION" 2>/dev/null || \
  echo "Bucket may already exist, continuing..."

# Enable versioning (lets you recover previous state files)
echo "Enabling versioning..."
aws s3api put-bucket-versioning \
  --bucket "$BUCKET_NAME" \
  --versioning-configuration Status=Enabled

# Enable encryption
echo "Enabling server-side encryption..."
aws s3api put-bucket-encryption \
  --bucket "$BUCKET_NAME" \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }'

# Block all public access
echo "Blocking public access..."
aws s3api put-public-access-block \
  --bucket "$BUCKET_NAME" \
  --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

# ── DynamoDB Table for State Locking ─────────────────────────────────────────
echo "Creating DynamoDB table: $DYNAMODB_TABLE"
aws dynamodb create-table \
  --table-name "$DYNAMODB_TABLE" \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region "$REGION" 2>/dev/null || \
  echo "DynamoDB table may already exist, continuing..."

echo ""
echo "=== Backend Setup Complete ==="
echo "You can now run:"
echo "  cd terraform"
echo "  terraform init"
echo "  terraform plan -var-file=terraform.tfvars"
echo "  terraform apply -var-file=terraform.tfvars"
