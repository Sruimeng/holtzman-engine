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
          // 大型工具库单独打包
          if (id.includes('lodash-es') || id.includes('dayjs')) {
            return 'vendor-utils';
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
  server: {
    host: 'localhost',
    port: 3000,
  },
}));
