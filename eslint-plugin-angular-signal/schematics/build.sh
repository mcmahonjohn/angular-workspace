#!/bin/bash

# Build schematics script for eslint-plugin-angular-signal
# This script compiles TypeScript and copies necessary files

set -e  # Exit on any error

LIB_DIR="."
SCHEMATICS_DIR="$LIB_DIR/schematics"
DIST_DIR="$LIB_DIR/dist/schematics"

# Clean previous build
if [ -d "$DIST_DIR" ]; then
	echo "Cleaning previous build..."
	rm -rf "$DIST_DIR"
fi

echo "Building schematics..."


# Compile implementation TypeScript
echo "Compiling implementation TypeScript..."
tsc -p "$SCHEMATICS_DIR/tsconfig.schematics.json"

# Compile spec TypeScript
echo "Compiling spec TypeScript..."
tsc -p "$SCHEMATICS_DIR/tsconfig.spec.json"

# Ensure DIST_DIR exists before copying collection.json
if [ ! -d "$DIST_DIR" ]; then
	mkdir -p "$DIST_DIR"
fi

# Copy collection.json
echo "Copying collection.json..."
cp "$SCHEMATICS_DIR/collection.json" "$DIST_DIR/collection.json"

# Create necessary directories (add more as needed)
echo "Creating directories..."
mkdir -p "$DIST_DIR/ng-add"

echo "Schematics build completed successfully!"
