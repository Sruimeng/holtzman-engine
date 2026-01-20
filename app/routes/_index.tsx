import { CommandConsole, HoloCard, MobileNav, TopHud, ViewportLayers } from '@/components/nexus';
import { EngineEndpoint } from '@/constants/meta/service';
import { t, type Locale } from '@/constants/static/i18n';
import { useFetchSSE } from '@/hooks/use-fetch-sse';
import { useMobile } from '@/hooks/use-mobile';
import {
  generateSessionId,
  generateSessionTitle,
  useSessionStorage,
  type Session,
} from '@/hooks/use-session-storage';
import {
  selectRounds,
  selectSynthesizerContent,
  useOrchestrationStore,
} from '@/store/orchestration';
import type { SSEEvent } from '@/utils/sse-parser';
import { cn, Dialog, Icon } from '@sruim/nexus-design';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const GRID_CLASS: Record<number, string> = {
  1: 'grid-cols-1 max-w-xl mx-auto',
  2: 'grid-cols-2 max-w-4xl mx-auto',
  3: 'grid-cols-3 max-w-6xl mx-auto',
  4: 'grid-cols-2 max-w-4xl mx-auto',
};

const getGridClass = (count: number) => GRID_CLASS[count] || 'grid-cols-3 max-w-6xl mx-auto';

function EmptyState({ locale }: { locale: Locale }) {
  return (
    <div className="relative z-10 min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="mb-6 text-6xl opacity-20">
        <Icon icon="i-carbon-ai-status" className="inline-block" />
      </div>
      <h1 className="mb-2 text-2xl text-text-primary font-bold">{t('empty.title', locale)}</h1>
      <p className="max-w-md text-text-secondary">{t('empty.description', locale)}</p>
    </div>
  );
}

export default function IndexRoute() {
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState<string | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const prevStatusRef = useRef<string | null>(null);
  const [locale, setLocale] = useState<'zh' | 'en'>('zh');
  const [mobileTab, setMobileTab] = useState<'chat' | 'agents' | 'settings'>('chat');
  const isMobile = useMobile();

  const { sessions, saveSession, getSession } = useSessionStorage();

  const {
    status,
    rounds,
    history,
    cardCollapsed,
    handleSSEEvent,
    startOrchestration,
    addToHistory,
    setHistory,
    setRounds,
    setCardCollapsed,
    reset,
    error,
  } = useOrchestrationStore();

  const allRounds = useOrchestrationStore(selectRounds);
  const synthesizerContent = useOrchestrationStore(selectSynthesizerContent);

  // Save session when status becomes finished
  useEffect(() => {
    if (!currentSessionId || status !== 'finished') return;

    const session: Session = {
      id: currentSessionId,
      title: generateSessionTitle(history[0]?.content || 'New Session'),
      history,
      rounds,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    saveSession(session);
  }, [status, history, rounds, currentSessionId, saveSession]);

  // Add synthesizer content to history when orchestration finishes
  useEffect(() => {
    if (status === 'finished' && synthesizerContent && prevStatusRef.current !== 'finished') {
      addToHistory({ role: 'assistant', content: synthesizerContent });
      queueMicrotask(() => setActiveQuery(null));
    }
    prevStatusRef.current = status;
  }, [status, synthesizerContent, addToHistory]);

  const requestBody = useMemo(
    () => (activeQuery ? { mode: 'polymath', query: activeQuery, config: {}, history } : null),
    [activeQuery, history],
  );

  const onMessage = useCallback((event: SSEEvent) => handleSSEEvent(event), [handleSSEEvent]);
  const onError = useCallback(
    (err: Error) => handleSSEEvent({ event: 'error', data: { error: err.message } }),
    [handleSSEEvent],
  );

  useFetchSSE({
    url: EngineEndpoint,
    body: requestBody,
    onMessage,
    onError,
    enabled: !!activeQuery && status !== 'finished' && status !== 'error',
  });

  const handleStart = () => {
    if (!query.trim()) return;
    if (!currentSessionId) {
      setCurrentSessionId(generateSessionId());
    }
    startOrchestration(query);
    setActiveQuery(query);
    setQuery('');
  };

  const handleStop = () => {
    setActiveQuery(null);
  };

  const handleSessionSelect = async (sessionId: string) => {
    const session = await getSession(sessionId);
    if (!session) return;
    setHistory(session.history);
    setRounds(session.rounds);
    setCurrentSessionId(sessionId);
  };

  const handleNewSession = () => {
    setActiveQuery(null);
    reset();
    setCurrentSessionId(null);
  };

  // Flatten all agents from all rounds for display (with roundId for unique keys)
  const allAgentsWithRound = useMemo(
    () =>
      allRounds.flatMap((r) =>
        Object.values(r.agents).map((agent) => ({ ...agent, roundId: r.id })),
      ),
    [allRounds],
  );

  const { normal, synthesizers } = useMemo(() => {
    const synths = allAgentsWithRound.filter((a) => a.role === 'synthesizer');
    const rest = allAgentsWithRound.filter((a) => a.role !== 'synthesizer');
    return { normal: rest, synthesizers: synths };
  }, [allAgentsWithRound]);

  const isRunning = status === 'orchestrating' || status === 'streaming';
  const isThinking = status === 'orchestrating';
  const gridCount = normal.length || 1;

  const handleSubmit = () => {
    if (isRunning) {
      handleStop();
    } else {
      handleStart();
    }
  };

  return (
    <ViewportLayers>
      {!isMobile && (
        <TopHud
          user={{ name: 'Commander Alex' }}
          locale={locale}
          onLocaleChange={setLocale}
          onHistoryClick={() => setHistoryOpen(true)}
        />
      )}

      <main className={isMobile ? 'min-h-screen px-4 pb-24 pt-8' : 'min-h-screen px-6 pb-32 pt-24'}>
        {error && (
          <div className="mb-6 border border-red-500/30 rounded-lg bg-red-900/20 p-4 text-red-300 backdrop-blur">
            <span className="text-sm font-mono">Error: {error}</span>
          </div>
        )}

        {allAgentsWithRound.length === 0 ? (
          <EmptyState locale={locale} />
        ) : (
          <div className="relative z-10 mx-auto max-w-6xl py-8">
            <div
              className={isMobile ? 'flex flex-col gap-4' : `grid gap-6 ${getGridClass(gridCount)}`}
            >
              {normal.map((agent) => {
                const cardKey = `${agent.roundId}-${agent.id}`;
                const isCollapsed = cardCollapsed[cardKey] ?? false;
                return (
                  <HoloCard
                    key={cardKey}
                    agent={agent}
                    collapsed={isCollapsed}
                    onCollapsedChange={(c) => setCardCollapsed(cardKey, c)}
                    locale={locale}
                  />
                );
              })}
              {synthesizers.map((synth) => {
                const cardKey = `${synth.roundId}-${synth.id}`;
                const isCollapsed = cardCollapsed[cardKey] ?? false;
                return (
                  <div
                    key={cardKey}
                    className={isMobile ? '' : 'col-span-full flex justify-center'}
                  >
                    <HoloCard
                      agent={synth}
                      wide={!isMobile}
                      collapsed={isCollapsed}
                      onCollapsedChange={(c) => setCardCollapsed(cardKey, c)}
                      locale={locale}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {isMobile ? (
        <MobileNav
          activeTab={mobileTab}
          onTabChange={setMobileTab}
          query={query}
          onQueryChange={setQuery}
          onSubmit={handleSubmit}
          isStreaming={isRunning}
          onStop={handleStop}
          onHistoryClick={() => setHistoryOpen(true)}
          onNewSession={handleNewSession}
          locale={locale}
          onLocaleChange={setLocale}
        />
      ) : (
        <CommandConsole
          value={query}
          onChange={setQuery}
          onSubmit={handleSubmit}
          disabled={false}
          isThinking={isThinking}
          onStop={handleStop}
          isStreaming={isRunning}
          onNewSession={handleNewSession}
          locale={locale}
        />
      )}

      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <div className="max-h-[60vh] w-[400px] overflow-hidden border border-white/10 rounded-2xl bg-slate-900/90 p-6 backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg text-text-primary font-bold">{t('history.title', locale)}</h2>
            <button
              onClick={() => setHistoryOpen(false)}
              className="text-text-secondary transition-colors hover:text-text-primary"
            >
              <Icon icon="i-carbon-close" className="text-xl" />
            </button>
          </div>
          <div className="max-h-[calc(60vh-100px)] flex flex-col gap-2 overflow-y-auto">
            {sessions.length === 0 ? (
              <p className="py-8 text-center text-text-secondary">{t('history.empty', locale)}</p>
            ) : (
              sessions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    handleSessionSelect(s.id);
                    setHistoryOpen(false);
                  }}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-4 py-3 text-left transition-all',
                    s.id === currentSessionId
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'bg-white/5 text-text-secondary hover:bg-white/10 hover:text-text-primary',
                  )}
                >
                  <Icon icon="i-carbon-chat" className="flex-shrink-0" />
                  <span className="truncate text-sm">{s.title}</span>
                </button>
              ))
            )}
          </div>
        </div>
      </Dialog>
    </ViewportLayers>
  );
}
