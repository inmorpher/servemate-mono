#!/usr/bin/env node
/**
 * Analyze Dependencies: Detect circular imports and side effects
 *
 * Usage:
 *   node scripts/analyze-dependencies.js src/features/orders/hooks/useGetOrders.ts
 */

const fs = require('fs');
const path = require('path');

const targetFile = process.argv[2];

if (!targetFile) {
	console.error('Usage: node scripts/analyze-dependencies.js <file-path>');
	process.exit(1);
}

const filePath = path.resolve(targetFile);

if (!fs.existsSync(filePath)) {
	console.error(`File not found: ${filePath}`);
	process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf-8');

console.log(`\n📋 Dependency Analysis: ${path.relative(process.cwd(), filePath)}\n`);

// Check for imports
const importRegex = /import\s+.*?from\s+['"]([^'"]+)['"]/g;
const imports = [];
let match;

while ((match = importRegex.exec(content)) !== null) {
	imports.push(match[1]);
}

console.log('Imports:');
imports.forEach((imp) => {
	if (imp.startsWith('@/')) {
		console.log(`  ✓ Absolute: ${imp}`);
	} else if (imp.startsWith('.')) {
		console.log(`  ✓ Relative: ${imp}`);
	} else {
		console.log(`  ✓ External: ${imp}`);
	}
});

// Check for side effects
console.log('\nSide Effect Checks:');

const sideEffectPatterns = [
	{ pattern: /console\.(log|warn|error)/g, name: 'console statements' },
	{ pattern: /localStorage\.|sessionStorage\./g, name: 'direct storage access' },
	{ pattern: /window\.|document\./g, name: 'global object mutation' },
	{ pattern: /fetch\(|axios\.|http\./g, name: 'direct HTTP calls (should use hooks)' },
];

let hasSideEffects = false;

sideEffectPatterns.forEach(({ pattern, name }) => {
	if (pattern.test(content)) {
		console.log(`  ⚠️  Found ${name}`);
		hasSideEffects = true;
	}
});

if (!hasSideEffects) {
	console.log('  ✓ No obvious side effects detected');
}

console.log('\n');
