export interface Author {
  name: string
  title: string
  avatar: string
  href?: string
}

export const authors: Record<string, Author> = {
  nathael: {
    name: 'Nathael',
    title: 'Software Engineer',
    avatar: 'https://avatars.githubusercontent.com/u/64804778?v=4',
    href: 'https://github.com/nathaelb',
  }
}

export function getAuthor(id: string): Author | undefined {
  return authors[id]
}
