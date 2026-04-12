import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      devOptions: {
        enabled: true
      },
      includeAssets: ['ivoice_square.png', 'vite.svg'],
      manifest: {
        name: 'Ivoice Video Call App',
        short_name: 'Ivoice',
        description: 'A Progressive Web App for HD video and voice calling.',
        theme_color: '#0f172a',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/ivoice_square.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/ivoice_square.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/ivoice_square.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        navigateFallback: '/',
        maximumFileSizeToCacheInBytes: 5000000,
      }
    })
  ],
})
