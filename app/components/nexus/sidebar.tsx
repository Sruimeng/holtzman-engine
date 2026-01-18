import { Icon } from '@iconify/react';

interface Session {
  id: string;
  active?: boolean;
}

interface SidebarProps {
  sessions?: Session[];
  onSessionClick?: (id: string) => void;
  onSettingsClick?: () => void;
}

const GLASS = 'bg-slate-900/40 backdrop-blur-xl backdrop-saturate-150';

export function Sidebar({ sessions = [], onSessionClick, onSettingsClick }: SidebarProps) {
  return (
    <aside
      className={`
        fixed left-0 top-0 z-50
        flex h-screen w-20 flex-col items-center
        border-r border-white/5 rounded-r-2xl
        py-6 ${GLASS}
      `}
    >
      {/* Avatar */}
      <div className="relative mb-8">
        <div className="h-12 w-12 flex animate-pulse items-center justify-center rounded-full from-cyan-400 to-cyan-600 bg-gradient-to-br shadow-[0_0_20px_rgba(6,182,212,0.5)]">
          <Icon icon="mdi:account" className="text-2xl text-white" />
        </div>
      </div>

      {/* History Section */}
      <div className="w-full flex flex-1 flex-col items-center px-3">
        <span className="mb-4 text-xs text-text-secondary tracking-wider">HIST</span>

        <div className="flex flex-col items-center gap-3">
          {sessions.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onSessionClick?.(s.id)}
              className="group relative flex items-center"
            >
              {s.active && <div className="absolute h-4 w-0.5 rounded-r bg-cyan-400 -left-3" />}
              <div
                className={`
                  h-3 w-3 rounded-full transition-all duration-200
                  ${
                    s.active
                      ? 'bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.6)]'
                      : 'bg-slate-500/60 group-hover:bg-slate-400'
                  }
                `}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Settings */}
      <button
        type="button"
        onClick={onSettingsClick}
        className="group rounded-lg p-2 text-text-secondary transition-all duration-300 hover:bg-white/5 hover:text-text-primary"
      >
        <Icon
          icon="mdi:cog"
          className="text-xl transition-transform duration-500 group-hover:rotate-90"
        />
      </button>
    </aside>
  );
}
