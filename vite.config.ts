import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Default Vite port
    cors: true, // Enable CORS
    headers: {
        'Access-Control-Allow-Origin': '*', // Allow all origins
        },
    // proxy: {
    //   '/api/v1': {
    //     target: 'http://localhost:8080', // backend server
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, '/api'), // optional
    //   }
    // }
  },
  base: './',
  clearScreen: false,
  build: {
    sourcemap: true
  }
})