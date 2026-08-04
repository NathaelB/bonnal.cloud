export interface Author {
  name: string
  title: string
  avatar: string
  href?: string
}

export const authors: Record<string, Author> = {
  nathaelb: {
    name: 'Nathaël Bonnal',
    title: 'Software Engineer',
    avatar: 'https://github.com/nathaelb.png',
    href: 'https://github.com/nathaelb',
  },
}

export function getAuthor(id: string): Author | undefined {
  return authors[id]
}
