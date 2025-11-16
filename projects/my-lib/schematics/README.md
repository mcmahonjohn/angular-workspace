# My-Lib Schematics

This directory contains Angular Schematics for `my-lib` library, providing automated code generation and migration capabilities.

## Migration Schematics

The following migration schematics are available to handle breaking changes between major versions:

### Available Migrations

| Version | Status | Description |
|---------|---------|------------|
| `update-2-0-0` | ✅ **Implemented** | Updates imports from 'my-lib' to 'library' in TypeScript files |
| `update-3-0-0` | 📋 **Template Ready** | Migration for v3.0.0 breaking changes |
| `update-4-0-0` | 📋 **Template Ready** | Migration for v4.0.0 breaking changes |
| `update-5-0-0` | 📋 **Template Ready** | Migration for v5.0.0 breaking changes |
| `update-6-0-0` | 📋 **Template Ready** | Migration for v6.0.0 breaking changes |

### Usage

Migrations are automatically triggered when updating the library via `ng update`:

```bash
# Update to specific version (triggers appropriate migration)
ng update my-lib@3.0.0
ng update my-lib@4.0.0
ng update my-lib@5.0.0
ng update my-lib@6.0.0

# Dry run to preview changes
ng update my-lib@3.0.0 --dry-run
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

### Testing

Run schematic tests:

```bash
npm run test:schematics
```

Test individual migrations:

```bash
# Test specific migration
npm run test:schematics -- --grep "Update to v3.0.0"
```

### Building

Compile schematics for distribution:

```bash
npm run build:schematics
```

---

*Migration templates are pre-created for versions 3.0.0 through 6.0.0 and ready for implementation when breaking changes are introduced.*

[migration-guide]: https://angular.dev/tools/cli/schematics-for-libraries#providing-generation-support
[ts-morph]: https://ts-morph.com/
[angular-migrations]: https://github.com/angular/angular-cli/tree/main/packages/schematics/angular/migrations
[material-migrations]: https://github.com/angular/components/tree/main/src/material/schematics/ng-update