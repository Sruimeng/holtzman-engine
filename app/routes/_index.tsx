import { CommandConsole, HoloCard, Sidebar, StatusHud, ViewportLayers } from '@/components/nexus';
import { EngineEndpoint } from '@/constants/meta/service';
import { useFetchSSE } from '@/hooks/use-fetch-sse';
import { selectSynthesizerContent, useOrchestrationStore } from '@/store/orchestration';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// Mock session data for sidebar
const MOCK_SESSIONS = [
  { id: '1', active: true },
  { id: '2', active: false },
  { id: '3', active: false },
  { id: '4', active: false },
  { id: '5', active: false },
  { id: '6', active: false },
  { id: '7', active: false },
];

const GRID_CLASS: Record<number, string> = {
  1: 'grid-cols-1 max-w-xl mx-auto',
  2: 'grid-cols-2 max-w-4xl mx-auto',
  3: 'grid-cols-3 max-w-6xl mx-auto',
  4: 'grid-cols-2 max-w-4xl mx-auto',
};

const getGridClass = (count: number) => GRID_CLASS[count] || 'grid-cols-3 max-w-6xl mx-auto';

function EmptyState() {
  return (
    <div className="relative z-10 min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="mb-6 text-6xl opacity-20">
        <span className="i-carbon-ai-status inline-block" />
      </div>
      <h1 className="mb-2 text-2xl text-text-primary font-bold">Nexus Boardroom</h1>
      <p className="max-w-md text-text-secondary">
        Enter a query below to summon the council. Multiple AI agents will analyze your question
        from different perspectives.
      </p>
    </div>
  );
}

export default function IndexRoute() {
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState<string | null>(null);
  const prevStatusRef = useRef<string | null>(null);

  const {
    status,
    agents,
    history,
    handleSSEEvent,
    startOrchestration,
    addToHistory,
    reset,
    error,
  } = useOrchestrationStore();

  const synthesizerContent = useOrchestrationStore(selectSynthesizerContent);

  // Add synthesizer content to history when orchestration finishes
  useEffect(() => {
    const wasStreaming = prevStatusRef.current === 'streaming';
    const allDone = Object.values(agents).every((a) => a.status === 'done' || a.status === 'error');

    if (wasStreaming && allDone && synthesizerContent) {
      addToHistory({ role: 'assistant', content: synthesizerContent });
    }

    prevStatusRef.current = status;
  }, [status, agents, synthesizerContent, addToHistory]);

  const requestBody = useMemo(
    () => (activeQuery ? { mode: 'polymath', query: activeQuery, config: {}, history } : null),
    [activeQuery, history],
  );

  const onMessage = useCallback((event: any) => handleSSEEvent(event), [handleSSEEvent]);
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
    reset();
    startOrchestration(query);
    setActiveQuery(query);
    setQuery('');
  };

  const handleStop = () => {
    setActiveQuery(null);
    reset();
  };

  const agentList = useMemo(() => Object.values(agents), [agents]);

  const { normal, synthesizer } = useMemo(() => {
    const synth = agentList.find((a) => a.role === 'synthesizer');
    const rest = agentList.filter((a) => a.role !== 'synthesizer');
    return { normal: rest, synthesizer: synth };
  }, [agentList]);

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
      <StatusHud title="Nexus Boardroom" sessionId="#020617" />
      <Sidebar
        sessions={MOCK_SESSIONS}
        onSessionClick={(id) => console.log('Session clicked:', id)}
        onSettingsClick={() => console.log('Settings clicked')}
      />

      {/* Background Video */}
      <div className="fixed inset-0 z-0">
        <video autoPlay loop muted playsInline className="h-full w-full object-cover opacity-40">
          <source src="/static/video/core-loop.mp4" type="video/mp4" />
        </video>
        {/* Overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[url('/static/images/grid.webp')] opacity-20" />
      </div>

      <main className="ml-64 min-h-screen px-6 pb-32 pt-16">
        {error && (
          <div className="mb-6 border border-red-500/30 rounded-lg bg-red-900/20 p-4 text-red-300 backdrop-blur">
            <span className="text-sm font-mono">Error: {error}</span>
          </div>
        )}

        {agentList.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="relative z-10 mx-auto max-w-6xl py-8">
            <div className={`grid gap-6 ${getGridClass(gridCount)}`}>
              {normal.map((agent) => (
                <HoloCard key={agent.id} agent={agent} />
              ))}
              {synthesizer && (
                <div className="col-span-full flex justify-center">
                  <HoloCard agent={synthesizer} wide />
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <CommandConsole
        value={query}
        onChange={setQuery}
        onSubmit={handleSubmit}
        disabled={false}
        isThinking={isThinking}
      />
    </ViewportLayers>
  );
}
