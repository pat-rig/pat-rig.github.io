---
name: add-paper-figures
description: Lift figures out of one of Patrick's own papers or project repos and place them in a blog post. Use when a post references a PDF whose plots should appear on the page, or when asked to add figures/plots/charts to an article.
---

# Adding a paper's figures to a post

Most posts here are written around a PDF that already contains the plots. The
job is to get the *same* plots onto the page — not lookalikes, not a
regenerated version, and not the paper's third-party screenshots.

Do not try to re-run the analysis code. The repos need old environments and it
is never worth it; the rendered figures are almost always committed.

## 1. Find the figure sources

Look for a directory whose name says what it is — `owd/fig4paper/` in
`Covid_Incidence_Biases` held exactly the four generated figures. Search the
tree rather than the README:

```bash
gh api "repos/pat-rig/<repo>/git/trees/<default-branch>?recursive=true" \
  --jq '.tree[] | select(.type=="blob") | "\(.size)\t\(.path)"' \
  | grep -iE '\.(pdf|png|svg)$'
```

Repos also hold exploratory plots from earlier runs. A file matching a figure's
subject is not evidence it is the figure that was published.

## 2. Verify each one against the PDF — do not skip this

Patrick asked for this explicitly: prove it is the published version, not an
earlier variant made with different code.

```bash
pdftoppm -png -r 150 figure.pdf fig          # the repo's copy
pdftoppm -png -r 110 -f <page> -l <page> paper.pdf page   # the paper's page
```

Read both images and compare panel titles, legend entries and their colours,
axis ranges, and curve shapes. Where something looks marginal, re-render that
region at `-r 300` with `-x -y -W -H` before concluding anything — in the
Covid paper the vaccination figure's dotted lines *appeared* to differ in
colour at low resolution and were identical at 300dpi.

**Skip any figure that is a screenshot of someone else's work.** The Covid
paper's Figure 1 is taken from `intensivregister.de` and `corona.rki.de`; that
is not ours to republish.

## 3. Convert

PNG at `-r 150`, and let Astro do the rest. Do not reach for SVG: `pdftocairo
-svg` turns a scatter plot into one path per point — 948KB against 103KB for
the same plot as PNG. It is only worth considering for pure line art.

## 4. Check metadata before anything enters the repo

Standing rule on this project. PDFs from LaTeX are usually clean, but check:

```bash
python3 -c "
import struct,sys
d=open(sys.argv[1],'rb').read(); i=8
while i < len(d):
    ln=struct.unpack('>I', d[i:i+4])[0]; t=d[i+4:i+8].decode('latin1')
    if t in ('tEXt','iTXt','zTXt','tIME','eXIf'): print('  ', t, d[i+8:i+8+min(ln,80)])
    i += 12+ln
    if t=='IEND': break
" image.png
```

## 5. Place them

Files go in `src/content/blog/figures/<post-slug>/`, named for what they show
rather than what the source called them.

Reference them with **markdown image syntax and a relative path**:

```markdown
![Alt text describing what the plot actually shows and what a reader should notice in it.](./figures/covid/positive-rate-vs-incidence.png)

*One-line caption. What to look at, not a repeat of the alt text.*
```

Two things depend on this exact form:

- **Markdown syntax, not a raw `<figure>`.** Only the markdown image reaches
  Astro's image pipeline, which emits WebP at roughly a third of the PNG weight
  and sets intrinsic width and height so the page does not jump while loading.
  A raw `<img>` ships the unoptimised original.
- **The italic paragraph immediately after is the caption.** It is styled by an
  adjacent-sibling rule in `src/pages/writing/[...slug].astro`. Break the
  adjacency and it renders as body text.

Write alt text that says what the data does, not "a plot of x against y" — a
reader who cannot see it should still get the point the figure is making.

## 6. Check the result

Build, then verify in the browser rather than by reasoning about the CSS. Do
not send Patrick a screenshot — he cannot see images in his terminal. Serve it
and give him a URL.

```bash
npm run build && npm run preview
```

Confirm the figure widths and that nothing overflows:

```js
[...document.querySelectorAll('.post__body img')].map(i => i.getBoundingClientRect())
document.documentElement.scrollWidth > document.documentElement.clientWidth  // must be false
```

## Why the figures blend into the page

Already implemented and commented in `src/pages/writing/[...slug].astro`;
noted here so it is not mistaken for a bug. matplotlib saves on opaque white,
which on this site's cream ground reads as a pasted-in rectangle.
`mix-blend-mode: multiply` resolves white to exactly the page colour and leaves
the ink, so plots sit on the page instead of in a box. Colours warm by about
two values per channel — accepted deliberately.

Figures are sized to the article column, not wider than it. That was Patrick's
choice between two mocked-up options; a one-sided breakout left a ragged right
edge he disliked.

## Known limit

A figure of three panels side by side is around 3.5:1, so it stays short
however wide the column gets. If one reads too small, the fix is to that
figure — splitting the panels into separate stacked images — not to the
layout.
