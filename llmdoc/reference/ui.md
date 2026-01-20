# 📘 Nexus Boardroom - UI Handoff Specifications

**Project:** Nexus AI Agent Interface
**Version:** 1.0 Final
**Theme:** "Luminous Clarity" (光之澄澈) - Dark Mode Only

---

## 1. 全局视觉基础 (Global Foundations)

### 1.1 颜色体系 (Color System)

严格遵循 Tailwind CSS 色板，配合 Alpha 透明度实现玻璃质感。

| 语义 (Semantic) | 颜色名称 (Token) | Hex Value | Tailwind Class | 用途说明 |
| --- | --- | --- | --- | --- |
| **Canvas** | `Void Black` | `#020617` | `bg-slate-950` | 页面最底层背景 |
| **Glass Base** | `Surface` | `#0F172A` (Opacity 40-60%) | `bg-slate-900/40` | 卡片、控制台的基底 |
| **Border** | `Rim Light` | `#FFFFFF` (Opacity 10%) | `border-white/10` | 默认边框，极细 |
| **Primary** | `Nexus Blue` | `#3B82F6` | `text-blue-500` | 系统高亮、光标、主按钮 |
| **Semantic** | `Critic Red` | `#F43F5E` | `text-rose-500` | Critic Agent 主题色/边框 |
| **Semantic** | `Pragma Green` | `#10B981` | `text-emerald-500` | Pragma Agent 主题色/边框 |
| **Text** | `High Contrast` | `#F8FAFC` | `text-slate-50` | 标题、主要内容 |
| **Text** | `Muted` | `#94A3B8` | `text-slate-400` | 元数据、未选中状态 |

### 1.2 字体排印 (Typography)

* **UI 主字体:** `Inter` (无衬线，干净)
* **Headers:** `font-bold tracking-wide`
* **Body:** `font-light leading-relaxed` (增加行高提升阅读呼吸感)


* **代码/数据:** `JetBrains Mono` or `Fira Code`
* **Use Cases:** Agent 名称、状态标签、代码块。



### 1.3 深度与光影 (Depth & Lighting)

不使用传统的黑色投影，而是使用**彩色光晕**模拟全息发光。

* **Glow Effect (Blue):** `drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]`
* **Glow Effect (Red):** `drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]`
* **Glass Blur:**
* Standard: `backdrop-blur-xl` (卡片)
* Heavy: `backdrop-blur-2xl` (控制台、模态框)



---

## 2. 核心组件规范 (Component Specifications)

### 2.1 顶部 HUD 导航栏 (HUD Top Bar)

* **定位:** `fixed top-0 w-full z-50`
* **高度:** `h-20` (80px)
* **交互热区:** 仅 Logo 和右侧按钮区响应点击 (`pointer-events-auto`)，中间区域穿透 (`pointer-events-none`)。

| 元素 | 样式描述 (Tailwind) | 状态逻辑 |
| --- | --- | --- |
| **Lang Switch** | `text-xs font-mono text-slate-600` | Active: `text-blue-400` + `font-bold` |
| **User Avatar** | `w-8 h-8 rounded-full border border-slate-600` | Hover: 边框变亮 `border-slate-300` |
| **Dropdown** | `absolute right-0 top-full mt-2 bg-slate-900/90 border border-white/10` | 出现动画: Opacity 0->1, Scale 0.95->1 |

### 2.2 智能体卡片 (Agent Card)

* **容器:** `rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-xl`
* **尺寸:** 宽度自适应，最大宽度 `max-w-xl`，高度随内容延伸。

**状态变化 (States):**

1. **IDLE (静止态):**
* Border: `border-white/5`
* Shadow: None
* Indicator: `text-slate-500` "IDLE"


2. **STREAMING (生成态 - 核心视觉点):**
* **Critic (Red):** Border `border-rose-500/50`, Box-Shadow `shadow-[0_0_30px_-10px_rgba(244,63,94,0.3)]`
* **Pragma (Green):** Border `border-emerald-500/50`, Box-Shadow `shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)]`
* **Typing Cursor:** 正文末尾必须跟随光标。样式: `inline-block w-2 h-5 bg-current animate-pulse`.



### 2.3 底部悬浮控制台 (Floating Console)

* **形状:** 胶囊形 `rounded-full`
* **定位:** `fixed bottom-8 left-1/2 -translate-x-1/2`
* **材质:** 比卡片更“厚”的玻璃 `bg-slate-950/60 backdrop-blur-2xl border border-white/10 ring-1 ring-white/5`
* **Input Area:**
* Placeholder: "Enter command to summon agents..." (`text-slate-500`)
* Focus: 容器外发光 `ring-blue-500/30`


* **Visualizer (频谱仪):**
* 位于输入框右侧。
* Idle: 静态圆形图标。
* Active: 动态波纹 (建议使用 Lottie 或 CSS Keyframes 模拟声波跳动)。



---

## 3. 动效与微反馈 (Animation & Micro-interactions)

使用 `Framer Motion` 或原生 CSS Transition。

* **卡片入场 (Card Entrance):**
* Trigger: Agent 被召唤时。
* Effect: 从下方 50px 处弹入，透明度 0->1。
* Timing: Spring (Mass: 1, Tension: 170, Friction: 26)。


* **流式文字 (Text Streaming):**
* 文字不是一次性出现，而是以 20-50ms 的间隔逐字显示（Typewriter Effect）。


* **背景网格 (Background Grid):**
* 地板网格可以有极慢的透视移动效果，增强 3D 空间感。



---

## 4. 响应式适配策略 (Responsive Design)

### Mobile (< 768px)

1. **HUD 变更:**
* 隐藏具体的语言切换和用户名。
* 显示 "Menu" 图标 (六边形 Icon)。
* 点击 Menu 触发全屏 Overlay (Z-index: 60)。


2. **Layout 变更:**
* Agent 卡片从 "Grid Columns" 变为 "Flex Column" (垂直堆叠)。
* 卡片宽度 `w-full`。
* 底部控制台宽度 `w-[90%]`, `bottom-4`。


3. **Performance:**
* 移除背景视频层，改为静态渐变图片以节省电量。
* 降低 `backdrop-blur` 的数值 (xl -> md) 以防低端机掉帧。



---

## 5. 资源交付清单 (Assets)

* **Icons:** 推荐使用 `Lucide React` 或 `Heroicons` (Outline 风格)。
* **Fonts:** Google Fonts (Inter, JetBrains Mono)。
* **Avatar:** DiceBear API 或本地占位图。

---

**设计师留言:**

> 开发时请务必注意 **Z-index 层级管理**，确保 HUD 永远在最上层，而卡片的光晕不要遮挡文字。如果遇到性能问题，优先牺牲模糊效果（Blur），保住帧率。
> Let's make it shine. 🚀