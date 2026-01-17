import { reactRouter } from '@react-router/dev/vite';
import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vite';
import { envOnlyMacros } from 'vite-env-only';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => ({
  plugins: [reactRouter(), tsconfigPaths(), envOnlyMacros(), UnoCSS()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('three') || id.includes('@react-three')) {
            return 'vendor-three';
          }
          if (id.includes('framer-motion')) {
            return 'vendor-motion';
          }
          if (id.includes('lodash-es') || id.includes('dayjs')) {
            return 'vendor-utils';
          }
          if (id.includes('dexie')) {
            return 'vendor-dexie';
          }
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
  server: {
    host: 'localhost',
    port: 3000,
  },
}));
