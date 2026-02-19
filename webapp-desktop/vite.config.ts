import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'redirect-desktop',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/desktop') {
            res.writeHead(301, { Location: '/desktop/' });
            res.end();
            return;
          }
          next();
        });
      }
    }
  ],
  base: '/desktop/',
  server: {
    port: 4002,
    host: '0.0.0.0',
    allowedHosts: true,
    proxy: {
      '/desktop/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/desktop\/api/, '/api')
      },
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
