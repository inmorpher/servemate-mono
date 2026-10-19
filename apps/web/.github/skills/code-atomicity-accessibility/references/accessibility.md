# Web Accessibility Reference Guide

Verify browser accessibility compliance using keyboard navigation and WCAG/Google Web Standards.

## Keyboard Navigation

All interactive elements must be operable via keyboard alone (no mouse required).

### Checklist

- [ ] All clickable elements are in tab order (`<button>`, `<a>`, custom `role="button"`)
- [ ] Tab order follows visual flow (left to right, top to bottom)
- [ ] Can reach and activate all interactive elements with Tab/Enter/Space
- [ ] Can navigate modals with Tab and close with Escape
- [ ] Can operate dropdowns with arrow keys
- [ ] Skip links exist for main content (optional but recommended)
- [ ] Focus is always visible (no `outline: none` without replacement)
- [ ] No keyboard traps (user is not stuck in an element)

### Common Issues & Fixes

| Issue                                         | Fix                                                                                     |
| --------------------------------------------- | --------------------------------------------------------------------------------------- |
| `<div onClick={...}>` not keyboard accessible | Change to `<button>` or add `role="button"`, `tabIndex={0}`, keyboard handlers          |
| Lost focus management in modal                | Trap focus inside modal, restore after close. See [focus management](#focus-management) |
| No visible focus indicator                    | Add `:focus` or `:focus-visible` styles (e.g., `border: 2px solid blue`)                |
| Tab order is wrong                            | Remove unneeded `tabIndex` values, or reorder DOM if possible                           |

### Manual Testing Steps

1. **Open the page/component in browser**
2. **Press Tab** repeatedly and note:
    - Can you reach all interactive elements?
    - Does focus ring appear each time?
    - Is the tab order logical?
3. **Press Shift+Tab** to go backwards
4. **Press Enter/Space** on focused buttons to activate
5. **Press Escape** to close modals/dropdowns
6. **Test arrow keys** on lists, tabs, sliders

## Semantic HTML

Use proper HTML elements for their intended meaning.

### Common Elements

```html
<!-- ✅ Good: Semantic -->
<button>Click me</button>
<nav><a href="/orders">Orders</a></nav>
<form>
	<label>Name: <input /></label>
</form>
<h1>Page Title</h1>
<main>Content</main>

<!-- ❌ Bad: Non-semantic (harder for assistive tech) -->
<div onClick="{...}" role="button">Click me</div>
<div><span onClick="{...}">Orders</span></div>
<div><span>Name:</span><input /></div>
<div style="font-size: 2em; font-weight: bold;">Page Title</div>
<div>Content</div>
```

### ARIA Attributes

Use ARIA only when HTML can't express semantics.

```html
<!-- ✅ Good: Use HTML when possible -->
<button aria-label="Close">×</button>
<ul role="listbox">
	<li role="option">Item 1</li>
</ul>

<!-- ✅ Also good: Semantic HTML with ARIA for clarity -->
<nav aria-label="Main navigation">
	<a href="/orders">Orders</a>
	<a href="/users">Users</a>
</nav>

<!-- ❌ Avoid: Over-using ARIA for semantic elements -->
<div role="button" aria-label="Submit">Submit</div>
<!-- Use <button> -->
<div role="heading" aria-level="1">Title</div>
<!-- Use <h1> -->
```

### Common ARIA Attributes

| Attribute            | Use Case                                             | Example                                                                |
| -------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------- |
| `aria-label`         | Button or icon with no text                          | `<button aria-label="Close">×</button>`                                |
| `aria-labelledby`    | Element labeled by another element                   | `<h2 id="title">Orders</h2><div aria-labelledby="title">...`           |
| `aria-describedby`   | Provide additional description                       | `<input aria-describedby="hint" /> <span id="hint">Min 8 chars</span>` |
| `aria-hidden="true"` | Hide decorative element from screen readers          | `<span aria-hidden="true">→</span>`                                    |
| `role="..." `        | Define element role (when semantic HTML unavailable) | `<div role="button">...`                                               |

## Touch Target Sizing

All interactive elements must have adequate size and spacing for touch devices.

### Standards & Recommendations

| Standard              | Size              | Platform | Notes                      |
| --------------------- | ----------------- | -------- | -------------------------- |
| **WCAG 2.1 (AAA)**    | 44×44px           | Web      | Official W3C standard      |
| **Material Design**   | 48×48 dp          | Android  | Google's official spec     |
| **Material Design**   | 44×44 pt          | iOS      | Apple's recommendation     |
| **Practical Balance** | 40×40px (icons)   | Mobile   | Common production standard |
| **Practical Balance** | 32×65px (buttons) | Mobile   | Text button with padding   |

### Key Principles

**Minimum touch area:**

- **Icons/Square buttons**: 40×40px (ideal) or 44×44px (WCAG standard)
- **Text buttons**: 32px height × 65px minimum width
- **Visual element** can be smaller; **touch area** is defined by padding

**Example:** Icon is 24×24px, but with padding it becomes 40×40px touch area

**Spacing between targets:**

- Minimum 8px horizontal and vertical spacing
- Prevents accidental touches of adjacent elements

### Mobile-First Responsive Sizes

Use Tailwind with responsive breakpoints:

```typescript
// ✅ Icon button: 40×40 on mobile, 36×36 on desktop
className = 'h-10 w-10 md:h-9 md:w-9';

// ✅ Text button: 32px height on mobile, 28px on desktop
className = 'h-8 md:h-7 px-4';

// ✅ Pagination button: 40×40 on mobile, 36×36 on desktop
className = 'h-10 w-10 md:h-9 md:w-9';
```

### Common Issues & Fixes

| Issue                 | Problem                | Fix                           |
| --------------------- | ---------------------- | ----------------------------- |
| Icon too small        | Touch target < 40px    | Add padding: `h-10 w-10 p-2`  |
| Button text cramped   | Height < 32px          | Use `h-8` minimum or `py-2`   |
| Elements too close    | Spacing < 8px          | Add `gap-2` between items     |
| Desktop looks bloated | Using 40×40 everywhere | Use responsive: `h-10 md:h-9` |

### Testing on Mobile

1. **Chrome DevTools**: Press `Ctrl+Shift+M` (Windows) or `Cmd+Shift+M` (Mac) for device emulation
2. **Inspect elements**: Right-click → Inspect, check computed height/width
3. **Tap test**: Try tapping elements with your finger (not mouse cursor)
4. **Lighthouse**: Run accessibility audit (Lighthouse tab in DevTools)

### ServeMate Implementation

**Critical components to check:**

- [Button.tsx](../../../src/shared/components/button/Button.tsx) - All button sizes
- [Pagination.tsx](../../../src/shared/components/pagination/Paginations.tsx) - Page numbers & nav
- [SearchButton.tsx](../../../src/features/search/ui/SearchButton.tsx) - Sort togglers
- [SearchChip.tsx](../../../src/features/search/ui/SearchChip.tsx) - Filter chips
- [Drawer close buttons](../../../src/shared/components/drawer/) - Exit actions

## Focus Management

For modals, dropdowns, and dynamic content, manage focus to keep keyboard users oriented.

### Modal Pattern

```typescript
const Modal = ({ isOpen, onClose, children }) => {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Save focus before opening
      previousFocusRef.current = document.activeElement;
      // Move focus into modal (first button)
      modalRef.current?.querySelector('button')?.focus();
    } else {
      // Restore focus when closing
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div role="dialog" ref={modalRef}>
      {children}
      <button onClick={onClose}>Close</button>
    </div>
  );
};
```

### Focus Trap Pattern

Prevent Tab from leaving a modal:

```typescript
const useFocusTrap = (ref) => {
	useEffect(() => {
		const element = ref.current;
		if (!element) return;

		const handleKeyDown = (e) => {
			if (e.key !== 'Tab') return;
			const focusableElements = element.querySelectorAll(
				'button, [href], input, [tabindex]:not([tabindex="-1"])',
			);
			const first = focusableElements[0];
			const last = focusableElements[focusableElements.length - 1];

			if (e.shiftKey && document.activeElement === first) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && document.activeElement === last) {
				e.preventDefault();
				first.focus();
			}
		};

		element.addEventListener('keydown', handleKeyDown);
		return () => element.removeEventListener('keydown', handleKeyDown);
	}, [ref]);
};
```

## Automated Auditing

Use these tools for automated accessibility checks:

### Chrome DevTools Lighthouse

1. Open Chrome DevTools (F12)
2. Go to **Lighthouse** tab
3. Check **"Accessibility"** checkbox
4. Click **"Analyze page load"**
5. Review report for issues and fixes

### WAVE Browser Extension

1. Install [WAVE browser extension](https://wave.webaim.org/extension/)
2. Click the WAVE icon on target page
3. Review icons for errors (red), warnings (yellow), features (green)

### Axe DevTools

1. Install [Axe DevTools extension](https://www.deque.com/axe/devtools/)
2. Right-click → **"Inspect with Axe DevTools"**
3. Run scan and fix reported violations

### Programmatic Testing

Run the [accessibility audit script](../scripts/a11y-audit.js) from this skill:

```bash
node scripts/a11y-audit.js ./src/features/orders/ui/OrderCard.tsx
```

## Common Fixes

### Fix: Custom Button Not Keyboard Accessible

```typescript
// ❌ Before
<div onClick={handleDelete} className="red-button">
  Delete
</div>

// ✅ After
<button
  onClick={handleDelete}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleDelete();
    }
  }}
  className="red-button"
>
  Delete
</button>
```

### Fix: Missing Focus Indicator

```css
/* ✅ Add visible focus ring */
button:focus {
	outline: 2px solid #0066cc;
	outline-offset: 2px;
}

/* Or use focus-visible for keyboard-only focus */
button:focus-visible {
	outline: 2px solid #0066cc;
	outline-offset: 2px;
}
```

### Fix: Modal Traps Keyboard

```typescript
// Handle Escape to close
<dialog
  onKeyDown={(e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }}
>
  {children}
</dialog>
```

## Verification Checklist

- [ ] All interactive elements reachable via Tab
- [ ] No keyboard traps
- [ ] Focus always visible
- [ ] Modal closes with Escape
- [ ] Forms have associated labels (`<label htmlFor="id">`)
- [ ] Images have alt text (or `alt=""` if decorative)
- [ ] Semantic HTML used (no `<div role="button">`)
- [ ] ARIA attributes used only when needed
- [ ] Focus management in modals/dropdowns
- [ ] **Icon buttons are 40×40px minimum** (or use `h-10 w-10` in Tailwind)
- [ ] **Text buttons are 32px high minimum** (or use `h-8` in Tailwind)
- [ ] **Touch elements have 8px spacing** between them
- [ ] **Responsive sizing applied** (smaller on desktop: `md:h-9 md:w-9`)
- [ ] Chrome Lighthouse Accessibility score **≥ 90**

## References

- [Google Web Accessibility Standards](https://www.google.com/accessibility/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN: Keyboard Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_custom_components)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
