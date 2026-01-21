import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { createCompressionPlugin } from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'production' && createCompressionPlugin({
      ext: '.gz',
      algorithm: 'gzip',
      threshold: 1024, // Only compress files larger than 1KB
      deleteOriginFile: false, // Keep original files too
    })
  ].filter(Boolean),
  // Allow overriding base at deploy time via VITE_BASE (defaults to root)
  base: process.env.VITE_BASE || '/',
  resolve: {
    alias: {
      // Allow importing from internal public data folders
      '@data': path.resolve(__dirname, '../public/data'),
      '@dictionary': path.resolve(__dirname, '../public/dictionary'),
    }
  },
  server: {
    port: 5173,
    strictPort: false,
    fs: {
      // Allow serving files from parent directory
      allow: ['..'],
    },
    watch: {
      // Only ignore node_modules to prevent watcher overload
      // Keep data and dictionary for hot reload
      ignored: ['**/node_modules/**', '**/.git/**'],
    }
  },
  // Enable JSON imports
  json: {
    stringify: false,
  },
  // Production optimizations
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    // Target modern browsers for better optimization
    target: 'es2018',
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Minify options
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
      },
    },
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'search-vendor': ['fuse.js', 'natural', 'metaphone'],
          'ui-vendor': ['react-window', 'react-virtualized-auto-sizer'],
          'audio-vendor': ['wavesurfer.js'],
          'graph-vendor': ['react-force-graph-2d', 'd3-force'],
          'animation-vendor': ['gsap'],
        },
        // Asset naming for better caching
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: ({ name }) => {
          if (/\.(gif|jpe?g|png|svg|webp)$/.test(name ?? '')) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (/\.css$/.test(name ?? '')) {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      }
    },
    // Source maps for production debugging
    sourcemap: mode === 'development',
  },
  // Performance optimizations
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'fuse.js',
      'natural',
      'metaphone',
      'react-window',
      'react-virtualized-auto-sizer',
      'wavesurfer.js',
      'gsap'
    ],
    // Exclude files using glob patterns with aliases during dep scan
    exclude: ['@data/**', '@dictionary/**'],
  },
  preview: {
    port: 4173,
    strictPort: true
  },
}))
