import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  base: '/', // using your custom domain
  server: {
    port: 8080
  },
  preview: {
    port: 8080
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
