---
id: strategy-nexus-refactor
type: strategy
version: "1.0.0"
created: 2025-01-20
related_ids: [style-hemingway, doc-standard, constitution]
---

# Strategy: Nexus Boardroom Refactor

## Mission

完成 Nexus Boardroom 多Agent SSE编排UI 从 70% 到 100% 生产级实现。

## Constraints

### Constitution
**颜色语义:**
- Canvas: `bg-slate-950`
- Glass: `bg-slate-900/40 backdrop-blur-xl`
- Border: `border-white/10`
- Critic: `text-rose-500`, `border-rose-500/50`
- Pragma: `text-emerald-500`, `border-emerald-500/50`
- Cursor Glow: `shadow-[0_0_30px_-10px_rgba(...)]`

**状态映射:**
- IDLE: `border-white/5`
- THINKING: `animate-pulse`
- STREAMING: `border-{color}-500/50` + Color Glow
- ERROR: `border-red-500/40`

**响应式分界点:**
- Mobile (<768px): 侧边栏 → 底部Tab, 卡片垂直堆叠, 移除视频背景

### Style Protocol
**Reference:** `llmdoc/reference/style-hemingway.md`

**Core Rules:**
- Max Nesting: 3 levels
- Max Function: 20 lines
- Early Returns over nested if-else
- Type-First (interfaces before logic)
- No "What" comments
- Iceberg Principle: Show 10%, imply 90%

**Forbidden Patterns:**
- Deep nesting (>3 levels)
- Verbose boolean returns (`if x return true else return false`)
- Bureaucratic naming (`AbstractManagerImpl`)
- Dead code / unused parameters

---

## Execution Plan

### Step 1: Timeout & Error Handling [P0]

**Target:** `nexus/app/services/orchestration.ts`

**Problem:** 无超时机制，meta阶段可能无限等待。

**Solution:**
```typescript
// 在 initiateAgentSequence 添加超时逻辑

const META_TIMEOUT = 10_000; // 10s

const fetchWithTimeout = (url: string, opts: RequestInit, ms: number) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ms);

  return fetch(url, { ...opts, signal: controller.signal })
    .finally(() => clearTimeout(timeoutId));
};

// 应用到 meta 阶段
try {
  const metaRes = await fetchWithTimeout('/api/orchestration/init', {
    method: 'POST',
    body: JSON.stringify({ query }),
  }, META_TIMEOUT);

  if (!metaRes.ok) throw new Error(`Meta failed: ${metaRes.status}`);
  // ... 解析 meta
} catch (err) {
  if (err.name === 'AbortError') {
    emit({ type: 'META_TIMEOUT', error: 'Meta analysis timed out' });
  } else {
    emit({ type: 'ERROR', error: err.message });
  }
  return;
}
```

**Verification:**
- [ ] 10秒后 meta 未返回触发 META_TIMEOUT 事件
- [ ] UI 显示错误状态
- [ ] 后续 agent 序列不启动

---

### Step 2: Stop Button Implementation [P0]

**Target:**
- `nexus/app/routes/_index.tsx`
- `nexus/app/components/command-console.tsx`
- `nexus/app/services/orchestration.ts`

**Problem:** 缺失中断流式传输的能力。

**Solution:**

**2.1 orchestration.ts 添加 AbortController:**
```typescript
interface OrchestrationController {
  abort: () => void;
}

export const initiateAgentSequence = (
  query: string,
  emit: EventEmitter
): OrchestrationController => {
  const controller = new AbortController();

  // 在 SSE 连接时传入 signal
  const stream = new EventSource('/api/orchestration/stream', {
    signal: controller.signal,
  });

  stream.addEventListener('message', (e) => {
    if (controller.signal.aborted) return;
    // ... 处理事件
  });

  return {
    abort: () => {
      controller.abort();
      stream.close();
      emit({ type: 'ABORTED' });
    }
  };
};
```

**2.2 _index.tsx 状态管理:**
```typescript
const [controller, setController] = useState<OrchestrationController | null>(null);

const handleSubmit = () => {
  const ctrl = initiateAgentSequence(query, (event) => {
    // ... 处理事件
  });
  setController(ctrl);
};

const handleStop = () => {
  controller?.abort();
  setController(null);
};
```

**2.3 command-console.tsx UI:**
```typescript
interface CommandConsoleProps {
  // ... 现有 props
  onStop?: () => void;
  isStreaming?: boolean;
}

// 在输入框右侧添加 Stop 按钮
{isStreaming && (
  <button
    onClick={onStop}
    className="px-3 py-1 text-xs font-mono bg-red-500/20 border border-red-500/50 rounded-md hover:bg-red-500/30 transition-colors"
  >
    STOP
  </button>
)}
```

**Verification:**
- [ ] 点击 STOP 后所有 SSE 连接关闭
- [ ] 卡片停止更新
- [ ] 控制台可再次输入

---

### Step 3: HUD Navigation Refactor [P1]

**Target:**
- `nexus/app/components/status-hud.tsx` → 重构为 `hud-nav.tsx`

**Problem:** 当前 HUD 功能单一，缺少语言切换和用户菜单。

**Solution:**

**3.1 创建 hud-nav.tsx:**
```typescript
// Types
interface User {
  name: string;
  avatar?: string;
}

interface HudNavProps {
  user: User;
  locale: 'zh' | 'en';
  onLocaleChange: (locale: 'zh' | 'en') => void;
  onLogout: () => void;
}

// Component Structure
export const HudNav = ({ user, locale, onLocaleChange, onLogout }: HudNavProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="fixed top-6 right-6 z-50 flex items-center gap-4">
      {/* Language Toggle */}
      <button
        onClick={() => onLocaleChange(locale === 'zh' ? 'en' : 'zh')}
        className={GLASS + ' px-3 py-1.5 rounded-lg text-xs font-mono hover:border-cyan-500/50 transition-colors'}
      >
        {locale.toUpperCase()}
      </button>

      {/* User Menu */}
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={GLASS + ' w-10 h-10 rounded-full overflow-hidden hover:ring-2 hover:ring-cyan-500/50 transition-all'}
        >
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-cyan-400 font-bold">
              {user.name[0].toUpperCase()}
            </div>
          )}
        </button>

        {menuOpen && (
          <div className={GLASS + ' absolute top-12 right-0 min-w-[180px] rounded-lg overflow-hidden'}>
            <div className="px-4 py-3 border-b border-white/10">
              <div className="text-sm text-white/90">{user.name}</div>
            </div>
            <button
              onClick={onLogout}
              className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-white/5 transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
```

**3.2 集成到 _index.tsx:**
```typescript
import { HudNav } from '~/components/hud-nav';

// State
const [locale, setLocale] = useState<'zh' | 'en'>('zh');
const mockUser = { name: 'Commander' };

// Render
<HudNav
  user={mockUser}
  locale={locale}
  onLocaleChange={setLocale}
  onLogout={() => console.log('Logout')}
/>
```

**Verification:**
- [ ] 语言切换按钮切换 zh/en
- [ ] 用户头像点击展开菜单
- [ ] 点击外部区域关闭菜单

---

### Step 4: Card Animations [P1]

**Target:** `nexus/app/components/holo-card.tsx`

**Problem:** 卡片瞬间出现，缺少入场动画和打字机效果。

**Dependencies:** `framer-motion`

**Solution:**

**4.1 安装依赖:**
```bash
pnpm add framer-motion
```

**4.2 卡片入场动画:**
```typescript
import { motion } from 'framer-motion';

export const HoloCard = ({ agent, content, status }: HoloCardProps) => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
      className={/* ... 现有 className */}
    >
      {/* ... 现有内容 */}
    </motion.div>
  );
};
```

**4.3 打字机光标:**
```typescript
// 在 STREAMING 状态时显示光标
{status === 'STREAMING' && (
  <motion.div
    className="inline-block w-2 h-5 bg-current ml-1"
    animate={{ opacity: [1, 0] }}
    transition={{
      duration: 0.8,
      repeat: Infinity,
      repeatType: 'reverse',
    }}
  />
)}
```

**4.4 智能滚动:**
```typescript
const contentRef = useRef<HTMLDivElement>(null);
const [autoScroll, setAutoScroll] = useState(true);

useEffect(() => {
  if (!autoScroll || !contentRef.current) return;

  // 滚动到底部
  contentRef.current.scrollTop = contentRef.current.scrollHeight;
}, [content, autoScroll]);

const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
  const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
  const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;

  // 用户手动滚动到非底部区域时禁用自动滚动
  setAutoScroll(isAtBottom);
};

// 应用到内容区域
<div
  ref={contentRef}
  onScroll={handleScroll}
  className="flex-1 overflow-y-auto"
>
  {/* 内容 */}
</div>
```

**Verification:**
- [ ] 新卡片从下往上弹性入场
- [ ] STREAMING 时显示闪烁光标
- [ ] 用户滚动时暂停自动滚动，回到底部恢复

---

### Step 5: Mobile Adaptation [P1]

**Target:**
- 创建 `nexus/app/components/mobile-nav.tsx`
- 更新 `nexus/app/routes/_index.tsx`
- 创建 `nexus/app/hooks/use-mobile.ts`

**Problem:** 当前布局在 <768px 设备上不可用。

**Solution:**

**5.1 创建 use-mobile.ts hook:**
```typescript
import { useEffect, useState } from 'react';

export const useMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);

    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);

  return isMobile;
};
```

**5.2 创建 mobile-nav.tsx (底部 Tab):**
```typescript
interface MobileNavProps {
  activeTab: 'chat' | 'agents' | 'settings';
  onTabChange: (tab: string) => void;
}

export const MobileNav = ({ activeTab, onTabChange }: MobileNavProps) => (
  <div className={GLASS + ' fixed bottom-0 left-0 right-0 h-16 flex items-center justify-around z-50'}>
    {['chat', 'agents', 'settings'].map((tab) => (
      <button
        key={tab}
        onClick={() => onTabChange(tab)}
        className={[
          'flex flex-col items-center gap-1',
          activeTab === tab ? 'text-cyan-400' : 'text-white/60',
        ].join(' ')}
      >
        <div className="text-xl">{/* Icon */}</div>
        <span className="text-xs font-mono">{tab.toUpperCase()}</span>
      </button>
    ))}
  </div>
);
```

**5.3 _index.tsx 响应式布局:**
```typescript
import { useMobile } from '~/hooks/use-mobile';
import { MobileNav } from '~/components/mobile-nav';

const isMobile = useMobile();
const [mobileTab, setMobileTab] = useState('chat');

return (
  <div className={isMobile ? 'pb-16' : ''}>
    {/* 移除视频背景（移动端） */}
    {!isMobile && <VideoBackground />}

    {/* 卡片布局 */}
    <div className={isMobile
      ? 'flex flex-col gap-4 p-4'
      : 'grid grid-cols-2 gap-6 p-8'
    }>
      {cards.map(card => (
        <HoloCard key={card.id} {...card} />
      ))}
    </div>

    {/* 导航 */}
    {isMobile ? (
      <MobileNav activeTab={mobileTab} onTabChange={setMobileTab} />
    ) : (
      <HudNav {...} />
    )}
  </div>
);
```

**5.4 性能降级:**
```typescript
// 移动端降低 blur 强度
const GLASS_MOBILE = 'bg-slate-900/60 backdrop-blur-sm border border-white/10';

// 移动端禁用动画
const cardVariants = isMobile
  ? {}
  : { initial: { y: 50, opacity: 0 }, animate: { y: 0, opacity: 1 } };
```

**Verification:**
- [ ] <768px 时侧边栏消失，底部显示 Tab
- [ ] 卡片垂直堆叠
- [ ] 视频背景移除
- [ ] blur 强度降低

---

## Verification Checklist

### P0 (Must Have)
- [ ] Meta 超时处理正常工作
- [ ] Stop 按钮可中断所有 SSE 流
- [ ] 错误状态在 UI 正确显示

### P1 (Should Have)
- [ ] HUD 导航栏包含语言切换和用户菜单
- [ ] 卡片入场动画流畅
- [ ] 打字机光标在 STREAMING 时显示
- [ ] 智能滚动逻辑正确（用户滚动时暂停）
- [ ] 移动端布局完整可用

### Style Compliance
- [ ] 所有新代码符合 Hemingway Style (max 3 nesting, max 20 lines)
- [ ] 无 "What" 注释
- [ ] Type-First（接口在前）
- [ ] 无冗余 else 返回

### Performance
- [ ] 移动端帧率 >30fps
- [ ] 卡片数量 >10 时无明显卡顿
- [ ] SSE 连接正确清理（无内存泄漏）

---

## Pseudo-Code Summary

**Timeout Logic:**
```
FUNCTION fetchWithTimeout(url, opts, ms):
  controller = new AbortController()
  timeout = setTimeout(() => controller.abort(), ms)

  TRY:
    response = fetch(url, { ...opts, signal: controller.signal })
  FINALLY:
    clearTimeout(timeout)

  RETURN response
```

**Stop Flow:**
```
FUNCTION handleStop():
  controller.abort()  // 中断所有 fetch
  stream.close()      // 关闭 SSE
  emit({ type: 'ABORTED' })  // 通知 UI
```

**Smart Scroll:**
```
ON scroll:
  IF (scrollTop + clientHeight) >= (scrollHeight - threshold):
    autoScroll = true  // 在底部，恢复自动滚动
  ELSE:
    autoScroll = false  // 用户手动滚动，暂停自动滚动

ON content change:
  IF autoScroll:
    scrollTo(bottom)
```

**Mobile Detection:**
```
FUNCTION useMobile(breakpoint = 768):
  [isMobile, setIsMobile] = useState(false)

  ON mount/resize:
    setIsMobile(window.innerWidth < breakpoint)

  RETURN isMobile
```

---

## Notes

**Implementation Order Rationale:**
1. P0 first (timeout & stop) - 阻塞问题，影响用户体验
2. P1 second (HUD & animations) - 提升交互质量
3. Mobile last - 新增设备支持，不影响桌面端

**Risk Mitigation:**
- 所有网络调用必须有超时和错误处理
- 动画使用 `prefers-reduced-motion` 媒体查询尊重用户偏好
- 移动端测试使用 Chrome DevTools 模拟器 + 真机验证

**Deployment Strategy:**
- 分支: `feat/nexus-refactor-p0` (Step 1-2)
- 分支: `feat/nexus-refactor-p1` (Step 3-5)
- 合并前需通过 Verification Checklist
