
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

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
