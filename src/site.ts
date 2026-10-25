/** Single source of truth for site-wide identity strings. */
export const SITE_NAME = 'Patrick Köhler';

/**
 * Where the site is served from. Must match `site` in astro.config.mjs — it is
 * what tells the external-link rule which absolute URLs are still us.
 */
export const SITE_URL = 'https://pat-rig.github.io';

/**
 * GoatCounter's endpoint for this site. Cookieless, aggregate-only page
 * counts; the dashboard lives at the same host without `/count`. The CSP in
 * BaseLayout allows exactly this origin, so changing it here is enough.
 */
export const GOATCOUNTER_ENDPOINT = 'https://patrig.goatcounter.com/count';
