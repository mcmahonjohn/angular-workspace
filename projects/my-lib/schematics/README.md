# My-Lib Schematics

This directory contains Angular Schematics for `my-lib` library, providing automated code generation and migration capabilities.

## Structure

```
schematics/
├── build.sh              # Build script for schematics
├── test.sh               # Test script for schematics  
├── collection.json       # Schematic collection definition
├── tsconfig.schematics.json  # TypeScript config for schematics
├── dist/                 # Built schematics (generated)
├── ng-new/               # ng-new schematic
│   ├── index.ts
│   ├── schema.json
│   ├── schema.ts
│   ├── templates/        # Template files
│   │   ├── karma.conf.js.template
│   │   └── karma.conf.ci.js.template
│   ├── ng-new-schematic.md
│   └── test-ng-new-schematic.js
└── update-X-X-X/         # Migration schematics for each version
    ├── index.ts
    ├── schema.json
    └── *.spec.ts
```

## Migration Schematics

The following migration schematics are available to handle breaking changes between major versions:

### Available Migrations

| Version | Status | Description |
|---------|---------|------------|
| `update-2-0-0` | ✅ **Implemented** | Updates imports from 'my-lib' to 'library' in TypeScript files |
| `update-3-0-0` | 📋 **Template Ready** | Migration for v3.0.0 breaking changes* |
| `update-4-0-0` | 📋 **Template Ready** | Migration for v4.0.0 breaking changes* |
| `update-5-0-0` | 📋 **Template Ready** | Migration for v5.0.0 breaking changes* |
| `update-6-0-0` | 📋 **Template Ready** | Migration for v6.0.0 breaking changes* |

**Migration templates are pre-created for versions 3.0.0 through 6.0.0 and ready for implementation when breaking changes are introduced.*

### Usage

Migrations are automatically triggered when updating the library via `ng update`:

```bash
# Update to specific version (triggers appropriate migration)
ng update my-lib@3.0.0
ng update my-lib@4.0.0
ng update my-lib@5.0.0
ng update my-lib@6.0.0

# Alternative: Update to latest in major version range
ng update my-lib@3    # Updates to latest 3.x version (e.g., 3.2.1)
ng update my-lib@4    # Updates to latest 4.x version (e.g., 4.1.0)

# Dry run to preview changes
ng update my-lib@3.0.0 --dry-run
ng update my-lib@3 --dry-run
```

### Template Structure

Each migration schematic includes:

- **`index.ts`** - Main migration logic with TODO placeholders
- **`schema.json`** - Configuration schema with standard options:
  - `skipConfirmation`: Skip migration confirmation prompts
  - `dryRun`: Show changes without applying them
- **`index.spec.ts`** - Test suite template with example test cases

### Implementation Guidelines

When implementing migration logic for a specific version:

1. **Update Import Statements**: Use AST transformations to update import paths
2. **Migrate Configurations**: Update configuration file formats and structures
3. **Update API Usage**: Replace deprecated API calls with new equivalents
4. **Handle Type Changes**: Update TypeScript interfaces and type definitions
5. **Theme/Style Updates**: Migrate styling configurations and theme structures
6. **Dependency Updates**: Handle peer dependency and build configuration changes

### Development Workflow

1. **Identify Breaking Changes**: Document what needs to be migrated
2. **Implement Migration Logic**: Replace TODO comments with actual transformation code
3. **Add Helper Functions**: Create utility functions for common transformations
4. **Write Comprehensive Tests**: Ensure migration handles edge cases gracefully
5. **Test Migration**: Validate against real projects before release
6. **Document Changes**: Update migration logs and user-facing documentation

### Helpful Resources

- [Migration Guide][migration-guide] - Official Angular migration schematic guide
- [AST Transformations][ts-morph] - TypeScript AST manipulation library
- [Angular Migrations][angular-migrations] - Reference implementations from Angular CLI
- [Material Migrations][material-migrations] - Production examples from Angular Material

## Available Scripts

### Building Schematics
```bash
npm run build:schematics
# or directly:
./projects/my-lib/schematics/build.sh
```

This script:
- Compiles TypeScript files
- Copies collection.json and schema.json files
- Creates necessary directory structure
- Copies template files to the dist directory

### Testing Schematics
```bash
npm run test:schematics
# or directly:
./projects/my-lib/schematics/test.sh
```

This script:
- Runs all schematic unit tests with coverage
- Uses nyc for coverage reporting
- Excludes spec files from coverage

### Integration Testing
```bash
npm run test:ng-new
```

Runs comprehensive integration tests for the ng-new schematic.

## Template System

Template files use Angular Schematics conventions:
- Files end with `.template` suffix
- Use `<%= variable %>` syntax for template variables
- Processed by Angular Schematics template engine during execution

## Adding New Schematics

When adding new schematics:

1. Create a new directory under `schematics/`
2. Add the schematic to `collection.json`
3. Update `build.sh` to copy any schema files or templates
4. Template files should use the `.template` suffix (Angular convention)
5. Run `npm run build:schematics` to build
6. Run `npm run test:schematics` to test

## Maintenance

The build and test scripts are designed to scale as new schematics are added:

- **build.sh**: Automatically handles new update schematics following the `update-X-X-X` pattern
- **test.sh**: Runs all tests in the dist directory
- Template copying is handled generically for any schematic with a `templates/` directory

---

[migration-guide]: https://angular.dev/tools/cli/schematics-for-libraries#providing-generation-support
[ts-morph]: https://ts-morph.com/
[angular-migrations]: https://github.com/angular/angular-cli/tree/main/packages/schematics/angular/migrations
[material-migrations]: https://github.com/angular/components/tree/main/src/material/schematics/ng-update