---
id: system-overview
type: architecture
related_ids: [constitution, doc-standard, index]
---

# 📐 系统架构概览

> **项目名称**: react-router-v7-template  
> **类型**: React Router v7 + React 19 模板仓库  
> **状态**: ✅ 已清理完成，可用于新项目

## 1. 项目概述

```
PROJECT_TYPE: Template Repository
FRAMEWORK: React Router v7 (SSR/SPA Hybrid)
REACT_VERSION: 19.0.0
BUILD_TOOL: Vite 6.3.5
PACKAGE_MANAGER: pnpm 9.6.0
```

## 2. 项目结构

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
│   ├── locales/                # 国际化 (7 种语言)
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

## 3. 数据流架构

```
Browser -> entry.server.tsx (SSR) -> root.tsx (Layout)
                                        |
                                        v
                                   Routes (页面)
                                        |
                    +-------------------+-------------------+
                    |                   |                   |
                    v                   v                   v
                 Hooks              Store               Utils
              (useXxx)           (Zustand)           (工具函数)
                    |                   |
                    +-------------------+
                            |
                            v
                      Backend API
```

## 4. 技术栈

### 核心依赖

| 包名 | 版本 | 用途 |
|------|------|------|
| react | ^19.0.0 | UI 框架 |
| react-router | ^7.6.2 | 路由管理 |
| zustand | ^5.0.3 | 状态管理 |
| i18next | ^24.2.1 | 国际化 |
| zod | ^3.24.1 | 数据验证 |

### 开发依赖

| 包名 | 版本 | 用途 |
|------|------|------|
| vite | ^6.3.5 | 构建工具 |
| typescript | ^5.8.3 | 类型系统 |
| unocss | ^66.2.0 | 原子化 CSS |
| eslint | ^9.23.0 | 代码检查 |
| prettier | ^3.3.3 | 代码格式化 |

## 5. 模块职责

### Routes (路由页面)
- 位置: app/routes/
- 职责: 页面布局, loader/action

### Components (组件)
- 位置: app/components/
- 职责: 可复用 UI 组件

### Hooks (钩子)
- 位置: app/hooks/
- 职责: 状态逻辑封装

### Store (状态)
- 位置: app/store/
- 职责: 全局状态管理

### Utils (工具)
- 位置: app/utils/
- 职责: 纯函数工具

## ⛔ 禁止事项

- 🚫 不要在 Components 中直接调用 API
- 🚫 不要在 Routes 中定义可复用组件
- 🚫 不要跳过 loader/action 直接 fetch
- 🚫 不要在 Store 中存储可派生状态

## 相关文档

- [constitution.md](../reference/constitution.md)
- [doc-standard.md](../guides/doc-standard.md)
