import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // GitHub Pages serves the app from /<repo>/; set VITE_BASE in CI
  base: process.env.VITE_BASE || '/',
  plugins: [react(), tailwindcss()],
})
