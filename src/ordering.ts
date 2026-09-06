import type { CollectionEntry } from 'astro:content';

/**
 * The order posts appear in, everywhere they are listed.
 *
 * Two rules, in this order:
 *
 *   1. A post with `pin` comes before one without, and pins sort ascending —
 *      `pin: 1` leads.
 *   2. Everything else is newest first.
 *
 * Kept here rather than repeated in each listing page: the landing page and
 * the two track pages all sort the same collection, and three copies of a
 * comparator are three chances for them to disagree about what a reader sees
 * first.
 */
export function byListingOrder(a: CollectionEntry<'blog'>, b: CollectionEntry<'blog'>): number {
  const pinA = a.data.pin;
  const pinB = b.data.pin;

  if (pinA !== undefined && pinB !== undefined) return pinA - pinB;
  if (pinA !== undefined) return -1;
  if (pinB !== undefined) return 1;

  return b.data.date.valueOf() - a.data.date.valueOf();
}
