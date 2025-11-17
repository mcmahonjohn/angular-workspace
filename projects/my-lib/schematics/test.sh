#!/bin/bash

# Test schematics script for my-lib
# This script runs all schematic tests with coverage

set -e  # Exit on any error

SCHEMATICS_DIR="projects/my-lib/schematics"
DIST_DIR="$SCHEMATICS_DIR/dist/schematics"

echo "Running schematics tests..."

# Check if schematics are built
if [ ! -d "$DIST_DIR" ]; then
    echo "Error: Schematics not built. Run 'npm run build:schematics' first."
    exit 1
fi

# Run tests with nyc coverage
npx nyc --reporter=lcov --reporter=text --exclude='**/*.spec.js' \
    npx jasmine "$DIST_DIR/**/*.spec.js"

echo "Schematics tests completed!"