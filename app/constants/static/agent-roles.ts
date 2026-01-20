import type { AgentRole } from '../../utils/sse-parser';

interface AgentTheme {
  color: string;
  hex: string;
  icon: string;
  label: string;
  labelCn: string;
}

export const AGENT_THEMES: Record<AgentRole, AgentTheme> = {
  critic: {
    color: 'rose',
    hex: '#F43F5E',
    icon: 'carbon:warning-alt',
    label: 'Critic',
    labelCn: '批判者',
  },
  historian: {
    color: 'amber',
    hex: '#F59E0B',
    icon: 'carbon:time',
    label: 'Historian',
    labelCn: '历史学家',
  },
  expander: {
    color: 'purple',
    hex: '#A855F7',
    icon: 'carbon:idea',
    label: 'Expander',
    labelCn: '拓展者',
  },
  pragmatist: {
    color: 'emerald',
    hex: '#10B981',
    icon: 'carbon:tools',
    label: 'Pragmatist',
    labelCn: '实用主义者',
  },
  verifier: {
    color: 'blue',
    hex: '#3B82F6',
    icon: 'carbon:checkmark',
    label: 'Verifier',
    labelCn: '验证者',
  },
  synthesizer: {
    color: 'white',
    hex: '#FFFFFF',
    icon: 'carbon:connect',
    label: 'Synthesizer',
    labelCn: '综合者',
  },
  mediator: {
    color: 'teal',
    hex: '#14B8A6',
    icon: 'carbon:arrows-horizontal',
    label: 'Mediator',
    labelCn: '调停者',
  },
};

export const getAgentTheme = (role: AgentRole): AgentTheme => AGENT_THEMES[role];
