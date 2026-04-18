import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss() /* basicSsl() disabled for tunnel compability */],
  server: {
    host: true,
    https: false, // Set to false so Localtunnel doesn't crash (Tunnel provides its own HTTPS)
    allowedHosts: true, // Complete bypass for tunnel hostnames
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
