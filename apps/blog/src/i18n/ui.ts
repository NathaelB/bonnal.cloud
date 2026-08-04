export const defaultLang = 'en' as const

export const ui = {
  en: {
    // Index page
    'index.title': 'Articles',
    'index.heading.prefix': 'Latest',
    'index.heading.highlight': 'articles',
    'index.empty': 'No articles yet.',
    'index.noResults': 'No articles match your search.',

    // RSS
    'rss.title': 'Nathaël Bonnal Blog',
    'rss.description': 'Latest articles from the blog',

    // Footer
    'footer.text': 'Built with Explainer v2',

    // Post layout
    'post.back': 'Back to writing',
    'post.published': 'Published',

    // Hero section
    'hero.minRead': 'min read',

    // Navbar
    'nav.allArticles': 'All articles',
    'nav.categories': 'Categories',
    'nav.rss': 'RSS',

    // Tag filter
    'tagFilter.placeholder': 'Search articles...',
    'tagFilter.all': 'All',

    // Table of contents
    'toc.title': 'On this page',

    // Sponsors
    'sponsors.title': 'Sponsors',

    // Author
    'author.label': 'Written by',

    // Share buttons
    'share.linkedin': 'Share on LinkedIn',
    'share.twitter': 'Share on Twitter',
    'share.facebook': 'Share on Facebook',
    'share.copyLink': 'Copy link',
  },
} as const

export type UiKey = keyof (typeof ui)['en']
