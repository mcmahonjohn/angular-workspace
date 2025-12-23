# ng-new Schematic

The `ng-new` schematic creates a new Angular workspace with optimized configurations and best practices built-in.

## Features

This schematic extends the standard Angular `ng new` command with the following enhancements:

### 🔧 Configuration Optimizations
- **CLI Analytics Disabled** - Respects developer privacy
- **Strict Angular Compiler Options** - Enhanced type checking and template validation
- **Custom Karma Configurations** - Separate configs for development and CI environments
- **Package Manager Lock** - Configured to use npm consistently

### 🧪 Testing Setup
- **Dual Karma Configs**: 
  - `karma.conf.js` - Chrome browser for development
  - `karma.conf.ci.js` - ChromeHeadless for CI/CD pipelines
- **Cypress Integration Ready** - Pre-configured for e2e testing installation
- **Coverage Reporting** - HTML and LCOV formats for comprehensive coverage analysis

### 🏗️ Build Optimizations  
- **Production Build Tweaks** - Disabled critical CSS inlining for better control
- **CI/CD Ready** - E2E test configuration for automated testing pipelines

### 🎯 Code Quality
- **Empty Constructor Removal** - Automatic cleanup of unnecessary constructors
- **Strict TypeScript** - Enhanced compiler strictness for better code quality
- **ESLint Integration** - Ready for Angular ESLint setup

## Usage

### Prerequisites
1. Install the my-lib package (when published):
   ```bash
   npm install -g my-lib
   ```

2. Or use locally during development:
   ```bash
   # Build and link the library
   npm run build
   
   # Build the schematics
   npm run build:schematics
   ```

### Creating a New Workspace

#### Using the published package:
```bash
ng new my-project --collection=my-lib
```

#### Using during development:
```bash
npx @angular-devkit/schematics-cli ./projects/my-lib/schematics/dist/schematics:ng-new --name=my-project
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `name` | `string` | *required* | The name of the workspace (prompted with "angular-" prefix suggestion) |
| `routing` | `boolean` | `true` | Generate a routing module |
| `minimal` | `boolean` | `false` | Create a minimal workspace without testing frameworks |
| `directory` | `string` | `undefined` | Directory name to create the workspace in |

### Examples

#### Basic workspace with routing:
```bash
ng new my-angular-app --collection=my-lib
```

#### Minimal workspace:
```bash
ng new my-angular-app --collection=my-lib --minimal=true
```

#### Workspace in a specific directory:
```bash
ng new my-angular-app --collection=my-lib --directory=custom-folder
```

#### Workspace without routing:
```bash
ng new my-angular-app --collection=my-lib --routing=false
```

## What Gets Created

After running the schematic, you'll have a new Angular workspace with:

### 📁 Standard Angular Files
- Complete Angular application structure
- TypeScript configuration files
- Package.json with dependencies

### ⚙️ Enhanced Configuration Files
```
my-project/
├── angular.json          # Enhanced with CI configs and analytics disabled
├── tsconfig.json         # Strict Angular compiler options
├── karma.conf.js         # Development testing with Chrome
├── karma.conf.ci.js      # CI testing with ChromeHeadless
├── package.json          # Standard Angular dependencies
└── src/
    ├── app/
    │   └── ...           # Standard Angular app structure
    └── ...
```

### 🔄 Ready for Next Steps

After creation, you can immediately:

1. **Install Cypress** for e2e testing:
   ```bash
   cd my-project
   npm install --save-dev @cypress/schematic
   ng add @cypress/schematic
   ```

2. **Run development server**:
   ```bash
   ng serve
   ```

3. **Run tests**:
   ```bash
   # Unit tests (development)
   ng test --karma-config=karma.conf.js
   
   # Unit tests (CI)
   ng test --karma-config=karma.conf.ci.js --watch=false
   
   # E2E tests (after Cypress setup)
   ng e2e
   ```

## Advanced Usage

### CI/CD Integration

The generated workspace is ready for CI/CD with:
- ChromeHeadless karma configuration
- Coverage reporting in LCOV format
- E2E configuration for automated testing

Example GitHub Actions workflow:
```yaml
- name: Run unit tests
  run: ng test --karma-config=karma.conf.ci.js --watch=false

- name: Run e2e tests  
  run: ng e2e-ci
```

### Development Workflow

The workspace includes configurations optimized for development:
- Chrome browser for interactive testing
- File watching enabled
- Comprehensive error reporting

## Comparison with Standard ng new

| Feature | Standard `ng new` | `my-lib ng-new` |
|---------|------------------|-----------------|
| CLI Analytics | Enabled | ❌ Disabled |
| Karma Config | Single config | ✅ Dual configs (dev/CI) |
| Angular Compiler | Default strictness | ✅ Enhanced strict mode |
| Cypress Ready | Manual setup | ✅ Pre-configured |
| Empty Constructors | Generated | ✅ Auto-removed |
| CI/CD Ready | Manual config | ✅ Built-in support |

## Troubleshooting

### Common Issues

1. **Schematic not found**:
   ```bash
   # Make sure the collection is built and available
   npm run build:schematics
   ```

2. **Permission errors**:
   ```bash
   # Use npx for temporary execution
   npx @angular-devkit/schematics-cli <collection-path>:ng-new
   ```

3. **External schematic errors**:
   - Ensure you have Angular CLI installed globally
   - Check internet connection for downloading Angular schematics

### Getting Help

If you encounter issues:
1. Check the [Angular Schematics documentation](https://angular.io/guide/schematics)
2. Review the generated `angular.json` for configuration issues
3. Test karma configurations individually

## Development

To modify or extend this schematic:

1. Edit the schematic files in `projects/my-lib/schematics/ng-new/`
2. Update the schema in `schema.json` for new options
3. Rebuild with `npm run build:schematics`
4. Test with the test script: `node ng-new-schematic.spec.js`