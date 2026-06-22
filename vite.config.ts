import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// `base` targets the GitHub Pages project site (edvardhov.github.io/foontik/).
// Override with VITE_BASE when hosting under a different path.
export default defineConfig({
  base: process.env.VITE_BASE ?? '/foontik/',
  plugins: [react(), tailwindcss()],
})
