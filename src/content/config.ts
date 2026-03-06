/**
 * Astro content collections schema.
 *
 * Blog collection is defined here for future use.
 * No blog pages are generated until content is added
 * and a [slug].astro route is created under pages/writing/.
 */
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    links: z.array(
      z.object({
        label: z.string(),
        href: z.string().min(1),
      }),
    ).default([]),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const research = defineCollection({
  type: "content",
  schema: z.object({
    document: z.string(),
    chapter: z.number().int().positive(),
    chapterTitle: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    estimatedReadMinutes: z.number().int().positive().optional(),
  }),
});

const researchDocuments = defineCollection({
  type: "content",
  schema: z.object({
    document: z.string(),
    documentTitle: z.string(),
    documentDescription: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    appearanceOrder: z.number().int().optional(),
  }),
});

export const collections = { blog, research, researchDocuments };
