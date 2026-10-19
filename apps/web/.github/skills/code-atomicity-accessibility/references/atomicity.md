# Code Atomicity Reference Guide

Verify that code follows single responsibility, best practices, compound components, and FSD paradigm without side effects.

## FSD Structure

ServeMate uses Feature-Sliced Design. Each domain should follow this layout:

```
src/features/{domain}/
├── api/              # API clients, endpoints
├── hooks/            # Custom hooks (useGetX, useXState)
├── ui/               # UI components
├── utils/            # Domain utilities
├── model/            # Domain models, types
└── store/            # Zustand stores (if needed)
```

**Verify**: When adding files, do they go in the right slice? Should it be in `shared/` instead?

### Anti-Patterns

❌ Business logic in components  
❌ Multiple responsibilities in a single hook  
❌ Direct API calls in UI components (should use hooks)  
❌ Utility functions in `ui/` folder (should be in `utils/`)

## Single Responsibility Principle

Each file should have **exactly one reason to change**.

### Functions

```typescript
// ✅ Good: Single responsibility
export const parseOrderSearchCriteria = (params: unknown) => {
  return OrderSearchSchema.parse(params);
};

// ❌ Bad: Multiple responsibilities (parsing + fetching + caching)
export const getOrdersWithCache = async (criteria) => {
  const parsed = OrderSearchSchema.parse(criteria);
  const data = await fetch(...);
  const cached = new Map();
  return cached.set(parsed, data);
};
```

### Hooks

```typescript
// ✅ Good: Single responsibility
export const useGetOrders = () => {
  const [criteria, setCriteria] = useState(...);
  return useQuery(...);
};

// ❌ Bad: Multiple responsibilities (data fetching + UI state + form logic)
export const useOrdersComponent = () => {
  const orders = useQuery(...);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({...});
  const handleSubmit = async (...) => {...};
  return { orders, isModalOpen, formData, ... };
};
```

## Compound Components

Break large components into smaller, composable parts.

### Pattern

```typescript
// ✅ Good: Compound component pattern
export const OrderCard = {
  Container: ({ children }) => <div className="card">{children}</div>,
  Header: ({ title }) => <h3>{title}</h3>,
  Body: ({ children }) => <div className="body">{children}</div>,
  Footer: ({ children }) => <div className="footer">{children}</div>,
};

// Usage:
<OrderCard.Container>
  <OrderCard.Header title="Order #123" />
  <OrderCard.Body>Details</OrderCard.Body>
  <OrderCard.Footer>Actions</OrderCard.Footer>
</OrderCard.Container>

// ❌ Bad: Monolithic component with many props
<OrderCard
  title="Order #123"
  headerClassName="..."
  bodyClassName="..."
  footerClassName="..."
  showHeader={true}
  showFooter={true}
  // ... 10 more props
/>
```

**Verify Checklist**:
- [ ] Component has <10 props (if more, consider compound pattern)
- [ ] Each part has a single, clear purpose
- [ ] Parts are testable independently
- [ ] Composition is flexible and intuitive

## No Side Effects

Functions should not:
- Modify global state
- Make API calls (unless in hooks/actions)
- Write to localStorage (unless in hooks with explicit intent)
- Mutate arguments

### Examples

```typescript
// ✅ Good: Pure function
export const filterOrders = (orders, criteria) => {
  return orders.filter(order => order.status === criteria.status);
};

// ❌ Bad: Side effect (modifies argument)
export const filterOrders = (orders, criteria) => {
  orders.forEach(order => {
    order.filtered = order.status === criteria.status;
  });
  return orders;
};

// ❌ Bad: Side effect (localStorage)
export const saveUserPreference = (key, value) => {
  localStorage.setItem(key, value); // Should be in a hook/action
};
```

## Dependency Analysis

Before committing, check:
1. **Import chains**: Do functions import from circular paths?
2. **External calls**: Are API calls only in hooks/actions?
3. **Store usage**: Is Zustand only in hooks or components?

Run `analyze-dependencies.js` script to detect these automatically.

## Verification Checklist

- [ ] Files follow FSD structure (correct folder, not scattered)
- [ ] Functions have single responsibility
- [ ] No side effects outside of hooks/actions
- [ ] Compound components are properly composed
- [ ] TypeScript types are specific (no `any`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Dependencies are not circular
