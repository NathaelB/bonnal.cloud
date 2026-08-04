import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import { getPublishedPosts, getPostSlug } from '../lib/posts'
import { useTranslations } from '../i18n/utils'
import type { APIContext } from 'astro'

const t = useTranslations('en')

export async function GET(context: APIContext) {
  const allPosts = await getCollection('posts')
  const posts = getPublishedPosts(allPosts)

  return rss({
    title: t('rss.title'),
    description: t('rss.description'),
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/${getPostSlug(post)}`,
    })),
  })
}
