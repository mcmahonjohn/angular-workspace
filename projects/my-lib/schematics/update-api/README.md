# update-api schematic — developer guide

This folder contains the `update-api` schematic which applies JSON-driven, text-based replacements across your codebase to help migrate APIs (components, directives, services, pipes, modules, interceptors, resolvers, etc.). Use this README to add or update change sets.

DO NOT expect the schematic to rename or move files; it only performs content replacements. The schematic supports both the old Angular filename style (`*.component.ts`, `*.component.html`) and the newer dash-separated style (`*-component.ts`, `*-component.html`) when matching `filePatterns`.

File: `api-changes.json`
- Top-level keys are categories (for example: `components`, `directives`, `services`, `pipes`, `modules`, `models`, `other`).
- Each category is an array of ChangeSet objects.

ChangeSet shape
- `description` (optional): human-friendly description of the change set.
- `tsReplacements`: array of replacement objects applied to TypeScript files (`.ts`):
  - `from`: string (literal identifier or regex pattern)
  - `to`: string (replacement text)
  - `regex` (optional, boolean): when `true` the `from` field is treated as a JavaScript regular expression (it will be used as `new RegExp(from, 'g')`). When `false` non-regex `from` values are treated as whole-word identifiers and replaced via an AST-aware approach (also updates comments).
- `htmlReplacements` (optional): array of replacements applied to HTML files (`.html`) under `src/app` and `src/lib`:
  - `from`, `to`, `regex` (same semantics as above). Non-regex `htmlReplacements` are applied as whole-word replacements.

Notes on filename styles
- The schematic expands common `filePatterns` so you can author patterns using the familiar `.component.` (dot) style and the schematic will also match `-component.` (dash) variants. You do not need to duplicate both styles in `filePatterns` (but you may if you prefer explicitness).
- Important: for `component`, `service`, `directive`, and `models` (model/interface) files the newer filename styles may omit the type segment entirely (for example `car.ts` instead of `car.model.ts` or `sample.ts` instead of `sample.component.ts`). The schematic generates matching variants that remove the segment so a pattern like `**/*.component.ts` will also match `**/*.ts` where appropriate. Prefer targeted patterns (e.g., `src/app/**/` prefixes) to avoid overly-broad matches.

Scope and safety
- By default the schematic only applies replacements within `src/app/**` and `src/lib/**` to reduce accidental global matches. This is enforced automatically.
- For TypeScript identifier renames the schematic uses AST-aware matching to safely rename identifier tokens (declarations and usages). It also updates occurrences found inside comments (`//` and `/* */`).
- Matching is case-sensitive and treated as whole-word for non-regex replacements.

HTML-specific replacements
- Components often require HTML-only changes (selectors, input/output attribute names). Use `htmlReplacements` in a ChangeSet to list replacements that should be applied only to HTML files. These run as literal or whole-word replacements unless `regex: true`.

Examples

- Components

```json
{
  "description": "Rename input 'oldInput' to 'newInput' and selector 'app-old' to 'app-new'",
  "filePatterns": ["**/*.component.ts", "**/*.component.html"],
  "tsReplacements": [
    { "from": "oldInput", "to": "newInput", "regex": false },
    { "from": "app-old", "to": "app-new", "regex": false }
  ]
}
```

- Directives

```json
{
  "description": "Update directive occurrences",
  "filePatterns": ["**/*.directive.ts", "**/*.component.html"],
  "tsReplacements": [
    { "from": "oldDirective", "to": "newDirective", "regex": false }
  ]
}
```

- Services (example using regex to include the call parentheses)

```json
{
  "description": "Rename service method 'oldMethod' to 'newMethod'",
  "filePatterns": ["**/*.service.ts"],
  "tsReplacements": [
    { "from": "oldMethod\\(", "to": "newMethod(", "regex": true }
  ]
}
```

- Pipes (template usage)

```json
{
  "description": "Update pipe usage in templates",
  "filePatterns": ["**/*.pipe.ts", "**/*.component.html"],
  "tsReplacements": [
    { "from": "| oldPipe", "to": "| newPipe", "regex": false }
  ]
}
```

- Modules (rename imported module class)

```json
{
  "description": "Replace OldSharedModule with NewSharedModule",
  "filePatterns": ["**/*.module.ts"],
  "tsReplacements": [
    { "from": "OldSharedModule", "to": "NewSharedModule", "regex": false }
  ]
}
```

- Other (resolvers / interceptors)

```json
{
  "description": "Resolvers and interceptors example",
  "filePatterns": ["**/*resolver*.ts", "**/*interceptor*.ts"],
  "tsReplacements": [
    { "from": "resolveOld(\\", "to": "resolveNew(", "regex": true }
  ]
}
```

Authoring tips
- Prefer targeted `filePatterns` to reduce false positives (e.g., `src/app/**\/grid.component.ts` instead of `**/*.ts`).
- Use `regex: true` for replacements that require pattern matching (e.g., capturing parentheses or optional whitespace). Remember the schematic uses the `g` flag for global replacement.
- For safe TypeScript refactors involving identifier renames (types, class members, imports that require updating references across files), consider using an AST-based transform (ts-morph or TypeScript AST) instead of blind text replacement. This schematic is intentionally text-based for simple mass replacements.

Testing
- Unit tests for the schematic live in `index.spec.ts`. Add tests that create `UnitTestTree` files using both filename styles (`sample.component.ts` and `sample-component.ts`) to validate matching.
- Run the schematics tests locally:

```bash
npm run test:schematics
```

Workflow example
- Add or update the relevant ChangeSet in `api-changes.json`.
- Run `npm run build:schematics` to ensure the compiled schematic includes your changes (build script copies `api-changes.json` into `dist`).
- Run `npm run test:schematics` and add or update unit tests as needed.

If you want help converting a specific replacement to an AST-aware transform, open an issue or ask here and include a code sample so I can propose an AST-based implementation and tests.
