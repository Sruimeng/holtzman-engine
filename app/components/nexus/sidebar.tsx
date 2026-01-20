import { cn, Icon } from '@sruim/nexus-design';

interface Session {
  id: string;
  title: string;
  active?: boolean;
}

interface SidebarProps {
  sessions?: Session[];
  currentSessionId?: string | null;
  onSessionClick?: (id: string) => void;
  onNewSession?: () => void;
  onSettingsClick?: () => void;
}

const GLASS = 'bg-slate-900/40 backdrop-blur-xl backdrop-saturate-150';

export function Sidebar({
  sessions = [],
  currentSessionId,
  onSessionClick,
  onNewSession,
  onSettingsClick,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        'fixed left-4 top-4 bottom-4 z-50',
        'flex w-64 flex-col items-center',
        'border border-white/10 rounded-2xl',
        'py-8 shadow-lg shadow-black/20',
        GLASS,
      )}
    >
      {/* Avatar */}
      <div className="relative mb-10 flex flex-col items-center gap-3">
        <div className="h-16 w-16 flex animate-pulse items-center justify-center rounded-full from-cyan-400 to-cyan-600 bg-gradient-to-br shadow-[0_0_20px_rgba(6,182,212,0.5)]">
          <Icon icon="i-carbon-user-avatar" className="text-3xl text-white" />
        </div>
        <div className="text-center">
          <div className="text-xs text-cyan-400 font-bold tracking-widest uppercase">Histeos</div>
          <div className="text-[10px] text-text-secondary">Commander</div>
        </div>
      </div>

      {/* History Section */}
      <div className="w-full flex flex-1 flex-col px-4">
        <div className="mb-4 flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            <span className="text-xs text-text-secondary font-bold tracking-widest uppercase">
              Sessions
            </span>
          </div>
          {onNewSession && (
            <button
              type="button"
              onClick={onNewSession}
              className="text-text-secondary transition-colors hover:text-cyan-400"
            >
              <Icon icon="i-carbon-add" className="text-lg" />
            </button>
          )}
        </div>

        <div className="flex flex-col gap-1 overflow-y-auto pr-1 scrollbar-thin">
          {sessions.map((s) => {
            const isActive = s.id === currentSessionId;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onSessionClick?.(s.id)}
                className={cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-200',
                  isActive
                    ? 'bg-white/10 text-cyan-400'
                    : 'text-text-secondary hover:bg-white/5 hover:text-text-primary',
                )}
              >
                <div
                  className={cn(
                    'h-2 w-2 flex-shrink-0 rounded-full transition-all duration-300',
                    isActive
                      ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] scale-110'
                      : 'bg-slate-600 group-hover:bg-slate-400',
                  )}
                />
                <span className="truncate text-sm font-mono">{s.title}</span>
                {isActive && (
                  <div className="ml-auto h-1.5 w-1.5 flex-shrink-0 animate-pulse rounded-full bg-cyan-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Settings */}
      <div className="mt-4 w-full px-4">
        <button
          type="button"
          onClick={onSettingsClick}
          className="w-full flex items-center gap-3 border border-white/5 rounded-xl bg-white/5 p-3 text-text-secondary transition-all duration-300 hover:border-white/10 hover:bg-white/10 hover:text-text-primary"
        >
          <Icon
            icon="i-carbon-settings"
            className="text-lg transition-transform duration-500 group-hover:rotate-90"
          />
          <span className="text-sm font-medium">Settings</span>
        </button>
      </div>
    </aside>
  );
}
