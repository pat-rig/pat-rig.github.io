import { defineHastPlugin } from 'satteri';

import { SITE_URL } from '../site.js';

/*
 * Makes links written in post bodies behave like the ones the templates
 * render: anything leaving the site opens in a new tab, anything staying
 * navigates in place.
 *
 * Without this the rule would hold everywhere except inside prose, which is
 * the one place a reader cannot tell the difference by looking — the citation
 * block and the article body would disagree about what a link does.
 *
 * "External" means an absolute http(s) URL pointing somewhere other than this
 * site. Root-relative links (`/writing/…`), fragments and mailto: are left
 * alone, so a cross-reference between two posts still navigates normally.
 *
 * The visually-hidden note matches the templates: the design system forbids
 * appended arrows (§2), so a screen reader is the only reader that can be
 * told the tab will change.
 */
export default defineHastPlugin({
  name: 'external-links',
  element: {
    filter: ['a'],
    visit(node, ctx) {
      const href = node.properties?.href;
      if (typeof href !== 'string') return;
      if (!/^https?:\/\//i.test(href)) return;
      if (href.startsWith(SITE_URL)) return;

      ctx.setProperty(node, 'target', '_blank');
      ctx.setProperty(node, 'rel', 'noopener');
      ctx.appendChild(node, {
        type: 'element',
        tagName: 'span',
        properties: { className: ['visually-hidden'] },
        children: [{ type: 'text', value: ' (opens in a new tab)' }],
      });
    },
  },
});
