---
title: A VAE loss that enforces statistical dependencies
date: 2022-08-26
summary: >-
  The mathematics behind pushing information around a latent space — the
  mutual-information term the CS-VAE uses, derived in full, and a
  conditional version of it that says which subspaces may share what.
tags: [vae, loss-functions]
track: data-science
mark: sigma
kind: Thesis
pin: 3
paper:
  label: Master's thesis
  title: >-
    Obeying Causal Structure when Manipulating Images through Latent
    Representations
  authors: Patrick Köhler
  venue: University of Tübingen
  year: 2022
  mark: network
---


In [the last post](/writing/splitting-a-latent-space-on-purpose/) we looked
at the VAE architecture and built an intuition for how and why we use
latent variables. We also ran into a problem. Nothing in the objective
says which part of the latent code should carry which information, so by
default it carries all of it, mixed — and the Conditional Subspace VAE's
*([Klys, Snell & Zemel, 2018](https://proceedings.neurips.cc/paper/2018/hash/73e5080f0f3804cb9cf470a8ce895dac-Abstract.html))* answer was to add terms to the loss that actively push label information
out of one subspace and into another.

That post stayed at the level of intuition on purpose. This one does the
opposite: we go into the mathematics of the loss function — the terms
behind that push, and a stronger version of them. I derived the resulting loss function in
Master's thesis, where the parts that define the structure in the latent space is the key contribution.

The reason why we are looking at integrals, entropies and a mutual information or two now is for
the depth. If we want to control *thoroughly* what information is encoded where, the loss is the only place
that control exists — and the only way to know what a loss term actually
does is to derive it.

## The tool, once

Recall the CS-VAE objective from the last post. The latent space is split
into $z$ and one subspace $w_i$ per attribute, and the loss has three
parts: $M_1$, the ordinary variational bound extended to the split code;
$M_2$, an estimate of the mutual information between $z$ and the label
$y$, which the encoder minimises; and $N$, which trains the predictor that
$M_2$ needs:

$$
\min_{\theta,\phi,\gamma}\; \beta_1 M_1 + \beta_2 M_2
\qquad\text{and}\qquad
\max_{\delta}\; \beta_3 N .
$$

Look at what $M_2$ is made of:

$$
M_2 \;=\; \mathbb{E}_{x}\, \mathbb{E}_{z \sim q_\phi(z \mid x)}
\left[ \int_{y} q_\delta(y \mid z)\,\log q_\delta(y \mid z)\, dy \right].
$$

Inside the brackets is the negative entropy of a predictor's output — a
network $q_\delta$ that reads the label off $z$. Averaged over the data
and over the encoder's samples, that is a mutual information up to a
constant, and minimising it through $\phi$ while fitting $q_\delta$
through $\delta$ is the whole trick. **An entropy of a learned predictor,
pushed one way by the encoder and the other way by the predictor.** That
shape is the tool. Everything below is that tool, applied more carefully.

## Where the tool is not enough

The CS-VAE keeps label information out of $z$. It says nothing about what
the label subspaces do *to each other*, and that is where the trouble is.

Attributes in real data are correlated, often for reasons that have
nothing to do with the attributes themselves. Suppose a disease stage is,
in the training set, almost always observed in female patients. A model
asked what a male patient's scan would look like at that stage will
produce female characteristics, because those are the only perturbations
its latent space ever learned to allow. The information about the stage
and the information about sex were never separated, and nothing asked
them to be.

The textbook answer is disentanglement: force every attribute subspace to
share no information with any other, $\mathrm{MI}(w_i, w_j) = 0$.
[Funke et al. (2021)](https://arxiv.org/abs/2112.14754) show what that costs, in a linear setting small enough to
solve exactly. Generate data from two correlated attributes, train an
encoder, then test it on data where the correlation is gone. Measure how
much of the variance in the true attributes the encoding can still
explain:

| explained variance | no regulariser | $\mathrm{MI} = 0$ | conditional $\mathrm{MI} = 0$ |
|---|---|---|---|
| train, $\rho = 0.8$ | 0.92 | 0.70 | 0.91 |
| test, $\rho = 0$ | 0.88 | 0.65 | 0.91 |

*Fraction of variance in the true attributes that a predictor trained on the
encoding explains, after Funke et al. (2021). All three columns maximise the
likelihood; the last two add a regulariser.*

Two failures, one on each side. The likelihood-optimal encoder has fitted
the training correlation and carries it into the test set. The
disentangled encoder has thrown away information it needed: under that
constraint, at least one subspace cannot hold everything about its own
attribute, and the numbers drop on both rows. The column that works
forbids only the sharing that goes *beyond* what the attribute itself
explains — a conditional independence, with a conditional mutual
information as its loss.

That is the statement to enforce: not "these subspaces share nothing,"
but "this subspace adds nothing about that attribute, given the subspace
that is supposed to carry it." What follows is how to turn it into a
number the encoder can minimise.

## The derivation

Take two attributes, $b$ and $g$, each with a subspace. We want $w_b$ to
be allowed to carry information about $g$ — but only what $w_g$ already
carries. As an independence statement:

$$
w_b \;\perp\; y_g \;\mid\; w_g .
$$

The quantity that measures the distance from it is the conditional mutual
information, and it splits into two entropies:

$$
\mathrm{MI}(w_b, y_g \mid w_g)
\;=\; H(y_g \mid w_g) \;-\; H(y_g \mid w_b, w_g).
$$

Both terms have the same form, so derive one. Write
$\tilde{w} = (w_b, w_g)$ for the second. By definition,

$$
H(y_g \mid \tilde{w})
\;=\; -\int_{\tilde{W}} \int_{Y_g}
p(\tilde{w})\; p(y_g \mid \tilde{w})\,\log p(y_g \mid \tilde{w})
\; dy_g \, d\tilde{w}.
$$

Two of these densities are not things we have. $p(\tilde{w})$ is the
marginal distribution of latent codes; $p(y_g \mid \tilde{w})$ is the
posterior over a label given a code. Both get the same treatment the VAE
gives its own unknowns: express what you cannot have through what you can
learn.

The marginal first. A code is what the encoder produces from an image, so
its distribution is the encoder's output averaged over the data,
$p(\tilde{w}) = \int p(\tilde{w} \mid x)\, p(x)\, dx$. Substituting turns
the marginal into an expectation over $x$:

$$
H(y_g \mid \tilde{w})
\;=\; -\int_{X} \int_{\tilde{W}} \int_{Y_g}
p(\tilde{w} \mid x)\, p(x)\; p(y_g \mid \tilde{w})\,\log p(y_g \mid \tilde{w})
\; dy_g \, d\tilde{w} \, dx
$$

$$
\;=\; \mathbb{E}_{x}\left[
-\int_{\tilde{W}} \int_{Y_g}
p(\tilde{w} \mid x)\; p(y_g \mid \tilde{w})\,\log p(y_g \mid \tilde{w})
\; dy_g \, d\tilde{w}
\right].
$$

Now the two conditionals, parameterised. $p(\tilde{w} \mid x)$ is the
encoder, $q_\phi(\tilde{w} \mid x)$ — it exists already. $p(y_g \mid
\tilde{w})$ does not, so introduce a network for it, $q_\delta(y_g \mid
\tilde{w})$. With the encoder in place, the integral over $\tilde{w}$ is
an expectation over the encoder's samples:

$$
H(y_g \mid \tilde{w})
\;\approx\; \mathbb{E}_{x}\;
\mathbb{E}_{\tilde{w} \sim q_\phi(\tilde{w} \mid x)}
\left[
-\int_{Y_g} q_\delta(y_g \mid \tilde{w})\,\log q_\delta(y_g \mid \tilde{w})\; dy_g
\right].
$$

What is left inside the brackets is the entropy of the predictor's output
at one code — for a binary attribute, a sum over two values. The
expectations outside become averages: over the data set, and over samples
drawn from the encoder for each image. Call the result

$$
\hat{H}_\phi \;:=\;
\hat{\mathbb{E}}_{D(x,y)}\;
\hat{\mathbb{E}}_{q_\phi(\tilde{w} \mid x)}
\left[
-\int_{Y_g} q_\delta(y_g \mid \tilde{w})\,\log q_\delta(y_g \mid \tilde{w})\; dy_g
\right],
$$

an estimate of $H(y_g \mid \tilde{w})$ that the encoder can be trained on.
It still contains $q_\delta$, a network with no training signal of its
own. Give it one — fit it by maximum likelihood on the same samples:

$$
\max_{\delta}\;
\hat{L}_\delta \;:=\;
\hat{\mathbb{E}}_{D(x,y)}\;
\hat{\mathbb{E}}_{q_\phi(\tilde{w} \mid x)}
\bigl[\, q_\delta(y_g \mid \tilde{w}) \,\bigr].
$$

That is a predictor from $\tilde{w}$ to $y_g$, trained as well as it can
be. Compare it with $N$ from the CS-VAE: same thing, different input.

The first entropy, $H(y_g \mid w_g)$, is the same derivation with $w_g$ in
place of $\tilde{w}$ — a second predictor, which sees only $w_g$. Index
the two: $\hat{H}^1_\phi$ and $\hat{L}^1_{\delta_1}$ for the
predictor that sees $w_g$ alone, $\hat{H}^2_\phi$ and
$\hat{L}^2_{\delta_2}$ for the one that also sees $w_b$.

Now back to the mutual information. It is non-negative, so the best the
encoder can do is zero, and zero means

$$
H(y_g \mid w_g) \;=\; H(y_g \mid w_b, w_g):
$$

the two predictors are equally uncertain. So minimise the difference of
the two estimates over the encoder, while each predictor is fitted over
its own parameters:

$$
\min_{\phi}\; \hat{H}^1_\phi - \hat{H}^2_\phi
\quad\wedge\quad
\max_{\delta_1}\; \hat{L}^1_{\delta_1}
\quad\wedge\quad
\max_{\delta_2}\; \hat{L}^2_{\delta_2} .
$$

Add these to the CS-VAE objective and the model is complete. In words:
**if we predict $y_g$ from $w_g$, including $w_b$ must not help.** The
predictor that sees $w_b$ is trained to be as good as it can be, and the
encoder is trained so that it is no better than the predictor that does
not. Should moving $w_b$ change anything about $y_g$, the second predictor
could use it and its entropy would drop; the encoder is trained so that it
cannot.

Two remarks. The CS-VAE's $M_2$ is this derivation with a single term and
no conditioning — the entropy of a predictor from $z$, which is
$\mathrm{MI}(z, y)$ up to a constant — so the two regularisers are the
same estimator, one and two terms deep. And nothing above used that $y_g$
is one label or $w_b$ one subspace; replace either with a set and the
algebra is unchanged, which is how one statement becomes a list of them.

## What the loss enforces

In the plainest terms: for every pair of subspaces you care about, you
choose whether one may carry information about the other's attribute, and
if so, how much — *no more than the attribute's own subspace explains*. The
loss then holds the latent space to that choice with the same device the
CS-VAE already uses, a predictor fighting an encoder. 

The thesis itself is not available online because of
licensing requirements; if you want more detail, feel free to contact me.
