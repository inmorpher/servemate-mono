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
	console.error('Usage: node analyze-dependencies.js <file-path>');
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
console.log('\n⚠️  Potential Side Effects:');
const sideEffectPatterns = [
	{ regex: /localStorage\.setItem\(/g, name: 'localStorage.setItem' },
	{ regex: /sessionStorage\.setItem\(/g, name: 'sessionStorage.setItem' },
	{ regex: /document\.body\.style\./g, name: 'Direct DOM manipulation' },
	{ regex: /fetch\(/g, name: 'fetch() call' },
	{ regex: /Object\.defineProperty/g, name: 'Object.defineProperty' },
	{ regex: /\.mutate\(/g, name: 'Array/Object mutation' },
];

let foundSideEffects = false;
sideEffectPatterns.forEach(({ regex, name }) => {
	if (regex.test(content)) {
		console.log(`  ⚠️  ${name}`);
		foundSideEffects = true;
	}
});

if (!foundSideEffects) {
	console.log('  ✓ No obvious side effects detected');
}

// Check function complexity
console.log('\n📊 Function Complexity:');
const funcRegex = /(?:export\s+)?(?:const|function)\s+(\w+)\s*=?\s*(?:\(|{)?/g;
let funcCount = 0;
while ((match = funcRegex.exec(content)) !== null) {
	funcCount++;
}
console.log(`  Functions/exports: ${funcCount}`);

if (funcCount > 5) {
	console.log('  ⚠️  Consider splitting into smaller functions');
}

// Check for common patterns
console.log('\n👁️  Patterns Found:');
if (content.includes('useQuery')) console.log('  ✓ Using React Query');
if (content.includes('useMutation')) console.log('  ✓ Using React Query mutations');
if (content.includes('useState')) console.log('  ✓ Using local state');
if (content.includes('useContext')) console.log('  ✓ Using context');
if (content.includes("'use client'")) console.log('  ✓ Client component');
if (content.includes('async ')) console.log('  ✓ Async functions');

console.log('\n✅ Analysis complete!\n');
