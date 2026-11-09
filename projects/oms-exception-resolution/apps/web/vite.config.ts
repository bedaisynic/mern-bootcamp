import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const proxy = {'/api': {target: process.env.VITE_BFF_TARGET ?? 'http://127.0.0.1:4100'}};
export default defineConfig({
  plugins: [react()],
  server: {proxy},
  preview: {proxy},
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'react';
          if (/node_modules\/@(mui|emotion)\//.test(id)) return 'material';
        },
      },
    },
  },
});
