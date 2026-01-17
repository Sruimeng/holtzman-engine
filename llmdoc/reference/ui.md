# UI/UX 设计规范：Nexus Boardroom

**版本**: v1.0
**核心理念**: 赛博极简 (Cyber-Minimalism) & 全息映射 (Holographic Mapping)
**设计目标**: 让 2D HUD 看起来是 3D 核心的“投影控制层”，而非简单的网页覆盖。

---

## 1. 视觉识别系统 (Visual Identity System)

### 1.1 调色板 (Color Palette)

我们不使用单一颜色，而是使用**光色 (Light Colors)**。

* **环境基底 (Base Environment)**
* `Void Black`: `#050505` (3D 场景的最深处)
* `Deep Slate`: `#0F172A` (2D 网页背景，用于遮罩)
* `Glass Tint`: `rgba(15, 23, 42, 0.6)` (磨砂玻璃基色)


* **能量/交互色 (Energy Accents)**
* `Electric Blue`: `#38BDF8` (主交互色，代表系统/中控)
* `Holo White`: `#F8FAFC` (高亮文字，带有轻微的外发光)
* `Dim Gray`: `#94A3B8` (次要信息，低对比度)


* **语义光色 (Agent Semantic Lights)**
* 这些颜色不仅用于文字，还决定了 3D 聚光灯和玻璃边缘光的颜色。
* `Critic Red`: `#F43F5E` (高饱和度，警示感)
* `Pragmatist Green`: `#10B981` (稳重，通行感)
* `Historian Amber`: `#F59E0B` (沉淀，复古感)
* `Expander Purple`: `#A855F7` (神秘，幻觉感)



### 1.2 排版 (Typography)

* **数据/代码/HUD (Data & HUD)**
* **Font**: `JetBrains Mono`
* **Usage**: 侧边栏菜单、输入框、Token 计数、God Mode 参数值。
* **Style**: 大写字母间距 (Tracking) 设为 `0.05em`，增加机械感。


* **阅读/内容 (Content & Reading)**
* **Font**: `Inter`
* **Usage**: 3D 石碑上的正文、对话气泡、长文本。
* **Style**: 字重偏细 (Light/Regular)，行高 `1.6`，保证透气感。



### 1.3 材质规范 (Material Specs)

这是本设计的灵魂，分为 2D 和 3D 两种实现。

**A. 2D HUD 材质 (CSS)**

* **深色磨砂 (Dark Frost)**:
```css
background: rgba(15, 23, 42, 0.4);
backdrop-filter: blur(12px) saturate(180%);
border: 1px solid rgba(255, 255, 255, 0.08);
box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);

```


* **激活态边框 (Active Border)**:
```css
border-color: rgba(56, 189, 248, 0.5);
box-shadow: 0 0 15px rgba(56, 189, 248, 0.2); /* 辉光 */

```



**B. 3D 水晶材质 (R3F/Shader)**

* **光学水晶 (Optical Crystal)**:
* `transmission`: 1.0 (全透)
* `thickness`: 1.5 (厚重感)
* `roughness`: 0.05 (极光滑，但也有一点点磨砂质感)
* `chromaticAberration`: 0.06 (边缘色散，产生彩虹光边)
* `ior`: 1.5 (折射率)



---

## 2. 组件设计规范 (Component Specs)

### 2.1 按钮与交互元件 (Buttons & Inputs)

* **主按钮 (Primary Action)**:
* 不是实心色块，而是**“空心发光管”**。
* 背景透明，边框 `#38BDF8`，文字发光。
* **Hover**: 背景填充 10% 的蓝色，辉光增强，文字轻微上浮 2px。


* **输入控制台 (The Console Input)**:
* 底部通栏设计。
* **Visualizer**: 在 Input 顶边框上方，绘制一条高 20px 的 Canvas 区域。
* **波形逻辑**: 默认是一条平直的微光线。打字时，线条根据按键速度产生噪波震动 (Perlin Noise Distortion)。



### 2.2 侧边栏与导航 (Navigation)

* **Sidebar**:
* 默认宽度 `64px`，半透明玻璃条。
* 图标：使用细线条风格 (Lucide React)，未选中透明度 0.4，选中透明度 1.0 + 外发光。
* **Hover 展开**: 宽度平滑过渡到 `240px`，文字淡入。
* **Session Item**: 选中项左侧不仅仅是竖线，而是一个小型的**发光三角形**指示器 (`▶`)。



### 2.3 上帝模式面板 (God Mode Panel)

* **位置**: 顶部导航栏下方滑出。
* **滑块 (Sliders)**:
* 轨道：极细的深灰色线。
* 滑块头：菱形发光点。
* **拖动时**: 显示数值变化的 HUD 浮层 (e.g., "RATIONALITY: 85%")。



---

## 3. 3D 场景布局与资产 (3D Layout & Assets)

### 3.1 核心结构 (The Core)

* **量子核心**: 位于场景正中心 `[0, 0, -10]`。
* **形态**: 一个缓慢自转的复杂几何体（二十面体或多层环状结构）。
* **材质**: 线框模式 (Wireframe) 与实体模式结合，发出微弱的呼吸光。

### 3.2 舞台与石碑 (The Stage & Monoliths)

* **石碑 (Monolith) 形态**:
* 圆角矩形板，厚度适中。
* **生成动画**: 从极小的点螺旋放大展开 (Scale + Rotation)。


* **排版布局**:
* **单人模式**: 石碑居中，稍微仰视视角。
* **双人对垒**: 左右分立，稍微向内倾斜 15 度，形成包围感。
* **三人圆桌**: 扇形排列。



### 3.3 轨道系统 (Orbit System)

* **原石 (Tesseracts)**:
* 未激活的 Agent 表现为浮空的立方体。
* **Idling**: 它们不只是公转，还会自身缓慢旋转。
* **颜色**: 核心发光点对应 Agent 语义色。



---

## 4. 关键交互与动效 (Interaction & Motion)

所有的动效必须遵循物理惯性，避免生硬的线性运动。

### 4.1 登录转场 (The "Dive" Transition)

这是用户进入系统的“仪式感”。

1. **State A (Login)**: 摄像机位于远处，能看到完整的轨道和核心。UI 面板在左。
2. **Action**: 点击登录。
3. **Animation**:
* 左侧 UI 向左飞出屏幕 (EaseInBack)。
* 摄像机向前推进 (Dolly In)，穿过外层轨道，最终停留在核心前方的“指挥位” (EaseInOutCubic, Duration: 1.5s)。
* HUD (侧边栏、底栏) 从屏幕边缘淡入并向内收缩 (Fade In + Scale Down)。



### 4.2 文字生成 (Streaming Output)

* **2D 层面**: 文字不是逐字出现，而是以 **Block** 为单位，带有轻微的解密效果 (Decryption Glitch) —— 先显示乱码字符，100ms 后变为正确文字。
* **3D 层面**:
* 石碑表面随文字生成产生**能量脉冲 (Energy Pulse)** —— 一道光带从上扫到下。
* 石碑上方的聚光灯强度随着输出速度闪烁。



### 4.3 视差反馈 (Parallax Feedback)

* 鼠标在屏幕中心时，摄像机归位。
* 鼠标移向左上角，摄像机微量向右下角移动并旋转。
* **比例**: 鼠标移动 100px，摄像机移动 0.1 unit，旋转 0.5 度。
* **阻尼 (Damping)**: 使用 `Lerp` 插值，让摄像机跟随有“重量感”，不飘。

---

## 5. 响应式策略 (Responsive Strategy)

虽然是指挥舱，但也需要适配不同屏幕。

* **Desktop ( > 1024px)**: 完整体验，左右分栏，3D 场景全景。
* **Tablet**: 侧边栏默认收起，石碑大小自动缩放。
* **Mobile ( < 640px )**: **"Datapad Mode" (数据板模式)**。
* 3D 场景作为背景层，降低亮度，模糊处理。
* HUD 变为覆盖层 (Overlay)。
* 侧边栏变为底部 Tab Bar。
* **上帝模式**: 变为全屏 Modal。



---

## 6. 资产交付清单 (Assets List)

* **SVG Icons**: Lucide React (无需设计，代码调用)。
* **Noise Texture**: 用于 2D 噪点和 3D 材质的 Normal Map。
* **Font Files**: JetBrains Mono (Variable), Inter (Variable).
* **HDRI Map**: 一张深空或科技感的环境贴图，用于 3D 场景的反射计算。