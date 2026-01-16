---
id: constitution
type: reference
related_ids: [doc-standard, system-overview, index]
---

# 📜 Constitution - React Router v7 Template 项目宪法

> **项目名称**: react-router-v7-template  
> **类型**: React Router v7 + React 19 模板仓库  
> **状态**: ✅ 已清理完成，可用于新项目

## 1. 项目定位

```
TYPE: Template Repository
PURPOSE: 提供可复用的 React Router v7 项目起始结构
TARGET: 快速启动新的 SSR/SPA 混合应用
FEATURES:
  - 服务端渲染 (SSR)
  - 国际化 (7 种语言)
  - 主题切换
  - 状态管理 (Zustand)
  - 表单验证 (Zod + React Hook Form)
```

## 2. 技术栈规范

### 2.1 核心依赖

| 类别 | 选型 | 版本 |
|------|------|------|
| **框架** | React | ^19.0.0 |
| **路由** | React Router | ^7.6.2 |
| **构建工具** | Vite | ^6.3.5 |
| **语言** | TypeScript | ^5.8.3 |
| **样式** | UnoCSS | ^66.2.0 |
| **状态管理** | Zustand | ^5.0.3 |
| **国际化** | i18next + remix-i18next | ^24.2.1 |
| **表单** | React Hook Form + Zod | ^7.54.2 |
| **主题** | remix-themes | ^2.0.1 |

### 2.2 开发工具

| 工具 | 版本 | 用途 |
|------|------|------|
| ESLint | ^9.23.0 | 代码检查 |
| Prettier | ^3.3.3 | 代码格式化 |
| Stylelint | ^16.14.1 | 样式检查 |
| Husky | ^9.1.7 | Git Hooks |
| pnpm | 9.6.0 | 包管理器 |

## 3. 目录结构规范

```
react-router-v7-template/
├── app/                        # 应用源代码 (React Router v7 约定)
│   ├── entry.client.tsx        # 客户端入口
│   ├── entry.server.tsx        # 服务端入口 (SSR)
│   ├── root.tsx                # 根组件 (Layout)
│   ├── root.css                # 全局样式
│   ├── routes.ts               # 路由配置
│   │
│   ├── .server/                # 服务端专用代码
│   ├── components/             # 可复用组件
│   ├── constants/              # 常量配置
│   ├── hooks/                  # 自定义 Hooks
│   ├── locales/                # 国际化资源
│   ├── routes/                 # 路由页面
│   ├── store/                  # Zustand 状态管理
│   └── utils/                  # 工具函数
│
├── llmdoc/                     # LLM 文档中心
├── public/                     # 静态资源
├── package.json                # 依赖配置
├── vite.config.ts              # Vite 配置
├── uno.config.ts               # UnoCSS 配置
└── README.md                   # 项目说明
```

## 4. 编码规范

### 4.1 命名约定

```
RULE: File Naming
  - 组件文件: kebab-case (e.g., error-boundary.tsx, canonical.tsx)
  - 工具文件: kebab-case (e.g., cookie.ts, storage.ts)
  - Hook 文件: camelCase (e.g., debounce.ts, navigate.ts)
  - 常量文件: kebab-case (e.g., env.ts, service.ts)

RULE: Variable Naming
  - 组件: PascalCase (e.g., ErrorBoundary, Header)
  - 函数/变量: camelCase (e.g., useNavigateWithQuery)
  - 常量: UPPER_SNAKE_CASE (e.g., CDNBaseURL, ApiURL)
  - 类型/接口: PascalCase (e.g., RequestState, Period)
```

### 4.2 组件规范

```typescript
// ✅ 正确：函数组件 + TypeScript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {label}
    </button>
  );
}
```

### 4.3 状态管理规范

```typescript
// ✅ 正确：Zustand Store 结构
interface StoreState {
  // 状态
  count: number;
  // 动作
  increment: () => void;
  reset: () => void;
}

const useStore = create<StoreState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 }),
}));
```

### 4.4 路由规范 (React Router v7)

```typescript
// app/routes.ts - 文件路由配置
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/_index/route.tsx"),
  route("api/set-locale", "routes/api.set-locale/route.tsx"),
  route("api/set-theme", "routes/api.set-theme/route.tsx"),
  route("*", "routes/404/route.tsx"),
] satisfies RouteConfig;
```

## 5. 文档驱动开发 (Doc-Driven)

```
PRINCIPLE: 文档先于代码
  1. 在 llmdoc/reference/ 定义规范
  2. 在 llmdoc/architecture/ 设计架构
  3. 在 llmdoc/guides/ 编写开发指南
  4. 然后才编写代码

WORKFLOW:
  READ llmdoc/reference/constitution.md
  → DESIGN in llmdoc/architecture/
  → IMPLEMENT code
  → UPDATE llmdoc/guides/
```

## 6. 国际化规范

```
SUPPORTED_LANGUAGES:
  - en (English) - 默认
  - zh (中文)
  - ja (日本語)
  - ko (한국어)
  - es (Español)
  - pt (Português)
  - ru (Русский)

FILE_STRUCTURE:
  app/locales/{lang}/
    ├── common.json      # 通用文本
    └── error-toast.json # 错误提示

USAGE:
  import { useTranslation } from 'react-i18next';
  const { t } = useTranslation();
  t('common.key')
```

## ⛔ 禁止事项 (Do NOTs)

- 🚫 **不要**使用 `any` 类型，必须定义明确的类型
- 🚫 **不要**在组件中直接调用 API，使用 loader/action
- 🚫 **不要**使用 `var`，使用 `const` 或 `let`
- 🚫 **不要**在没有文档的情况下添加新功能
- 🚫 **不要**硬编码配置值，使用环境变量或配置文件
- 🚫 **不要**忽略 TypeScript 错误，必须修复
- 🚫 **不要**在 Store 中存储可派生的状态
- 🚫 **不要**跳过 loader/action 直接在组件中 fetch
- 🚫 **不要**添加业务特定代码到模板中

## 7. 版本控制规范

### 7.1 Commit Message 格式

```
TYPE(scope): description

TYPE:
  - feat: 新功能
  - fix: 修复 bug
  - docs: 文档更新
  - style: 代码格式 (不影响功能)
  - refactor: 重构
  - test: 测试相关
  - chore: 构建/工具相关

EXAMPLE:
  feat(auth): add login component
  fix(api): handle network timeout
  docs(readme): update installation guide
```

## 8. 相关文档

- 文档规范: [doc-standard.md](../guides/doc-standard.md)
- 系统概览: [system-overview.md](../architecture/system-overview.md)
- 技术债务: [technical-debt.md](./technical-debt.md)
