import { ChevronDown, Globe, Settings, User } from 'lucide-react';
import { useRef, useState } from 'react';

import { connectPolymath } from '@/lib/services/polymath';
import type { PolymathEvent } from '@/types/polymath';

interface Message {
  id: string;
  agent: string;
  content: string;
  role: 'user' | 'assistant';
}

type AgentType = 'pragmatist' | 'critic' | 'historian' | 'expander';

const AGENT_CONFIG: Record<AgentType, { label: string; color: string }> = {
  pragmatist: { label: 'Pragmatist', color: 'emerald' },
  critic: { label: 'Critic', color: 'rose' },
  historian: { label: 'Historian', color: 'amber' },
  expander: { label: 'Expander', color: 'violet' },
};

const GOD_MODES = ['Balanced', 'Creative', 'Precise', 'Fast'];

const LANGUAGES = [
  { code: 'zh-CN', label: '简体中文' },
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
];

function Sidebar({ language, onLanguageChange }: { language: string; onLanguageChange: (v: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <aside
      className="fixed left-0 top-0 z-50 flex h-full flex-col border-r border-white/10 bg-slate-900/80 backdrop-blur-xl transition-all duration-300"
      style={{ width: expanded ? 240 : 64 }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => { setExpanded(false); setLangOpen(false); }}
    >
      <header className="border-b border-white/10 p-3 text-center">
        {expanded && (
          <h1 className="mb-3 text-sm font-medium tracking-wide text-cyan-100/90">
            Nexus Boardroom
          </h1>
        )}
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-purple-500">
          <User size={20} className="text-white" />
        </div>
      </header>

      <nav className="flex-1 overflow-y-auto py-4">
        {expanded && <p className="px-4 text-xs text-white/40">Sessions coming soon</p>}
      </nav>

      <footer className="flex items-center border-t border-white/10 py-3" style={{ justifyContent: expanded ? 'space-between' : 'center', padding: expanded ? '12px 20px' : '12px' }}>
        <button className="p-2 text-slate-400 hover:text-cyan-400">
          <Settings size={20} />
        </button>

        {expanded && (
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-white/10 hover:text-cyan-400"
            >
              <Globe size={16} />
              <span>{currentLang.label}</span>
            </button>

            {langOpen && (
              <div className="absolute bottom-full left-0 mb-2 min-w-32 rounded-lg border border-white/10 bg-slate-900/95 p-2 backdrop-blur-xl">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { onLanguageChange(lang.code); setLangOpen(false); }}
                    className={`w-full rounded px-3 py-2 text-left text-sm ${
                      language === lang.code ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </footer>
    </aside>
  );
}

function TopNav({ sessionTitle, godMode, onGodModeChange }: {
  sessionTitle: string;
  godMode: string;
  onGodModeChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed left-16 right-0 top-0 z-40 border-b border-white/10 bg-slate-950/60 backdrop-blur-xl">
      <div className="flex h-14 items-center gap-4 px-6">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-cyan-500/50 bg-slate-900/80 px-4 py-2">
          <span className="text-xs text-cyan-300/70">Session:</span>
          <span className="text-sm text-white">{sessionTitle}</span>
        </div>

        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 rounded-lg border border-white/20 bg-slate-900/80 px-4 py-2 text-sm"
          >
            <span className="text-white/60">God Mode:</span>
            <span className="text-white">{godMode}</span>
            <ChevronDown size={14} className={`text-white/60 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>

          {open && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
              <div className="absolute right-0 top-full z-50 mt-2 min-w-40 rounded-lg border border-white/10 bg-slate-900/95 p-2 backdrop-blur-xl">
                {GOD_MODES.map((mode) => (
                  <button
                    key={mode}
                    onClick={() => { onGodModeChange(mode); setOpen(false); }}
                    className={`w-full rounded px-3 py-2 text-left text-sm ${
                      godMode === mode ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function AgentCard({ agent, content, isStreaming }: { agent: string; content: string; isStreaming: boolean }) {
  const config = AGENT_CONFIG[agent as AgentType] || { label: agent, color: 'slate' };

  return (
    <div
      className={`
        relative min-h-80 w-80 rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl
        ${isStreaming ? `border-${config.color}-500/50 shadow-lg` : ''}
      `}
    >
      <div className={`mb-4 text-xs font-bold uppercase tracking-widest text-${config.color}-400`}>
        {config.label} {isStreaming && <span className="animate-pulse">●</span>}
      </div>
      <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-300">{content || 'Thinking...'}</div>
    </div>
  );
}

function Console({ onSend }: { onSend: (query: string) => void }) {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue('');
  };

  return (
    <footer className="fixed bottom-0 left-16 right-0 z-40 p-4">
      <div className="mx-auto max-w-4xl rounded-xl border border-white/10 bg-slate-900/80 p-4 backdrop-blur-xl">
        <div className="flex gap-4">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSubmit())}
            placeholder="Ask something... (Enter to send, Shift+Enter for new line)"
            rows={3}
            className="max-h-40 min-h-20 flex-1 resize-none bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
          />
          <button
            onClick={handleSubmit}
            disabled={!value.trim()}
            className="self-end rounded-lg bg-cyan-600 px-6 py-2 text-sm font-medium text-white hover:bg-cyan-500 disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </div>
    </footer>
  );
}

export default function BoardroomRoute() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [streaming, setStreaming] = useState<Set<string>>(new Set());
  const [godMode, setGodMode] = useState('Balanced');
  const [language, setLanguage] = useState('zh-CN');
  const ctrlRef = useRef<AbortController | null>(null);

  const handleSend = async (query: string) => {
    ctrlRef.current?.abort();

    const userMsg: Message = { id: `user-${Date.now()}`, agent: 'user', content: query, role: 'user' };
    const prevMessages = [...messages, userMsg];
    setMessages(prevMessages);
    setStreaming(new Set());

    const history = prevMessages.map((m) => ({
      role: m.role,
      content: m.role === 'user' ? m.content : `[${m.agent}] ${m.content}`,
    }));

    try {
      ctrlRef.current = await connectPolymath({
        query,
        history,
        onEvent: (event: PolymathEvent) => {
          if (event.type === 'meta') {
            const agents = event.selected_agents;
            const newMsgs = agents.map((a) => ({
              id: `${a}-${Date.now()}`,
              agent: a,
              content: '',
              role: 'assistant' as const,
            }));
            setMessages((prev) => [...prev, ...newMsgs]);
            setStreaming(new Set(agents));
          } else if (event.type === 'stream') {
            setMessages((prev) =>
              prev.map((m) =>
                m.agent === event.agent && m.role === 'assistant' ? { ...m, content: m.content + event.delta } : m,
              ),
            );
          } else if (event.type === 'stream_end') {
            setStreaming((prev) => {
              const next = new Set(prev);
              next.delete(event.agent);
              return next;
            });
          }
        },
      });
    } catch {
      // Connection aborted or failed
    }
  };

  const agentMessages = messages.filter((m) => m.role === 'assistant');
  const hasMessages = agentMessages.length > 0;

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <Sidebar language={language} onLanguageChange={setLanguage} />
      <TopNav sessionTitle="Quantum Strategy" godMode={godMode} onGodModeChange={setGodMode} />

      <video
        autoPlay
        loop
        muted
        playsInline
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40"
        style={{
          mixBlendMode: 'screen',
          maskImage: 'radial-gradient(ellipse 80% 80% at center, black 20%, transparent 70%)',
        }}
      >
        <source src="/static/video/Sci_Fi_Plasma_Vortex_Video_Generation.mp4" type="video/mp4" />
      </video>

      <main className="relative z-10 ml-16 flex min-h-screen flex-col items-center justify-center px-8 pb-32 pt-20">
        {!hasMessages && <h1 className="text-2xl font-light tracking-wide text-slate-400">Polymath Chat</h1>}

        {hasMessages && (
          <div className="flex flex-wrap justify-center gap-6">
            {agentMessages.map((m) => (
              <AgentCard key={m.id} agent={m.agent} content={m.content} isStreaming={streaming.has(m.agent)} />
            ))}
          </div>
        )}
      </main>

      <Console onSend={handleSend} />
    </div>
  );
}
