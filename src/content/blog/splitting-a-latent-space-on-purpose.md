---
title: Splitting a latent space on purpose
date: 2021-06-28
summary: >-
  Trustworthiness again, but not in a classifier's output this time — in what
  a latent-variable model is built to represent in the first place, and a
  seminar project that split a VAE's latent code on purpose.
tags: [vae, variational-inference]
track: data-science
mark: distribution
kind: Note
pin: 2
status: draft
paper:
  label: Seminar paper — not peer-reviewed
  title: >-
    Conditional Subspace Variational Autoencoders for Counterfactual Recourse
    on Images
  authors: Patrick Köhler, Tobias Leemann
  venue: University of Tübingen
  year: 2021
  url: https://raw.githubusercontent.com/pat-rig/csvae4counterfactuals/main/seminar_paper.pdf
  mark: network
---

This is another look at trustworthiness in image classifiers and
latent-variable models more broadly.
[We've written before](/writing/well-calibrated-predictors/) about
well-calibrated predictors — trustworthiness as a property of a classifier's
*output*, whether a stated confidence means what it says. Here it's a
property of the model's architecture: what a latent-variable model is built
to represent, decided before it ever produces an output at all.

What follows is a sketch of the general principle: how you control the way
information gets organised inside a model's latent variables. It stays at the
level of the idea and the intuition behind it, and leans on the base paper
for everything underneath. A closer investigation — including an original
contribution of mine — is a separate article,
[A VAE loss that enforces statistical dependencies](/writing/vae-loss-statistical-dependencies/).

What's here builds on a short write-up I did during a seminar, working
through the loss function of the CS-VAE model to understand it more closely.
It's referenced at the foot of this post.

## Intuition

Take a diagnostic model that flags a scan as malignant. A natural follow-up
question is what the image would need to look like for the model to call it
benign instead. If the answer only changes what the diagnosis actually
depends on — a tumor's shape, its margins — a physician learns something
real. If it also changes the patient's bone density or the scanner's
contrast setting, it has learned nothing, because the model never kept those
two kinds of information apart in the first place.

## What a plain autoencoder doesn't ask for

A variational autoencoder compresses an image into a latent code and asks
two things of it: reconstruct the input well, and keep the code close to a
simple prior, so that points nearby still decode into something sensible.
Nothing in that objective says which part of the code should carry the
diagnosis and which part should carry everything else. Label and non-label
information get mixed by default, because nothing in the loss ever asks them
not to be.

## Forcing the split

A [Conditional Subspace VAE](https://proceedings.neurips.cc/paper/2018/hash/73e5080f0f3804cb9cf470a8ce895dac-Abstract.html)
*(Klys, Snell & Zemel, 2018)* fixes this by giving the label its own
subspace. The latent code is split in two: `w`, encoded with the label as an
input, and `z`, trained to reveal as little about the label as possible. The
second half is the interesting part — an optimizer can't just be told "don't
put label information here." Something has to actively push it out.

The trick is adversarial. A second network is trained to guess the label
from `z` alone. The encoder is then trained to do three things at once:
reconstruct well, stay close to the prior, and make that guesser's job as
hard as possible.

$$
\min_{\theta,\phi,\gamma} \; \beta_1 M_1 + \beta_2 M_2
\qquad\qquad
\max_{\delta} \; \beta_3 N
$$

$M_1$ is the ordinary VAE terms — reconstruction and regularity — extended
to the split code. $N$ trains the guesser: it gets to become as good as it
can at reading the label off `z`. $M_2$ is what the encoder is fighting
against: an estimate of how much label information still leaks into `z`,
which training pushes toward zero.

That write-up put the model in the context of counterfactual medical imaging
and left its predictive performance unbenchmarked — an open question, not a
result. The mechanism is the part worth keeping: **information doesn't
separate itself. If two things shouldn't share a representation, something in
the loss has to be actively fighting to keep them apart.**
