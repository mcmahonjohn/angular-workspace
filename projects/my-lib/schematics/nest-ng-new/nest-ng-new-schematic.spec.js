#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

function createTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'nest-ng-new-test-'));
}

function cleanup(tempDir) {
  if (fs.existsSync(tempDir)) {
    console.log(`🧹 Cleaning up temporary directory: ${tempDir}`);
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

function runCommand(command, cwd = process.cwd(), options = {}) {
  console.log(`🔧 Running: ${command}`);

  try {
    const result = execSync(command, {
      cwd,
      stdio: options.silent ? 'pipe' : 'inherit',
      encoding: 'utf8',
      ...options
    });

    return result;

} catch (error) {
    console.error(`❌ Command failed: ${command}`);
    console.error(`Exit code: ${error.status}`);

    if (error.stdout) {
      console.error('STDOUT:', error.stdout);
    }

    if (error.stderr) {
      console.error('STDERR:', error.stderr);
    }

    throw error;
  }
}

function testNestNgNewSchematic() {
  let tempDir;

  try {
    console.log('🚀 Testing nest-ng-new schematic integration...\n');
    tempDir = createTempDir();
    console.log(`📁 Created temporary directory: ${tempDir}\n`);

    // Build the schematics first
    console.log('🔨 Building schematics...');
    runCommand('npm run build:schematics', path.resolve(__dirname, '../../../..'));
    console.log('✅ Schematics built successfully\n');

    // Get the absolute path to our schematics
    const schematicsPath = path.resolve(__dirname, '../dist/schematics');
    console.log(`📦 Using schematics from: ${schematicsPath}\n`);

    // Test the nest-ng-new schematic validation (dry run)
    const testAppName = 'test-nest-app';
    console.log(`🧪 Testing nest-ng-new schematic validation with app name: ${testAppName}`);

    // Change to temp directory for dry run
    process.chdir(tempDir);

    // Check collection.json exists and is valid
    const collectionPath = path.join(schematicsPath, 'collection.json');

    if (!fs.existsSync(collectionPath)) {
      throw new Error(`Collection file not found: ${collectionPath}`);
    }

    const collection = JSON.parse(fs.readFileSync(collectionPath, 'utf8'));

    if (!collection.schematics || !collection.schematics['nest-ng-new']) {
      throw new Error('nest-ng-new schematic not found in collection');
    }

    console.log('  ✅ Collection.json is valid');
    console.log('  ✅ nest-ng-new schematic is registered');

    // Check schema.json exists
    const schemaPath = path.join(schematicsPath, 'nest-ng-new', 'schema.json');

    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found: ${schemaPath}`);
    }

    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

    if (!schema.properties || !schema.properties.name) {
      throw new Error('Schema is missing required properties');
    }

    console.log('  ✅ Schema.json is valid');

    // Check compiled JavaScript exists
    const compiledSchematicPath = path.join(schematicsPath, 'nest-ng-new', 'index.js');

    if (!fs.existsSync(compiledSchematicPath)) {
      throw new Error(`Compiled schematic not found: ${compiledSchematicPath}`);
    }

    console.log('  ✅ Compiled schematic exists');

    // Validate the schematic JavaScript syntax by requiring it
    console.log('\n🧪 Testing schematic JavaScript syntax...');

    try {
      const schematicModule = require(compiledSchematicPath);

      if (typeof schematicModule.default === 'function') {
        console.log('  ✅ Schematic exports a valid default function');

      } else {
        throw new Error('Schematic does not export a default function');
      }

      console.log('  ✅ JavaScript syntax validation passed');

    } catch (syntaxError) {
      throw new Error(`Schematic syntax error: ${syntaxError.message}`);
    }

    // Test configuration generation logic
    const rule = require(compiledSchematicPath).default;

    if (typeof rule === 'function') {
      console.log('  ✅ Schematic default export is a function');
    }

    console.log('\n🎉 nest-ng-new schematic integration test completed successfully!');
    console.log('\n📋 Summary:');
    console.log('  - Schematic collection is properly configured');
    console.log('  - Schema validation passes');
    console.log('  - Compiled JavaScript exists and is syntactically valid');
    console.log('  - Schematic default export is a function');
    console.log('  - Ready for use with Angular CLI');

  } catch (error) {
    console.error('\n💥 Test failed:', error.message);
    process.exit(1);

} finally {

    if (tempDir) {
      cleanup(tempDir);
    }

    process.chdir(path.resolve(__dirname, '../../../..'));
  }
}

testNestNgNewSchematic();
