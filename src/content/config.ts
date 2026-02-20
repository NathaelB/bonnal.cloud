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
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
