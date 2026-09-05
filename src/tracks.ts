/**
 * The two tracks the site is organised around. Single source of truth: the
 * content schema validates against these ids, and the landing page and
 * /writing render from this list, so adding or renaming a track happens here
 * and nowhere else.
 */
export const TRACK_IDS = ['data-science', 'business'] as const;

export type TrackId = (typeof TRACK_IDS)[number];

export interface Track {
  id: TrackId;
  /** Small label above the heading. */
  kicker: string;
  title: string;
  description: string;
  /** Text of the link to the full listing. */
  moreLabel: string;
}

export const TRACKS: readonly Track[] = [
  {
    id: 'data-science',
    kicker: 'in depth',
    title: 'Data science & research',
    description: 'Projects, publications and research ideas. Longer, with the method shown.',
    moreLabel: 'All data science work',
  },
  {
    id: 'business',
    kicker: 'shorter',
    title: 'Business & LLMs',
    description:
      'High-level writing on where language models actually pay off, and where they do not.',
    moreLabel: 'All business writing',
  },
];
