---
id: strategy-nexus-api-integration
type: strategy
version: 0.1.0
---

# Strategy: Nexus Design System API Integration

## 1. Analysis

**Context:**
- Custom components exist in `app/components/nexus/`
- Custom UnoCSS theme in `uno.config.ts` with project-specific tokens
- No `@sruim/nexus-design` dependency installed
- React Router app with `root.tsx` as entry

**Constitution:**
- React 19, UnoCSS, Zustand (Ref: existing stack)
- Hemingway Style: Terse, Type-First, No Fluff

**Style Protocol:** Strict Adherence to `llmdoc/reference/style-hemingway.md` (Iceberg Principle, No Fluff).

**Negative Constraints:**
- No duplicate theme tokens (merge, not replace)
- No breaking existing custom components
- No removing project-specific animations/shortcuts

## 2. Assessment

<Assessment>
**Complexity:** Level 2
</Assessment>

Rationale: Configuration + Import changes. No math/physics. Some component wrapping.

## 3. Integration Specification

<MathSpec>
```
1. Install: pnpm add @sruim/nexus-design
2. Theme: Merge(ProjectTheme, NexusTheme) -> uno.config.ts
3. Styles: Import('@sruim/nexus-design/style.css') -> root.tsx
4. Dialoger: Inject(<Dialoger />) -> root.tsx body
5. Components: Wrap/Replace as needed
```
</MathSpec>

## 4. The Plan

<ExecutionPlan>

**Block 1: Package Installation**
1. `pnpm add @sruim/nexus-design`

**Block 2: UnoCSS Theme Merge**
File: `/Users/mac/Desktop/project/Sruimeng/holtzman-engine/uno.config.ts`

1. Import nexus theme: `import { theme as nexusTheme } from '@sruim/nexus-design/theme'`
2. Spread nexus tokens into existing theme
3. Preserve project-specific: `agent-*`, `surface-*`, animations, shortcuts, rules

```typescript
theme: {
  ...nexusTheme,
  colors: {
    ...nexusTheme.colors,
    // Project overrides
    background: 'rgba(var(--color-background) / <alpha-value>)',
    // ... existing project tokens
  },
  animation: {
    ...nexusTheme.animation,
    keyframes: {
      ...nexusTheme.animation?.keyframes,
      // ... existing project keyframes
    },
  },
},
```

**Block 3: Root Setup**
File: `/Users/mac/Desktop/project/Sruimeng/holtzman-engine/app/root.tsx`

1. Add import: `import '@sruim/nexus-design/style.css'`
2. Add import: `import { Dialoger } from '@sruim/nexus-design/ui'`
3. Insert `<Dialoger />` before `</body>`

```tsx
<body className="select-none">
  <Outlet />
  <ScrollRestoration />
  <Scripts />
  <Dialoger />
</body>
```

**Block 4: Component Opportunities**
No immediate replacement required. Custom components serve specific purposes:

| Component | Status | Rationale |
|-----------|--------|-----------|
| `HoloCard` | KEEP | Custom agent visualization, no nexus equivalent |
| `CommandConsole` | KEEP | Custom input with spectrogram, no nexus equivalent |
| `ViewportLayers` | KEEP | Custom layered background system |
| `HudNav` | KEEP | Custom HUD navigation |
| `TopHud` | KEEP | Custom HUD header |
| `MobileNav` | EVALUATE | Could use `Drawer` from nexus |
| `Sidebar` | EVALUATE | Could use nexus primitives |

**Block 5: Future Component Usage**
When building new features, prefer nexus primitives:

- `Button` for actions
- `Dialog` / `Dialog.show()` for modals
- `Confirm.show()` for confirmations
- `Select` for dropdowns
- `Tabs` for tabbed content
- `Tooltip` for hints
- `Form` + `useForm` for forms
- `cn()` for class merging

</ExecutionPlan>

## 5. File Change List

| File | Action | Description |
|------|--------|-------------|
| `package.json` | MODIFY | Add `@sruim/nexus-design` |
| `uno.config.ts` | MODIFY | Merge nexus theme |
| `app/root.tsx` | MODIFY | Import styles, add Dialoger |

## 6. Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| Theme token collision | LOW | Spread nexus first, project overrides second |
| CSS specificity conflicts | LOW | Nexus uses scoped classes |
| Bundle size increase | LOW | Tree-shakeable exports |
| Breaking existing styles | MEDIUM | Test all pages after integration |

**Rollback:** Remove package, revert 3 files.
