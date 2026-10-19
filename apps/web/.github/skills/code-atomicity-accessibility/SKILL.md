---
name: code-atomicity-accessibility
description: 'Verify code atomicity (single responsibility, no side effects, FSD paradigm) and browser web accessibility (keyboard navigation, WCAG/Google standards). Use on-demand before commits, during code review, or when implementing components.'
argument-hint: 'File path, feature name, or component type to check'
---

# Code Atomicity & Accessibility Verification

A reference guide and audit toolkit for ensuring code follows atomic design principles and meets web accessibility standards in the ServeMate project.

## When to Use

- **Before committing** code to verify quality gates
- **During code review** to validate components and utilities
- **After implementing** features in the orders, users, or auth domains
- **On-demand** for accessibility audits on specific pages or components

## Two-Part Verification

### Part 1: Atomicity Check

Ensure code follows **single responsibility, compound components, FSD paradigm, and no side effects**.

1. **File Structure**: Use [atomicity reference](./references/atomicity.md) to verify FSD folder layout
2. **Function Dependencies**: Run [dependency analyzer](./scripts/analyze-dependencies.js) on your component/hook
3. **Component Composition**: Check that components are composable using [compound components checklist](./references/atomicity.md#compound-components)
4. **Type Safety**: Run `npm run lint` to catch TypeScript and ESLint violations

**Decision Point**: If violations found, refactor using patterns in [atomicity reference](./references/atomicity.md).

### Part 2: Accessibility Audit

Ensure keyboard navigation, WCAG compliance, and proper touch target sizing following Google Web Standards.

1. **Automated Audit**: Run [accessibility audit script](./scripts/a11y-audit.js) on target page/component
2. **Keyboard Navigation**: Manually test using [keyboard nav checklist](./references/accessibility.md#keyboard-navigation)
3. **Touch Target Sizing**: Verify buttons/icons meet [touch target standards](./references/accessibility.md#touch-target-sizing)
4. **Semantic HTML**: Verify using [ARIA and semantic checklist](./references/accessibility.md#semantic-html)
5. **Browser DevTools**: Use Chrome DevTools Lighthouse to validate (See [accessibility reference](./references/accessibility.md))

**Decision Point**: If failures found, apply fixes from [accessibility remediation guide](./references/accessibility.md#common-fixes).

## Quick Reference

| Scenario                     | Reference                                                                   |
| ---------------------------- | --------------------------------------------------------------------------- |
| Verify component composition | [Compound Components](./references/atomicity.md#compound-components)        |
| Check folder structure       | [FSD Paradigm](./references/atomicity.md#fsd-structure)                     |
| Test keyboard navigation     | [Keyboard Nav Checklist](./references/accessibility.md#keyboard-navigation) |
| Check button/icon sizes      | [Touch Target Sizing](./references/accessibility.md#touch-target-sizing)    |
| Review ARIA attributes       | [ARIA Guidelines](./references/accessibility.md#semantic-html)              |
| Run automated checks         | [Scripts](./scripts/)                                                       |

## Scripts Included

- `analyze-dependencies.js` — Trace function dependencies and detect side effects
- `a11y-audit.js` — Run accessibility audit on components/pages
- `fsd-validator.js` — Validate FSD folder structure

## CommonPatterns

See [atomicity patterns](./references/atomicity.md) and [accessibility patterns](./references/accessibility.md) for:

- Single responsibility patterns
- Compound component examples
- Keyboard event handling
- ARIA attribute usage
- Focus management
