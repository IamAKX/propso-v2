#!/bin/bash

cd /Users/akash/Desktop/Sanath/cp

# Define version file
VERSION_FILE=".docker-version"

# Read current version or start at 1.0.0
if [ -f "$VERSION_FILE" ]; then
  CURRENT_VERSION=$(cat "$VERSION_FILE")
else
  CURRENT_VERSION="1.0.0"
fi

# Increment patch version (1.0.0 -> 1.0.1)
IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT_VERSION"
PATCH=$((PATCH + 1))
NEW_VERSION="$MAJOR.$MINOR.$PATCH"

echo "📦 Building images..."
docker compose build

echo "🏷️ Tagging images as $NEW_VERSION and latest..."
docker tag cp-backend iamakx/propertycp-backend:$NEW_VERSION
docker tag cp-frontend iamakx/propertycp-react:$NEW_VERSION
docker tag cp-backend iamakx/propertycp-backend:latest
docker tag cp-frontend iamakx/propertycp-react:latest

echo "🔑 Logging into Docker Hub..."
docker login

echo "📤 Pushing images..."
docker push iamakx/propertycp-backend:$NEW_VERSION
docker push iamakx/propertycp-react:$NEW_VERSION
docker push iamakx/propertycp-backend:latest
docker push iamakx/propertycp-react:latest

# Save new version
echo "$NEW_VERSION" > "$VERSION_FILE"

echo "✅ Done! Images pushed:"
echo "   - iamakx/propertycp-backend:$NEW_VERSION"
echo "   - iamakx/propertycp-react:$NEW_VERSION"
echo "   - iamakx/propertycp-backend:latest"
echo "   - iamakx/propertycp-react:latest"
