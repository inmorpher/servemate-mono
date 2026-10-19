#!/usr/bin/env node
/**
 * Accessibility Audit: Check for keyboard nav and semantic HTML issues
 *
 * Usage:
 *   node scripts/a11y-audit.js ./src/features/orders/ui/OrderCard.tsx
 */

const fs = require('fs');
const path = require('path');

const targetFile = process.argv[2];

if (!targetFile) {
	console.error('Usage: node scripts/a11y-audit.js <file-path>');
	process.exit(1);
}

const filePath = path.resolve(targetFile);

if (!fs.existsSync(filePath)) {
	console.error(`File not found: ${filePath}`);
	process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf-8');

console.log(`\n♿ Accessibility Audit: ${path.relative(process.cwd(), filePath)}\n`);

const issues = [];
const successes = [];

// Check for non-semantic buttons
if (/<div.*?onClick/g.test(content)) {
	issues.push('⚠️  Found <div> with onClick handler - should use <button>');
} else {
	successes.push('✓ No non-semantic click handlers detected');
}

// Check for proper button elements
if (/<button/g.test(content)) {
	const buttonCount = (content.match(/<button/g) || []).length;
	successes.push(`✓ Found ${buttonCount} <button> element(s)`);
}

// Check for form labels
if (/<input/g.test(content)) {
	const inputCount = (content.match(/<input/g) || []).length;
	const labelCount = (content.match(/<label/g) || []).length;

	if (labelCount < inputCount) {
		issues.push(
			`⚠️  Found ${inputCount} input(s) but only ${labelCount} label(s) - consider using <label htmlFor>`,
		);
	} else {
		successes.push(`✓ Input elements have associated labels`);
	}
}

// Check for alt text
if (/<img/g.test(content)) {
	const imgCount = (content.match(/<img/g) || []).length;
	const altCount = (content.match(/alt=/g) || []).length;

	if (altCount < imgCount) {
		issues.push(`⚠️  Found ${imgCount} image(s) but only ${altCount} with alt text`);
	} else {
		successes.push(`✓ All images have alt text`);
	}
}

// Check for focus management
if (/onKeyDown|useFocusTrap|focus\(\)/g.test(content)) {
	successes.push('✓ Contains focus management code');
} else {
	if (/<dialog|Modal|Drawer/g.test(content)) {
		issues.push('⚠️  Modal/Drawer detected but no focus management found');
	}
}

// Check for ARIA
if (/aria-/g.test(content)) {
	const ariaCount = (content.match(/aria-/g) || []).length;
	successes.push(`✓ Uses ${ariaCount} ARIA attribute(s)`);
}

// Check for keyboard events
if (/onKeyDown|onKeyUp/g.test(content)) {
	successes.push('✓ Contains keyboard event handlers');
} else {
	if (/<div.*?onClick|custom component/i.test(content)) {
		issues.push(
			'⚠️  Custom interactive elements should handle keyboard events (onKeyDown, onKeyUp)',
		);
	}
}

// Check for touch target sizing
const buttonClasses = content.match(/className=['"][^'"]*h-\d[^'"]*['"]/g) || [];
const hasTouchSizedButtons = buttonClasses.some((cls) => {
	return cls.includes('h-10') || cls.includes('h-12') || cls.includes('md:h-');
});

if (hasTouchSizedButtons) {
	successes.push('✓ Uses appropriate button heights for touch targets');
} else {
	if (content.includes('<button')) {
		issues.push(
			'⚠️  Check if buttons have proper touch target sizing (h-10 or h-12 on mobile)',
		);
	}
}

// Check for role attributes
if (/role="/g.test(content)) {
	const roleCount = (content.match(/role="/g) || []).length;
	console.log(`\n📋 Roles used: ${roleCount} instance(s)`);
	console.log("   ℹ️  Verify roles are used only when semantic HTML can't express semantics");
}

// Print results
if (successes.length > 0) {
	console.log('✅ Passed checks:');
	successes.forEach((s) => console.log(`  ${s}`));
}

if (issues.length > 0) {
	console.log('\n⚠️  Issues found:');
	issues.forEach((i) => console.log(`  ${i}`));
	console.log(
		'\n📖 Fix tips: See .github/skills/code-atomicity-accessibility/references/accessibility.md',
	);
} else {
	console.log('\n✨ No major accessibility issues detected!');
}

console.log('');
