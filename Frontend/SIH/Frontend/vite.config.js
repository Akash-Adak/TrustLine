// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        name: 'TrustLine',
        short_name: 'TrustLine',
        description: 'A unified platform for reporting civic and cyber issues.',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        importScripts: ['src/sw-custom.js']
      },
    })
  ],

  // 👇 Add this block
  server: {
    proxy: {
      "/nominatim": {
        target: "https://nominatim.openstreetmap.org",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/nominatim/, ""),
      },
    },
    host:'0.0.0.0',
    port:5173
  },
})
