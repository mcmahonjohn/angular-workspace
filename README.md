
# AngularWorkspace

This Angular 18 monorepo contains:
- **my-app**: An Angular application
- **my-lib**: An Angular library

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.21.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Development Tasks

### Build

To build the library:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Running the application

Run `npm run start` to serve the my-app dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.


### Running unit tests

To run unit tests for the library:

```bash
npm run test:unit
```

To run unit tests for the application:

```bash
npm run test:app
```

To run schematic tests:

```bash
npm run test:schematics
```

### Running end-to-end tests

This project uses Cypress for end-to-end testing. To run e2e tests for the my-app application:

```bash
npm run e2e
```

Or use the Angular CLI directly:

```bash
ng e2e my-app
```

---

### NPM Scripts

Below are the available npm scripts (excluding `ng`):

| Script                | Description                                                                                   |
|-----------------------|---------------------------------------------------------------------------------------------|
| build                 | Build the my-lib library.                                                                    |
| build:schematics      | Compile my-lib schematics and copy required files for testing.                               |
| cypress:open          | Open Cypress Test Runner in interactive mode for my-app.                                     |
| cypress:run           | Run Cypress tests in headless mode for my-app.                                              |
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

You can run any script with `npm run <script-name>`. For example:

```bash
npm run test:unit
```

## Angular Schematics

This project includes Angular Schematics for `my-lib` to provide automated code generation and migration capabilities.

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

### Creating Custom Schematics

Here's guidance on implementing the key schematic types for this library:

#### Component Generator Schematic
Create a schematic to generate components with library-specific patterns:

```bash
# Create schematic files
mkdir -p projects/my-lib/schematics/component
touch projects/my-lib/schematics/component/{index.ts,schema.json,files/__name@dasherize__.component.ts.template}
```

**Key implementation points:**
- Define schema with component name, selector prefix, and styling options
- Use template files with Angular naming conventions (`__name@dasherize__`)
- Include proper imports for library dependencies
- Add component to library's public API if needed
- Generate corresponding test files

#### Service Generator Schematic
Generate services with proper dependency injection setup:

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

##### New Project Schematic (`ng new` support)
Create complete project templates that include your library from the start:

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

```bash
# Test file structure
touch projects/my-lib/schematics/component/index.spec.ts
touch projects/my-lib/schematics/service/index.spec.ts
```

**Testing approach:**
- Use `@angular-devkit/schematics/testing` for unit tests
- Test file generation, content, and placement
- Verify schema validation and error handling
- Test integration with existing project structures
- Include tests for edge cases and error scenarios

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
