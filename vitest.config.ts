import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '#': fileURLToPath(new URL('./src', import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: [
      'src/helpers/zod/zod-helpers.spec.ts',
      'src/routes/*.test.{ts,tsx}',
      'src/components/datatable/*.test.tsx',
      'src/features/audit-logs/*.test.{ts,tsx}',
      'src/features/auth/*.test.{ts,tsx}',
      'src/lib/env.test.ts',
    ],
  },
})
