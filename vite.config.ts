import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',   // keep '/' if you’re using your custom domain
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
