import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Improve development server performance
  server: {
    fs: {
      // Allow serving files outside of the workspace root
      strict: false,
    },
  },
  build: {
    // Improve chunk size warnings threshold
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Split vendor libraries into separate chunks for better caching
        manualChunks: {
          // React ecosystem
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // UI library
          'antd-vendor': ['antd', '@ant-design/v5-patch-for-react-19'],
          // Icons and animations
          'ui-vendor': ['lucide-react', 'framer-motion'],
          // Charts and data visualization
          'chart-vendor': ['recharts'],
          // Utilities
          'util-vendor': ['dayjs'],
          // DnD functionality
          'dnd-vendor': ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
        },
      },
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'antd',
      'lucide-react',
      'framer-motion',
      'recharts',
    ],
  },
})
