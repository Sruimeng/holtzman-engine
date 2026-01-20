import { AnimatePresence, motion } from 'framer-motion';
import { type KeyboardEvent, useState } from 'react';

import { cn, Icon } from '@sruim/nexus-design';
import { AGENT_THEMES } from '../../constants/static/agent-roles';
import { t } from '../../constants/static/i18n';
import type { AgentRole } from '../../utils/sse-parser';

const GLASS =
  'bg-slate-900/60 backdrop-blur-sm backdrop-saturate-150 border border-white/10 shadow-lg shadow-black/20';

interface MobileNavProps {
  activeTab: 'chat' | 'agents' | 'settings';
  onTabChange: (tab: 'chat' | 'agents' | 'settings') => void;
  query: string;
  onQueryChange: (value: string) => void;
  onSubmit: () => void;
  isStreaming?: boolean;
  onStop?: () => void;
  onHistoryClick?: () => void;
  onNewSession?: () => void;
  locale: 'zh' | 'en';
  onLocaleChange: (locale: 'zh' | 'en') => void;
}

const TABS = [
  { id: 'chat' as const, icon: 'i-carbon-chat', label: 'Chat' },
  { id: 'agents' as const, icon: 'i-carbon-ai-status', label: 'Agents' },
  { id: 'settings' as const, icon: 'i-carbon-settings', label: 'Settings' },
];

// Static color maps for UnoCSS JIT
const BG_COLOR: Record<string, string> = {
  rose: 'bg-rose-500/20',
  amber: 'bg-amber-500/20',
  purple: 'bg-purple-500/20',
  emerald: 'bg-emerald-500/20',
  blue: 'bg-blue-500/20',
  white: 'bg-white/20',
  teal: 'bg-teal-500/20',
};

const TEXT_COLOR: Record<string, string> = {
  rose: 'text-rose-400',
  amber: 'text-amber-400',
  purple: 'text-purple-400',
  emerald: 'text-emerald-400',
  blue: 'text-blue-400',
  white: 'text-white',
  teal: 'text-teal-400',
};

const AGENT_DESCRIPTIONS: Record<AgentRole, { en: string; zh: string }> = {
  critic: {
    en: 'Challenges assumptions and identifies potential flaws',
    zh: '质疑假设，发现潜在缺陷',
  },
  historian: {
    en: 'Provides historical context and precedents',
    zh: '提供历史背景和先例',
  },
  expander: {
    en: 'Explores creative possibilities and alternatives',
    zh: '探索创意可能性和替代方案',
  },
  pragmatist: {
    en: 'Focuses on practical implementation',
    zh: '关注实际落地方案',
  },
  verifier: {
    en: 'Validates facts and checks accuracy',
    zh: '验证事实，检查准确性',
  },
  synthesizer: {
    en: 'Integrates insights into cohesive conclusions',
    zh: '整合洞察，形成统一结论',
  },
  mediator: {
    en: 'Balances different viewpoints',
    zh: '平衡不同观点',
  },
};

export const MobileNav = ({
  activeTab,
  onTabChange,
  query,
  onQueryChange,
  onSubmit,
  isStreaming,
  onStop,
  onHistoryClick,
  onNewSession,
  locale,
  onLocaleChange,
}: MobileNavProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAgentsOpen, setIsAgentsOpen] = useState(false);

  const handleTabClick = (id: 'chat' | 'agents' | 'settings') => {
    if (id === 'settings') {
      setIsMenuOpen(true);
    } else if (id === 'agents') {
      setIsAgentsOpen(true);
    } else {
      onTabChange(id);
    }
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key !== 'Enter' || !query.trim()) return;
    onSubmit();
  };

  return (
    <>
      {/* Input Bar - increased bottom spacing */}
      <div
        className={cn(
          GLASS,
          'fixed bottom-24 left-4 right-4 h-14 flex items-center gap-3 rounded-2xl px-4 z-40',
        )}
      >
        {onNewSession && (
          <button
            onClick={onNewSession}
            className="flex-shrink-0 text-slate-400 transition-colors active:text-cyan-400"
          >
            <Icon icon="i-carbon-add" className="text-xl" />
          </button>
        )}
        {onHistoryClick && (
          <button
            onClick={onHistoryClick}
            className="flex-shrink-0 text-slate-400 transition-colors active:text-cyan-400"
          >
            <Icon icon="i-carbon-time" className="text-xl" />
          </button>
        )}
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={handleKey}
          placeholder={t('mobile.enterCommand', locale)}
          className="min-w-0 flex-1 bg-transparent text-sm text-slate-50 font-mono outline-none placeholder:text-slate-500"
        />
        {isStreaming ? (
          <button
            onClick={onStop}
            className="h-8 flex flex-shrink-0 items-center rounded-full bg-rose-500/20 px-3 text-xs text-rose-400 font-bold font-mono"
          >
            {t('common.stop', locale)}
          </button>
        ) : (
          <button
            onClick={onSubmit}
            disabled={!query.trim()}
            className={cn(
              'h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-full transition-colors',
              query.trim() ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-500',
            )}
          >
            <Icon icon="i-carbon-send" className="text-lg" />
          </button>
        )}
      </div>

      {/* Tab Bar */}
      <div
        className={cn(
          GLASS,
          'fixed bottom-0 left-0 right-0 h-20 pb-4 flex items-center justify-around z-50',
        )}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={cn(
              'flex flex-col items-center gap-1 px-6 py-2 transition-colors',
              activeTab === tab.id && tab.id !== 'settings' && tab.id !== 'agents'
                ? 'text-cyan-400'
                : 'text-white/60',
            )}
          >
            <Icon icon={tab.icon} className="text-2xl" />
            <span className="text-[10px] tracking-wider font-mono">{tab.label.toUpperCase()}</span>
          </button>
        ))}
      </div>

      {/* Agents Panel */}
      <AnimatePresence>
        {isAgentsOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            className="fixed inset-0 z-[60] flex flex-col bg-slate-900/80 p-6 pt-16"
          >
            <button
              onClick={() => setIsAgentsOpen(false)}
              className="absolute right-6 top-6 text-white/50 hover:text-white"
            >
              <Icon icon="i-carbon-close" className="text-3xl" />
            </button>

            <div className="mb-6 text-center">
              <div className="mb-1 text-xl text-white font-bold">{t('agents.title', locale)}</div>
              <div className="text-xs text-slate-400">{t('agents.subtitle', locale)}</div>
            </div>

            <div className="flex-1 overflow-y-auto pb-4 space-y-3">
              {(
                Object.entries(AGENT_THEMES) as [AgentRole, (typeof AGENT_THEMES)[AgentRole]][]
              ).map(([role, theme]) => (
                <div
                  key={role}
                  className="flex items-start gap-4 border border-white/10 rounded-xl bg-white/5 p-4"
                >
                  <div
                    className={cn(
                      'h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-full',
                      BG_COLOR[theme.color],
                    )}
                  >
                    <Icon icon={theme.icon} className={cn('text-xl', TEXT_COLOR[theme.color])} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className={cn('text-sm font-bold font-mono', TEXT_COLOR[theme.color])}>
                      {locale === 'zh' ? theme.labelCn : theme.label}
                    </div>
                    <div className="mt-1 text-xs text-slate-400 leading-relaxed">
                      {AGENT_DESCRIPTIONS[role][locale]}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Panel */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-slate-900/80 p-8"
          >
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute right-8 top-8 text-white/50 hover:text-white"
            >
              <Icon icon="i-carbon-close" className="text-3xl" />
            </button>

            <div className="max-w-sm w-full space-y-6">
              <div className="mb-8 text-center">
                <div className="mb-2 text-2xl text-white font-bold">
                  {t('settings.title', locale)}
                </div>
                <div className="text-sm text-slate-400">{t('settings.subtitle', locale)}</div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => onLocaleChange(locale === 'zh' ? 'en' : 'zh')}
                  className="h-14 w-full flex items-center justify-between border border-white/10 rounded-xl bg-white/5 px-6 transition-colors active:bg-white/10"
                >
                  <span className="text-white font-mono">{t('settings.language', locale)}</span>
                  <div className="flex gap-2 text-sm">
                    <span className={locale === 'en' ? 'text-cyan-400' : 'text-slate-500'}>EN</span>
                    <span className="text-slate-600">/</span>
                    <span className={locale === 'zh' ? 'text-cyan-400' : 'text-slate-500'}>ZH</span>
                  </div>
                </button>

                <button className="h-14 w-full flex items-center justify-between border border-white/10 rounded-xl bg-white/5 px-6 transition-colors active:bg-white/10">
                  <span className="text-white font-mono">{t('settings.theme', locale)}</span>
                  <span className="text-sm text-slate-400">{t('settings.dark', locale)}</span>
                </button>

                <button className="h-14 w-full flex items-center justify-between border border-rose-500/20 rounded-xl bg-rose-500/10 px-6 transition-colors active:bg-rose-500/20">
                  <span className="text-rose-400 font-mono">
                    {t('settings.disconnect', locale)}
                  </span>
                  <Icon icon="i-carbon-logout" className="text-rose-400" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
