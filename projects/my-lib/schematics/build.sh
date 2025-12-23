#!/bin/bash

# Build schematics script for my-lib
# This script compiles TypeScript and copies necessary files

set -e  # Exit on any error

LIB_DIR="projects/my-lib"
SCHEMATICS_DIR="$LIB_DIR/schematics"
PROD_DIST_DIR="dist/my-lib/schematics"
DIST_DIR="$LIB_DIR/$PROD_DIST_DIR"


# Clean previous build
if [ -d "$DIST_DIR" ]; then
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

    mkdir -p "$DIST_DIR/$SUB_DIR"

    # Copy .ts and .js files, excluding spec files in prod
    if [[ "$1" == "prod" || "$1" == "--prod" || "$1" == "-p" ]]; then
        find "$SCHEMATICS_DIR/$SUB_DIR" -maxdepth 1 -type f \( -name "*.ts" -o -name "*.js" \) \
            ! -name "*.spec.ts" ! -name "*.spec.js" ! -name "*.spec.d.ts" ! -name "*.spec.js.map" \
            -exec cp {} "$PROD_DIST_DIR/$SUB_DIR/" \;
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


# Remove spec files for production build
if [[ "$1" == "prod" || "$1" == "--prod" || "$1" == "-p" ]]; then
    echo "Removing spec files for production..."
    find "$PROD_DIST_DIR" -type f \
        \( -name '*.spec.d.ts' -o -name '*.spec.js' -o -name '*.spec.js.map' -o -name '*.spec.ts' \) \
        -exec rm -f {} +
fi

echo "Schematics build completed successfully!"
