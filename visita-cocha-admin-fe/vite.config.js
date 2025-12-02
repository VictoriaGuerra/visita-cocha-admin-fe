import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true, // Forzar solo el puerto 5173, no intentar otros puertos
    // Proxy API requests to backend to avoid CORS in development
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/login': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/attractions': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/restaurants': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/events': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/hotels': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/foods': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/announcements': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/pois': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/routes': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/attraction-categories': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/restaurant-categories': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/main-categories': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/reviews': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/user': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
