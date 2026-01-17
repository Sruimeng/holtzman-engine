## 1. 核心工程挑战：2D/3D 坐标同步系统 (Coordinate Projection System)

PRD 里提到“石碑上的文字”和“UI 悬浮在 3D 上”。这不能只靠脑补，需要具体的数学映射方案。

* **问题**: 当 3D 摄像机移动时，2D DOM 元素（如石碑上的文字、头顶的 Label）如何不飘移？
* **解决方案**: 实现一个 **`Tracker` 组件**。
* **世界坐标转屏幕坐标**: 在 R3F 的 `useFrame` 中，每帧获取 3D 物体 (Anchor Point) 的 `Vector3`，通过 `camera.project()` 投影到 NDC 空间，再映射为 CSS 的 `transform: translate3d(x, y, 0)`。
* **遮挡剔除 (Occlusion)**: 当石碑转到背面或被核心挡住时，前端必须计算 `Raycaster`，如果被遮挡，DOM 节点的 `opacity` 设为 0，且 `pointer-events` 设为 `none`。
* **性能优化**: 不要用 React State 更新坐标（太慢），直接操作 DOM Ref (`ref.current.style.transform = ...`)。



## 2. 状态管理：双循环架构 (The Dual-Loop Architecture)

React 的渲染循环 (Re-render) 和 Three.js 的渲染循环 (60fps Loop) 是冲突的。必须明确**数据流向**。

* **瞬时状态 (Transient State)** -> **Zustand (Outside React)**
* *包含*: 鼠标坐标、摄像机当前的插值进度、粒子系统的当前时间、音频波形数据。
* *访问*: R3F 组件通过 `useStore.getState()` 直接读取，**不触发组件重渲染**。


* **持久状态 (Persistent State)** -> **React Context / Query**
* *包含*: 会话列表、用户配置、Agent 的回复内容 (String)。
* *访问*: 标准 React Flow。


* **桥接 (The Bridge)**:
* 当 SSE 收到 `stream` 事件（文字更新）时，写入 IndexedDB (持久)，同时触发一个 Custom Event 或 Zustand Action，通知 R3F 中的 Text 组件更新纹理，**仅触发该 Text 局部的重绘**，不重新挂载整个 3D 场景。



## 3. 3D 资源加载与实例化策略 (Asset & Instancing Strategy)

PRD 提到“所有的 Agent 原石在轨道公转”。如果有 50 个历史会话，就会有 50 个原石。

* **几何体实例化 (InstancedMesh)**:
* 绝对不能创建 50 个 `Mesh` 对象。
* 必须使用 `<InstancedMesh>`。所有的“原石”共用一个 Geometry 和 Material。
* 通过修改 `InstancedMesh.setMatrixAt(i, matrix)` 来控制每个原石的公转位置和自转。
* **交互**: 使用 `Three.js` 的 `instanceId` 来判断鼠标点击了哪个原石。


* **资源预加载 (Pre-loading)**:
* 核心模型、石碑模型、环境贴图 (HDRI)、字体文件 (SDF Font) 必须在进入 `Auth` 页面时就开始静默加载。
* 使用 `React.Suspense` + `useGLTF.preload`。



## 4. SSE 连接保活与错误恢复 (Resilience)

PRD 没提如果网络断了怎么办。

* **心跳与重连**:
* SSE 连接必须实现自动重连 (Exponential Backoff)。
* **断点续传**: 重连时，Header 携带 `Last-Event-ID`，后端补发丢失的 Token。


* **WebGL 上下文丢失 (Context Loss)**:
* 如果在移动端切后台，WebGL Context 可能会丢。
* 监听 `webglcontextlost` 事件，显示“系统休眠中”的 2D UI 遮罩，`webglcontextrestored` 时重建场景。



## 5. 性能预算与降级策略 (Performance Budget)

这一套在 M1 Max 上跑得飞快，但在集成显卡上会卡死。

* **FPS 监控**: 引入 `r3f-perf`。
* **动态 Tier 分级**:
* **High (60fps)**: 开启焦散 (Caustics)、色散 (Dispersion)、高分辨率 FBO、Bloom。
* **Medium (<45fps)**: 关闭焦散，降低 Bloom 采样率，关闭色散。
* **Low (<30fps)**: 关闭所有 Post-processing，将材质退化为标准 `MeshStandardMaterial`，降低 Canvas 的 `dpr` (Device Pixel Ratio) 到 1。



## 6. 移动端交互映射 (Mobile Interaction Mapping)

PRD 里的 `Hover` 在手机上不存在。

* **点击替代悬停**: 手机上点击原石 = 选中 (Focus)，再次点击 = 确认/进入。
* **双指手势**:
* 双指旋转 = 旋转摄像机视角。
* 双指捏合 = 推进/拉远视角 (Dolly)。


* **陀螺仪 (Gyroscope)**:
* 可选功能：利用手机陀螺仪轻微控制摄像机视角，增强“全息窗口”的沉浸感。
