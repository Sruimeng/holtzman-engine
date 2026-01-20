---
id: strategy-campaign-nexus-update
type: strategy
version: "1.0.0"
created: 2026-01-20
related_ids: [strategy-nexus-refactor, constitution, style-hemingway]
---

# Strategy: Nexus Design System Migration Campaign

## Mission

Migrate 8 component files + 2 route files to unified nexus-design system.

**Scope:**
- Replace raw `<button>` with `Button` / `IconButton`
- Unify icons to `<Icon icon="i-carbon-*" />`
- Replace manual class merging with `cn()`
- Preserve project-specific `GLASS` constant

---

## Shared Rules (All Blocks)

<Constitution>
**Color Semantics:**
- Canvas: `bg-slate-950`
- Glass: `bg-slate-900/40 backdrop-blur-xl` (PRESERVE - project-specific)
- Border: `border-white/10`
- Accent: `text-cyan-400`, `border-cyan-500/50`

**Component Mapping:**
| Old | New |
|-----|-----|
| `<button>` | `<Button>` or `<IconButton>` |
| `<Icon icon="mdi:*">` | `<Icon icon="i-carbon-*" />` |
| `<span className="iconify carbon:*">` | `<Icon icon="i-carbon-*" />` |
| `<span className="i-carbon-*">` | `<Icon icon="i-carbon-*" />` |
| `[...].join(' ')` | `cn(...)` |

**Icon Mapping (MDI -> Carbon):**
| MDI | Carbon |
|-----|--------|
| `mdi:clock-outline` | `i-carbon-time` |
| `mdi:signal-cellular-2` | `i-carbon-wifi` |
| `mdi:pound` | `i-carbon-hashtag` |
| `mdi:account` | `i-carbon-user-avatar` |
| `mdi:cog` | `i-carbon-settings` |
| `carbon:chat` | `i-carbon-chat` |
| `carbon:ai-status` | `i-carbon-ai-status` |
| `carbon:settings` | `i-carbon-settings` |
| `carbon:close` | `i-carbon-close` |
| `carbon:logout` | `i-carbon-logout` |
| `carbon:chevron-down` | `i-carbon-chevron-down` |
</Constitution>

<StyleProtocol>
**Reference:** `llmdoc/reference/style-hemingway.md`

**Rules:**
1. Max Nesting: 3 levels
2. Max Function: 20 lines
3. Early Returns over nested if-else
4. Type-First (interfaces before logic)
5. No "What" comments

**Forbidden:**
- Deep nesting (>3 levels)
- `[...].join(' ')` for class merging (use `cn()`)
- Inline icon class strings (use `<Icon>`)
- `@iconify/react` imports (use nexus-design)
</StyleProtocol>

---

## Assessment

<Assessment>
**Complexity:** Level 2 (Systematic Refactor)
**Risk:** Low (API replacement, no logic changes)
**Dependencies:** nexus-design package must export `Button`, `IconButton`, `Icon`, `cn`
</Assessment>

---

## Execution Blocks

### Block A: Sidebar + StatusHud (iconify/react)

**Files:**
1. `/Users/mac/Desktop/project/Sruimeng/holtzman-engine/app/components/nexus/sidebar.tsx`
2. `/Users/mac/Desktop/project/Sruimeng/holtzman-engine/app/components/nexus/status-hud.tsx`

**Current State:**
- Uses `import { Icon } from '@iconify/react'`
- Uses `<Icon icon="mdi:*" />`
- Manual class concatenation with template literals

**Imports to Add:**
```typescript
import { Icon, Button, IconButton, cn } from 'nexus-design';
```

**Imports to Remove:**
```typescript
import { Icon } from '@iconify/react';
```

**Replacements:**

| File | Line | Old | New |
|------|------|-----|-----|
| sidebar.tsx | 30 | `<Icon icon="mdi:account">` | `<Icon icon="i-carbon-user-avatar">` |
| sidebar.tsx | 84 | `<Icon icon="mdi:cog">` | `<Icon icon="i-carbon-settings">` |
| sidebar.tsx | 49-72 | `<button>` (session) | `<Button variant="ghost">` |
| sidebar.tsx | 79-89 | `<button>` (settings) | `<Button variant="ghost">` |
| status-hud.tsx | 36 | `<Icon icon="mdi:clock-outline">` | `<Icon icon="i-carbon-time">` |
| status-hud.tsx | 48 | `<Icon icon="mdi:signal-cellular-2">` | `<Icon icon="i-carbon-wifi">` |
| status-hud.tsx | 53 | `<Icon icon="mdi:pound">` | `<Icon icon="i-carbon-hashtag">` |

**Class Merging:**
```typescript
// Before
className={`group flex items-center ${s.active ? 'bg-white/10' : ''}`}

// After
className={cn('group flex items-center', s.active && 'bg-white/10')}
```

**Preserve:**
- `GLASS` constant definition (project-specific)

---

### Block B: HudNav + CommandConsole (no icons)

**Files:**
1. `/Users/mac/Desktop/project/Sruimeng/holtzman-engine/app/components/nexus/hud-nav.tsx`
2. `/Users/mac/Desktop/project/Sruimeng/holtzman-engine/app/components/nexus/command-console.tsx`

**Current State:**
- No icon imports
- Uses `[...].join(' ')` for class merging
- Raw `<button>` elements

**Imports to Add:**
```typescript
import { Button, cn } from 'nexus-design';
```

**Replacements:**

| File | Line | Old | New |
|------|------|-----|-----|
| hud-nav.tsx | 37-47 | `<button>` (locale) | `<Button variant="ghost" size="sm">` |
| hud-nav.tsx | 50-66 | `<button>` (avatar) | `<IconButton variant="ghost">` |
| hud-nav.tsx | 78-86 | `<button>` (logout) | `<Button variant="danger">` |
| command-console.tsx | 166-178 | `<button>` (ABORT) | `<Button variant="danger" size="sm">` |

**Class Merging:**
```typescript
// Before (hud-nav.tsx:39-44)
className={[
  GLASS,
  'px-3 py-1.5 rounded-lg',
  'hover:border-cyan-500/50',
].join(' ')}

// After
className={cn(GLASS, 'px-3 py-1.5 rounded-lg hover:border-cyan-500/50')}
```

**Preserve:**
- `GLASS` constant
- `SphericalSpectrogram` component (custom canvas)

---

### Block C: MobileNav (iconify CSS class)

**Files:**
1. `/Users/mac/Desktop/project/Sruimeng/holtzman-engine/app/components/nexus/mobile-nav.tsx`

**Current State:**
- Uses `<span className="iconify carbon:*">` pattern
- Uses `[...].join(' ')` for class merging

**Imports to Add:**
```typescript
import { Icon, Button, cn } from 'nexus-design';
```

**Replacements:**

| Line | Old | New |
|------|-----|-----|
| 43 | `<span className="iconify ${tab.icon}">` | `<Icon icon="i-${tab.icon.replace(':', '-')}">` |
| 61 | `<span className="iconify carbon:close">` | `<Icon icon="i-carbon-close">` |
| 87 | `<span className="iconify carbon:logout">` | `<Icon icon="i-carbon-logout">` |

**TABS Constant Update:**
```typescript
// Before
const TABS = [
  { id: 'chat', icon: 'carbon:chat', label: 'Chat' },
  { id: 'agents', icon: 'carbon:ai-status', label: 'Agents' },
  { id: 'settings', icon: 'carbon:settings', label: 'Settings' },
];

// After
const TABS = [
  { id: 'chat', icon: 'i-carbon-chat', label: 'Chat' },
  { id: 'agents', icon: 'i-carbon-ai-status', label: 'Agents' },
  { id: 'settings', icon: 'i-carbon-settings', label: 'Settings' },
];
```

**Button Replacements:**
- Line 35-46: Tab buttons -> `<Button variant="ghost">`
- Line 57-60: Close button -> `<IconButton icon="i-carbon-close">`
- Line 71-78: Settings buttons -> `<Button variant="ghost">`
- Line 85-88: Disconnect button -> `<Button variant="danger">`

---

### Block D: TopHud (UnoCSS icons)

**Files:**
1. `/Users/mac/Desktop/project/Sruimeng/holtzman-engine/app/components/nexus/top-hud.tsx`

**Current State:**
- Uses `<span className="i-carbon-*">` (UnoCSS icon class)
- Raw `<button>` elements
- No class merging utility

**Imports to Add:**
```typescript
import { Icon, Button, IconButton, cn } from 'nexus-design';
```

**Replacements:**

| Line | Old | New |
|------|-----|-----|
| 104 | `<span className="i-carbon-chevron-down">` | `<Icon icon="i-carbon-chevron-down">` |
| 124 | `<span className="i-carbon-settings">` | `<Icon icon="i-carbon-settings">` |
| 128 | `<span className="i-carbon-time">` | `<Icon icon="i-carbon-time">` |
| 133 | `<span className="i-carbon-logout">` | `<Icon icon="i-carbon-logout">` |

**Button Replacements:**
- Line 45-53: EN button -> `<Button variant="ghost" size="sm">`
- Line 57-65: ZH button -> `<Button variant="ghost" size="sm">`
- Line 70-108: User capsule -> `<Button variant="ghost">`
- Line 123-126: Settings menu item -> `<Button variant="ghost">`
- Line 127-130: History menu item -> `<Button variant="ghost">`
- Line 132-135: Disconnect -> `<Button variant="danger">`

---

### Block E: Routes

**Files:**
1. `/Users/mac/Desktop/project/Sruimeng/holtzman-engine/app/routes/_index.tsx`
2. `/Users/mac/Desktop/project/Sruimeng/holtzman-engine/app/routes/404/route.tsx`

**_index.tsx:**

**Current State:**
- Uses `<span className="i-carbon-ai-status">` in EmptyState
- No button replacements needed (uses nexus components)

**Imports to Add:**
```typescript
import { Icon } from 'nexus-design';
```

**Replacements:**

| Line | Old | New |
|------|-----|-----|
| 22 | `<span className="i-carbon-ai-status inline-block">` | `<Icon icon="i-carbon-ai-status" className="inline-block">` |

**404/route.tsx:**

**Current State:**
- Uses `DefaultErrorBoundary` component
- No changes needed (no icons/buttons)

**Action:** Skip - no nexus-design elements to migrate.

---

## Verification Checklist

### Per-Block Verification

| Block | Files | Icons | Buttons | cn() |
|-------|-------|-------|---------|------|
| A | sidebar, status-hud | 5 | 3 | 2 |
| B | hud-nav, command-console | 0 | 5 | 4 |
| C | mobile-nav | 5 | 6 | 2 |
| D | top-hud | 4 | 6 | 3 |
| E | _index | 1 | 0 | 0 |

### Global Checks

- [ ] No `@iconify/react` imports remain
- [ ] No `iconify` CSS class pattern remains
- [ ] No `[...].join(' ')` for class merging
- [ ] All `GLASS` constants preserved
- [ ] TypeScript compiles without errors
- [ ] Visual regression: icons render correctly
- [ ] Visual regression: buttons maintain styling

---

## Execution Order

```
Block A (sidebar, status-hud)
    |
    v
Block B (hud-nav, command-console)
    |
    v
Block C (mobile-nav)
    |
    v
Block D (top-hud)
    |
    v
Block E (_index)
    |
    v
[Verification]
```

**Rationale:**
- A first: highest icon density, validates mapping
- B second: no icons, validates Button/cn patterns
- C third: different icon syntax (iconify CSS)
- D fourth: UnoCSS icon syntax
- E last: minimal changes, route-level

---

## Notes

**Prerequisite:**
Verify nexus-design exports before execution:
```typescript
// Expected exports from nexus-design
export { Button, IconButton } from './components/Button';
export { Icon } from './components/Icon';
export { cn } from './utils';
```

**Fallback:**
If nexus-design package incomplete, create local wrappers in `app/components/nexus/primitives/`.
