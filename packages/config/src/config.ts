import type { SiteConfig } from './contracts'

export const defaultConfig: SiteConfig = {
  name: 'Nathaël Bonnal',
  titleTemplate: '%s — Nathaël Bonnal',
  favicon: '/favicon.svg',
  logo: '/logo.svg',
  thumbnail: '/thumbnail.png',
  twitterCard: 'summary_large_image',
  ogType: 'website',
  github: 'https://github.com/nathaelb',
  sponsors: [],
  defaultLocale: 'en',
  locales: ['en'],
  footer: {
    description: 'footer.description',
    columns: {
      documentation: 'footer.columns.documentation',
      resources: 'footer.columns.resources',
      community: 'footer.columns.community',
    },
    copyright: 'footer.copyright',
    builtWith: 'footer.builtWith',
    links: {
      documentation: [
        { label: 'footer.links.gettingStarted', href: '/explainer/getting-started' },
        { label: 'footer.links.mdxComponents', href: '/explainer/mdx-components/callout' },
        {
          label: 'footer.links.customization',
          href: '/explainer/features/theme-customization',
        },
        { label: 'footer.links.deployment', href: '/explainer/deployment/docker' },
      ],
      resources: [
        {
          label: 'footer.links.github',
          href: 'https://github.com/nathaelb',
          external: true,
        },
        { label: 'footer.links.blog', href: '', appId: 'blog' },
      ],
      community: [
        {
          label: 'footer.links.issues',
          href: 'https://github.com/LeadcodeDev/website/issues',
          external: true,
        },
        {
          label: 'footer.links.discussions',
          href: 'https://github.com/LeadcodeDev/website/discussions',
          external: true,
        },
        {
          label: 'footer.links.contributing',
          href: 'https://github.com/LeadcodeDev/website/blob/main/CONTRIBUTING.md',
          external: true,
        },
      ],
    },
  },
}
