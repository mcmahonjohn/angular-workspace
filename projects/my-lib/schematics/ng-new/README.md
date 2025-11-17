# ng-new Schematic

This schematic extends Angular's built-in `ng new` command to create a workspace with additional optimizations and configurations specifically tailored for projects using `my-lib`.

## Features

The ng-new schematic creates a new Angular workspace with the following enhancements:

### 🚀 Performance Optimizations
- **Analytics disabled** - CLI analytics are disabled by default for privacy
- **Production build optimization** - Inline critical CSS is disabled for better performance
- **Strict TypeScript configuration** - Enhanced type checking and compiler options

### 🧪 Testing Infrastructure
- **Cypress E2E testing** - Pre-configured Cypress setup with CI-ready configuration
- **Dual Karma configurations** - Separate configs for development and CI environments
- **ChromeHeadless support** - Optimized for Codespaces and CI environments

### 🛠 Development Experience
- **Enhanced tsconfig** - Strict Angular compiler options for better development experience
- **ESLint integration** - Pre-configured with Angular ESLint rules
- **Schematic collections** - Ready to use Angular, ESLint, and Cypress schematics
- **Empty constructor cleanup** - Automatically removes boilerplate empty constructors

## Usage

### Basic Usage
```bash
ng generate my-lib:ng-new my-awesome-app
```

### With Options
```bash
ng generate my-lib:ng-new my-awesome-app --routing=true --minimal=false
```

### In a Subdirectory
```bash
ng generate my-lib:ng-new my-awesome-app --directory=projects/frontend
```

## Schema Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `name` | `string` | - | The name of the workspace (required) |
| `routing` | `boolean` | `true` | Whether to include Angular Router |
| `minimal` | `boolean` | `false` | Create a minimal workspace |
| `directory` | `string` | - | The directory name to create the workspace in |

## Generated Configuration

### Angular.json Enhancements
- **CLI configuration**: Analytics disabled, npm package manager, schematic collections
- **E2E CI target**: `e2e-ci` architect target for headless Cypress testing
- **Production optimizations**: Inline critical CSS disabled

### TypeScript Configuration
Enhanced `tsconfig.json` with strict Angular compiler options:
```json
{
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "fullTemplateTypeCheck": true,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true,
    "strictStandalone": true
  }
}
```

### Karma Configurations
Two separate Karma configuration files are created:

1. **karma.conf.js** - Development testing with Chrome browser
2. **karma.conf.ci.js** - CI testing with ChromeHeadless

### Cypress Integration
The schematic automatically:
1. Installs `@cypress/schematic`
2. Configures Cypress for the project
3. Sets up E2E testing targets

## Post-Generation Steps

After running the schematic, you'll have:

1. **A complete Angular workspace** with all standard files
2. **Enhanced configurations** for better development experience
3. **Testing infrastructure** ready for both unit and E2E tests
4. **CI-ready setup** with headless browser configurations

To start developing:

```bash
cd your-workspace-name
npm install
npm start
```

To run tests:

```bash
# Unit tests (development)
ng test --karma-config=karma.conf.js

# Unit tests (CI)
ng test --karma-config=karma.conf.ci.js

# E2E tests
ng e2e

# E2E tests (CI)
ng run your-app:e2e-ci
```

## Technical Implementation

The schematic uses Angular's `externalSchematic` to leverage the official `@schematics/angular:ng-new` schematic, then applies additional customizations:

1. **Workspace Creation**: Uses Angular's standard ng-new schematic
2. **Configuration Updates**: Modifies `angular.json` and `tsconfig.json`
3. **File Generation**: Creates Karma configuration files
4. **Task Scheduling**: Schedules Cypress installation and setup
5. **Code Cleanup**: Removes empty constructors from generated files

This approach ensures compatibility with Angular's standard workspace structure while adding project-specific optimizations.

## Compatibility

- **Angular**: 18.x
- **Node.js**: 18.x or higher
- **Package Manager**: npm (configured by default)
- **Browsers**: Chrome/Chromium (for testing)

## Related Schematics

This schematic works alongside other migration schematics in this package:
- `update-2-0-0` through `update-6-0-0` - Version migration schematics
- Standard Angular schematics - Component, service, etc. generators

## Troubleshooting

### Common Issues

**External schematic not found**: Ensure `@schematics/angular` is installed
```bash
npm install @schematics/angular --save-dev
```

**Cypress installation fails**: The schematic schedules Cypress installation as a task. If it fails, manually install:
```bash
ng add @cypress/schematic
```

**Test configuration issues**: Ensure Chrome/Chromium is available in your environment for testing.