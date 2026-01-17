---
id: frontend-integration
type: how_to
title: 前端接入指南
---

# Auth SDK 前端接入指南

## 概述

基于 Email Magic Link 的无密码认证系统。用户通过邮箱接收登录链接，点击后自动完成认证。

**Base URL:** `https://auth.sruim.xin`

## API 接口

### 1. 请求登录

```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "redirect_uri": "https://app.sruim.xin/dashboard",  // 可选
  "product": "ephemera"  // 可选: "ephemera" | "maxell" | null
}
```

**响应:**
- `200 OK` - 邮件已发送
- `502 Bad Gateway` - 邮件服务不可用

**说明:**
- `redirect_uri`: 验证成功后的跳转地址。未传则使用默认地址。
- `product`: 邮件模板标识。影响邮件主题、logo、配色。未传则使用默认模板。

**可用产品:**

| product | 产品名 | 邮件主题 | Logo | 主题色 |
|---------|-------|---------|------|--------|
| `"ephemera"` | Ephemera | 登录 Ephemera | https://ephemera.sruim.xin/logo.png | #6366f1 |
| `"maxell"` | Maxell | 登录 Maxell | https://maxell.sruim.xin/logo.png | #0ea5e9 |
| `null` | Sruim | 登录验证 | https://sruim.xin/logo.png | #18181b |

### 2. 验证 Token (用户点击邮件链接)

```
GET /auth/verify?token=xxx
```

**响应:**
- `302 Redirect` - 验证成功，重定向到 `redirect_uri`
- `401 Unauthorized` - Token 无效或过期

**自动行为:** 设置 HttpOnly Cookie，前端无需处理。

### 3. 获取当前用户

```
GET /auth/me
```

**响应:**
```json
// 200 OK - 已登录
{
  "id": 1,
  "email": "user@example.com",
  "created_at": "2026-01-16T06:00:00Z"
}

// 401 Unauthorized - 未登录
```

### 4. 登出

```
POST /auth/logout
```

**响应:**
- `200 OK` - 登出成功

## 前端集成

### 核心要点

1. **所有请求必须携带 Cookie**
```javascript
fetch(url, { credentials: 'include' })
```

2. **跨域配置 (如果前端域名不同)**
```javascript
// 前端: app.sruim.xin
// 后端: auth.sruim.xin
// 同一主域名下的子域名，Cookie 可共享
```

### 完整示例

```javascript
const AUTH_BASE = 'https://auth.sruim.xin';

// 认证服务类
class AuthService {
  // 检查登录状态
  async getUser() {
    const res = await fetch(`${AUTH_BASE}/auth/me`, {
      credentials: 'include'
    });
    if (!res.ok) return null;
    return res.json();
  }

  // 请求登录 (发送 Magic Link 邮件)
  async login(email, redirectUri, product) {
    const res = await fetch(`${AUTH_BASE}/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        redirect_uri: redirectUri || window.location.href,
        product
      })
    });
    return res.ok;
  }

  // 登出
  async logout() {
    await fetch(`${AUTH_BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
  }
}

const auth = new AuthService();
```

### React 集成示例

```jsx
import { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auth.getUser()
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, product) => {
    const success = await auth.login(email, null, product);
    if (success) {
      alert('验证邮件已发送，请查收邮箱');
    }
    return success;
  };

  const logout = async () => {
    await auth.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

```jsx
// 使用示例
function App() {
  const { user, loading, login, logout } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <LoginForm onSubmit={login} />;
  }

  return (
    <div>
      <p>Welcome, {user.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Vue 集成示例

```javascript
// composables/useAuth.js
import { ref, onMounted } from 'vue';

const user = ref(null);
const loading = ref(true);

export function useAuth() {
  onMounted(async () => {
    user.value = await auth.getUser();
    loading.value = false;
  });

  const login = async (email, product) => {
    return auth.login(email, null, product);
  };

  const logout = async () => {
    await auth.logout();
    user.value = null;
  };

  return { user, loading, login, logout };
}
```

## 认证流程

```
┌─────────────┐     POST /auth/login      ┌─────────────┐
│   前端页面   │ ──────────────────────────▶│  Auth 服务   │
│             │     { email, redirect }   │             │
└─────────────┘                           └──────┬──────┘
                                                 │
                                                 │ 发送邮件
                                                 ▼
                                          ┌─────────────┐
                                          │   用户邮箱   │
                                          └──────┬──────┘
                                                 │
                                                 │ 点击链接
                                                 ▼
┌─────────────┐     302 Redirect          ┌─────────────┐
│   前端页面   │ ◀──────────────────────────│  Auth 服务   │
│ (redirect)  │     + Set-Cookie          │ /auth/verify│
└──────┬──────┘                           └─────────────┘
       │
       │ 页面加载后
       │ GET /auth/me
       ▼
┌─────────────┐
│  显示用户态  │
└─────────────┘
```

## 常见问题

### Q: 为什么 /auth/me 返回 401？

1. Cookie 未携带 - 检查 `credentials: 'include'`
2. Session 过期 - 默认 7 天有效
3. 跨域问题 - 确保同一主域名

### Q: 登录和注册是同一个接口吗？

是。系统自动处理：
- 邮箱存在 → 登录
- 邮箱不存在 → 自动注册并登录

### Q: Token 有效期多久？

Magic Link Token: 15 分钟
Session Cookie: 7 天

### Q: 如何处理多个子应用的 SSO？

所有 `*.sruim.xin` 子域名共享 Cookie。用户在任一子应用登录后，其他子应用自动识别。

## 错误处理

| HTTP 状态码 | 含义 | 处理方式 |
|------------|------|---------|
| 200 | 成功 | 继续流程 |
| 401 | 未认证 | 跳转登录页 |
| 502 | 邮件服务故障 | 提示用户稍后重试 |

## 安全说明

- Cookie 设置 `HttpOnly`，JavaScript 无法读取
- Cookie 设置 `SameSite=Lax`，防止 CSRF
- Magic Link 单次有效，验证后立即失效
- Token 使用 256-bit 随机数，不可预测
