// @ts-check
import { defineConfig } from 'astro/config';

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
