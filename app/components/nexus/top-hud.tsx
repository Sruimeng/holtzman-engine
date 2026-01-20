import { cn, Icon } from '@sruim/nexus-design';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { t } from '../../constants/static/i18n';

interface TopHudProps {
  user: { name: string; avatar?: string };
  locale: 'zh' | 'en';
  onLocaleChange: (locale: 'zh' | 'en') => void;
  onHistoryClick?: () => void;
}

const DiamondLogo = () => (
  <div className="relative h-12 w-12 flex-shrink-0">
    <div className="absolute inset-0 rotate-45 rounded-lg bg-cyan-500/30 blur-md" />
    <div className="absolute inset-1 rotate-45 border-2 border-cyan-400 rounded-lg bg-slate-950/80" />
    <div className="absolute inset-3 rotate-45 border border-cyan-400/50 rounded bg-cyan-500/20" />
  </div>
);

export const TopHud = ({ user, locale, onLocaleChange, onHistoryClick }: TopHudProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="pointer-events-none fixed left-0 right-0 top-0 z-50 h-16 flex items-center justify-between px-6">
      {/* Left: Logo + Title */}
      <div className="pointer-events-auto flex items-center gap-4">
        <DiamondLogo />
        <div className="flex flex-col">
          <div className="text-xl text-white font-bold leading-none tracking-wider">NEXUS</div>
          <div className="text-xs text-cyan-400 leading-tight tracking-[0.3em] font-mono">
            BOARDROOM
          </div>
        </div>
      </div>

      {/* Right: Lang Switch + User Capsule */}
      <div className="pointer-events-auto flex items-center gap-10">
        {/* Language Toggle - EN / 中 */}
        <div className="flex items-center gap-4 text-sm tracking-wider font-mono">
          <button
            onClick={() => onLocaleChange('en')}
            className={cn(
              'transition-all duration-300',
              locale === 'en'
                ? 'text-slate-100 font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]'
                : 'text-slate-600 hover:text-slate-400',
            )}
          >
            EN
          </button>
          <span className="text-xs text-slate-800">/</span>
          <button
            onClick={() => onLocaleChange('zh')}
            className={cn(
              'transition-all duration-300',
              locale === 'zh'
                ? 'text-cyan-400 font-bold drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]'
                : 'text-slate-600 hover:text-slate-400',
            )}
          >
            中
          </button>
        </div>

        {/* User Capsule - Avatar + Name + Dropdown Arrow */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={cn(
              'group flex items-center gap-4 rounded-xl border px-1.5 py-1.5 pr-4 transition-all duration-300 outline-none',
              isDropdownOpen
                ? 'border-cyan-500/50 bg-slate-900/80 shadow-[0_0_20px_-5px_rgba(6,182,212,0.3)] ring-1 ring-cyan-500/30'
                : 'border-white/5 bg-slate-900/40 hover:border-white/10 hover:bg-slate-900/60',
            )}
          >
            {/* Avatar */}
            <div className="relative h-9 w-9">
              <div className="h-full w-full overflow-hidden border border-white/10 rounded-lg bg-slate-800 shadow-inner">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center from-slate-800 to-slate-900 bg-gradient-to-br text-xs text-slate-400 font-medium font-mono">
                    {initials}
                  </div>
                )}
              </div>
              {/* Online dot - Overlapping corner */}
              <div className="absolute h-3 w-3 border-2 border-slate-950 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] -bottom-1 -right-1" />
            </div>

            {/* Name */}
            <span className="md:block hidden text-sm text-slate-200 font-medium tracking-wide transition-colors group-hover:text-white">
              {user.name}
            </span>

            {/* Dropdown Arrow */}
            <Icon
              icon="i-carbon-chevron-down"
              className={cn(
                'text-xs text-slate-500 transition-transform duration-300',
                isDropdownOpen ? 'rotate-180 text-cyan-400' : 'group-hover:text-slate-300',
              )}
            />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 8 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden border border-white/10 rounded-xl bg-slate-950/90 p-2 shadow-2xl ring-1 ring-white/5 backdrop-blur-3xl"
                >
                  {/* Menu Items */}
                  <div className="space-y-1">
                    <button className="group w-full flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm text-slate-200 transition-all hover:bg-white/5 hover:text-white">
                      <Icon
                        icon="i-carbon-settings"
                        className="text-lg text-slate-400 transition-colors group-hover:text-cyan-400"
                      />
                      {t('settings.title', locale)}
                    </button>
                    <button
                      onClick={() => {
                        onHistoryClick?.();
                        setIsDropdownOpen(false);
                      }}
                      className="group w-full flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm text-slate-200 transition-all hover:bg-white/5 hover:text-white"
                    >
                      <Icon
                        icon="i-carbon-time"
                        className="text-lg text-slate-400 transition-colors group-hover:text-cyan-400"
                      />
                      {t('history.title', locale)}
                    </button>
                    <div className="my-2 h-px from-transparent via-white/10 to-transparent bg-gradient-to-r" />
                    <button className="group w-full flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm text-rose-400 transition-all hover:bg-rose-500/10 hover:text-rose-300">
                      <Icon
                        icon="i-carbon-logout"
                        className="text-lg transition-transform group-hover:scale-110"
                      />
                      {t('settings.disconnect', locale)}
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
