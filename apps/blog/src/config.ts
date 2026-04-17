import { defineConfig } from '@explainer/config'

export const siteConfig = defineConfig({
  titleTemplate: '%s — Blog',
  description: 'Nathael Blog',
  footer: {
    description: 'Rust, IAM, Kubernetes and distributed architecture. Notes from Nathael Bonnal.',
    columns: {
      documentation: 'Projects',
      resources: 'Resources',
      community: 'Open source',
    },
    copyright: 'Copyright {year} Nathael Bonnal.',
    builtWith: 'Blog built with {icon} Explainer',
    builtWithHref: 'https://github.com/leadcodedev/explainer_v2',
    links: {
      documentation: [
        { label: 'FerrisKey', href: 'https://github.com/FerrisKey/FerrisKey', external: true },
        { label: 'Ferriscord', href: 'https://github.com/FerrisLabs/Ferriscord', external: true },
        { label: 'Ferrisletter', href: 'https://github.com/FerrisLabs/Ferrisletter', external: true },
      ],
      resources: [
        { label: 'Home', href: '/', appId: 'website' },
        { label: 'GitHub', href: 'https://github.com/nathaelb', external: true },
      ],
      community: [
        { label: 'Open source', href: 'https://github.com/FerrisLabs', external: true },
        { label: 'FerrisKey', href: 'https://github.com/FerrisKey', external: true },
      ],
    },
  },
})
