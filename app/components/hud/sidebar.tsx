import { useLiveQuery } from 'dexie-react-hooks';
import { Settings, User } from 'lucide-react';
import { useState } from 'react';

import { LanguageButton } from '@/components/settings/language-modal';
import { db, type Session } from '@/lib/dexie/db';

interface Props {
  activeSessionId?: string | null;
  onSessionSelect?: (id: string) => void;
}

function Avatar({ compact = false }: { compact?: boolean }) {
  const size = compact ? 40 : 80;
  const iconSize = compact ? 20 : 32;

  return (
    <div className="relative mx-auto">
      <div className="absolute inset-0 rounded-full from-cyan-400 via-purple-500 to-cyan-400 bg-gradient-to-br opacity-60 blur-md" />
      <div
        className="relative rounded-full from-cyan-400 via-purple-500 to-cyan-400 bg-gradient-to-br p-[2px] shadow-[0_0_25px_rgba(34,211,238,0.4),0_0_50px_rgba(168,85,247,0.2)]"
        style={{ width: size, height: size }}
      >
        <div className="h-full w-full flex items-center justify-center rounded-full bg-slate-900/90">
          <User size={iconSize} className="text-cyan-200/70" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}

interface SessionItemProps {
  session: Session;
  isActive: boolean;
  expanded: boolean;
  onSelect?: (id: string) => void;
}

function SessionItem({ session, isActive, expanded, onSelect }: SessionItemProps) {
  const activeClass = isActive
    ? 'text-cyan-100 bg-gradient-to-r from-cyan-900/30 to-transparent border-l-2 border-cyan-400 shadow-[inset_0_0_12px_rgba(34,211,238,0.1)]'
    : 'text-dim hover:text-holo hover:bg-white/5 border-l-2 border-transparent';

  return (
    <li>
      <button
        className={`flex w-full items-center gap-2 px-3 py-2 rounded-md transition-all ${activeClass}`}
        onClick={() => onSelect?.(session.id)}
      >
        {isActive && (
          <span className="text-xs text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]">
            &#9654;
          </span>
        )}
        {!isActive && <span className="w-3" />}
        {expanded && (
          <span className="truncate text-sm tracking-wide font-mono">{session.title}</span>
        )}
        {isActive && (
          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
        )}
      </button>
    </li>
  );
}

interface SessionListProps {
  sessions: Session[];
  activeId?: string | null;
  expanded: boolean;
  onSelect?: (id: string) => void;
}

function SessionList({ sessions, activeId, expanded, onSelect }: SessionListProps) {
  if (!sessions.length) {
    return expanded ? <p className="text-dim px-4 text-sm">No sessions</p> : null;
  }

  return (
    <ul className="space-y-1">
      {sessions.map((s) => (
        <SessionItem
          key={s.id}
          session={s}
          isActive={s.id === activeId}
          expanded={expanded}
          onSelect={onSelect}
        />
      ))}
    </ul>
  );
}

export function Sidebar({ activeSessionId, onSessionSelect }: Props) {
  const [expanded, setExpanded] = useState(false);
  const sessions = useLiveQuery(() => db.sessions.orderBy('updatedAt').reverse().toArray());

  return (
    <aside
      className="glass-panel fixed left-0 top-0 z-50 h-full flex flex-col overflow-hidden transition-all duration-300"
      style={{ width: expanded ? 240 : 64 }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[280px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/40 via-blue-950/20 to-transparent"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute left-1/2 top-[100px] h-28 w-28 rounded-full bg-cyan-500/20 blur-[50px] -translate-x-1/2"
        aria-hidden="true"
      />

      <header className="relative z-10 border-b border-white/8 p-3 text-center">
        {expanded && (
          <h1 className="mb-3 text-base text-cyan-100/90 font-medium tracking-wide">
            Nexus Boardroom
          </h1>
        )}
        <Avatar compact={!expanded} />
      </header>

      <nav className="relative z-10 flex-1 overflow-y-auto py-4">
        {expanded && (
          <p className="mb-2 px-4 text-xs text-white/40 tracking-wider font-mono">
            Recent sessions
          </p>
        )}
        <SessionList
          sessions={sessions ?? []}
          activeId={activeSessionId}
          expanded={expanded}
          onSelect={onSessionSelect}
        />
      </nav>

      <footer
        className={`relative z-10 flex items-center border-t border-white/5 py-3 ${
          expanded ? 'justify-between px-5' : 'flex-col gap-3 justify-center'
        }`}
      >
        <button className="hud-icon-btn p-1" aria-label="Settings">
          <Settings size={20} strokeWidth={1.5} />
        </button>
        <LanguageButton expanded={expanded} />
      </footer>
    </aside>
  );
}
