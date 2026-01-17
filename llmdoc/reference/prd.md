# PRD: Nexus Boardroom (Web Client)

## 1. 产品愿景 (Vision)

构建一个**“全息指挥舱”**。
它不是一个聊天软件，而是一个可视化的思维操作系统。用户通过控制终端（2D UI）操控量子核心（3D 场景），指挥多智能体（Agents）进行并发协作。

* **核心隐喻**: **控制终端 (HUD)** + **量子核心 (The Core)**。
* **关键体验**: 深度感、秩序感、并发可视化。

---

## 2. 技术栈架构 (Tech Stack)

* **Core Framework**: React 19 + TypeScript.
* **3D Engine**: React Three Fiber (R3F) + Drei (抽象组件库).
* **Styling**: Tailwind CSS (布局) + Framer Motion (2D 动效).
* **State Management**: Zustand (瞬时状态: 鼠标位置/Loading) + TanStack Query (服务端状态).
* **Persistence (关键)**: **Dexie.js** (IndexedDB Wrapper). *因后端无状态，前端必须作为唯一的真理来源 (Source of Truth)*.
* **Protocol**: Server-Sent Events (SSE) native implementation.

---

## 3. 界面规范 (UI Specification)

### 3.1 视觉语言：赛博极简 (Cyber-Minimalism)

* **材质**:
* **UI**: 深色磨砂玻璃 (Dark Frosted Glass)，带 1px 发光描边 (`box-shadow: 0 0 10px var(--agent-color)`).
* **3D**: 高透光学水晶 (Optical Crystal)，强调焦散 (Caustics) 和色散 (Dispersion)。


* **配色**:
* Background: Deep Void (`#0F172A`).
* Accent: Electric Blue (`#38BDF8`).
* Agents: Semantic Colors (Critic=Red, Pragmatist=Green, Historian=Amber).


* **字体**:
* HUD/Data: `JetBrains Mono`.
* Content: `Inter`.



---

## 4. 功能模块详解 (Functional Modules)

### 4.1 身份验证 (Auth & Entry)

**布局**: 分屏设计。

* **左侧 (40%) - 控制面板**:
* 磨砂玻璃容器。
* 表单交互：Input 聚焦时，边框流光动画。
* **Action**: Login/Register 调用后端 API 获取 JWT，存入 LocalStorage。


* **右侧 (60%) - 视窗 (Viewport)**:
* 显示 **3D 量子核心** (Idle 状态)。
* **Orbit**: 所有的 Agent 原石 (Tessaracts) 在远端轨道缓慢公转。


* **转场 (Transition)**:
* 登录成功 -> 左侧面板滑出 -> 摄像机 (Camera) 向核心推进 (Dolly In) -> 进入主界面 HUD 模式。



### 4.2 主界面框架 (Main HUD)

全屏覆盖，UI 悬浮于 3D Canvas 之上（`z-index` 管理）。

#### A. 侧边栏 (Sidebar - Left)

* **形态**: 窄条玻璃，鼠标 Hover 展开。
* **功能**:
* **Session List**: 读取 IndexedDB。选中项左侧显示发光光标。
* **User Profile**: 头像 + 状态。
* **System**: 设置入口 (I18n/Theme)。



#### B. 顶部导航 (Top Nav)

* **形态**: 顶部通栏玻璃条。
* **功能**:
* **Breadcrumbs**: 当前会话标题。
* **God Mode Toggle**: 点击展开“上帝模式”配置面板。



#### C. 底部控制台 (Console - Bottom)

* **形态**: 整合式底座。
* **功能**:
* **Input Area**: 支持多行文本。
* **Visualizer**: 输入框上方绘制 Canvas 简易波形，响应键盘敲击频率 (Keystroke velocity)。



### 4.3 3D 舞台系统 (The Stage System)

这是应用的核心。

#### 逻辑状态机

* **Orbit (待命)**: Agent 为小体积原石，绕核心公转。
* **Summon (召唤)**: 原石脱离轨道，飞向摄像机前方。
* **Active (激活)**: 原石展开为巨大的**水晶石碑 (Monolith)**，作为文字容器。
* **Dismiss (退场)**: 石碑折叠，飞回轨道。

#### 渲染逻辑

* **Monolith**: 使用 R3F `Text` 组件或 HTML Overlay 将文字投影在水晶表面。
* **Lighting**:
* 全局环境光 (HDRI)。
* **Spotlight**: 每一块激活的石碑上方有一盏聚光灯，灯光颜色匹配 Agent 身份（Critic=红光）。



### 4.4 对话引擎 (Chat Engine)

前端负责复杂的流式处理。

#### 流程

1. **Send**: 用户回车 -> 锁定 Input -> 顶部显示 "Director Scanning..."。
2. **Context Construction**:
* 从 IndexedDB 拉取最近 10 条记录。
* 读取 God Mode 配置。
* 打包 Payload 发送至 `/api/chat`。


3. **SSE Parsing**:
* `event: orchestration` -> 触发 3D 动画：对应的原石从 Orbit 飞入 Stage。
* `event: stream` -> 根据 `agent_id` 分流，追加文字到对应的石碑上。**必须支持多路并发写入**。


4. **Finish**: 解锁 Input。保存完整记录到 IndexedDB。

### 4.5 增强功能 (Enhancements)

#### A. 上帝模式 (God Mode)

* **UI**: 从顶部下滑的面板。
* **Controls**:
* **Persona Sliders**: 调整 Agent 性格参数 (e.g., Critic: Rational <-> Aggressive)。
* **Prompt Editor**: 允许硬核用户注入 System Prompt。


* **Persistence**: 配置跟随 Session 存储。

#### B. 多语言 (I18n)

* **Stack**: `i18next`.
* **交互**: 模态框选择。切换时触发全屏 "Glitch" (故障) 特效，文字瞬间重绘。

#### C. 主题切换 (Theme)

* **Dark (Default)**: Deep Void 背景，冷色光。
* **Light (Radiant)**:
* 背景变为纯净的“以太白” (Ethereal White)。
* UI 玻璃变亮。
* 3D 灯光色温调暖 (3000K -> 6000K)。



---

## 5. 数据结构 (Schema)

**IndexedDB (Dexie)**

```typescript
interface Session {
  id: string; // UUID
  title: string;
  createdAt: number;
  updatedAt: number;
  personaConfig: object; // 当前会话的上帝模式配置
}

interface Message {
  id: string; // UUID
  sessionId: string;
  role: 'user' | 'critic' | 'historian' | ...;
  content: string;
  timestamp: number;
  turnId: string; // 标识同一轮次的并发对话
}

```

---

## 6. 交互动效规范 (Interaction Specs)

* **Parallax (视差)**: 鼠标在屏幕移动时，3D 摄像机沿相反方向微动，UI 层与 3D 层移动速率不同 (z-depth 错觉)。
* **Hover Glow**: 鼠标悬停在 UI 按钮上时，对应的 3D 光源强度 +20%。
* **Typing Effect**: Agent 输出时，石碑表面有微弱的能量脉冲 (Pulse) 效果。

