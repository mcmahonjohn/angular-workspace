#!/bin/bash

# Test schematics script for eslint-plugin-angular-signal
# This script runs all schematic tests with coverage

set -e  # Exit on any error

SCHEMATICS_DIR="schematics"
DIST_DIR="$SCHEMATICS_DIR/dist/schematics"

echo "Running schematics tests..."


# Check if schematics and spec files are built
if [ ! -d "$DIST_DIR" ]; then
    echo "Error: Schematics not built. Run 'npm run build:schematics' first."
    exit 1
fi

# Run tests with nyc coverage from spec output directory
npx nyc --reporter=lcov --reporter=text --exclude='**/*.spec.js' \
    npx jasmine "$DIST_DIR/**/*.spec.js"

echo "Schematics tests completed!"
