#!/bin/bash

# Build schematics script for my-lib
# This script compiles TypeScript and copies necessary files

set -e  # Exit on any error

SCHEMATICS_DIR="projects/my-lib/schematics"
DIST_DIR="$SCHEMATICS_DIR/dist/schematics"

# Clean previous build
if [ -d "$DIST_DIR" ]; then
    echo "Cleaning previous build..."
    rm -rf "$DIST_DIR"
fi

echo "Building schematics..."

# Compile TypeScript
echo "Compiling TypeScript..."
tsc -p "$SCHEMATICS_DIR/tsconfig.schematics.json"

# Copy collection.json
echo "Copying collection.json..."
cp "$SCHEMATICS_DIR/collection.json" "$DIST_DIR/collection.json"

# Create necessary directories
echo "Creating directories..."
mkdir -p "$DIST_DIR/ng-new/templates" \
         "$DIST_DIR/update-2-0-0" \
         "$DIST_DIR/update-3-0-0" \
         "$DIST_DIR/update-4-0-0" \
         "$DIST_DIR/update-5-0-0" \
         "$DIST_DIR/update-6-0-0"

# Copy schema files and templates
echo "Copying schema files and templates..."

# ng-new schematic
cp "$SCHEMATICS_DIR/ng-new/schema.json" "$DIST_DIR/ng-new/schema.json"
if [ -d "$SCHEMATICS_DIR/ng-new/templates" ] && [ "$(ls -A $SCHEMATICS_DIR/ng-new/templates)" ]; then
    cp -r "$SCHEMATICS_DIR/ng-new/templates/"* "$DIST_DIR/ng-new/templates/"
fi

# Update schematics

for version in 2-0-0 3-0-0 4-0-0 5-0-0 6-0-0; do
    cp "$SCHEMATICS_DIR/update-$version/schema.json" "$DIST_DIR/update-$version/schema.json"
    # Copy static directory if it exists
    if [ -d "$SCHEMATICS_DIR/update-$version/static" ]; then
        mkdir -p "$DIST_DIR/update-$version/static"
        cp -r "$SCHEMATICS_DIR/update-$version/static/"* "$DIST_DIR/update-$version/static/"
    fi
done

echo "Schematics build completed successfully!"
