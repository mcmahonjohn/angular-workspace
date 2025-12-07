# AngularWorkspace


This Angular 18 monorepo contains:
- **my-app**: An Angular application for end users
- **my-lib**: A reusable Angular library for use in other Angular projects

## Overview

**my-app** is a reference Angular application demonstrating usage of **my-lib** and serving as a starting point for new projects.

**my-lib** is a library of reusable Angular components, services, and utilities that can be installed and used in other Angular applications.

## Getting Started

### Using my-lib in your project

1. Install the library (after publishing to npm or via local linking):
  ```bash
  npm install my-lib
  # or for local development
  npm link ./dist/my-lib
  ```
2. Import the desired modules/components from `my-lib` in your Angular app.

### Running the Example App (my-app)

1. Install dependencies:
  ```bash
  npm ci && npm run build
  ```
2. Start the development server:
  ```bash
  npm run start
  # Visit http://localhost:4200/
  ```

### Creating a New Project with my-lib Optimizations

Use the included `ng-new` schematic to create a new Angular workspace with my-lib's optimizations and best practices built-in:

```bash
# After publishing my-lib to npm
ng new my-project --collection=my-lib

# The workspace will be created with:
# - CLI analytics disabled
# - Strict Angular compiler options
# - Dual karma configurations (dev/CI)
# - Cypress-ready setup
# - Production build optimizations
```

See [ng-new schematic documentation](projects/my-lib/schematics/ng-new/ng-new-schematic.md) for complete details and options.

## Docker & OSM Tile Server

This project includes a Docker Compose setup for running both an OpenStreetMap tile server (for local map tiles) and the Angular frontend. See below for a quick start, or the [Contributing Guide](CONTRIBUTING.md) for full details.

### 1. Import OSM Data (One-time Step)

Place your `.osm.pbf` file in a `data/` directory at the root of the project:

```bash
mkdir -p data
cp <your-map.osm.pbf> data/map.osm.pbf
```

Run the import step (this may take a while depending on the file size):

```bash
docker compose run import
```

### 2. Start the Tile Server and Frontend

Start the tile server and frontend services:

```bash
docker compose up tileserver frontend
```

* The tile server will be available at: http://localhost:8080/tiles/{z}/{x}/{y}.png
* The Angular frontend will be available at: http://localhost:4200/

### 3. Stopping Services

To stop all services:

```bash
docker compose down
```

### 4. Notes

- The PostgreSQL/PostGIS database is persisted in a Docker volume (`osm-db-data`).
- You only need to run the import step again if you want to update the map data.
- The frontend is built and served from the `dist/my-app` directory using Nginx.

---

## Contributing

For development setup, testing, building, and advanced usage, see the [Contributing Guide][contributing-guide].

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference][angular-cli-reference] page.

## Angular-Dependent Dependencies (excluding @angular scope)

### Dependencies
- @ng-bootstrap/ng-bootstrap
- @fortawesome/angular-fontawesome
- @fortawesome/fontawesome-svg-core
- @fortawesome/free-solid-svg-icons
- ngx-owl-carousel-o

### Dev Dependencies
- angular-in-memory-web-api

<!-- Reference Links -->
[contributing-guide]: CONTRIBUTING.md
[angular-cli-reference]: https://angular.dev/tools/cli
