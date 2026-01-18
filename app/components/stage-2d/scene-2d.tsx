import { cn } from '@/lib/utils';
import type { Message } from '@/store/chat-store';
import { motion } from 'framer-motion';
import { throttle } from 'lodash-es';
import type { PropsWithChildren } from 'react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { HoloCard } from './holo-card';

type AgentType = 'pragmatist' | 'critic' | 'historian' | 'expander';

interface Scene2DProps extends PropsWithChildren {
  className?: string;
  showCards?: boolean;
  agentMessages?: Message[];
  streamingAgents?: Set<string>;
}

const PARALLAX = { video: 0.02, particles: 0.05, cards: 0.1 };

const entryVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.3, delayChildren: 0 } },
};

const videoVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.6, transition: { duration: 0.5 } },
};

const cardContainerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.8 } },
};

function NoiseLayer() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-5"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

function VideoLayer({ parallax }: { parallax: { x: number; y: number } }) {
  return (
    <motion.div className="absolute inset-0" variants={videoVariants} style={parallax}>
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          mixBlendMode: 'screen',
          maskImage: 'radial-gradient(ellipse 80% 80% at center, black 20%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at center, black 20%, transparent 70%)',
        }}
      >
        <source src="/static/video/Sci_Fi_Plasma_Vortex_Video_Generation.mp4" type="video/mp4" />
      </video>
    </motion.div>
  );
}

const CardStage = memo(
  function CardStage({
    messages,
    streamingAgents,
    parallax,
  }: {
    messages: Message[];
    streamingAgents: Set<string>;
    parallax: { x: number; y: number };
  }) {
    const validAgents: AgentType[] = ['pragmatist', 'critic', 'historian', 'expander'];
    const isValidAgent = (id: string): id is AgentType => validAgents.includes(id as AgentType);

    return (
      <motion.div
        className="absolute inset-0 flex items-center justify-center gap-8 px-8"
        variants={cardContainerVariants}
        style={parallax}
      >
        {messages.map((msg) => (
          <HoloCard
            key={msg.id}
            agent={isValidAgent(msg.agentId) ? msg.agentId : 'pragmatist'}
            isActive={streamingAgents.has(msg.agentId)}
          >
            <p>{msg.content || 'Waiting...'}</p>
          </HoloCard>
        ))}
      </motion.div>
    );
  },
  (prev, next) =>
    prev.messages.length === next.messages.length &&
    prev.streamingAgents.size === next.streamingAgents.size &&
    prev.parallax.x === next.parallax.x &&
    prev.parallax.y === next.parallax.y,
);

export function Scene2D({
  children,
  className,
  showCards = true,
  agentMessages = [],
  streamingAgents = new Set(),
}: Scene2DProps) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const throttledSetMouse = useRef(
    throttle((x: number, y: number) => {
      setMouse({ x, y });
    }, 16),
  ).current;

  useEffect(() => {
    return () => throttledSetMouse.cancel();
  }, [throttledSetMouse]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      throttledSetMouse(x, y);
    },
    [throttledSetMouse],
  );

  const videoParallax = useMemo(
    () => ({ x: mouse.x * 20 * PARALLAX.video, y: mouse.y * 20 * PARALLAX.video }),
    [mouse.x, mouse.y],
  );
  const particleParallax = useMemo(
    () => ({ x: mouse.x * 20 * PARALLAX.particles, y: mouse.y * 20 * PARALLAX.particles }),
    [mouse.x, mouse.y],
  );
  const cardParallax = useMemo(
    () => ({ x: mouse.x * 20 * PARALLAX.cards * -1, y: mouse.y * 10 * PARALLAX.cards * -1 }),
    [mouse.x, mouse.y],
  );

  return (
    <motion.div
      className={cn('relative w-full h-screen overflow-hidden', className)}
      style={{ backgroundColor: '#020617' }}
      onMouseMove={handleMouseMove}
      initial="hidden"
      animate="visible"
      variants={entryVariants}
    >
      <NoiseLayer />
      <VideoLayer parallax={videoParallax} />
      <motion.div className="pointer-events-none absolute inset-0" style={particleParallax}>
        <div className="absolute inset-0 animate-pulse bg-gradient-radial from-cyan-500/5 via-transparent to-transparent" />
      </motion.div>
      {showCards && agentMessages.length > 0 && (
        <CardStage
          messages={agentMessages}
          streamingAgents={streamingAgents}
          parallax={cardParallax}
        />
      )}
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}
