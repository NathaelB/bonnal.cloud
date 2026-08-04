import { readFileSync } from 'node:fs'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import { thumbnailIntegration } from '@explainer/thumbnail/integration'
import { crabMark } from '@explainer/config'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

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
  site: process.env.PUBLIC_WEBSITE_URL || env.PUBLIC_WEBSITE_URL,
  integrations: [
    react(),
    sitemap(),
    thumbnailIntegration({
      appName: 'Nathaël Bonnal',
      primaryColor: '#f97316',
      icon: crabMark,
      content: {
        type: 'static',
        pages: [
          {
            path: '/',
            title: 'Nathaël Bonnal',
            description: 'Software Engineer specialized in designing robust, scalable products through thoughtful software architecture tailored to your product.',
          },
        ],
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    envDir: '../../',
  },
})
