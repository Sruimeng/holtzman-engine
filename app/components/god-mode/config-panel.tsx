import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

import { useGodModeStore, type PersonaConfig } from '@/store/god-mode-store';
import { PersonaSlider } from './persona-slider';
import { PromptEditor } from './prompt-editor';

const PERSONA_COLORS: Record<keyof PersonaConfig, string> = {
  critic: '#F43F5E',
  historian: '#F59E0B',
  pragmatist: '#10B981',
  expander: '#A855F7',
};

interface Props {
  sessionId?: string;
}

export function ConfigPanel({ sessionId }: Props) {
  const { isOpen, config, toggle, updateConfig, resetToDefault, persist } = useGodModeStore();

  const handlePersonaChange = (key: keyof PersonaConfig, value: number) => {
    updateConfig({ personas: { ...config.personas, [key]: value } });
  };

  const handleSave = async () => {
    if (!sessionId) return;
    await persist(sessionId);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '-100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed left-16 right-0 top-14 z-30 overflow-hidden border-b border-white/10 bg-slate-950/80 shadow-2xl backdrop-blur-xl"
        >
          <div className="pointer-events-none absolute left-1/2 h-[120px] w-[250px] bg-cyan-500/20 blur-[60px] -top-16 -translate-x-1/2" />
          <div className="relative z-10 mx-auto max-w-4xl p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg text-cyan-100 tracking-widest font-mono drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                GOD MODE CONFIGURATION
              </h2>
              <button
                onClick={toggle}
                className="rounded-full p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-6">
                <div>
                  <span className="text-dim mb-4 block text-xs tracking-widest font-mono uppercase">
                    Temperature
                  </span>
                  <PersonaSlider
                    label=""
                    value={config.temperature * 100}
                    onChange={(v) => updateConfig({ temperature: v / 100 })}
                    color="#38BDF8"
                  />
                </div>

                <div className="space-y-4">
                  <span className="text-dim block text-xs tracking-widest font-mono uppercase">
                    Persona Weights
                  </span>
                  {(Object.keys(config.personas) as (keyof PersonaConfig)[]).map((key) => (
                    <PersonaSlider
                      key={key}
                      label={key}
                      value={config.personas[key]}
                      onChange={(v) => handlePersonaChange(key, v)}
                      color={PERSONA_COLORS[key]}
                    />
                  ))}
                </div>
              </div>

              <PromptEditor
                value={config.systemPrompt}
                onChange={(v) => updateConfig({ systemPrompt: v })}
                onSave={handleSave}
                onReset={resetToDefault}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
