import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Environment variable configuration
  envPrefix: 'VITE_',
  
  // Build optimization
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  },
  
  // Development server configuration
  server: {
    port: 5173,
    host: true
  },
  
  // Preview server configuration for production testing
  preview: {
    port: 4173,
    host: true
  }
})
