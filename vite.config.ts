import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  // GitHub Pages deployment - repo name for project pages
  base: '/ae-bootcamp-capstone/',
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    
    // Optimize Phaser chunking
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser'],
        },
      },
    },
  },
  
  server: {
    port: 3000,
    open: true,
  },
  
  // Optimize asset handling
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.webp', '**/*.mp3', '**/*.ogg'],
});
