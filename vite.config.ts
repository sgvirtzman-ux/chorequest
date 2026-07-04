import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// base './' so the built site works from any static host or subfolder
export default defineConfig({
  base: './',
  plugins: [react()],
  test: {
    // unit tests only — e2e/*.spec.ts belongs to Playwright, and vitest's
    // default include pattern would otherwise try (and fail) to run it
    include: ['src/**/*.test.ts'],
  },
})
