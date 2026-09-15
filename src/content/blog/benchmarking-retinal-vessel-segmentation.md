---
title: Benchmarking segmentation models for retinal vessel segmentation
date: 2024-06-21
summary: >-
  Clinics differ in cameras, lighting and patients, so a model validated in one
  is asked to hold up in all the others. We varied those conditions
  deliberately to find out which of them actually move performance.
tags: [segmentation, benchmarking, robustness, domain-shift]
track: data-science
mark: vessels
kind: Publication
paper:
  label: Preprint — not peer-reviewed
  title: >-
    Benchmarking Retinal Blood Vessel Segmentation Models for Cross-Dataset
    and Cross-Disease Generalization
  authors: Jeremiah Fadugba, Patrick Köhler, Lisa Koch, Petru Manescu, Philipp Berens
  venue: arXiv:2406.14994 [eess.IV]
  year: 2024
  url: https://arxiv.org/abs/2406.14994
  mark: vessels
---

Medical imaging setups are not interchangeable. Two clinics running the same
examination differ in the camera and its optics, in illumination, in how much
training the operator had, and — before any of that — in which patients walk
through the door. A model validated in one of them is asked, on deployment, to
hold up in all the others. That is a typical safety question.


The field of retinal vessel segmentation has spent years ranking models on DRIVE and CHASEDB1 — 40 images
from a single screening programme, and 28 images of 14 healthy children. So we
asked a different question: not *how good is this model*, but *which of the
things that vary between clinics actually move its performance, and by how
much*.

We evaluated five published architectures, each trained under four losses, for
their robustness against the three shifts a new clinic actually imposes: a
different dataset source, a different mix of diseases, and lower image quality.

That work is a paper I co-authored, and this is the short version of it — the
findings, without the protocol or the full results. The paper itself is linked
at the foot of the page.

<div class="fundus__figure">

<ul class="fundus__labels" aria-hidden="true">
  <li>FIVES · DR</li>
  <li>FIVES · AMD</li>
  <li>FIVES · healthy</li>
  <li>FIVES · glaucoma</li>
  <li>DRIVE</li>
  <li>CHASEDB1</li>
</ul>

![Six fundus photographs above their vessel annotations, one column per dataset. The four FIVES columns and the DRIVE and CHASEDB1 examples differ sharply in colour cast, brightness and contrast — the glaucoma image is nearly dark, the DRIVE image washed out. The DRIVE and CHASEDB1 annotations trace far more fine capillaries than the FIVES ones.](./figures/retinal-vessel-benchmark/dataset-examples.png)

*The variation is there before any model sees it. Top: fundus images from the four FIVES subgroups, DRIVE and CHASEDB1. Bottom: their reference annotations — the last two trace noticeably finer vessels, so the labelling protocols differ too, not just the cameras. Taken and slightly modified from [Fadugba et al. (2024)](https://arxiv.org/abs/2406.14994), CC BY-SA 4.0.*

</div>

## What we varied

Concretely: five architectures (UNet, FR-UNet, MA-Net, SA-UNet, W-Net) under
four losses (BCE, SoftDice, DiceBCE, clDice), trained on FIVES — the largest
annotated fundus dataset available (n = 800), split evenly across diabetic
retinopathy, macular degeneration, glaucoma and healthy eyes — then tested
across three datasets, four ophthalmological conditions and three aspects of
image quality. Performance below is Dice, the
overlap between predicted and reference segmentation, where 1.0 is perfect.

Neither the architecture nor the loss turned out to matter much. Of the three
shifts, one costs almost nothing — the other two are the problem.

## The data did the work, not the architecture

Trained and tested on FIVES, UNet, FR-UNet and MA-Net all land at about 0.90;
SA-UNet and W-Net at about 0.85. Reported agreement among junior human graders
is 0.92, so the top three sit just below human consensus. The plain UNet from
2015 is not beaten by any of the modifications designed specifically for thin,
highly connected structures — *given a training set this large*, which is the
condition the whole result rests on. The loss function matters even less: the
spread across all four, within any of the top three architectures, is under one
percentage point.

So what got these models to 0.90 was not the network architecture. It was a
training set large enough, and annotated well enough, to make the choice of
network architecture almost irrelevant.

## Disease shift costs almost nothing

So how well do these models hold up once the data changes? Start with the
gentlest version of that question: a disease the model has never been trained
on.

Train on three of the four conditions, test on the held-out fourth, and median
performance stays close to in-domain; the largest drop across all models was
W-Net, at 4.03%. Segmentation is consistently better on healthy and AMD images
than on diabetic retinopathy and glaucoma, but that gap breaks nothing. This is
the reassuring half of the result — a model will probably cope with a disease
it has not seen.

## The best in-domain model is not the most robust

Now the harder version of the question: what happens when the images come from
a different source altogether — another camera, another clinic, another
labelling protocol? This is the half that should worry you.

The setup: we trained each architecture separately on each of the three
datasets and tested it on the other two — six train-test pairs per model, all
with the DiceBCE loss. In the plots below the horizontal axis is a model's
score on the dataset it was trained on, the vertical axis its score on the
dataset it was moved to, so the dashed diagonal is what lossless transfer would
look like.

<figure class="xd__figure">
<svg class="xdomain" viewBox="0 0 672 706" role="img" aria-labelledby="xd-title xd-desc">
<title id="xd-title">Cross-dataset generalisation for four segmentation models</title>
<desc id="xd-desc">Four panels, one per model. Each plots a model's Dice on the dataset it was trained on against its Dice on the dataset it was tested on, with a dashed diagonal marking a lossless transfer. Twenty-nine of the thirty points lie below the diagonal. Models trained on FIVES sit furthest right and land highest. FR-UNet and W-Net fall furthest below the diagonal; SA-UNet and UNet stay closest to it.</desc>
<text class="xd-legend-label" x="52" y="16">Trained on</text>
<rect class="xd-mark xd-chase" x="131.0" y="6.5" width="10.0" height="10.0" rx="1"/>
<text class="xd-legend" x="148" y="16">CHASEDB1</text>
<g class="xd-mark xd-drive xd-x"><line x1="221.9" y1="7.4" x2="230.1" y2="15.6"/><line x1="221.9" y1="15.6" x2="230.1" y2="7.4"/></g>
<text class="xd-legend" x="238" y="16">DRIVE</text>
<polygon class="xd-mark xd-fives" points="300.0,5.1 306.4,11.5 300.0,17.9 293.6,11.5"/>
<text class="xd-legend" x="312" y="16">FIVES</text>
<g class="xd-panel">
<text class="xd-panel-title" x="186" y="34">UNet</text>
<g class="xd-axis"><line x1="52" y1="314" x2="320" y2="314"/><line x1="52" y1="46" x2="52" y2="314"/></g>
<line class="xd-diagonal" x1="52.0" y1="314.0" x2="320.0" y2="46.0"/>
<g class="xd-tick"><line x1="100.1" y1="314" x2="100.1" y2="318"/><text class="xd-ticklabel" x="100.1" y="331">60</text></g>
<g class="xd-tick"><line x1="48" y1="265.9" x2="52" y2="265.9"/><text class="xd-ticklabel xd-ticklabel--y" x="44" y="269.4">60</text></g>
<g class="xd-tick"><line x1="168.8" y1="314" x2="168.8" y2="318"/><text class="xd-ticklabel" x="168.8" y="331">70</text></g>
<g class="xd-tick"><line x1="48" y1="197.2" x2="52" y2="197.2"/><text class="xd-ticklabel xd-ticklabel--y" x="44" y="200.7">70</text></g>
<g class="xd-tick"><line x1="237.5" y1="314" x2="237.5" y2="318"/><text class="xd-ticklabel" x="237.5" y="331">80</text></g>
<g class="xd-tick"><line x1="48" y1="128.5" x2="52" y2="128.5"/><text class="xd-ticklabel xd-ticklabel--y" x="44" y="132.0">80</text></g>
<g class="xd-tick"><line x1="306.3" y1="314" x2="306.3" y2="318"/><text class="xd-ticklabel" x="306.3" y="331">90</text></g>
<g class="xd-tick"><line x1="48" y1="59.7" x2="52" y2="59.7"/><text class="xd-ticklabel xd-ticklabel--y" x="44" y="63.2">90</text></g>
<rect class="xd-mark xd-chase" x="236.3" y="176.5" width="10.0" height="10.0" rx="1"/>
<rect class="xd-mark xd-chase" x="236.3" y="143.0" width="10.0" height="10.0" rx="1"/>
<g class="xd-mark xd-drive xd-x"><line x1="214.4" y1="190.7" x2="222.6" y2="198.9"/><line x1="214.4" y1="198.9" x2="222.6" y2="190.7"/></g>
<g class="xd-mark xd-drive xd-x"><line x1="214.4" y1="156.9" x2="222.6" y2="165.1"/><line x1="214.4" y1="165.1" x2="222.6" y2="156.9"/></g>
<polygon class="xd-mark xd-fives" points="307.3,138.8 313.7,145.2 307.3,151.6 300.9,145.2"/>
<polygon class="xd-mark xd-fives" points="307.3,135.1 313.7,141.5 307.3,147.9 300.9,141.5"/>
<text class="xd-pointlabel" x="229.5" y="164.5" text-anchor="start">F</text>
<text class="xd-pointlabel" x="229.5" y="198.3" text-anchor="start">C</text>
<text class="xd-pointlabel" x="252.3" y="151.5" text-anchor="start">F</text>
<text class="xd-pointlabel" x="252.3" y="185.0" text-anchor="start">D</text>
<text class="xd-pointlabel" x="318.3" y="145.0" text-anchor="start">C</text>
<text class="xd-pointlabel" x="296.3" y="148.7" text-anchor="end">D</text>
</g>
<g class="xd-panel">
<text class="xd-panel-title" x="486" y="34">FR-UNet</text>
<g class="xd-axis"><line x1="352" y1="314" x2="620" y2="314"/><line x1="352" y1="46" x2="352" y2="314"/></g>
<line class="xd-diagonal" x1="352.0" y1="314.0" x2="620.0" y2="46.0"/>
<g class="xd-tick"><line x1="400.1" y1="314" x2="400.1" y2="318"/><text class="xd-ticklabel" x="400.1" y="331">60</text></g>
<g class="xd-tick"><line x1="348" y1="265.9" x2="352" y2="265.9"/><text class="xd-ticklabel xd-ticklabel--y" x="344" y="269.4">60</text></g>
<g class="xd-tick"><line x1="468.8" y1="314" x2="468.8" y2="318"/><text class="xd-ticklabel" x="468.8" y="331">70</text></g>
<g class="xd-tick"><line x1="348" y1="197.2" x2="352" y2="197.2"/><text class="xd-ticklabel xd-ticklabel--y" x="344" y="200.7">70</text></g>
<g class="xd-tick"><line x1="537.5" y1="314" x2="537.5" y2="318"/><text class="xd-ticklabel" x="537.5" y="331">80</text></g>
<g class="xd-tick"><line x1="348" y1="128.5" x2="352" y2="128.5"/><text class="xd-ticklabel xd-ticklabel--y" x="344" y="132.0">80</text></g>
<g class="xd-tick"><line x1="606.3" y1="314" x2="606.3" y2="318"/><text class="xd-ticklabel" x="606.3" y="331">90</text></g>
<g class="xd-tick"><line x1="348" y1="59.7" x2="352" y2="59.7"/><text class="xd-ticklabel xd-ticklabel--y" x="344" y="63.2">90</text></g>
<rect class="xd-mark xd-chase" x="543.9" y="174.3" width="10.0" height="10.0" rx="1"/>
<rect class="xd-mark xd-chase" x="543.9" y="128.1" width="10.0" height="10.0" rx="1"/>
<g class="xd-mark xd-drive xd-x"><line x1="537.7" y1="252.2" x2="545.9" y2="260.4"/><line x1="537.7" y1="260.4" x2="545.9" y2="252.2"/></g>
<g class="xd-mark xd-drive xd-x"><line x1="537.7" y1="262.3" x2="545.9" y2="270.5"/><line x1="537.7" y1="270.5" x2="545.9" y2="262.3"/></g>
<polygon class="xd-mark xd-fives" points="608.8,158.6 615.2,165.0 608.8,171.4 602.4,165.0"/>
<polygon class="xd-mark xd-fives" points="608.8,130.9 615.2,137.3 608.8,143.7 602.4,137.3"/>
<text class="xd-pointlabel" x="552.8" y="259.8" text-anchor="start">C</text>
<text class="xd-pointlabel" x="530.8" y="269.9" text-anchor="end">F</text>
<text class="xd-pointlabel" x="559.9" y="136.6" text-anchor="start">F</text>
<text class="xd-pointlabel" x="559.9" y="182.8" text-anchor="start">D</text>
<text class="xd-pointlabel" x="619.8" y="140.8" text-anchor="start">C</text>
<text class="xd-pointlabel" x="619.8" y="168.5" text-anchor="start">D</text>
</g>
<g class="xd-panel">
<text class="xd-panel-title" x="186" y="368">SA-UNet</text>
<g class="xd-axis"><line x1="52" y1="648" x2="320" y2="648"/><line x1="52" y1="380" x2="52" y2="648"/></g>
<line class="xd-diagonal" x1="52.0" y1="648.0" x2="320.0" y2="380.0"/>
<g class="xd-tick"><line x1="100.1" y1="648" x2="100.1" y2="652"/><text class="xd-ticklabel" x="100.1" y="665">60</text></g>
<g class="xd-tick"><line x1="48" y1="599.9" x2="52" y2="599.9"/><text class="xd-ticklabel xd-ticklabel--y" x="44" y="603.4">60</text></g>
<g class="xd-tick"><line x1="168.8" y1="648" x2="168.8" y2="652"/><text class="xd-ticklabel" x="168.8" y="665">70</text></g>
<g class="xd-tick"><line x1="48" y1="531.2" x2="52" y2="531.2"/><text class="xd-ticklabel xd-ticklabel--y" x="44" y="534.7">70</text></g>
<g class="xd-tick"><line x1="237.5" y1="648" x2="237.5" y2="652"/><text class="xd-ticklabel" x="237.5" y="665">80</text></g>
<g class="xd-tick"><line x1="48" y1="462.5" x2="52" y2="462.5"/><text class="xd-ticklabel xd-ticklabel--y" x="44" y="466.0">80</text></g>
<g class="xd-tick"><line x1="306.3" y1="648" x2="306.3" y2="652"/><text class="xd-ticklabel" x="306.3" y="665">90</text></g>
<g class="xd-tick"><line x1="48" y1="393.7" x2="52" y2="393.7"/><text class="xd-ticklabel xd-ticklabel--y" x="44" y="397.2">90</text></g>
<rect class="xd-mark xd-chase" x="227.7" y="490.0" width="10.0" height="10.0" rx="1"/>
<rect class="xd-mark xd-chase" x="227.7" y="454.0" width="10.0" height="10.0" rx="1"/>
<g class="xd-mark xd-drive xd-x"><line x1="244.8" y1="516.1" x2="253.0" y2="524.3"/><line x1="244.8" y1="524.3" x2="253.0" y2="516.1"/></g>
<g class="xd-mark xd-drive xd-x"><line x1="244.8" y1="458.4" x2="253.0" y2="466.6"/><line x1="244.8" y1="466.6" x2="253.0" y2="458.4"/></g>
<polygon class="xd-mark xd-fives" points="282.5,473.4 288.9,479.8 282.5,486.2 276.1,479.8"/>
<polygon class="xd-mark xd-fives" points="282.5,495.5 288.9,501.9 282.5,508.3 276.1,501.9"/>
<text class="xd-pointlabel" x="221.7" y="462.5" text-anchor="end">F</text>
<text class="xd-pointlabel" x="243.7" y="498.5" text-anchor="start">D</text>
<text class="xd-pointlabel" x="259.9" y="466.0" text-anchor="start">F</text>
<text class="xd-pointlabel" x="259.9" y="523.7" text-anchor="start">C</text>
<text class="xd-pointlabel" x="293.5" y="483.3" text-anchor="start">D</text>
<text class="xd-pointlabel" x="293.5" y="505.4" text-anchor="start">C</text>
</g>
<g class="xd-panel">
<text class="xd-panel-title" x="486" y="368">W-Net</text>
<g class="xd-axis"><line x1="352" y1="648" x2="620" y2="648"/><line x1="352" y1="380" x2="352" y2="648"/></g>
<line class="xd-diagonal" x1="352.0" y1="648.0" x2="620.0" y2="380.0"/>
<g class="xd-tick"><line x1="400.1" y1="648" x2="400.1" y2="652"/><text class="xd-ticklabel" x="400.1" y="665">60</text></g>
<g class="xd-tick"><line x1="348" y1="599.9" x2="352" y2="599.9"/><text class="xd-ticklabel xd-ticklabel--y" x="344" y="603.4">60</text></g>
<g class="xd-tick"><line x1="468.8" y1="648" x2="468.8" y2="652"/><text class="xd-ticklabel" x="468.8" y="665">70</text></g>
<g class="xd-tick"><line x1="348" y1="531.2" x2="352" y2="531.2"/><text class="xd-ticklabel xd-ticklabel--y" x="344" y="534.7">70</text></g>
<g class="xd-tick"><line x1="537.5" y1="648" x2="537.5" y2="652"/><text class="xd-ticklabel" x="537.5" y="665">80</text></g>
<g class="xd-tick"><line x1="348" y1="462.5" x2="352" y2="462.5"/><text class="xd-ticklabel xd-ticklabel--y" x="344" y="466.0">80</text></g>
<g class="xd-tick"><line x1="606.3" y1="648" x2="606.3" y2="652"/><text class="xd-ticklabel" x="606.3" y="665">90</text></g>
<g class="xd-tick"><line x1="348" y1="393.7" x2="352" y2="393.7"/><text class="xd-ticklabel xd-ticklabel--y" x="344" y="397.2">90</text></g>
<rect class="xd-mark xd-chase" x="498.1" y="523.9" width="10.0" height="10.0" rx="1"/>
<rect class="xd-mark xd-chase" x="498.1" y="623.2" width="10.0" height="10.0" rx="1"/>
<g class="xd-mark xd-drive xd-x"><line x1="519.6" y1="561.9" x2="527.8" y2="570.1"/><line x1="519.6" y1="570.1" x2="527.8" y2="561.9"/></g>
<g class="xd-mark xd-drive xd-x"><line x1="519.6" y1="614.8" x2="527.8" y2="623.0"/><line x1="519.6" y1="623.0" x2="527.8" y2="614.8"/></g>
<polygon class="xd-mark xd-fives" points="576.4,509.6 582.8,516.0 576.4,522.4 570.0,516.0"/>
<polygon class="xd-mark xd-fives" points="576.4,496.3 582.8,502.7 576.4,509.1 570.0,502.7"/>
<text class="xd-pointlabel" x="514.1" y="532.4" text-anchor="start">F</text>
<text class="xd-pointlabel" x="514.1" y="631.7" text-anchor="start">D</text>
<text class="xd-pointlabel" x="534.7" y="569.5" text-anchor="start">C</text>
<text class="xd-pointlabel" x="534.7" y="622.4" text-anchor="start">F</text>
<text class="xd-pointlabel" x="587.4" y="506.2" text-anchor="start">D</text>
<text class="xd-pointlabel" x="587.4" y="519.5" text-anchor="start">C</text>
</g>
<text class="xd-axis-title" x="336" y="700">Dice on the training dataset</text>
<text class="xd-axis-title" x="14" y="376" transform="rotate(-90 14 376)">Dice on the test dataset</text>
</svg>
<figcaption>Each marker is one train&#8211;test pair: the shape and colour say what the model was trained on, the letter beside it what it was tested on (C&#160;CHASEDB1, D&#160;DRIVE, F&#160;FIVES). Distance below the dashed diagonal is the domain gap. Four of the five models are shown; MA-Net behaves like UNet and is left out for space. Taken and slightly modified from <a href="https://arxiv.org/abs/2406.14994">Fadugba et al. (2024)</a>, redrawn from the exact values in the paper&#8217;s <a href="https://github.com/berenslab/Retinal-Vessel-Segmentation-Benchmark">analysis notebooks</a>.</figcaption>
</figure>

Three things to read off it. **Almost every point sits below the line**: a
dataset shift nearly always costs something, for every architecture.

**The green diamonds sit furthest right, and they land highest**: averaged over
all five architectures, a model trained on FIVES scores 76.3 on the dataset it
is moved to, against 72.5 for one trained on CHASEDB1 and 68.2 for one trained
on DRIVE. Better training data makes a better model on data it has never
seen.

And **the in-domain ranking does not survive**. FR-UNet, which led in-domain by
0.22 points over UNet, is among the two most shift-sensitive models; trained on
DRIVE it falls to around 0.60 elsewhere.

## The camera matters more than the patient

Quality effects were much larger than disease effects. Of its three components,
poor contrast hurt every model most; blur and illumination mattered less.

And FR-UNet loses again: on the worst-quality images it drops *below* the
generally weaker SA-UNet. Operating at full resolution keeps noise in the
intermediate representations that downsampling would otherwise average out — an
inductive bias that helps on clean images and hurts on dirty ones.

Two different shifts, two ways for the in-domain winner to be the wrong thing
to deploy.

## Takeaway

> Investing into a well curated dataset to train a standard architecture yields
> better results than tuning a sophisticated architecture on a smaller dataset
> or one with lower image quality.

For anyone assembling data for clinical use that reorders the priorities: image
quality first, dataset size and source second, disease coverage third,
architecture last.

## Datasets

The images and annotations above come from three publicly available datasets:

- **FIVES** — Jin, K., Huang, X., Zhou, J., Li, Y., Yan, Y., Sun, Y., Zhang,
  Q., Wang, Y., Ye, J. (2022). FIVES: A Fundus Image Dataset for Artificial
  Intelligence based Vessel Segmentation. *Scientific Data* 9, 475.
  [doi:10.1038/s41597-022-01564-3](https://doi.org/10.1038/s41597-022-01564-3)
  · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- **DRIVE** — Staal, J., Abràmoff, M.D., Niemeijer, M., Viergever, M.A., van
  Ginneken, B. (2004). Ridge-based vessel segmentation in color images of the
  retina. *IEEE Transactions on Medical Imaging* 23(4), 501–509.
  [doi:10.1109/TMI.2004.825627](https://doi.org/10.1109/TMI.2004.825627)
- **CHASEDB1** — Fraz, M.M., Remagnino, P., Hoppe, A., Uyyanonvara, B.,
  Rudnicka, A.R., Owen, C.G., Barman, S.A. (2012). An Ensemble
  Classification-Based Approach Applied to Retinal Blood Vessel Segmentation.
  *IEEE Transactions on Biomedical Engineering* 59(9), 2538–2548.
  [doi:10.1109/TBME.2012.2205687](https://doi.org/10.1109/TBME.2012.2205687)
  · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)

Both figures are reproduced from our preprint, which is published under
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
