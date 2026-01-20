import { z } from 'zod';

// PRD-compliant Agent roles
export const AgentRoleSchema = z.enum([
  'critic',
  'historian',
  'expander',
  'pragmatist',
  'verifier',
  'synthesizer',
  'mediator',
]);

export type AgentRole = z.infer<typeof AgentRoleSchema>;

// PRD event: meta
const MetaEventSchema = z.object({
  event: z.literal('meta'),
  data: z.object({
    step: z.literal('orchestration'),
    selected_agents: z.array(AgentRoleSchema),
  }),
});

// PRD event: stream
const StreamEventSchema = z.object({
  event: z.literal('stream'),
  data: z.object({
    agent: AgentRoleSchema,
    delta: z.string(),
  }),
});

// PRD event: stream_end
const StreamEndEventSchema = z.object({
  event: z.literal('stream_end'),
  data: z.object({
    agent: AgentRoleSchema,
  }),
});

// PRD event: error
const ErrorEventSchema = z.object({
  event: z.literal('error'),
  data: z.object({
    agent: AgentRoleSchema.optional(),
    error: z.string(),
  }),
});

export const SSEEventSchema = z.discriminatedUnion('event', [
  MetaEventSchema,
  StreamEventSchema,
  StreamEndEventSchema,
  ErrorEventSchema,
]);

export type SSEEvent = z.infer<typeof SSEEventSchema>;
export type MetaEvent = z.infer<typeof MetaEventSchema>;
export type StreamEvent = z.infer<typeof StreamEventSchema>;
export type StreamEndEvent = z.infer<typeof StreamEndEventSchema>;
export type ErrorEvent = z.infer<typeof ErrorEventSchema>;

export function parseSSEEvent(eventType: string, raw: string): SSEEvent | null {
  try {
    const data = JSON.parse(raw);
    const event = { event: eventType, data };
    return SSEEventSchema.parse(event);
  } catch {
    return null;
  }
}
