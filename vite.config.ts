import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        // SECURITY NOTE: Only expose N8N_WEBHOOK_URL to client-side
        // API keys should NEVER be exposed in client-side code
        // They must be kept on the server side (e.g., in n8n workflows)
        'process.env.N8N_WEBHOOK_URL': JSON.stringify(env.N8N_WEBHOOK_URL)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
