---
id: style-hemingway
type: reference
priority: critical
---

# Hemingway Style Guide

## Core Principle

**Iceberg Theory**: Show 10%, imply 90%. Code speaks for itself.

## Rules

### 1. Be Ruthless

Cut anything that doesn't advance logic.

```typescript
// BAD
// This function checks if the user is authenticated
// and returns true if they are, false otherwise
function isAuthenticated(user: User): boolean {
  if (user.token) {
    return true;
  } else {
    return false;
  }
}

// GOOD
const isAuthenticated = (user: User) => Boolean(user.token);
```

### 2. Show, Don't Tell

Type definitions > Comments.

```typescript
// BAD
// User object with name and email
const user = { name: 'John', email: 'john@example.com' };

// GOOD
interface User {
  name: string;
  email: string;
}
```

### 3. Early Returns

Flatten conditionals.

```typescript
// BAD
function process(data: Data) {
  if (data) {
    if (data.valid) {
      return transform(data);
    }
  }
  return null;
}

// GOOD
function process(data: Data) {
  if (!data?.valid) return null;
  return transform(data);
}
```

### 4. No "What" Comments

Comments explain WHY, not WHAT.

```typescript
// BAD
// Loop through items
items.forEach(item => process(item));

// GOOD (no comment needed - code is clear)
items.forEach(process);

// GOOD (explains WHY)
// Skip first item - it's the header row
items.slice(1).forEach(process);
```

### 5. Newspaper Structure

Important stuff at top. Details below.

```typescript
// File structure:
// 1. Types/Interfaces
// 2. Constants
// 3. Main export
// 4. Helper functions
```

## Forbidden Patterns

| Pattern | Why |
|---------|-----|
| `AbstractManagerImpl` | Bureaucratic naming |
| Deep nesting (>3 levels) | Hard to read |
| `// This function...` | "What" comment |
| `else { return false }` | Verbose boolean |
| Unused parameters | Dead code |

## Metrics

- Max nesting: 3 levels
- Max function length: 20 lines
- Max file length: 200 lines
- Comments ratio: <10%
