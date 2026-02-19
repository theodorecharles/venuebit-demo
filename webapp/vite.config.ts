import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Allow OPTIMIZELY_SDK_KEY to be used without VITE_ prefix
    'import.meta.env.VITE_OPTIMIZELY_SDK_KEY': JSON.stringify(process.env.VITE_OPTIMIZELY_SDK_KEY || process.env.OPTIMIZELY_SDK_KEY || ''),
  },
  server: {
    port: 4000,
    host: '0.0.0.0',
    allowedHosts: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
