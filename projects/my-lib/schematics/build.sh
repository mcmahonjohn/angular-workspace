#!/bin/bash

# Build schematics script for my-lib
# This script compiles TypeScript and copies necessary files

set -e  # Exit on any error

LIB_DIR="projects/my-lib"
SCHEMATICS_DIR="$LIB_DIR/schematics"

# Check for 'prod' flag
if [[ "$1" == "prod" || "$1" == "--prod" || "$1" == "-p" ]]; then
    DIST_DIR="dist/my-lib/schematics"

else
    DIST_DIR="$LIB_DIR/dist/schematics"
fi

# Clean previous build
if [ -d "$DIST_DIR" ] && [[ "$1" != "prod" && "$1" != "--prod" && "$1" != "-p" ]]; then
    echo "Cleaning previous build..."
    rm -rf "$DIST_DIR"
fi

echo "Building schematics..."

# Compile TypeScript
echo "Compiling TypeScript..."
tsc -p "$LIB_DIR/tsconfig.schematics.json"

# Ensure DIST_DIR exists before copying collection.json
if [ ! -d "$DIST_DIR" ]; then
    mkdir -p "$DIST_DIR"
fi

# Copy collection.json
echo "Copying collection.json..."
cp "$SCHEMATICS_DIR/collection.json" "$DIST_DIR/collection.json"

# Copy schema files and templates
echo "Copying schema files and templates..."

for version in ng-new 2-0-0 3-0-0 4-0-0 5-0-0 6-0-0; do

    if [ "$version" == "ng-new" ]; then
        SUB_DIR=$version
    else
        SUB_DIR="update-$version"
    fi

    cp "$SCHEMATICS_DIR/$SUB_DIR/schema.json" "$DIST_DIR/$SUB_DIR/schema.json"

    # Copy static directory if it exists
    if [ -d "$SCHEMATICS_DIR/$SUB_DIR/static" ]; then
        mkdir -p "$DIST_DIR/$SUB_DIR/static"
        cp -r "$SCHEMATICS_DIR/$SUB_DIR/static/"* "$DIST_DIR/$SUB_DIR/static/"
    fi

    # Copy template directory if it exists

    if [ -d "$SCHEMATICS_DIR/$SUB_DIR/templates" ] && [ "$(ls -A $SCHEMATICS_DIR/$SUB_DIR/templates)" ]; then
        mkdir -p "$DIST_DIR/$SUB_DIR/templates"
        cp -r "$SCHEMATICS_DIR/$SUB_DIR/templates/"* "$DIST_DIR/$SUB_DIR/templates/"
    fi
done

echo "Schematics build completed successfully!"
