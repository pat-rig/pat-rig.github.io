import katex from 'katex';
import { defineMdastPlugin } from 'satteri';

/*
 * Renders the maths Sätteri parses (`$…$` inline, `$$…$$` display) into MathML
 * at build time.
 *
 * Sätteri only *parses* maths: it produces `math` and `inlineMath` nodes and
 * leaves rendering to whoever wants it. This plugin is that renderer.
 *
 * MathML rather than KaTeX's default HTML output, deliberately. The HTML output
 * puts inline `style` attributes on nearly every span — struts, kerning — which
 * `style-src 'self'` forbids. Rendering it would cost the CSP an
 * 'unsafe-inline' and add a stylesheet from node_modules on top. MathML is
 * native in every current browser, needs no CSS and no JS of its own, and ships
 * nothing the policy has to be relaxed for.
 *
 * It runs on the mdast, not the hast, and that is load-bearing. By the time the
 * tree reaches hast a display equation is a `<pre><code class="language-math
 * math-display">`, and Astro's Shiki plugin — which runs before any user hast
 * plugin — has already syntax-highlighted it into a dark `<pre>` full of inline
 * styles. Astro means to skip those (`defaultExcludeLanguages` is `['math']`)
 * but matches on `data.lang`, which Sätteri does not set on maths nodes, so the
 * block is highlighted as plaintext instead. Rewriting the maths one phase
 * earlier sidesteps that entirely: Shiki never sees a code block at all.
 */

/**
 * `throwOnError` makes a LaTeX typo fail the build. KaTeX's default is to emit
 * a red error node instead, which would be both silent in CI and styled inline
 * — invisible to us, and blocked by the CSP for readers.
 */
function render(tex, displayMode) {
  return katex.renderToString(tex, {
    output: 'mathml',
    displayMode,
    throwOnError: true,
  });
}

export default defineMdastPlugin({
  name: 'katex-mathml',
  math: (node) => ({ type: 'html', value: render(node.value, true) }),
  inlineMath: (node) => ({ type: 'html', value: render(node.value, false) }),
});
