#!/usr/bin/env node
/**
 * FSD Validator: Check Feature-Sliced Design folder structure
 * 
 * Usage:
 *   node scripts/fsd-validator.js src/features/orders
 */

const fs = require('fs');
const path = require('path');

const targetDir = process.argv[2];

if (!targetDir) {
  console.error('Usage: node fsd-validator.js <feature-directory>');
  process.exit(1);
}

const dirPath = path.resolve(targetDir);

if (!fs.existsSync(dirPath)) {
  console.error(`Directory not found: ${dirPath}`);
  process.exit(1);
}

console.log(`\n📁 FSD Structure Validation: ${path.relative(process.cwd(), dirPath)}\n`);

const expectedSlices = ['api', 'hooks', 'ui', 'utils'];
const expectedApiFiles = ['client.ts', 'endpoints.ts', 'index.ts'];

const issues = [];
const successes = [];

// Check for expected slices
expectedSlices.forEach(slice => {
  const slicePath = path.join(dirPath, slice);
  
  if (fs.existsSync(slicePath) && fs.statSync(slicePath).isDirectory()) {
    successes.push(`✓ ${slice}/ exists`);
  } else if (slice === 'api' || slice === 'hooks' || slice === 'ui') {
    issues.push(`⚠️  Missing expected slice: ${slice}/`);
  } else {
    console.log(`  ℹ️  Optional slice not found: ${slice}/`);
  }
});

// Check api structure
const apiPath = path.join(dirPath, 'api');
if (fs.existsSync(apiPath)) {
  const apiFiles = fs.readdirSync(apiPath);
  expectedApiFiles.forEach(file => {
    if (apiFiles.includes(file)) {
      successes.push(`✓ api/${file} found`);
    } else {
      issues.push(`⚠️  Missing api/${file}`);
    }
  });
}

// Check for files in wrong places
const rootFiles = fs.readdirSync(dirPath).filter(f => {
  const fullPath = path.join(dirPath, f);
  return fs.statSync(fullPath).isFile() && f.endsWith('.ts') || f.endsWith('.tsx');
});

if (rootFiles.length > 0) {
  issues.push(`⚠️  Found files in root instead of slices: ${rootFiles.join(', ')}`);
}

// Check for common issues
console.log('\nCommon Issues:\n');

if (fs.existsSync(path.join(dirPath, 'ui'))) {
  const uiFiles = fs.readdirSync(path.join(dirPath, 'ui'));
  const utilsInUI = uiFiles.filter(f => f.includes('Helper') || f.includes('utils'));
  
  if (utilsInUI.length > 0) {
    issues.push(`⚠️  Utilities found in ui/: ${utilsInUI.join(', ')} - move to utils/`);
  }
}

// Print results
console.log('Structure:\n');
successes.forEach(s => console.log(`  ${s}`));

if (issues.length > 0) {
  console.log('\n⚠️  Issues Found:\n');
  issues.forEach((issue, i) => console.log(`  ${i + 1}. ${issue}`));
} else {
  console.log('\n✅ FSD structure looks good!');
}

console.log('\n📚 FSD Best Practices:');
console.log('  • api/ — API clients, endpoints, type-safe queries');
console.log('  • hooks/ — Custom hooks, data fetching logic');
console.log('  • ui/ — React components and composition');
console.log('  • utils/ — Domain utilities, helpers, pure functions');
console.log('  • store/ — Zustand stores (if needed)');
console.log('  • model/ — Types, interfaces, data models');
console.log('\n');
