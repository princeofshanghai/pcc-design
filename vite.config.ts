import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React ecosystem
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // Ant Design ecosystem (large UI library)
          'antd-vendor': ['antd'],
          
          // Icon library
          'icons-vendor': ['lucide-react'],
          
          // Utilities and smaller dependencies
          'utils': [
            // Add other utility libraries here as they're identified
          ]
        },
        // Configure chunk file names for better caching
        chunkFileNames: (chunkInfo) => {
          // Create descriptive names for our manual chunks
          if (chunkInfo.name === 'react-vendor') return 'assets/react-[hash].js';
          if (chunkInfo.name === 'antd-vendor') return 'assets/antd-[hash].js';
          if (chunkInfo.name === 'icons-vendor') return 'assets/icons-[hash].js';
          if (chunkInfo.name === 'utils') return 'assets/utils-[hash].js';
          
          // For pages and other dynamic chunks, use route-based names
          if (chunkInfo.isDynamicEntry || chunkInfo.isEntry) {
            return 'assets/page-[name]-[hash].js';
          }
          
          // Default naming for other chunks
          return 'assets/[name]-[hash].js';
        }
      }
    },
    // Optimize chunk size warning threshold
    chunkSizeWarningLimit: 600, // Slightly higher than default 500KB for antd
    
    // Enable source maps for better debugging
    sourcemap: true
  }
})
