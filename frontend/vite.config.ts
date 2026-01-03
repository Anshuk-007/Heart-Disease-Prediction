import { defineConfig } from 'vite'
import react from '@vitejs/react-swc'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 'base' is set to './' to ensure that the index.html finds your JS and CSS 
  // correctly when hosted on a subpath or specific directory on Render.
  base: './', 
  resolve: {
    alias: {
      // This allows you to use the "@/" shorthand in your imports
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // This ensures your build output goes into the 'dist' folder 
    // which matches your Render "Publish Directory" setting.
    outDir: 'dist',
  }
})