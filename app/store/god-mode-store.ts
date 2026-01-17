import { db } from '@/lib/dexie/db';
import { create } from '@/store';

interface PersonaConfig {
  critic: number;
  historian: number;
  pragmatist: number;
  expander: number;
}

interface GodModeConfig {
  temperature: number;
  personas: PersonaConfig;
  systemPrompt: string;
}

interface GodModeState {
  isOpen: boolean;
  config: GodModeConfig;
}

interface GodModeActions {
  toggle: () => void;
  updateConfig: (patch: Partial<GodModeConfig>) => void;
  resetToDefault: () => void;
  persist: (sessionId: string) => Promise<void>;
}

type GodModeStore = GodModeState & GodModeActions;

const DEFAULT_CONFIG: GodModeConfig = {
  temperature: 0.7,
  personas: {
    critic: 50,
    historian: 50,
    pragmatist: 50,
    expander: 50,
  },
  systemPrompt: '',
};

const godModeStore = create<GodModeState, GodModeStore>(
  'god-mode-store',
  (initial) => (set, get) => ({
    isOpen: initial.isOpen ?? false,
    config: initial.config ?? { ...DEFAULT_CONFIG },

    toggle: () => set({ isOpen: !get().isOpen }),

    updateConfig: (patch) => {
      const current = get().config;
      set({
        config: {
          ...current,
          ...patch,
          personas: patch.personas ? { ...current.personas, ...patch.personas } : current.personas,
        },
      });
    },

    resetToDefault: () => set({ config: { ...DEFAULT_CONFIG } }),

    persist: async (sessionId) => {
      const { config } = get();
      await db.sessions.update(sessionId, {
        personaConfig: config as unknown as Record<string, unknown>,
      });
    },
  }),
);

export const { Provider: GodModeProvider, useStore: useGodModeStore } = godModeStore;
export type { GodModeConfig, PersonaConfig };
