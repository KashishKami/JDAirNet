import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'

// Explicitly load .env.test for unit tests (fallback to .env.example if .env.test is not created)
const envTestPath = path.resolve(__dirname, '.env.test')
const envExamplePath = path.resolve(__dirname, '.env.example')
if (fs.existsSync(envTestPath)) {
  dotenv.config({ path: envTestPath })
} else if (fs.existsSync(envExamplePath)) {
  dotenv.config({ path: envExamplePath })
}

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/tests/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['tests/**', 'node_modules/**', '.next/**', 'out/**'],
  },
})
