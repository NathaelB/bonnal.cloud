import { defineConfig } from '@explainer/config'

export const siteConfig = defineConfig({
  name: 'Nathael Bonnal',
  titleTemplate: '%s',
  logo: '/logo.svg',
  thumbnail: '/nathael.jpg',
  github: 'https://github.com/nathaelb',
  defaultLocale: 'en',
  locales: ['en'],
  footer: {
    description: 'Rust, IAM, Kubernetes and distributed architecture. Personal portfolio and open source projects.',
    columns: {
      documentation: 'Projects',
      resources: 'Resources',
      community: 'Open source',
    },
    copyright: 'Copyright {year} Nathael Bonnal.',
    builtWith: 'Portfolio built with {icon} Explainer',
    builtWithHref: 'https://github.com/leadcodedev/explainer_v2',
    links: {
      documentation: [
        { label: 'FerrisKey', href: 'https://github.com/FerrisKey/FerrisKey', external: true },
        { label: 'Ferriscord', href: 'https://github.com/FerrisLabs/Ferriscord', external: true },
        { label: 'Ferrisletter', href: 'https://github.com/FerrisLabs/Ferrisletter', external: true },
      ],
      resources: [
        { label: 'Blog', href: '', appId: 'blog' },
        { label: 'GitHub', href: 'https://github.com/nathaelb', external: true },
      ],
      community: [
        { label: 'Open source', href: 'https://github.com/FerrisLabs', external: true },
        { label: 'FerrisKey', href: 'https://github.com/FerrisKey', external: true },
      ],
    },
  },
})
