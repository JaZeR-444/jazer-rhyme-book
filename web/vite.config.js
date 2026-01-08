import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Allow importing from parent directory data folders
      '@data': path.resolve(__dirname, '../data'),
      '@dictionary': path.resolve(__dirname, '../Rap_Dictionary_Master_Hub'),
    }
  },
  server: {
    fs: {
      // Allow serving files from parent directory
      allow: ['..'],
    }
  },
  // Enable JSON imports
  json: {
    stringify: false,
  },
  // Optimize large data imports
  build: {
    rollupOptions: {
      // Increase chunk size warning limit for data files
      chunkSizeWarningLimit: 5000,
    }
  }
})
