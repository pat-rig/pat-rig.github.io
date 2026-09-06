// @ts-check
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import katexMathml from './src/markdown/katex-mathml.mjs';
import externalLinks from './src/markdown/external-links.mjs';

// https://astro.build/config
export default defineConfig({
  /*
   * This is a GitHub Pages *user* site (the repo is named <user>.github.io),
   * so it is served from the domain root and needs no `base` path. A project
   * repo would require `base: '/<repo-name>'` here and in every internal link.
   *
   * `site` is what makes absolute URLs (canonical links, sitemaps, RSS)
   * resolve correctly at build time.
   */
  site: 'https://pat-rig.github.io',
  output: 'static',
  trailingSlash: 'always',
  /*
   * `/writing/` was a real page until the two tracks got their own listings.
   * Anyone holding a cached copy of the old landing page — or a bookmark —
   * would otherwise hit a 404, so the old URL is kept alive as a redirect
   * rather than deleted outright. Static output renders these as small
   * meta-refresh pages.
   */
  redirects: {
    '/writing': '/',
    /*
     * Renamed 2026-09-06 when the post stopped being about deriving the ELBO
     * and became about controlling what a latent space represents. The old
     * slug had already been deployed, so it stays alive rather than 404ing
     * for anyone holding the link.
     */
    '/writing/elbo-from-the-ground-up': '/writing/splitting-a-latent-space-on-purpose/',
  },
  /*
   * Sätteri is Astro's default Markdown processor and is named here only to
   * turn one feature on: maths. `$…$` inline and `$$…$$` on their own lines for
   * display, rendered to MathML by the plugin below — see
   * src/markdown/katex-mathml.mjs for why MathML and not KaTeX's HTML output.
   *
   * Everything else stays at Astro's defaults, so no other post's rendering
   * changes. Note that a bare `$` in prose is now a maths delimiter: write it
   * as `\$` if a post ever needs a literal dollar sign.
   */
  markdown: {
    processor: satteri({
      features: { math: true },
      mdastPlugins: [katexMathml],
      hastPlugins: [externalLinks],
    }),
  },
  build: {
    // Emit `/blog/post/index.html` rather than `/blog/post.html`, which is what
    // Pages needs for extensionless URLs to resolve.
    format: 'directory',
    /*
     * Never inline stylesheets. Astro's default ('auto') inlines small ones,
     * which would force `style-src 'unsafe-inline'` in the CSP. Keeping styles
     * external costs one cached request and buys a materially stricter policy.
     */
    inlineStylesheets: 'never',
  },
});
