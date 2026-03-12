/**
 * Astro content collections schema.
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

const documents = defineCollection({
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

const documentIndex = defineCollection({
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

export const collections = { blog, documents, documentIndex };
