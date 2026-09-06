import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { TRACK_IDS } from './tracks';

/** Shared so the entry mark and the citation mark can never drift apart. */
const MARKS = ['grid', 'distribution', 'network', 'bars', 'fork', 'lines'] as const;

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
    mark: z.enum(MARKS).default('lines'),
    /**
     * The publication a post is written around, rendered as a reference block
     * at the foot of the article. `url` is optional so a citation can go in
     * before the proceedings link exists.
     */
    paper: z
      .object({
        title: z.string(),
        authors: z.string().optional(),
        venue: z.string(),
        year: z.number().int().optional(),
        url: z.url().optional(),
        /** A recorded talk about the same work, listed under the paper link. */
        talk: z.url().optional(),
        /**
         * Overrides the block's default "Publication" header. Most posts are
         * written around something that went through peer review and this is
         * accurate as-is — but a seminar paper, a thesis chapter, or a
         * preprint is not a publication, and labelling it one overstates its
         * provenance. Set this whenever the default would be inaccurate.
         */
        label: z.string().optional(),
        mark: z.enum(MARKS).default('lines'),
      })
      .optional(),
    /** Optional short status shown in the entry meta, e.g. "collecting data". */
    status: z.string().optional(),
    /** Optional kind label shown in the entry meta, e.g. "Project", "Publication". */
    kind: z.string().optional(),
  }),
});

export const collections = { blog };
