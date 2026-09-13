import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        name: 'Metro Trayectos',
        short_name: 'Metro',
        description: 'Tus trayectos y próximas llegadas de Metro de Madrid.',
        lang: 'es',
        display: 'standalone',
        start_url: './',
        scope: './',
        background_color: '#101214',
        theme_color: '#101214',
        icons: [
          {
            src: './icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        navigateFallback: 'index.html'
      }
    })
  ]
});
