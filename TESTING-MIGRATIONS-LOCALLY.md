# How to Test Angular Library Migrations Locally

This guide explains how to verify that your `migrations.json` and update schematics work as expected before publishing your Angular library.

---

## 1. Build Your Library and Schematics

Make sure your library and all schematics are built and copied to the correct output directory:

```sh
npm run build
npm run build:schematics
```

---

## 2. Link or Pack Your Library

**Option A: Use npm pack**

```sh
cd dist/my-lib
npm pack
```
This creates a tarball (e.g., `my-lib-0.0.1.tgz`).

**Option B: Use npm link**

```sh
cd dist/my-lib
npm link
```

---

## 3. Create or Use a Test Angular Project

- Use an existing Angular workspace or create a new one:
  ```sh
  ng new test-migrations
  cd test-migrations
  ```

---

## 4. Install Your Local Library in the Test Project

**If using a tarball:**
```sh
npm install /absolute/path/to/dist/my-lib/my-lib-<version>.tgz
```

**If using npm link:**
```sh
npm link my-lib
```

---

## 5. Simulate an Update

1. In the test project, set the dependency in `package.json` to an older version (e.g., `"my-lib": "2.0.0"`).
2. Run:
   ```sh
   npm install
   ```
3. Now, update the version in `package.json` to the new version (the one with your migrations).
4. Run:
   ```sh
   npx ng update my-lib --from=2.0.0 --to=<new-version> --migrate-only --allow-dirty
   ```
   - This will run the migrations defined in your `migrations.json` for the version bump.

---

## 6. Check the Output

- Verify that the correct schematic(s) ran by checking the logs and the changes made to the test project.
- Look for log messages or file changes that your migration schematic should produce.

---

## Summary Table

| Step | Command/Action |
|------|---------------|
| Build library & schematics | `npm run build && npm run build:schematics` |
| Pack or link library | `npm pack` or `npm link` |
| Create test project | `ng new test-migrations` |
| Install local lib | `npm install <tarball>` or `npm link my-lib` |
| Simulate update | `npx ng update my-lib --from=... --to=... --migrate-only --allow-dirty` |
| Check output | Review logs and file changes |

---

## References

- [Angular: Authoring Schematics](https://angular.io/guide/schematics-authoring)
- [Angular: Creating and Publishing Libraries](https://angular.io/guide/creating-libraries#packaging-and-publishing-your-library)
- [Angular CLI: ng update](https://angular.io/cli/update)
- [ng-packagr: assets](https://ng-packagr.gitbook.io/ng-packagr/guide/assets)
- [Angular CLI: Migrations](https://github.com/angular/angular-cli/blob/main/docs/design/migrations.md)
- [Angular CLI: Testing Migrations](https://github.com/angular/angular-cli/blob/main/docs/design/migrations.md#testing-migrations)

---

## Notes
- The `--migrate-only` flag runs migrations without updating dependencies.
- The `--allow-dirty` flag allows running migrations even if the working directory is not clean (useful for local testing).
- You can adjust the `--from` and `--to` versions to test different migration paths.

---

**This process ensures your migrations.json and update schematics work as intended before publishing your library to npm.**
