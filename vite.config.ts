import { defineConfig, loadEnv } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { brandDefaults } from './src/lib/brand-defaults.ts'

const config = defineConfig(({ mode }) => ({
  resolve: { tsconfigPaths: true },
  plugins: [
    tailwindcss(),
    viteReact(),
    {
      name: 'app-brand-title',
      transformIndexHtml: {
        order: 'pre',
        handler(html) {
          const name =
            (
              loadEnv(mode, process.cwd(), 'VITE_') as Partial<
                Record<string, string>
              >
            ).VITE_APP_NAME?.trim() || brandDefaults.name
          const escapedName = name.replace(
            /[&<>"']/g,
            (character) =>
              ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;',
              })[character]!,
          )
          return html.replace('%VITE_APP_NAME%', () => escapedName)
        },
      },
    },
  ],
}))

export default config
