import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? '/jazer-rhyme-book/' : '/',
  resolve: {
    alias: {
      // Allow importing from internal public data folders
      '@data': path.resolve(__dirname, '../public/data'),
      '@dictionary': path.resolve(__dirname, '../public/dictionary'),
    }
  },
  server: {
    fs: {
      // Allow serving files from parent directory
      allow: ['..'],
    },
    watch: {
      // Only ignore node_modules to prevent watcher overload
      // Keep data and dictionary for hot reload
      ignored: ['**/node_modules/**', '**/.git/**'],
      // Use polling for large directories to avoid file handle issues
      usePolling: true,
      interval: 1000,
    }
  },
  // Enable JSON imports
  json: {
    stringify: false,
  },
  // Optimize large data imports
  build: {
    rollupOptions: {
      output: {
        // Increase chunk size warning limit for data files
        manualChunks: undefined,
      }
    }
  }
}))
