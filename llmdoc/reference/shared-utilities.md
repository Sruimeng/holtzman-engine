---
id: shared-utilities
type: reference
---

# Shared Utilities

## Utils (`app/utils/`)

| Function | File | Signature |
|----------|------|-----------|
| `isInEU` | `cookie.ts` | `() => boolean` |
| `allowCookies` | `cookie.ts` | `() => boolean` |
| `isMobileDevice` | `utils.ts` | `(ua: string) => boolean` |
| `sleep` | `utils.ts` | `(ms: number) => Promise<void>` |
| `pf<T>` | `utils.ts` | `() => DeferredPromise<T>` |
| `jump` | `utils.ts` | `(url: string, blank?: boolean) => void` |
| `formatFileSize` | `utils.ts` | `(bytes: number, decimals?: number) => string` |
| `copy` | `utils.ts` | `(text: string) => Promise<void>` |
| `extractBVId` | `utils.ts` | `(url: string) => string \| null` |
| `extractVideoId` | `utils.ts` | `(url: string) => string \| null` |
| `videoUrlHandler` | `utils.ts` | `(url: string) => VideoInfo` |

### Storage (`app/utils/storage.ts`)

| Function | Scope | Signature |
|----------|-------|-----------|
| `setCommonStorage` | Global | `(key: string, value: any) => void` |
| `getCommonStorage<T>` | Global | `(key: string) => T \| null` |
| `removeCommonStorage` | Global | `(key: string) => void` |
| `setStorage` | User | `(key: string, value: any) => void` |
| `getStorage<T>` | User | `(key: string) => T \| null` |
| `removeStorage` | User | `(key: string) => void` |

## Hooks (`app/hooks/`)

| Hook | File | Purpose |
|------|------|---------|
| `useDebounce` | `debounce.ts` | Debounced callback (200ms) |
| `useThrottle` | `debounce.ts` | Throttled callback (100ms) |
| `useNavigateWithQuery` | `navigate.ts` | Navigate preserving query |
| `useLoadingRequest` | `request.ts` | Async with loading state |
| `useLoading` | `request.ts` | Simple loading wrapper |

## Components (`app/components/`)

| Component | File | Purpose |
|-----------|------|---------|
| `Canonical` | `canonical.tsx` | SEO canonical link |
| `Layout` | `layout.tsx` | App shell |
| `Header` | `layout.tsx` | Nav header |
| `DefaultErrorBoundary` | `error-boundary.tsx` | Route errors |
| `SafeErrorBoundary` | `error-boundary.tsx` | Class fallback |
| `FallbackErrorPage` | `error-boundary.tsx` | Static error |

## Don't Reinvent

Before creating new utilities, check:

1. `lodash-es` - Array/Object manipulation
2. `dayjs` - Date formatting
3. `app/utils/` - Project utilities
4. `app/hooks/` - Custom hooks
