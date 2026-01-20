---
id: frontend-polymath
type: guide
version: "1.0.0"
related_ids: [frontend-integration, api-endpoints, system-overview]
---

# 前端接入指南：Polymath Engine (多智能体模式)

## 场景

复杂问题求解。通过 "Director" (导演) 动态编排多个垂直领域的 Agent (如 Critic, Historian, Expander) 并发协作，提供多维度的回答。

## API 端点

```
POST /api/v1/engine
```

## 请求格式

```typescript
interface PolymathRequest {
  mode: "polymath";                   // 必须为 polymath
  query: string;                      // 用户复杂问题
  config?: {
    model?: string;                   // 可选，指定底层模型 (e.g. "gpt-4", "gemini-2.0-flash")
  };
  history?: Array<{                   // 上下文历史
    role: "user" | "assistant";
    content: string;
  }>;
}
```

## 响应协议 (SSE 事件流)

与 Vanilla 模式不同，Polymath 模式使用 **Named Events** 来区分元数据、不同 Agent 的输出流和状态。

### 事件类型定义

#### 1. 编排事件 (`event: meta`)
Director 完成选角后触发，告知前端即将出场的 Agent 列表。

```json
event: meta
data: {
  "step": "orchestration",
  "selected_agents": ["historian", "critic"]
}
```

#### 2. Agent 流式输出 (`event: stream`)
各个 Agent 并发输出内容。前端需根据 `agent` 字段将内容分发到对应的 UI 卡片/气泡中。

```json
event: stream
data: {
  "agent": "historian",
  "delta": "在19世纪初期..."
}
```

#### 3. Agent 完成信号 (`event: stream_end`)
某个 Agent 完成了它的任务。

```json
event: stream_end
data: {
  "agent": "historian"
}
```

#### 4. 错误事件 (`event: error`)
特定 Agent 发生错误（不影响其他 Agent）。

```json
event: error
data: {
  "agent": "critic",
  "error": "Rate limit exceeded"
}
```

## 前端代码示例

```typescript
import { fetchEventSource } from '@microsoft/fetch-event-source'; // 推荐使用此库处理 SSE

type AgentId = "critic" | "historian" | "expander" | "pragmatist" | "verifier" | "synthesizer" | "mediator";

interface AgentState {
  id: AgentId;
  content: string;
  status: 'thinking' | 'streaming' | 'done' | 'error';
}

// 状态管理 (示例)
const [agents, setAgents] = useState<Record<string, AgentState>>({});

async function startPolymathChat(query: string) {
  await fetchEventSource('/api/v1/engine', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mode: "polymath",
      query: query
    }),
    
    onopen(response) {
      if (response.ok) return;
      throw new Error(`Failed: ${response.status}`);
    },

    onmessage(msg) {
      const data = JSON.parse(msg.data);

      switch (msg.event) {
        case 'meta':
          // 1. 初始化 Agent 占位符
          const newAgents = {};
          data.selected_agents.forEach(id => {
            newAgents[id] = { id, content: '', status: 'thinking' };
          });
          setAgents(newAgents);
          break;

        case 'stream':
          // 2. 追加内容
          setAgents(prev => ({
            ...prev,
            [data.agent]: {
              ...prev[data.agent],
              content: prev[data.agent].content + data.delta,
              status: 'streaming'
            }
          }));
          break;

        case 'stream_end':
          // 3. 标记完成
          setAgents(prev => ({
            ...prev,
            [data.agent]: { ...prev[data.agent], status: 'done' }
          }));
          break;

        case 'error':
          // 4. 处理错误
          console.error(`Agent ${data.agent} failed:`, data.error);
          setAgents(prev => ({
            ...prev,
            [data.agent]: { ...prev[data.agent], status: 'error' }
          }));
          break;
      }
    }
  });
}
```

## 可用 Agent 列表

| Agent ID | 名称 | 职责 |
|----------|------|------|
| **critic** | 批判者 | 寻找逻辑漏洞，进行反驳和质疑 |
| **historian** | 历史学家 | 提供时间维度的背景、演变过程 |
| **expander** | 拓展者 | 发散思维，提供类比和跨领域视角 |
| **pragmatist** | 实用主义者 | 关注落地执行、具体方案和可行性 |
| **verifier** | 验证者 | 事实核查，防止幻觉 (Fact Checking) |
| **synthesizer** | 综合者 | 收束观点，提供最终总结 |
| **mediator** | 调停者 | 在冲突观点中寻找平衡 |

## 最佳实践

1.  **并行 UI**: 不要像传统聊天那样线性堆叠消息。建议使用 "卡片墙" 或 "多列布局" 同时展示不同 Agent 的思考过程。
2.  **动态加载**: Agent 是由 Director 动态选择的，前端 UI 需要能够处理 1 到 N 个任意类型的 Agent。
3.  **视觉区分**: 为不同的 Agent 分配不同的图标和强调色 (例如 Critic 用红色/警告色，Pragmatist 用蓝色/冷静色)。
