---
title: An argument for well-calibrated predictors in high-risk applications
date: 2026-09-05
summary: >-
  A model that says 70% should be right 70% of the time. That property lets you
  estimate how well a model is doing without ever seeing a label — and that is
  what our MIDL 2024 paper is built on.
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

Classification and regression models are often judged on performance.
Calibration — whether the confidence a model reports is worth anything — tends
not to be part of that judgement, in large part because accuracy is indifferent
to it. A model can sit at the top of a leaderboard while the numbers it attaches
to its predictions mean rather less than they appear to.

Performance metrics are aggregates — accuracy over a test set, a mean Dice score
across a cohort. In a high-risk setting the decision is not made over a test
set. Someone acts on the one image in front of them, and about that image an
aggregate has nothing to say. What the model does offer at that level is a
confidence score, and calibration is the quality of that score.

So the argument here is that calibration deserves more attention than it gets,
and that in medical imaging it buys something concrete rather than tidier
probabilities. What follows is not a recap of our MIDL 2024 paper but the view
from further out. We recap briefly what calibration means, point to a very important
implication of well calibrated models, and discuss the range of applications that opens
up from there. [Our paper](https://proceedings.mlr.press/v250/kohler24a.html) is
one of those applications.

## What calibration is

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

## Why calibration is useful

Here is the step that turns calibration from a tidiness property into a tool.

If a model's confidences are real probabilities, you can estimate how well it is
performing **without ever looking at a ground-truth label**.

That is a strong property and worth pausing on. Every ordinary way of measuring
a model needs the labels, which is why performance is established once on a test
set and then assumed to hold. Estimating it from the confidences alone means it
can be checked on the data the model is actually running on.

The argument is one line long. Take a batch of predictions and average the
confidence the model assigned to each one. Under calibration that confidence
*is* the probability the prediction is correct, so the average is the expected
accuracy:

$$
\mathbb{E}\bigl[\mathrm{acc}\bigr] \;=\; \frac{1}{N}\sum_{i=1}^{N} \hat p_i .
$$

There is no $Y$ on the right-hand side. Nothing was annotated to compute it.

And there is no machinery behind it either. This is not a theorem that has to be
proved, or an approximation that holds under conditions — it is the definition of
calibration, averaged. Definition 1 says the confidence attached to a prediction
*is* the probability that the prediction is correct. Take the mean of both sides
across a batch of predictions and the line above is what you have.

It does not stop at accuracy either. Split the predictions by which side of the
decision threshold they fell on, and the same move gives every cell of the
confusion matrix in expectation — true and false positives, true and false
negatives, all of them out of the confidences alone. Anything assembled from
those four numbers comes with it: precision, recall, specificity, $F_1$, and —
for segmentation — the Dice score.

<details class="formal">
<summary>Formal perspective</summary>

Take the binary case, with $p_i = \mathbb{P}(Y_i = 1 \mid X_i)$ as reported by
the model and $\hat y_i \in \{0, 1\}$ the label it assigns after thresholding.
Under perfect calibration, $p_i$ is the probability that case $i$ is genuinely
positive, so each prediction contributes its own probability mass to two cells
at once:

$$
\mathbb{E}[\mathrm{TP}] = \sum_{i \,:\, \hat y_i = 1} p_i,
\qquad
\mathbb{E}[\mathrm{FP}] = \sum_{i \,:\, \hat y_i = 1} (1 - p_i),
$$

$$
\mathbb{E}[\mathrm{FN}] = \sum_{i \,:\, \hat y_i = 0} p_i,
\qquad
\mathbb{E}[\mathrm{TN}] = \sum_{i \,:\, \hat y_i = 0} (1 - p_i).
$$

Every sum runs over model outputs only. Substituting these into the definition
of any rate built on the confusion matrix gives an estimate of that rate on
unlabelled data — for instance

$$
\mathbb{E}[\mathrm{DSC}] \;\approx\;
\frac{2\,\mathbb{E}[\mathrm{TP}]}{2\,\mathbb{E}[\mathrm{TP}] + \mathbb{E}[\mathrm{FP}] + \mathbb{E}[\mathrm{FN}]}.
$$

This is a ratio of expectations rather than the expectation of a ratio, so it is
not unbiased even under perfect calibration. In practice, though, the binding
constraint is the calibration itself: the estimate is only ever as good as the
probabilities going into it, which is why a model is normally temperature-scaled
before anyone applies it.

</details>

That is what makes it a control rather than a diagnostic. Errors are rarely
symmetric — a missed lesion on a screening image is not the same kind of mistake
as a false alarm — and if you can estimate each cell separately, you can pick
the threshold that holds the one you care about at the level you chose. Control
the type I error, or the false-negative rate, or the Dice score, and do it on
the unlabelled data actually in front of you rather than on the test set where
the labels happened to live.

## Downstream applications

An unlabelled performance estimate is a small equation with a large amount
downstream of it.

It gives you **selective prediction**: the model answers where it is confident
and hands over the rest, with the abstention rate set to a performance target
instead of a guess. It gives you **operating points you can choose in advance**,
rather than tuning a threshold empirically and re-tuning it whenever anything
shifts. And it gives you **quality control on data you have no labels for** —
which is all data that matters, because the point of deployment is that the
annotation has stopped.

[Our MIDL 2024 paper](https://proceedings.mlr.press/v250/kohler24a.html) is one
instance of that last one.

A segmentation model in clinical use has to meet a quality standard on *each*
image, not on average. A model can look strong in aggregate and still fail badly
on one particular image, and the average is no comfort to whoever is holding it.
We built a combined quality-control and error-correction framework around that
problem: uncertainty maps from an ensemble decide which local patches of an
image are worth a human's attention, the framework recommends how many patches
to send for manual review, and it estimates in advance what that review will do
to the Dice score of the corrected segmentation.

![One test image in three panels: the retinal photograph, the manual ground-truth vessel tracing, and the model's prediction. The prediction follows the main vessel tree closely but drops a branch on the right-hand side that the ground truth has, and thins out along several of the finer vessels.](./figures/calibration/fundus-prediction.png)

*A fundus image, the manual ground truth, and the model's prediction. The Dice score is the disagreement between the last two. The white and red boxes are the first two patches the framework selected for review; the magenta one is ours, marking a branch the ground truth has and the model reduces to a faint trace — the kind of local failure a per-image quality standard has to catch, and one an aggregate score would bury.*

That last estimate is the whole point, and it is the equation above doing the
work — the label-free DSC estimator of Li et al. (2022), which we extended to
predict the score *after* a given set of patches has been corrected. That
extension is what turns a quality score into a review budget: because the
predicted improvement can be trusted, segmentation quality can be traded against
review time deliberately, reviewing as little as necessary to clear the standard
rather than reviewing everything or guessing. On retinal vessel segmentation in
fundus images, our adaptive strategy reached a quality target of nearly 0.90
Dice at 3.2 reviewed patches per image — about a third of what a fixed review
budget needed for the same standard.

All of which rests on the calibration actually holding. A segmentation network's
output probabilities are not calibrated out of the box, so they have to be
temperature-scaled first, and skipping that step does not degrade the estimate
gracefully. It breaks it in one direction.

<div class="figure-float">

![Estimated against true Dice for the 200 test images. The calibrated estimates scatter tightly around the diagonal. The uncalibrated ones collapse into a vertical band near 0.96 whatever the true score behind them, so every bad segmentation is reported as a good one.](./figures/calibration/dsc-estimate-scatter.png)

*Estimated against true Dice, 200 test images. Same model, same estimator — the only difference is whether the probabilities were temperature-scaled first.*

</div>

The crosses nearly all claim an estimated Dice above 0.95, while the true scores
behind them run from 0.80 to 0.95. An uncalibrated model does not merely give
you a noisier estimate of its own quality; it tells you everything is fine.
Calibrated, the same estimator lands on the diagonal at a mean absolute error of
0.02 — small enough to set a review budget against.

The setting is specific. The property underneath it is not.
