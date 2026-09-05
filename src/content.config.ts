import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { TRACK_IDS } from './tracks';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    repo: z.url().optional(),
    tags: z.array(z.string()).default([]),
    /**
     * Which of the two tracks this post belongs to. Required with no default:
     * a post that has not been deliberately assigned should fail the build
     * rather than land silently in whichever column happens to be first.
     */
    track: z.enum(TRACK_IDS),
    /** Chooses the data-mark drawn beside the entry. See src/components/Mark.astro. */
    mark: z.enum(['grid', 'distribution', 'network', 'bars', 'fork', 'lines']).default('lines'),
    /** Optional short status shown in the entry meta, e.g. "collecting data". */
    status: z.string().optional(),
    /** Optional kind label shown in the entry meta, e.g. "Project", "Publication". */
    kind: z.string().optional(),
  }),
});

export const collections = { blog };
