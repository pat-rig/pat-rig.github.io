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

## 2b. Check the licence, and say so in the hand-off — do not wait to be asked

Standing request from Patrick: every figure, table or PDF that goes on the
site comes with a verdict on whether it may be published there. Verify at the
source, never from memory:

- **The paper's licence** — the arXiv abstract page prints it (2406.14994 is
  CC BY-SA 4.0); PMLR's publication agreement is CC BY 4.0 and asks for a
  citation plus a link to the PMLR page; a seminar paper or thesis has none,
  so co-authors' consent is the question instead.
- **Anything inside the figure the paper does not own.** A paper's licence
  does not cover dataset photos or third-party graphics. FIVES and CHASE_DB1
  are CC BY 4.0; DRIVE is research-use only, "copying, redistribution ...
  prohibited" — a DRIVE example image in our own preprint is still DRIVE's.
- **The data behind a redrawn chart.** Redrawing does not remove the
  attribution: Our World in Data is CC BY 4.0 and asks that its testing and
  vaccination datasets be cited by paper.
- **Hosted PDFs**: `pdfimages -list paper.pdf` and grep the captions for
  "taken from" before copying one into `public/papers/`.

Put the licence line in the caption or in a "Datasets"/"Data" section at the
foot of the post, as the calibration and benchmark posts do, and tell Patrick
per item: OK / OK with attribution / not covered.

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

## Prefer the data behind the figure to the figure itself

Before lifting a rendered figure, look for the **notebook that generated it**.
Papers link one — `§ Code and data availability`, usually a GitHub repo — and
the plotting notebook is often committed **with its cell outputs intact**. Those
outputs are the numbers, in text, exact.

This beats reusing the PNG whenever the figure would have to be restyled,
recomposed, or split, because a redraw from real values is faithful in a way
that digitising a plot never is.

```bash
gh api "repos/<org>/<repo>/git/trees/<branch>?recursive=true" \
  --jq '.tree[] | select(.type=="blob") | .path' | grep -iE '\.(ipynb|csv)$'
gh api "repos/<org>/<repo>/contents/notebooks/<name>.ipynb" --jq '.content' \
  | base64 -d > nb.ipynb
```

Then parse `cells[].outputs[].text` and pair each value with the `main_result(...)`
call above it. Metrics hide under other names — in the retinal benchmark the
cross-dataset Dice values were logged as `F1`, which for binary segmentation is
the same quantity.

**Validate before trusting it.** Find a subset of the extracted numbers that
also appears in the paper's tables and check every one. Fifteen in-domain values
parsed out of `cross_dataset.ipynb` matched Table 4 exactly, which is what
established the notebook as the figure's source rather than a stale re-run.

**Expect this to change the prose.** The cross-dataset numbers existed nowhere
in that paper except inside the plot, and having them falsified two claims in
the draft: "every point sits below the diagonal" (one of thirty is above), and
"models trained on FIVES transfer best" (true of the absolute score, the reverse
if measured as the smallest gap). Neither was visible from the figure. Budget
time to re-check the text after extraction, not just the figure.

When the data cannot be recovered, say so in the caption and use the PNG. Do not
digitise marker positions and present the result as the paper's numbers.

## Redrawing a figure in the site's design

Only once the values are exact. Inline SVG in design tokens, following
`.reliability` in the calibration post and `.xdomain` in the vessel benchmark:
`currentColor` or token fills, `var(--font-mono)` for labels, no plate.

- **Run the palette validator** — `dataviz`'s `scripts/validate_palette.js`
  against `--surface "#f4f1ea"`. The site's own warm palette fails the chroma
  floor on cream and reads as three greys; Okabe-Ito passes. Keep the source
  figure's hue families where you can, so a reader who knows it still recognises
  it — matplotlib's saturated red beside saturated green is a red-green CVD
  failure and must not be reproduced.
- **Check the rendered panel size before choosing a layout.** The article column
  is 672px. Five panels in a row is 134px each and illegible; 2×2 is 336px. Two
  points 0.53 units apart collide at the first and separate at the second.
- **Reproduce the structure, restyle the surface** — unless the author says
  otherwise. The Covid figures keep their triple and dual y-axes, which are an
  anti-pattern, because they are a record of what the report argued. That call
  belongs to Patrick, not to the agent: ask, and say in the caption that the
  scales are as published.
- Author the SVG from a generator script, not by hand, and keep the script. Every
  one of these needed three or four passes for label collisions and legend
  overlap.
