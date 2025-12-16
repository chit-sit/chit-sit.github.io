#!/bin/bash
# GitHub Pages JSON DB Update Script
# This script would be used in a GitHub Action to update the JSON database

set -e

echo "Starting GitHub Pages JSON DB Update..."

# Check if we have git credentials
if [ -z "$GITHUB_TOKEN" ]; then
  echo "Error: GITHUB_TOKEN is not set"
  exit 1
fi

# Clone the repository to a temporary directory
TEMP_DIR=$(mktemp -d)
REPO_URL="https://${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"

echo "Cloning repository..."
git clone "$REPO_URL" "$TEMP_DIR"

# Copy current data files to temporary directory
if [ -f "data/questions.json" ]; then
  cp "data/questions.json" "$TEMP_DIR/data/"
  echo "Copied questions.json"
else
  echo "Creating initial questions.json"
  mkdir -p "$TEMP_DIR/data"
  cat > "$TEMP_DIR/data/questions.json" << EOF
{
  "questions": [],
  "settings": {
    "siteName": "Cheatsheet Hub Questions",
    "lastUpdated": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
    "version": "1.0.0"
  }
}
EOF
fi

cd "$TEMP_DIR"

# Configure git
git config user.name "GitHub Actions Bot"
git config user.email "actions@users.noreply.github.com"

# Check for changes
if ! git diff --quiet; then
  echo "Changes detected, committing and pushing..."
  
  git add .
  git commit -m "Update JSON database [skip ci]" || (echo "No changes to commit"; exit 0)
  git push origin main
  
  echo "Successfully updated JSON database!"
else
  echo "No changes to push"
fi