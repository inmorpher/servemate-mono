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
	console.error('Usage: node scripts/fsd-validator.js <feature-directory>');
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
expectedSlices.forEach((slice) => {
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

	expectedApiFiles.forEach((file) => {
		if (apiFiles.includes(file)) {
			successes.push(`  ✓ api/${file}`);
		} else {
			issues.push(`  ⚠️  Missing api/${file}`);
		}
	});
}

// Check for index.ts in slices
['api', 'hooks', 'ui', 'utils'].forEach((slice) => {
	const slicePath = path.join(dirPath, slice);
	const indexPath = path.join(slicePath, 'index.ts');

	if (fs.existsSync(slicePath) && !fs.existsSync(indexPath)) {
		issues.push(`  ⚠️  Missing index.ts in ${slice}/ (needed for barrel exports)`);
	}
});

// Print results
if (successes.length > 0) {
	console.log('✅ Structure checks:');
	successes.forEach((s) => console.log(`  ${s}`));
}

if (issues.length > 0) {
	console.log('\n⚠️  Issues:');
	issues.forEach((i) => console.log(`  ${i}`));
} else {
	console.log('\n✨ FSD structure is valid!');
}

console.log('');
