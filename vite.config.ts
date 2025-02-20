import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  preview: {
    host: true, // Nécessaire pour écouter sur toutes les interfaces
    port: Number(process.env.PORT) || 3000,
  },
  server: {
    host: true, // Nécessaire pour écouter sur toutes les interfaces
    port: Number(process.env.PORT) || 3000,
  }
})
