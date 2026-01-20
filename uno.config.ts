import { theme as nexusTheme } from '@sruim/nexus-design/theme';
import {
  defineConfig,
  presetIcons,
  presetWind3,
  transformerCompileClass,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss';
import presetAnimations from 'unocss-preset-animations';

export default defineConfig({
  presets: [
    presetWind3({
      breakpoints: {
        sm: '768px',
      },
    }),
    presetAnimations(),
    presetIcons({
      autoInstall: true,
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup(), transformerCompileClass()],
  theme: {
    ...nexusTheme,
    colors: {
      ...nexusTheme.colors,

      // Project semantic tokens
      background: 'rgba(var(--color-background) / <alpha-value>)',
      foreground: 'rgba(var(--color-foreground) / <alpha-value>)',
      primary: 'rgba(var(--color-primary) / <alpha-value>)',
      secondary: 'rgba(var(--color-secondary) / <alpha-value>)',
      accent: 'rgba(var(--color-accent) / <alpha-value>)',
      muted: 'rgba(var(--color-muted) / <alpha-value>)',
      border: 'rgba(var(--color-border) / <alpha-value>)',

      // Nexus Surface Layers
      'surface-void': '#020617',
      'surface-glass-1': 'rgba(2, 6, 23, 0.6)',
      'surface-glass-2': 'rgba(15, 23, 42, 0.4)',
      'surface-glass-3': 'rgba(15, 23, 42, 0.7)',

      // Nexus Content
      'text-primary': '#F1F5F9',
      'text-secondary': '#94A3B8',
      'text-accent': '#22D3EE',

      // Nexus Borders
      'border-subtle': 'rgba(255, 255, 255, 0.08)',
      'border-highlight': 'rgba(255, 255, 255, 0.2)',

      // Agent Themes
      'agent-critic': '#F43F5E',
      'agent-historian': '#F59E0B',
      'agent-pragmatist': '#10B981',
      'agent-expander': '#A855F7',
      'agent-verifier': '#3B82F6',
      'agent-synthesizer': '#FFFFFF',
    },
    animation: {
      ...nexusTheme.animation,
      keyframes: {
        ...nexusTheme.animation?.keyframes,
        shimmer: '{ 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }',
        'glow-red':
          '{ 0%, 100% { box-shadow: 0 0 5px #ef4444, 0 0 10px #ef444480 } 50% { box-shadow: 0 0 15px #ef4444, 0 0 25px #ef444480 } }',
        'glow-amber':
          '{ 0%, 100% { box-shadow: 0 0 5px #f59e0b, 0 0 10px #f59e0b80 } 50% { box-shadow: 0 0 15px #f59e0b, 0 0 25px #f59e0b80 } }',
        'glow-purple':
          '{ 0%, 100% { box-shadow: 0 0 5px #a855f7, 0 0 10px #a855f780 } 50% { box-shadow: 0 0 15px #a855f7, 0 0 25px #a855f780 } }',
        'glow-blue':
          '{ 0%, 100% { box-shadow: 0 0 5px #3b82f6, 0 0 10px #3b82f680 } 50% { box-shadow: 0 0 15px #3b82f6, 0 0 25px #3b82f680 } }',
        'glow-green':
          '{ 0%, 100% { box-shadow: 0 0 5px #22c55e, 0 0 10px #22c55e80 } 50% { box-shadow: 0 0 15px #22c55e, 0 0 25px #22c55e80 } }',
        'glow-indigo':
          '{ 0%, 100% { box-shadow: 0 0 5px #6366f1, 0 0 10px #6366f180 } 50% { box-shadow: 0 0 15px #6366f1, 0 0 25px #6366f180 } }',
        'glow-teal':
          '{ 0%, 100% { box-shadow: 0 0 5px #14b8a6, 0 0 10px #14b8a680 } 50% { box-shadow: 0 0 15px #14b8a6, 0 0 25px #14b8a680 } }',
        'wave-slow': '{ 0%, 100% { height: 4px } 50% { height: 8px } }',
        'wave-fast': '{ 0%, 100% { height: 6px } 50% { height: 20px } }',
      },
    },
  },
  shortcuts: {
    'skeleton-line':
      'h-3 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer',

    // Nexus Glassmorphism
    'glass-base': 'backdrop-blur-xl bg-gradient-to-b from-white/3 to-white/1 border border-white/5',
    'glass-card': 'backdrop-blur-2xl bg-slate-900/30 border border-white/8 shadow-lg',
    'glass-card-active': 'backdrop-blur-2xl bg-slate-900/50 border border-white/15',
  },
  rules: [
    // Radial gradient for energy orb
    [
      'bg-gradient-radial',
      {
        'background-image': 'radial-gradient(var(--tw-gradient-stops))',
      },
    ],
    // Shimmer animation for skeleton
    [
      'animate-shimmer',
      {
        animation: 'shimmer 1.5s ease-in-out infinite',
      },
    ],
    // Glow animations per color
    ['animate-glow-red', { animation: 'glow-red 2s ease-in-out infinite' }],
    ['animate-glow-amber', { animation: 'glow-amber 2s ease-in-out infinite' }],
    ['animate-glow-purple', { animation: 'glow-purple 2s ease-in-out infinite' }],
    ['animate-glow-blue', { animation: 'glow-blue 2s ease-in-out infinite' }],
    ['animate-glow-green', { animation: 'glow-green 2s ease-in-out infinite' }],
    ['animate-glow-indigo', { animation: 'glow-indigo 2s ease-in-out infinite' }],
    ['animate-glow-teal', { animation: 'glow-teal 2s ease-in-out infinite' }],
    ['animate-wave-slow', { animation: 'wave-slow 0.8s ease-in-out infinite alternate' }],
    ['animate-wave-fast', { animation: 'wave-fast 0.3s ease-in-out infinite alternate' }],
    ['safe-area-pt', { 'padding-top': 'env(safe-area-inset-top, 0px)' }],
    ['safe-area-pb', { 'padding-bottom': 'env(safe-area-inset-bottom, 0px)' }],
    [
      'safe-area-px',
      {
        'padding-left': 'env(safe-area-inset-left, 0px)',
        'padding-right': 'env(safe-area-inset-right, 0px)',
      },
    ],
    [
      'safe-area-py',
      {
        'padding-top': 'env(safe-area-inset-top, 0px)',
        'padding-bottom': 'env(safe-area-inset-bottom, 0px)',
      },
    ],
    [
      'scrollbar-thin',
      {
        'scrollbar-width': 'thin',
        'border-radius': '30px',
        'scrollbar-color': 'rgba(153, 153, 153, 1) rgba(32, 32, 32, 1)',
      },
    ],
  ],
});
