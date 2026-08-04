import { readFileSync } from 'node:fs'
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import mdx from '@astrojs/mdx'
import tailwindcss from '@tailwindcss/vite'
import remarkDirective from 'remark-directive'
import { shikiConfig } from '@explainer/mdx/shiki'
import { remarkAutoImport } from '@explainer/mdx/remark-auto-import'
import { remarkDirectiveHandler } from '@explainer/mdx/remark-directive-handler'
import { remarkCodeBlocks } from '@explainer/mdx/remark-code-blocks'
import { thumbnailIntegration } from '@explainer/thumbnail/integration'
import { crabMark } from '@explainer/config'

function loadRootEnv() {
  try {
    const content = readFileSync('../../.env', 'utf-8')
    const env: Record<string, string> = {}
    for (const line of content.split('\n')) {
      const match = line.match(/^\s*([\w.]+)\s*=\s*(.*)?\s*$/)
      if (match) env[match[1]] = match[2]?.replace(/^['"]|['"]$/g, '') ?? ''
    }
    return env
  } catch {
    return {}
  }
}

const env = loadRootEnv()

export default defineConfig({
  site: process.env.PUBLIC_DOCS_URL || env.PUBLIC_DOCS_URL,
  devToolbar: { enabled: false },
  integrations: [
    react(),
    sitemap({
      // The root is a client-side redirect stub (noindex) — exclude it from the sitemap.
      filter: (page) => new URL(page).pathname !== '/',
    }),
    mdx({
      remarkPlugins: [remarkAutoImport, remarkCodeBlocks, remarkDirective, remarkDirectiveHandler],
    }),
    thumbnailIntegration({
      appName: 'Docs',
      primaryColor: '#f97316',
      icon: crabMark,
      content: { type: 'collection', dir: './src/content/docs' },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    envDir: '../../',
  },
  markdown: {
    shikiConfig,
  },
})
