import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Build to a relative base so the static output can be hosted from any path.
export default defineConfig({
  plugins: [react()],
  base: './',
})
