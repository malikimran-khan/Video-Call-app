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
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Voice Call App',
        short_name: 'VoiceApp',
        description: 'A professional video and voice call application',
        theme_color: '#ffffff',
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
      }
    })
  ],
})
