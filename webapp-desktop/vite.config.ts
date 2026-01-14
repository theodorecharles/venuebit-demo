import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4002,
    host: '0.0.0.0',
    allowedHosts: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
