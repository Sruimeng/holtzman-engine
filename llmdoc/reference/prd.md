# Product Requirement Document (PRD)

## Project: Nexus Boardroom (Holographic Agent Interface)

| 文档信息 | 内容 |
| --- | --- |
| **版本号** | v2.1 (Release Candidate) |
| **状态** | 待评审 (Pending Review) |
| **撰写人** | Senior PM |
| **涉及端** | Web Frontend (React), Mobile H5 |
| **核心目标** | 打造沉浸式多智能体协作界面，通过可视化交互降低用户理解复杂 AI 逻辑的门槛。 |

---

## 1. 背景与价值 (Context & Value)

### 1.1 用户痛点 (Pain Points)

* **黑盒焦虑**: 传统 Chatbot 单一输出，用户不知道 AI 是如何得出结论的。
* **信息单调**: 缺乏多视角（正方/反方）辩论，决策支持能力弱。
* **视觉疲劳**: 现有的 AI 界面多为枯燥的文字流，缺乏科技感和沉浸感。

### 1.2 解决方案 (Solution)

构建 "Nexus Boardroom"，一个**伪 3D 全息会议室**。用户输入指令后，系统动态召唤不同性格的 AI 智能体（Agent）上台，以卡片对决的形式实时生成内容，并展示思考过程的“心跳”波形。

### 1.3 核心指标 (Success Metrics)

* **交互完成率**: 用户发起 Query 到所有 Agent 输出完毕且无中断的比例 > 95%。
* **平均会话时长**: 用户在“全息界面”停留时间 > 3分钟/次。
* **分享率**: 用户截图或点击分享按钮的比例（依赖高颜值 UI）。

---

## 2. 功能范围 (Scope - MoSCoW)

* **Must-Have (P0)**:
* 全息玻璃拟态 UI (5层 Z轴深度)。
* 多 Agent SSE 流式并发输出。
* 动态波形图 (Audio Visualizer)。
* 移动端响应式适配（降级体验）。


* **Should-Have (P1)**:
* 打字机光标动效与声效。
* Agent 卡片的手动展开/收起。
* Markdown 代码高亮与表格渲染。


* **Could-Have (P2)**:
* 用户自定义 Agent 主题色。
* 会话历史记录侧边栏。


* **Won't-Have (v1.0)**:
* Agent 之间的语音对话功能。
* 3D 模型渲染 (仅用 CSS 伪 3D)。



---

## 3. 详细功能说明 (Functional Specifications)

### 3.1 核心舞台与 Agent 编排 (The Stage)

**用户故事**: 作为用户，我发出指令后，希望看到系统自动选择最合适的专家 Agent 来回答，而不是千篇一律的回复。

* **逻辑流程**:
1. 监听 SSE `meta` 事件，获取 `agent_list`。
2. 根据 Agent 数量动态调整 Grid 布局（1列、2列或田字格）。
3. **动效**: 卡片需带有 `Entrance Animation`（弹簧效果从底部弹出）。


* **异常处理**:
* **超时**: 若 10s 内无 meta 事件，显示 Toast "Neural Link Unstable"，并显示重试按钮。
* **空状态**: 若返回空列表，默认召唤 "System Agent" 兜底。



### 3.2 全息卡片交互 (Holo-Card Interaction)

**用户故事**: 在 Agent 生成内容时，我希望能流畅阅读，且清楚知道哪个 Agent 正在“思考”。

* **状态定义**:
| 状态 | 视觉表现 | 触发条件 |
| :--- | :--- | :--- |
| **Idle** | 透明度 60%，无边框光效 | 初始化或非活跃 |
| **Thinking** | 骨架屏闪烁，顶部显示 "Analyzing..." | 收到 meta 但未收到 stream |
| **Streaming** | 透明度 100%，边框高亮，光标跳动 | 正在接收 stream delta |
| **Error** | 边框变红，卡片变灰 | 收到 stream_error |
* **智能滚动逻辑 (Smart Scroll)**:
* 若用户滚动条在底部 -> 随内容生成自动滚动。
* 若用户手动向上滚动查看历史 -> **暂停自动滚动**，仅显示 "New content ↓" 悬浮提示。



### 3.3 底部控制台 (Command Console)

**组件**: 输入框 + 频谱仪 (Visualizer)。

* **输入框逻辑**:
* Enter 发送，Shift+Enter 换行。
* 发送后 Input 变为 `Disabled` 状态，Placeholder 变为 "Transmission in progress..."。
* 增加 "Stop" 按钮（仅在生成时出现），点击后断开 SSE 连接。


* **频谱仪 (Visualizer)**:
* **Idle**: 低频正弦波 (模拟呼吸)。
* **Busy**: 根据生成的 token 速率模拟高频波动 (伪随机高度)。



---

## 4. 非功能性需求 (Non-Functional Requirements)

### 4.1 性能要求 (Performance)

* **帧率 (FPS)**: 在 MacBook Air (M1) 及以上设备保持 60fps。
* **降级策略 (Graceful Degradation)**:
* 检测到 GPU 性能低（通过 `requestAnimationFrame` 采样）或移动端设备时：
* 关闭 `backdrop-filter: blur`。
* 移除背景视频层 (L0)，改为静态渐变图。
* 简化粒子特效。





### 4.2 响应式设计 (Responsive)

* **Desktop (>1024px)**: 完整全息体验，双栏布局。
* **Tablet (768px - 1024px)**: 侧边栏收起为图标栏。
* **Mobile (<768px)**:
* **布局变更**: 侧边栏变为底部 Tab。
* **Stack View**: Agent 卡片改为垂直堆叠，不支持左右并排。
* **字体**: 正文字号从 14px 调整为 16px (防止 iOS 缩放)。



---

## 5. 数据埋点需求 (Analytics)

| 事件 Key | 描述 | 参数 (Params) |
| --- | --- | --- |
| `nexus_init` | 页面加载完成 | `device_type`, `performance_mode` |
| `query_sent` | 用户发送指令 | `query_length` |
| `agent_triggered` | Agent 被召唤 | `agent_name`, `agent_count` |
| `stream_complete` | 生成完成 | `duration_ms`, `token_count` |
| `ui_interaction` | 界面交互 | `action_type` (expand/copy/scroll) |

---

## 6. 验收标准 (Acceptance Criteria - AC)

### AC1: 视觉还原度

* [ ] 背景视频、网格层、玻璃层叠加顺序正确，无穿模。
* [ ] Critic (红) 和 Pragmatist (绿) 的主题色 Hex 值与设计稿完全一致。
* [ ] 字体必须使用 `Inter` 或 `JetBrains Mono` (代码)。

### AC2: SSE 稳定性

* [ ] 模拟网络延迟（Slow 3G）时，UI 不应卡死，Loading 状态需持续。
* [ ] 断网重连后，应当提示用户刷新或自动重试，而不是白屏。
* [ ] 点击 "Stop" 按钮，数据流立即停止，不再追加文字。

### AC3: 移动端适配

* [ ] 在 iPhone Safari 上，地址栏不应遮挡底部输入框（处理 `100vh` 问题）。
* [ ] 手机端无明显卡顿，模糊效果已根据设备性能自动关闭。

---

## 7. 附录：技术栈建议 (Tech Stack Recommendation)

* **Framework**: React 18 + Vite
* **State**: Zustand (轻量级，适合高频 SSE 更新)
* **Styling**: Tailwind CSS (核心), `clsx` + `tailwind-merge` (动态样式)
* **Animation**: Framer Motion (处理卡片进出场)
* **Markdown**: `react-markdown` + `rehype-highlight`