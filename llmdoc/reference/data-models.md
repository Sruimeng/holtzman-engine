---
id: data-models
type: reference
---

# Data Models

## Types

### Core

```typescript
// app/constants/static/index.ts
type Noop = () => void;

// app/root.tsx
type Theme = 'light' | 'dark';
```

### Store

```typescript
// app/store/utils/utils.tsx
type Ref<T, U> = {
  state: T;
  actions: U;
};

type Store<StoreState, StoreType> = (
  set: SetState<StoreState>,
  get: GetState<StoreState>
) => StoreType;
```

## Enums

```typescript
// app/constants/static/enum.ts
enum Period {
  Monthly = 'monthly',
  Annually = 'annually',
}

// app/constants/static/storage.ts
enum Storage {
  UID = 't_uid',
}

enum CommonStorage {
  Signup = 't_signup',
  Login = 't_login',
  UserDetail = 't_user_detail',
  EuCookie = 't.cookieAccept',
  Comment = 't_comment',
}
```

## Constants

```typescript
// app/constants/static/storage.ts
const STORAGE_KEYS = {
  THEME: 'app_theme',
  LOCALE: 'app_locale',
} as const;

// app/constants/meta/env.ts
const isDEV: boolean;
const isSTAGING: boolean;
const isPROD: boolean;

// app/constants/meta/service.ts
const ApiURL: string;
const BaseUrl: string;
```

## i18n Config

```typescript
// app/locales/index.ts
const Lngs = [
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
  // ... 7 languages
];

const I18nConfig = {
  supportedLngs: string[];
  fallbackLng: 'en';
  defaultNS: 'common';
};

// Type augmentation
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: typeof resources['en'];
  }
}
```

## Store Pattern

```typescript
// Usage
const { Provider, useStore, useVanillaStore } = create('storeName', (set, get) => ({
  state: initialState,
  actions: {
    update: (value) => set({ state: value }),
  },
}));
```
