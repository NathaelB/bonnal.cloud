import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'

const posts = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    status: z.enum(['draft', 'published']).default('draft'),
    author: z.string().optional(),
    thumbnail: z
      .object({
        title: z.string().optional(),
        description: z.string().optional(),
        color: z.string().optional(),
        theme: z.enum(['default', 'gradient', 'minimal']).optional(),
      })
      .optional(),
  }),
})

export const collections = { posts }
