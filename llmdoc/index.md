---
id: index
type: overview
related_ids: [constitution, system-overview, doc-standard, technical-debt]
---

# 📚 React Router v7 Template 文档中心

> **项目名称**: react-router-v7-template  
> **类型**: React Router v7 + React 19 模板仓库  
> **状态**: ✅ 已清理完成，可用于新项目

## 🗂️ 文档导航

### 📐 架构文档 (Architecture)

| 文档 | 描述 |
|------|------|
| [`system-overview.md`](./architecture/system-overview.md) | 系统架构概览与模块职责 |

### 📖 开发指南 (Guides)

| 文档 | 描述 |
|------|------|
| [`doc-standard.md`](./guides/doc-standard.md) | LLMDoc 文档规范 |

### 📋 参考规范 (Reference)

| 文档 | 描述 |
|------|------|
| [`constitution.md`](./reference/constitution.md) | 项目宪法 - 编码规范与技术栈 |
| [`technical-debt.md`](./reference/technical-debt.md) | 🏥 技术债务报告 - 已清理完成 |

## 🏗️ 项目结构

```
react-router-v7-template/
├── app/                        # 应用源代码
│   ├── entry.client.tsx        # 客户端入口
│   ├── entry.server.tsx        # 服务端入口
│   ├── root.tsx                # 根组件
│   ├── root.css                # 全局样式
│   ├── routes.ts               # 路由配置
│   ├── .server/                # 服务端专用代码
│   ├── components/             # 可复用组件
│   ├── constants/              # 常量配置
│   ├── hooks/                  # 自定义 Hooks
│   ├── locales/                # 国际化 (7 种语言)
│   ├── routes/                 # 路由页面
│   ├── store/                  # Zustand 状态管理
│   └── utils/                  # 工具函数
├── llmdoc/                     # LLM 文档中心
├── package.json                # 依赖配置
├── vite.config.ts              # Vite 配置
├── uno.config.ts               # UnoCSS 配置
└── README.md                   # 项目说明
```

## 🚀 快速开始

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建生产版本
pnpm build-production

# 构建测试版本
pnpm build-staging

# 类型检查
pnpm typecheck

# 代码检查
pnpm lint
```

## 📦 技术栈

### 核心依赖

| 包名 | 版本 | 用途 |
|------|------|------|
| `react` | ^19.0.0 | UI 框架 |
| `react-router` | ^7.6.2 | 路由管理 |
| `zustand` | ^5.0.3 | 状态管理 |
| `i18next` | ^24.2.1 | 国际化 |
| `zod` | ^3.24.1 | 数据验证 |

### 开发工具

| 包名 | 版本 | 用途 |
|------|------|------|
| `vite` | ^6.3.5 | 构建工具 |
| `typescript` | ^5.8.3 | 类型系统 |
| `unocss` | ^66.2.0 | 原子化 CSS |
| `eslint` | ^9.23.0 | 代码检查 |
| `prettier` | ^3.3.3 | 代码格式化 |

## 📝 文档更新日志

| 日期 | 变更 |
|------|------|
| 2026-01-07 | 完成技术债务清理，模板已纯洁化 |
| 2026-01-07 | 更新文档反映实际项目结构 |
| 2026-01-07 | 创建 [`technical-debt.md`](./reference/technical-debt.md) 技术债务报告 |
| 2026-01-07 | 创建 [`constitution.md`](./reference/constitution.md) 项目宪法 |
| 2026-01-07 | 创建 [`system-overview.md`](./architecture/system-overview.md) 系统架构 |

## 🔗 相关链接

- 项目宪法: [`constitution.md`](./reference/constitution.md)
- 系统架构: [`system-overview.md`](./architecture/system-overview.md)
- 文档规范: [`doc-standard.md`](./guides/doc-standard.md)
- 技术债务: [`technical-debt.md`](./reference/technical-debt.md)