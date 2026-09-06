---
title: An argument for well-calibrated predictors in high-risk applications
date: 2026-09-05
summary: >-
  A model that says 70% should be right 70% of the time. Why that property is
  worth more than it looks, and what it made possible in our MIDL 2024 paper.
tags: [calibration, segmentation, publication]
track: data-science
mark: distribution
kind: Publication
pin: 1
status: draft
paper:
  title: >-
    Efficiently correcting patch-based segmentation errors to control
    image-level performance in retinal images
  authors: Patrick Köhler, Jeremiah Fadugba, Philipp Berens, Lisa M. Koch
  venue: Medical Imaging with Deep Learning (MIDL) · PMLR 250:841–856
  year: 2024
  url: https://proceedings.mlr.press/v250/kohler24a.html
  talk: https://youtu.be/27FOGfwgCL8?t=1707
---

The predictive capacity of classification and regression algorithms is usually
discussed from a performance point of view. The notion of calibration — which
measures the quality of a model's uncertainty estimates — is often overlooked.
In high-risk applications, good calibration can be the key to many safety
mechanisms. We developed one such mechanism, to show what well-calibrated
uncertainty estimates can do in practice.

The corresponding publication is referenced below.
In this article, we are not going to recap the paper in detail but we take a brief look at the
bigger picture why calibration matters.


## What calibration is

The key principle behind calibration is that we can infer performance estimates without ever accessing the 
ground truth data! Let's not skip ahead and recap the definition of calibration briefly.

A classifier usually does not just tell you *which* class it picked. It hands
you a number alongside it — 0.7, 0.99, 0.51. Calibration is the question of
whether that number means anything.

A model is well calibrated when, across all the cases where it said **0.7**, it
turns out to be right about **70%** of the time. Take every prediction it made
with 90% confidence, and 90% of them should be correct. The number is a
promise; calibration is whether the model keeps it.

This is a different property from accuracy, and the two come apart in both
directions:

- A model can be **accurate but badly calibrated**. It gets 95% of cases right
  while reporting 0.999 on nearly all of them. Every individual prediction is
  overconfident; the accuracy is still excellent.
- A model can be **inaccurate but perfectly calibrated**. On a genuinely hard
  problem, a model that reports 0.55 and is right 55% of the time is telling you
  the exact truth about how hard the problem is.

The usual way to look at this is a reliability diagram: bin the predictions by
the confidence they were given, then plot the confidence of each bin against how
often that bin was actually correct. Perfect calibration is the diagonal.
Everything below it is overconfidence, everything above it is underconfidence.

Modern deep networks sit below the line. They are, as a rule, overconfident —
and more so as they get larger and are trained longer.

<details class="formal">
<summary>Formal perspective</summary>

In formal terms, all of this rests on a single conditional statement.

<div class="def">

**Definition 1 (Calibration).** Let $X$ be an input with true label $Y$, let
$\hat Y$ be the class the model predicts for it, and let $\hat p \in [0,1]$ be
the confidence the model reports for that prediction. Write

$$
\operatorname{acc}(p) \;=\; \mathbb{P}\bigl(\hat Y = Y \,\big|\, \hat p = p\bigr)
$$

for the accuracy among all cases the model called with confidence $p$. The
model is **perfectly calibrated** if

$$
\operatorname{acc}(p) = p \qquad \text{for every } p \in [0,1].
$$

</div>

Perfect calibration is a limit case. What one actually needs is a number for
how far a given model is from it — and the strictest such number is the largest
gap anywhere on the confidence scale.

<div class="def">

**Definition 2 (Maximum calibration error).** The MCE of a model is

$$
\mathrm{MCE} \;=\; \max_{p \in [0,1]} \bigl|\operatorname{acc}(p) - p\bigr|.
$$

<figure class="def__figure">
<svg class="reliability" viewBox="0 0 300 300" role="img" aria-labelledby="rd-title rd-desc">
<title id="rd-title">Reliability diagram of an over-confident model</title>
<desc id="rd-desc">Reported confidence on the horizontal axis against observed accuracy on the vertical axis. A dashed diagonal marks perfect calibration. The model's binned curve runs below that diagonal across the whole range, which is the signature of over-confidence, and the largest vertical distance between the two is marked as the maximum calibration error.</desc>
<g class="rd-axis"><line x1="44" y1="260" x2="290" y2="260" /><line x1="44" y1="14" x2="44" y2="260" /></g>
<line class="rd-diagonal" x1="44" y1="260" x2="284" y2="20" />
<text class="rd-region" x="54" y="118">under-confident</text>
<text class="rd-region" x="150" y="246">over-confident</text>
<g class="rd-gap"><line x1="212" y1="92" x2="212" y2="140" /><line x1="206" y1="92" x2="218" y2="92" /><line x1="206" y1="140" x2="218" y2="140" /></g>
<text class="rd-gap-label" x="228" y="123">MCE</text>
<polyline class="rd-curve" points="68,245.6 116,212 164,173.6 212,140 260,87.2" />
<g class="rd-point"><circle cx="68" cy="245.6" r="3.6" /><circle cx="116" cy="212" r="3.6" /><circle cx="164" cy="173.6" r="3.6" /><circle cx="212" cy="140" r="3.6" /><circle cx="260" cy="87.2" r="3.6" /></g>
<g class="rd-tick"><text x="44" y="278">0</text><text x="284" y="278">1</text><text class="rd-tick--y" x="36" y="26">1</text></g>
<text class="rd-axis-label" x="167" y="293">confidence</text>
<text class="rd-axis-label" x="16" y="137" transform="rotate(-90 16 137)">accuracy</text>
</svg>
<figcaption>The MCE is the largest vertical distance from the diagonal — here at the fourth bin, where the model claims 0.7 and delivers 0.5.</figcaption>
</figure>
</div>

In practice $\operatorname{acc}(p)$ is not observable: there are rarely two
predictions carrying exactly the same confidence. So it is estimated by
binning — partition the predictions into $M$ bins $B_1, \dots, B_M$ by reported
confidence and take

$$
\mathrm{MCE}_M \;=\; \max_{m \le M} \bigl|\operatorname{acc}(B_m) - \operatorname{conf}(B_m)\bigr|,
$$

where $\operatorname{conf}(B_m)$ is the mean confidence inside bin $m$. That is
exactly what a reliability diagram shows: the MCE is its largest vertical
departure from the diagonal.

Averaging those gaps rather than maximising over them gives the more commonly
reported ECE. The maximum is the conservative choice, and it is the right one
when a single bad region of the confidence scale is what you are worried
about — which, in a high-risk setting, it is.

</details>

## Why it matters

Because an uncalibrated probability is not a probability. It is a ranking score
wearing a probability's clothes.

That distinction is invisible for as long as you only ever use the model's
*argmax* — which class won. Ranking is preserved under any monotone distortion
of the scores, so a badly calibrated model can top every accuracy leaderboard
and nothing about the miscalibration will show up in the metric.

It stops being invisible the moment anything downstream reads the number itself
rather than the ordering. And in practice, something almost always does:

- **A threshold.** "Flag anything above 0.9 for review" is a statement about
  probability. If 0.9 actually means 0.6, you have quietly set a completely
  different operating point than the one you wrote down.
- **A human in the loop.** Any workflow where the model handles the confident
  cases and escalates the uncertain ones depends entirely on the confidence
  being real.
- **Combination with other evidence.** Merging a model's output with a prior,
  another model, or a second measurement is arithmetic on probabilities. Feed it
  numbers that are not probabilities and the result is not meaningful.

Accuracy tells you how often the model is right in aggregate. Calibration is
what lets you say something about the *single case in front of you* — and single
cases are what decisions are made on.

## What well-calibrated models let you do

Once the number can be taken at face value, a set of things become available
that are simply not available otherwise.

**Selective prediction.** The model answers where it is confident and abstains
where it is not, handing those cases to a human. The whole approach rests on
confidence being trustworthy: an overconfident model abstains too rarely, and
abstains on the wrong cases.

**Operating points you can actually choose.** Picking a threshold to hit a
target error rate is only possible if predicted probabilities correspond to real
frequencies. Otherwise the threshold has to be tuned empirically and re-tuned
whenever anything shifts.

**Uncertainty you can show.** In segmentation, a calibrated per-pixel confidence
becomes something a person can look at — a map of where the model is unsure,
typically the boundaries and the ambiguous structures. That is a genuinely
useful artefact, and it is only as honest as the calibration underneath it.

## The paper

A segmentation model that goes into clinical use has to meet a quality standard
on *each* image, not on average. A model can look strong in aggregate and still
fail badly on one particular image — and the average is no comfort at all to
whoever happens to be holding that image.

We built a combined quality-control and error-correction framework around that
problem. Uncertainty maps from an ensemble of segmentation models decide which
local patches of an image are worth a human's attention. The framework then
recommends how many patches to send for manual review, and estimates in advance
what that review will do to the Dice score of the corrected segmentation.

That estimate is the part that turns a suggestion into a control. Because the
predicted improvement can be trusted, segmentation quality can be traded against
review time deliberately: review as little as necessary to clear the standard,
rather than reviewing everything or guessing. We evaluated it on retinal vessel
segmentation in fundus images, where the Dice score rose substantially after
reviewing only a handful of patches.

The setting is specific. The requirement behind it is not — all it takes is a
model that emits uncertainty estimates good enough that something downstream can
act on them.
