import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      logLevel: 'error',
      server: {
        port: 3000,
        host: '0.0.0.0',
        hmr: false,
        ws: false,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Security-Policy': "frame-ancestors 'self' * https://web.telegram.org https://*.telegram.org https://t.me https://*.t.me tg:;",
        },
      },
      plugins: [
        react(),
        tailwindcss(),
        nodePolyfills({
          globals: {
            Buffer: true,
            global: true,
            process: true,
          },
          protocolImports: true,
        }),
      ],
      optimizeDeps: {
        include: ['react', 'react-dom', 'lucide-react', '@tonconnect/ui-react'],
      },
      build: {
        outDir: path.resolve(__dirname, 'dist'),
        emptyOutDir: true,
        chunkSizeWarningLimit: 3000,
        sourcemap: false,
        cssCodeSplit: true,
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (id.includes('node_modules/three') || id.includes('node_modules/@react-three')) {
                return 'vendor-three';
              }
              if (id.includes('node_modules/@ton') || id.includes('node_modules/@tonconnect')) {
                return 'vendor-ton';
              }
              if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
                return 'vendor-react';
              }
              if (id.includes('node_modules/lucide-react')) {
                return 'vendor-icons';
              }
            }
          }
        }
      },
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        global: 'globalThis',
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
