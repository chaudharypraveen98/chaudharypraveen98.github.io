import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    author: z.string().default('Praveen Chaudhary'),
    tags: z.array(z.string()).default([]),
    slug: z.string().optional(),
    previewUrl: z.string().optional(),
    repoUrl: z.string().optional(),
    image: z.string().optional(),
    headerImage: z.string().default('/projects/assets/img/post-bg.webp'),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects };
