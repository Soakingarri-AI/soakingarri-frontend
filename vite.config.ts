import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // All /api requests are proxied to the real API during local dev.
      // This avoids CORS entirely — the browser only ever talks to localhost.
      '/api': {
        target: 'https://api.soakingarri.com',
        changeOrigin: true,
        secure: true,
        // Forward cookies so the httpOnly auth cookies round-trip correctly
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Origin', 'https://api.soakingarri.com');
          });
        },
      },
    },
  },
})

