export type Locale = 'zh' | 'en';

export const i18n = {
  // Common
  'common.submit': { zh: '发送', en: 'Send' },
  'common.stop': { zh: '停止', en: 'Stop' },
  'common.close': { zh: '关闭', en: 'Close' },
  'common.loading': { zh: '加载中...', en: 'Loading...' },

  // Empty State
  'empty.title': { zh: 'Nexus 智囊团', en: 'Nexus Boardroom' },
  'empty.description': {
    zh: '输入问题召唤智囊团。多个AI智能体将从不同角度分析你的问题。',
    en: 'Enter a query below to summon the council. Multiple AI agents will analyze your question from different perspectives.',
  },

  // Command Console
  'console.placeholder': { zh: '输入指令召唤智能体...', en: 'Enter command to summon agents...' },
  'console.transmitting': { zh: '传输中...', en: 'Transmission in progress...' },
  'console.abort': { zh: '中止', en: 'ABORT' },

  // HoloCard
  'card.unit': { zh: '单元', en: 'UNIT' },
  'card.active': { zh: '神经链路激活', en: 'NEURAL LINK ACTIVE' },
  'card.initializing': { zh: '初始化中...', en: 'INITIALIZING...' },
  'card.standby': { zh: '待机', en: 'STANDBY' },
  'card.awaiting': { zh: '等待神经链路...', en: 'Awaiting neural link...' },
  'card.error': { zh: '错误', en: 'Error' },

  // Top HUD
  'hud.title': { zh: '司令官', en: 'Commander' },
  'hud.history': { zh: '历史记录', en: 'History' },

  // History Dialog
  'history.title': { zh: '历史记录', en: 'History' },
  'history.empty': { zh: '暂无会话记录', en: 'No sessions yet' },

  // Mobile Nav
  'mobile.chat': { zh: '对话', en: 'Chat' },
  'mobile.agents': { zh: '智能体', en: 'Agents' },
  'mobile.settings': { zh: '设置', en: 'Settings' },
  'mobile.enterCommand': { zh: '输入指令...', en: 'Enter command...' },

  // Agents Panel
  'agents.title': { zh: '智能体议会', en: 'AGENT COUNCIL' },
  'agents.subtitle': { zh: '多智能体协作系统', en: 'Multi-Agent Collaboration System' },

  // Settings
  'settings.title': { zh: '设置', en: 'SETTINGS' },
  'settings.subtitle': { zh: '系统配置', en: 'System Configuration' },
  'settings.language': { zh: '语言', en: 'LANGUAGE' },
  'settings.theme': { zh: '主题', en: 'THEME' },
  'settings.dark': { zh: '深色', en: 'DARK' },
  'settings.disconnect': { zh: '断开连接', en: 'DISCONNECT' },
} as const;

export type I18nKey = keyof typeof i18n;

export const t = (key: I18nKey, locale: Locale): string => {
  return i18n[key][locale];
};
