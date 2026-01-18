# Frontend PRD: Nexus Boardroom (Holographic Edition)

**版本**: 2.0
**类型**: 实施规范
**核心目标**: 1:1 还原 Figma 设计稿的“全息玻璃”质感，并对接 Polymath SSE 引擎。

## 1. 视觉架构 (Visual Architecture)

基于参考图，界面由 **5 个 Z 轴层级** 构成，通过 CSS 制造伪 3D 深度。

* **L0 (Deep Void)**: 背景视频层。播放紫色/青色能量核心循环视频 (`core_loop.mp4`)。混合模式: `Screen`，透明度: `40%`。
* **L1 (The Grid)**: 全屏深蓝色网格背景 (`bg-grid-slate-900`)，带晕映 (Vignette) 遮罩。
* **L2 (Glass Panel)**: 侧边栏与顶部 HUD。磨砂玻璃材质。
* **L3 (Holo-Cards)**: 智能体卡片。高亮边缘，内发光，悬浮态。
* **L4 (Overlay)**: 扫描线与噪点纹理，统一画面质感。

## 2. 组件详细规范 (Component Specs)

### 2.1 侧边栏 (Sidebar) - *Left*

* **样式**: 磨砂玻璃长条，高度 100vh，宽度 80px。
* **元素**:
* **User Avatar**: 顶部。带青色呼吸光环 (`shadow-cyan-500/50`)。
* **Session List**: 中部。垂直排列的小圆点。
* *Active*: 青色发光圆点 + 连线效果。
* *Inactive*: 灰色圆点。


* **Settings**: 底部齿轮图标。



### 2.2 顶部 HUD (Status Bar) - *Top*

* **样式**: 悬浮胶囊或通栏，极低透明度。
* **数据**:
* **Time**: `HH:mm` (实时更新)。
* **Signal**: `((·)) 15%` (模拟信号强度)。
* **Hash**: `#020617` (版本号或 Session ID)。
* **Title**: "Nexus Boardroom" (居中，发光字)。



### 2.3 核心舞台 (The Stage) - *Center*

* **布局**: 动态 Grid 系统。根据 API `meta` 事件返回的 Agent 数量自动排列。
* **默认视图 (参考图)**: 双卡片对决模式 (Duel Mode)。
* 左卡: `PRAGMATIST` (Green Theme)
* 右卡: `CRITIC` (Red Theme)



### 2.4 全息卡片 (Holo-Card) - *Critical*

参考图中卡片的详细构造：

* **Header**:
* Icon + Agent Name (全大写，等宽字体)。
* 顶部高亮光条 (颜色对应 Agent 主题)。


* **Body**:
* 背景: 深色半透明 (`bg-slate-900/60`) + `backdrop-blur-xl`.
* 内容: Markdown 渲染区域。字体 `Inter`，颜色 `Slate-200`。


* **Footer**:
* 状态: "Thinking..." 或 "Speaking..." (打字机效果时闪烁)。
* 数据: "Latency data, 0.83ms" (模拟数据)。



### 2.5 底部控制台 (Command Console) - *Bottom*

* **Visualizer (波形图)**:
* 位于输入框上方。
* 参考图显示为 **垂直条状频谱**，颜色为青紫渐变。
* *Idle*: 低幅波动。 *Thinking*: 高频剧烈波动。


* **Input Field**:
* 玻璃胶囊造型。
* Placeholder: "Enter tactical query..."
* 发光边框: 聚焦时显示青色外发光。



---

## 3. 逻辑与数据接入 (Logic & Integration)

### 3.1 智能体映射表 (Agent Mapping)

前端需维护一个配置表，将后端 `agent_id` 映射到 UI 颜色和图标。

| Agent ID | Name | Color Theme (Tailwind) | Icon (Lucide) | 参考图对应 |
| --- | --- | --- | --- | --- |
| `pragmatist` | PRAGMATIST | `emerald-500` (#10B981) | `Briefcase` | 左侧卡片 |
| `critic` | CRITIC | `rose-500` (#F43F5E) | `AlertTriangle` | 右侧卡片 |
| `historian` | HISTORIAN | `amber-500` (#F59E0B) | `ScrollText` | (预设) |
| `expander` | EXPANDER | `purple-500` (#A855F7) | `Sparkles` | (预设) |
| `default` | SYSTEM | `cyan-500` (#06B6D4) | `Cpu` | (通用) |

### 3.2 SSE 事件流处理机

对接 `POST /api/v1/engine`。

1. **Phase 1: 初始化 (Request)**
* 发送 `query`。
* UI 状态: Input 锁定，Visualizer 变为“高频波动”，中间舞台显示 "Orchestrating Agents..."。


2. **Phase 2: 编排 (Event: `meta`)**
* **Payload**: `{"selected_agents": ["pragmatist", "critic"]}`
* **Action**:
* 清空当前舞台。
* 根据列表生成 2 张卡片。
* 卡片状态设为 `Thinking` (显示骨架屏或 Loading 动画)。




3. **Phase 3: 流式输出 (Event: `stream`)**
* **Payload**: `{"agent": "critic", "delta": "This proposal..."}`
* **Action**:
* 找到 ID 为 `critic` 的卡片。
* 将 `delta` 追加到内容缓存。
* 触发“打字机”光标跳动。
* 卡片边框高亮，透明度设为 100% (Focus)。非活跃卡片透明度降为 60%。




4. **Phase 4: 完成 (Event: `stream_end`)**
* **Action**: 移除打字机光标，显示引用来源或 Token 统计。



---

## 4. 交互动效 (Interaction)

使用 `Framer Motion` 实现。

1. **入场 (Entry)**:
* Grid 背景淡入。
* 卡片从屏幕下方 `50px` 处弹入 (Spring 动画)。


2. **视差 (Parallax)**:
* 鼠标移动时，背景层 (L0, L1) 移动速度极慢，卡片层 (L3) 移动稍快。制造“悬浮”错觉。


3. **悬停 (Hover)**:
* 鼠标悬停在卡片上时，卡片轻微上浮，内发光增强。



---

## 5. 给 AI 编程助手的 Prompt (Developer Hand-off)

> **Role**: Senior Frontend Engineer.
> **Task**: Implement the "Nexus Boardroom" UI based on the attached screenshot and API specs.
> **Stack**: React, Tailwind CSS, Framer Motion, Lucide React.
> **Requirements**:
> 1. **Layout**: Create the Sidebar (Left), Header (Top), and Stage (Center). Use CSS Grid/Flexbox.
> 2. **Visuals**: Use `backdrop-filter: blur(xl)` for the glass effect. Match the specific colors: Green for Pragmatist, Red for Critic.
> 3. **State**: Create a `usePolymathStore` (Zustand) to handle SSE events.
> * On `meta` event: dynamic render `<HoloCard />` components.
> * On `stream` event: append text to the specific card ID.
> 
> 
> 4. **Components**:
> * `HoloCard`: Needs props for `title`, `type` (determines color), `content`, and `status`.
> * `AudioVisualizer`: A mock animated bars component above the input.
> 
> 
> 5. **Assets**: Use a placeholder `div` with a radial gradient to simulate the background "Energy Core" if video is missing.
> 
> 

---

**附注**: 所有的颜色 Hex 值已从你的设计稿中提取，请在 Tailwind Config 中通过 `extend.colors` 预设这些变量，以保证还原度。