#!/bin/bash

# Script to update AWS Secrets Manager with new SSL certificates

set -e

CERT_FILE=".certificates-and-keys/server.crt"
KEY_FILE=".certificates-and-keys/server.key"
SECRET_ID="cvai/ssl-certificates"
REGION="eu-central-1"

# Check if certificate files exist
if [ ! -f "$CERT_FILE" ]; then
    echo "Error: Certificate file not found: $CERT_FILE"
    exit 1
fi

if [ ! -f "$KEY_FILE" ]; then
    echo "Error: Private key file not found: $KEY_FILE"
    exit 1
fi

echo "Reading certificate and private key files..."

# Read certificate and private key, escape newlines for JSON
CERT_CONTENT=$(cat "$CERT_FILE" | sed 's/$/\\n/' | tr -d '\n')
KEY_CONTENT=$(cat "$KEY_FILE" | sed 's/$/\\n/' | tr -d '\n')

# Create JSON payload
SECRET_JSON="{\"certificate\":\"$CERT_CONTENT\",\"private_key\":\"$KEY_CONTENT\"}"

echo "Updating AWS Secrets Manager..."
aws secretsmanager update-secret \
    --secret-id "$SECRET_ID" \
    --secret-string "$SECRET_JSON" \
    --region "$REGION"

echo "✅ Successfully updated AWS Secrets Manager!"
echo ""
echo "Next steps:"
echo "1. Trigger a redeployment by running:"
echo "   git commit --allow-empty -m 'Update SSL certificates'"
echo "   git push origin main"
