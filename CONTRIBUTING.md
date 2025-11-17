# Contributing Guide

Thank you for your interest in contributing to this Angular monorepo! This guide provides all the information you need to develop, test, and contribute code to the project.

## Table of Contents
- [Project Structure](#project-structure)
- [Development Setup](#development-setup)
- [NPM Scripts](#npm-scripts)
- [Building](#building)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Linting](#linting)
- [Schematics](#schematics)
- [Docker & Tile Server](#docker--tile-server)
- [Pull Requests](#pull-requests)
- [Code Style](#code-style)
- [Further Resources](#further-resources)

---

## Project Structure

- `projects/my-app/`: Main Angular application
- `projects/my-lib/`: Angular library
- `projects/my-lib/schematics/`: Custom Angular schematics and migrations
- `dist/`: Build output
- `data/`: Place your `.osm.pbf` file here for OSM tile server

## Development Setup

### Local Development

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd angular-workspace
   ```
2. **Install dependencies:**
   ```bash
   npm ci
   ```

### GitHub Codespaces Setup

If you're using GitHub Codespaces, you'll need to install Google Chrome for unit testing and set up helpful git aliases:

1. **Install Google Chrome:**
   ```bash
   # Add Google Chrome repository
   wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
   echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list
   
   # Update package list and install Chrome
   sudo apt-get update
   sudo apt-get install -y google-chrome-stable
   
   # Verify installation
   google-chrome --version
   ```

2. **Set up Git aliases for productivity:**
   ```bash
   # Essential git aliases for efficient workflow

   ## Status and branch shortcuts
   git config --global alias.st status
   git config --global alias.br branch

   # Commit shortcuts
   git config --global alias.co 'commit -m'
   git config --global alias.fix 'commit --fixup'

   # Checkout and switching
   git config --global alias.out switch

   # Push and pull shortcuts
   git config --global alias.up 'pull --rebase=interactive --autostash'
   git config --global alias.pf 'push -f'
   git config --global alias.ps push
   git config --global alias.pu 'push -u'

   # Rebase
   git config --global alias.base 'rebase -i --autostash'
   git config --global alias.cont 'rebase --continue'

   # Log and history
   git config --global alias.last 'log -1 HEAD'

   # Diff shortcuts
   git config --global alias.d diff
   git config --global alias.ds 'diff --staged'
   git config --global alias.dc 'diff --cached'

   # Stash shortcuts
   git config --global alias.drop 'stash drop'
   git config --global alias.pop 'stash pop'
   git config --global alias.apply 'stash apply'

   # Remote shortcuts
   git config --global alias.rem 'remote update --prune'
   git config --global alias.rename 'remote rename'
   git config --global alias.update 'remote update'
   ```

3. **Verify setup:**
   ```bash
   # Test Chrome installation (should work without errors)
   npm run test:unit
   
   # Test git aliases
   git st    # Should show git status
   git up    # Updates from remote with interactive rebase
   git rem   # Updates all remotes
   git base  # Interactive rebase with autostash
   ```

**Note**: The Codespace environment should now be ready for all development tasks including unit testing with Chrome and efficient git operations.

## NPM Scripts

| Script                | Description                                                                                   |
|-----------------------|---------------------------------------------------------------------------------------------|
| build                 | Build the my-lib library.                                                                    |
| build:app             | Build my-app in production mode.                                                             |
| build:app:dev         | Build my-app in development mode.                                                            |
| build:schematics      | Compile my-lib schematics and copy required files for testing.                               |
| cypress:open          | Open Cypress Test Runner in interactive mode for my-app.                                     |
| cypress:run           | Run Cypress tests in headless mode for my-app.                                               |
| e2e                   | Run end-to-end tests for my-app using Cypress.                                               |
| link:lib              | Link the built my-lib library for local development.                                         |
| lint                  | Lint all source files using ESLint.                                                          |
| lint:fix              | Lint and automatically fix problems in all source files.                                     |
| start                 | Serve the my-app Angular application locally.                                                |
| test:app              | Run unit tests for my-app in headless Chrome with code coverage (single run, no watch).      |
| test:schematics       | Run schematic tests for my-lib with code coverage using Jasmine and nyc.                     |
| test:unit             | Run unit tests for my-lib in headless Chrome with code coverage (single run, no watch).      |
| test:unit:clean       | Run my-lib unit tests and suppress xkbcomp warnings in the output.                           |
| watch-app             | Serve my-app in watch mode for live development.                                             |
| watch-lib             | Build my-lib in watch mode for live development.                                             |

Run any script with `npm run <script-name>`.

## Building

- **Library:**
  ```bash
  npm run build
  ```
- **App (production):**
  ```bash
  npm run build:app
  ```
- **App (development):**
  ```bash
  npm run build:app:dev
  ```

## Running the Application locally

- **Development server:**
  ```bash
  npm run start
  # Visit http://localhost:4200/
  ```

## Testing

- **Library unit tests:**
  ```bash
  npm run test:unit
  ```
- **App unit tests:**
  ```bash
  npm run test:app
  ```
- **Schematic tests:**
  ```bash
  npm run test:schematics
  ```
- **E2E tests (Cypress):**
  ```bash
  npm run e2e
  ```

## Linting

- **Lint all files:**
  ```bash
  npm run lint
  ```
- **Auto-fix lint issues:**
  ```bash
  npm run lint:fix
  ```


## Angular Schematics

This project includes Angular Schematics for `my-lib` to provide automated code generation and migration capabilities.

> 📚 **Detailed Documentation**: See the [Schematics README](projects/my-lib/schematics/README.md) for comprehensive implementation guides, migration templates, and development workflows.

### Existing Schematics

#### Update Migration (update-2-0-0)
- **Purpose**: Updates imports from 'my-lib' to 'library' in TypeScript files
- **Version**: 2.0.0
- **Usage**: Automatically runs during library updates via `ng update`

### Building Schematics

To compile the schematics:

```bash
npm run build:schematics
```

### Testing Schematics

To run schematic tests:

```bash
npm run test:schematics
```

### Future Schematic Ideas

The following schematics could be implemented to enhance developer experience:

- **Component Generator**: `ng generate my-lib:component` - Generate components with library-specific patterns
- **Service Generator**: `ng generate my-lib:service` - Create services with proper dependency injection setup
- **Init Schematic**: `ng add my-lib` - Initial setup and configuration for consuming applications
- **Configuration Generator**: `ng generate my-lib:config` - Generate configuration files and interfaces
- **Migration Schematics**: Automated migrations for breaking changes between major versions
- **Theme Generator**: `ng generate my-lib:theme` - Create custom themes and styling configurations

> 💡 **Migration Templates**: Pre-built migration schematics for versions 3.0.0 through 6.0.0 are ready for implementation. See the [Schematics README](projects/my-lib/schematics/README.md) for details.

### Creating Custom Schematics

Here's guidance on implementing the key schematic types for this library:

**Essential Resources:**

**Core Angular Schematics:**
- [Angular Schematics Official Guide][schematics-guide] - Primary documentation
- [Schematics API Documentation][schematics-api] - API reference
- [Angular DevKit Schematics Package][schematics-package] - NPM package docs

**Cross-Platform Schematics (Mental Model):**
- [NestJS Schematics][nestjs-schematics] - Server-side framework using Angular Schematics
- [Nx Schematics][nx-schematics] - Monorepo tooling built on Angular Schematics
- [Nrwl DevKit][nx-devkit] - Advanced schematic patterns and utilities

**Learning the Mental Model:**
- [Schematics Concepts Deep Dive][schematics-concepts] - Fundamental concepts
- [Tree Data Structure][schematics-tree] - Core abstraction for file operations
- [Rules and Actions Pattern][schematics-rules] - Functional programming approach
- [Virtual File System][di-guide] - Understanding the staging area

**Advanced Patterns & Examples:**
- [RxJS Operators for Schematics][rxjs-schematics] - Composing transformations
- [AST Transformations][ast-viewer] - TypeScript AST manipulation tool
- [Workspace APIs][workspace-apis] - Project configuration manipulation
- [Schematics Testing Patterns][testing-patterns] - Testing utilities and patterns

**Real-World Implementations:**
- [Angular Material Schematics][material-schematics] - Production examples
- [NgRx Schematics][ngrx-schematics] - State management patterns
- [Firebase Schematics][firebase-schematics] - Third-party integration patterns

**Schematic Generators (Bootstrap Your Schematics):**
- [Schematics CLI][schematics-cli] - `schematics blank my-schematic` - Generate blank schematic
- [Angular CLI Collection Generator][collection-generator] - `ng generate library` includes schematics setup
- [Nx Schematic Generator][nx-generator] - `nx g @nx/plugin:generator my-generator` - Generate Nx-style schematics
- [NestJS Schematic CLI][nestjs-cli] - `nest g schematic my-schematic` - Server-side schematic generation
- [Yeoman Generator for Schematics][yeoman-schematics] - Interactive schematic project setup

**Available Schematic Templates:**
- **ng-add Templates**: [Angular Material ng-add][material-ng-add] provides excellent starter code
- **Migration Templates**: [Angular Update Migrations][angular-migrations] for reference patterns

#### Component Generator Schematic
Create a schematic to generate components with library-specific patterns:

- Use `schematics @schematics/angular:component --name=my-component --dry-run` as template

**References:**
- [Component Schematic Tutorial][schematics-concepts]
- [Template Files Guide][template-files]
- [Angular Component Schematics Source][angular-component-source]

```bash
# Create schematic files
mkdir -p projects/my-lib/schematics/component
touch projects/my-lib/schematics/component/{index.ts,schema.json,files/__name@dasherize__.component.ts.template}
```

**Implementation guidance:**
- Define schema with component name, selector prefix, and styling options
- Use template files with Angular naming conventions (`__name@dasherize__`)
- Include proper imports for library dependencies
- Add component to library's public API if needed
- Generate corresponding test files

#### Service Generator Schematic
Generate services with proper dependency injection setup:

- Use `schematics @schematics/angular:service --name=my-service --dry-run` as template

**References:**
- [Service Schematic Example][angular-service-source]
- [Injectable Decorator Guide][injectable-guide]
- [Tree Manipulation API][schematics-tree]

```bash
# Create schematic structure
mkdir -p projects/my-lib/schematics/service/files
touch projects/my-lib/schematics/service/{index.ts,schema.json}
```

**Implementation guidance:**
- Schema should include service name and injection scope (root, platform, any)
- Template should include proper `@Injectable()` decorator
- Consider library-specific service patterns and interfaces
- Auto-register in library module if applicable

#### Initialization Schematics
Handle project setup and library integration scenarios:

**Essential Resources:**
- [ng-add Schematic Guide][ng-add-guide]
- [Workspace Manipulation][workspace-manipulation]
- [Package Installation API][package-install-api]

##### New Project Schematic (`ng new` support)
Create complete project templates that include your library from the start:

**Implementation guidance:**
- [ng-new Collection Example][ng-new-example]
- [Workspace Schema][workspace-schema]
- [Application Schematic Reference][application-schematic]
- [File Creation API][file-creation-api]

```bash
# Create ng-new schematic for full project setup
mkdir -p projects/my-lib/schematics/ng-new
touch projects/my-lib/schematics/ng-new/{index.ts,schema.json,files/**/*}
```

**Features for ng-new schematic:**
- Generate complete Angular workspace with my-lib pre-configured
- Include example components demonstrating library usage
- Set up recommended project structure and conventions
- Prompt for whether it'll be deployed to Sharepoint or as a Docker container.
- Configure build pipeline with library-specific optimizations
- Include starter documentation and README templates
- Pre-configure testing setup for both unit and e2e tests

##### Library Addition Schematic (`ng add` support)
Enable `ng add my-lib` functionality for adding the library to existing projects:

**Implementation guidance:**
- [ng-add Schematic Tutorial][ng-add-guide]
- [Material ng-add Example][material-ng-add]
- [Package.json Manipulation][packagejson-manipulation]

```bash
# Create ng-add schematic
mkdir -p projects/my-lib/schematics/ng-add
touch projects/my-lib/schematics/ng-add/{index.ts,schema.json}
```

**Key features to implement:**
- Add library to package.json dependencies
- Import library module in app.module.ts or main.ts (standalone)
- Generate initial configuration files
- Set up default theme/styling if applicable
- Create example usage files and components
- Update angular.json with library-specific build options
- Configure providers and services in application bootstrap
- Add necessary peer dependencies automatically

#### Configuration Generator
Create configuration files and interfaces:

**References:**
- [File Creation API][file-creation-api]
- [Configuration Pattern Examples][ngrx-config-examples]
- [Schema Validation Guide][schema-validation]

```bash
# Setup config generator
mkdir -p projects/my-lib/schematics/config/files
touch projects/my-lib/schematics/config/{index.ts,schema.json}
```

**Configuration schematic should:**
- Generate TypeScript interfaces for library config
- Create default configuration files (JSON/TS)
- Add configuration injection tokens
- Update app configuration to include library settings
- Provide type safety for configuration options

#### Migration Schematics
Handle breaking changes between library versions:

**Essential Resources:**
- [Migration Schematics Guide][migration-guide]
- [Angular Update Migrations][angular-migrations]
- [TypeScript AST Manipulation][ts-morph]
- [Migration Collection Example][material-migrations]

```bash
# Create migration for major version
mkdir -p projects/my-lib/schematics/migration-v3
touch projects/my-lib/schematics/migration-v3/{index.ts,schema.json}
```

**Migration best practices:**
- Use AST transformations for code modifications
- Update import statements and module references
- Rename deprecated APIs to new equivalents
- Update configuration file structures
- Add TODO comments for manual updates needed
- Include rollback instructions in migration logs
- Test migrations against various project structures

#### Schema Registration
Update `collection.json` to register new schematics:

**References:**
- [Collection Schema Reference][collection-schema]
- [Schema.json Format][schema-format]
- [Factory Function Guide][factory-functions]

```json
{
  "schematics": {
    "component": {
      "description": "Generate a my-lib component",
      "factory": "./component/index#componentSchematic",
      "schema": "./component/schema.json"
    },
    "service": {
      "description": "Generate a my-lib service", 
      "factory": "./service/index#serviceSchematic",
      "schema": "./service/schema.json"
    },
    "ng-add": {
      "description": "Add my-lib to an Angular project",
      "factory": "./ng-add/index#ngAdd",
      "schema": "./ng-add/schema.json"
    }
  }
}
```

#### Testing Schematics
Create comprehensive tests for each schematic:

**References:**
- [Schematic Testing Guide][testing-guide]
- [Testing Utilities API][testing-utilities]
- [Angular CLI Test Examples][angular-test-examples]
- [Tree Testing Documentation][tree-testing]

```bash
# Test file structure
touch projects/my-lib/schematics/component/index.spec.ts
touch projects/my-lib/schematics/service/index.spec.ts
```

**Implementation guidance:**
- Use `@angular-devkit/schematics/testing` for unit tests
- Test file generation, content, and placement
- Verify schema validation and error handling
- Test integration with existing project structures
- Include tests for edge cases and error scenarios

## Docker & Tile Server

- See the main README for instructions on running the OSM tile server and frontend with Docker Compose.
- Place your `.osm.pbf` file in the `data/` directory.
- Use the provided `docker-compose.yml` for orchestration.

## Pull Requests

- Fork the repository and create a feature branch.
- Write clear, concise commit messages.
- Ensure all tests and linters pass before submitting a PR.
- Reference related issues in your PR description.

## Code Style

- Use the existing ESLint configuration.
- Follow Angular and TypeScript best practices.
- Keep code modular and well-documented.

## Further Resources

- [Angular CLI Documentation][angular-cli-docs]
- [Angular Schematics Authoring][schematics-api]
- [Cypress Documentation][cypress-docs]
- [PostGIS Documentation][postgis-docs]

---

If you have questions, open an issue or start a discussion!

<!-- Reference Links -->
[angular-cli-docs]: https://angular.dev/tools/cli
[angular-component-source]: https://github.com/angular/angular-cli/tree/main/packages/schematics/angular/component
[angular-migrations]: https://github.com/angular/angular-cli/tree/main/packages/schematics/angular/migrations
[angular-service-source]: https://github.com/angular/angular-cli/tree/main/packages/schematics/angular/service
[angular-test-examples]: https://github.com/angular/angular-cli/tree/main/packages/schematics/angular
[application-schematic]: https://github.com/angular/angular-cli/tree/main/packages/schematics/angular/application
[ast-viewer]: https://ts-ast-viewer.com/
[collection-generator]: https://angular.dev/tools/cli/schematics-authoring#creating-a-schematics-collection
[collection-schema]: https://angular.dev/tools/cli/schematics-authoring#collection-schema
[cypress-docs]: https://docs.cypress.io/
[di-guide]: https://medium.com/@tomastrajan/total-guide-to-angular-6-dependency-injection-providedin-vs-providers-85b7a347b59f
[factory-functions]: https://angular.dev/tools/cli/schematics-authoring#factory-functions
[file-creation-api]: https://angular.dev/tools/cli/schematics-authoring#creating-files
[firebase-schematics]: https://github.com/angular/angularfire/tree/main/src/schematics
[injectable-guide]: https://angular.dev/guide/dependency-injection
[material-migrations]: https://github.com/angular/components/tree/main/src/material/schematics/ng-update
[material-ng-add]: https://github.com/angular/components/tree/main/src/material/schematics/ng-add
[material-schematics]: https://github.com/angular/components/tree/main/src/cdk/schematics
[migration-guide]: https://angular.dev/tools/cli/schematics-for-libraries#providing-generation-support
[nestjs-cli]: https://docs.nestjs.com/cli/usages#nest-generate
[nestjs-schematics]: https://docs.nestjs.com/cli/overview#nest-generate
[ng-add-guide]: https://angular.dev/tools/cli/schematics-for-libraries#providing-installation-support
[ng-new-example]: https://github.com/angular/angular-cli/tree/main/packages/schematics/angular/ng-new
[ngrx-config-examples]: https://github.com/ngrx/platform/tree/main/modules/schematics/src/store
[ngrx-schematics]: https://github.com/ngrx/platform/tree/main/modules/schematics
[nx-devkit]: https://nx.dev/packages/devkit/documents/nx_devkit
[nx-generator]: https://nx.dev/packages/plugin
[nx-schematics]: https://nx.dev/packages/devkit
[package-install-api]: https://github.com/angular/angular-cli/blob/main/packages/angular_devkit/schematics/tasks/package-manager/install-task.ts
[packagejson-manipulation]: https://angular.dev/tools/cli/schematics-authoring#packagejson
[postgis-docs]: https://postgis.net/
[rxjs-schematics]: https://github.com/angular/angular-cli/blob/main/packages/angular_devkit/schematics/src/rules/base.ts
[schema-format]: https://json.schemastore.org/schematics
[schema-validation]: https://angular.dev/tools/cli/schematics-authoring#schema-validation
[schematics-api]: https://angular.dev/tools/cli/schematics-authoring
[schematics-cli]: https://www.npmjs.com/package/@angular-devkit/schematics-cli
[schematics-concepts]: https://blog.angular.io/schematics-an-introduction-dc1dfbc2a2b2
[schematics-guide]: https://angular.dev/tools/cli/schematics
[schematics-package]: https://www.npmjs.com/package/@angular-devkit/schematics
[schematics-rules]: https://angular.dev/tools/cli/schematics-authoring#rules
[schematics-tree]: https://angular.dev/tools/cli/schematics-authoring#tree
[template-files]: https://angular.dev/tools/cli/schematics-authoring#template-files
[testing-guide]: https://angular.dev/tools/cli/schematics-authoring#testing
[testing-patterns]: https://github.com/angular/angular-cli/blob/main/packages/schematics/angular/utility/test.ts
[testing-utilities]: https://www.npmjs.com/package/@angular-devkit/schematics/v/0.1102.0#testing
[tree-testing]: https://angular.dev/tools/cli/schematics-authoring#testing-a-schematic
[ts-morph]: https://ts-morph.com/
[workspace-apis]: https://github.com/angular/angular-cli/tree/main/packages/angular_devkit/core
[workspace-manipulation]: https://angular.dev/tools/cli/schematics-authoring#workspace
[workspace-schema]: https://github.com/angular/angular-cli/blob/main/packages/schematics/angular/workspace/schema.json
[yeoman-schematics]: https://github.com/saniyusuf/generator-schematics
