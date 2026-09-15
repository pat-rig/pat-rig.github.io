---
title: Variance is not information
date: 2022-02-18
summary: >-
  Microbiome data has more variables than any analysis can hold. A research
  project on 18,000 samples compared three ways of reducing them, and found
  why the most familiar one, PCA, is the wrong tool for this data.
tags: [dimensionality-reduction, embeddings, microbiome]
track: data-science
mark: microbe
kind: Project
pin: 4
repo: https://github.com/pat-rig/Microbiome_Embeddings
paper:
  label: Project report — not peer-reviewed
  title: Exploring Linear and Nonlinear Embeddings for Microbiome Data
  authors: Patrick Köhler
  venue: University of Tübingen
  year: 2022
  url: /papers/microbiome-embeddings-2022.pdf
  mark: bars
---

Exploring the spectrum of biomedical applications of machine learning
during my master's led me to one of the questions medicine has not
resolved: what the composition of a person's microbial community says about
their health. It bears on a range of conditions, and the prominent case is
inflammatory bowel disease — Crohn's disease and ulcerative colitis — whose
causes, somewhere between host genetics, environment and microbial activity,
are still not comprehensively understood, and whose incidence most studies
report to be rising.

From a machine-learning point of view the central difficulty is a
dimensionality-reduction problem. A microbiome is measured as counts of
bacterial sequence variants, and a data set easily has more than ten
thousand of them — too many variables for any statistical analysis to
detect small effects, or general structure of any kind. So the number of
variables has to come down, and the question is what to keep.

In this semester project, we
investigated three lower-dimensional representations of this data — PCA,
GloVe and UMAP — and assessed their usefulness for a downstream task, that stands representative of its usefulness:
predicting inflammatory bowel disease from some 18,000 samples. This post
is the short version of the report referenced at the foot of the page. It
leads with what the three methods commit you to, then with what happened
when we ran the comparison 27 times over — and with a reason, beyond "it
performed worse," why the most familiar of the three is the wrong tool for
this data.

## Reducing dimensions vs. implicit distances

A microbiome sample is a vector of counts, one per distinct bacterial
sequence. Sequencing the V4 region of ribosomal RNA identifies a microbe by
roughly 150 nucleotides, and after error correction each unique sequence —
an *amplicon sequence variant*, ASV — becomes a variable. A data set easily
exceeds ten thousand of them. Every statistical method suffers in that many
dimensions; small effects become undetectable. To make meaningful
analyses possible at all, we need to find a lower-dimensional
representation of the data.

**Linear embeddings** — PCA and, as we'll see, GloVe — all make the same
move. Choose a new coordinate system: a set of axes, each a vector in the
original space, written as the columns of a matrix $E$. Project every
sample onto them, which is one matrix product, $D_{\text{original}} E =
D_{\text{embedded}}$. What separates one method from another is only the
loss $J$ that decides which axes are *best*. For PCA, best means the
projection explains as much variance as possible.

That is a heuristic, and it can fail quietly. Suppose one microbe's
abundance separates sick from healthy cleanly, but that microbe is rare and
its counts barely vary. It contributes almost nothing to total variance, so
the principal axes point elsewhere, and after projection the one variable
that mattered is gone. Whether this happens depends on the data; the point
is that the loss never asked.

**GloVe** was built for text. It starts from co-occurrence counts — how
often word $i$ appears in the context of word $j$ — and from the
observation that ratios of co-occurrence probabilities are far more telling
than the probabilities themselves. In a six-billion-token corpus, *ice* and
*steam* both co-occur most often with *water*, which says little. The
*ratio* is what separates them:

| | $k$ = solid | $k$ = gas | $k$ = water | $k$ = fashion |
|---|---|---|---|---|
| $P(k \mid \text{ice})$ | 1.9 × 10⁻⁴ | 6.6 × 10⁻⁵ | 3.0 × 10⁻³ | 1.7 × 10⁻⁵ |
| $P(k \mid \text{steam})$ | 2.2 × 10⁻⁵ | 7.8 × 10⁻⁴ | 2.2 × 10⁻³ | 1.8 × 10⁻⁵ |
| ratio | 8.9 | 0.085 | 1.36 | 0.96 |

*Co-occurrence probabilities from [Pennington et al. (2014)](https://aclanthology.org/D14-1162/).*

Read the first two rows on their own and both words look alike: each
co-occurs with *water* ten to a hundred times more often than with
anything else, because *water* is simply a frequent word in any sentence
about either. The probabilities are dominated by what the two words have
in common. Dividing one row by the other cancels exactly that. What is
shared drops out — *water* lands at 1.36, and *fashion*, which has nothing
to do with either, at 0.96 — and what is distinctive is amplified: *solid*
comes out at 8.9, a word that belongs to ice and not to steam, and *gas*
at 0.085, the reverse. The ratio has isolated the one property along which
the two words actually differ, their state of matter, out of counts that
on their own mostly measured how common a word is.

GloVe asks for embeddings $w_i$ whose differences reproduce these ratios.
After some algebra that requirement becomes a condition on every pair of
words,

$$
w_i^{\top}\tilde{w}_k + b_i + \tilde{b}_k \;=\; \log X_{ik},
$$

and the loss $J$ is how far the embeddings are from meeting it — a squared
residual per pair, summed over all pairs, weighted so that the most
frequent pairs don't dominate:

$$
J \;=\; \sum_{i,j=1}^{V} f(X_{ij})\,\bigl(w_i^{\top}\tilde{w}_j + b_i + \tilde{b}_j - \log X_{ij}\bigr)^2 ,
$$

with $f$ rising from zero and flat at 1 for any pair seen more than a
hundred times. This is the same $J$ as in PCA, with a
different idea of *best* plugged in: not maximal variance, but preserved
co-occurrence ratios.

For microbiomes, replace words by ASVs and documents by samples — the data
types match: discrete, finite counts, and in both cases a "document" is a
set of neighbourhoods of things that tend to occur together. The
dimensions of the resulting space can be read as properties of a
microbiome, and a sample's coordinates are again a matrix product. Which
is the thing to notice: GloVe is still a linear embedding. Every sample is
a linear combination of a fixed set of prototypes. What changed is $J$.

**UMAP** refuses the whole setup. If what you need downstream is distances
between samples — and clustering, classification, regression need little
else — there is no reason to pick axes at all. Measure distance *along the
data* instead: connect every sample to its $k$ nearest neighbours, weight
each connection by how confident you can be that the neighbour is there
because of structure rather than chance, merge the neighbourhoods into one
graph, and take the shortest path through that graph as the distance
between two samples. A two-dimensional picture, if you want one, is a
layout of that graph that keeps its connections as faithfully as it can.

<figure class="mb__figure">
<svg class="mb-fig mf-fig" viewBox="0 0 672 360" role="img" aria-labelledby="mb-c-t mb-c-d">
<title id="mb-c-t">Distance along the data versus straight-line distance</title>
<desc id="mb-c-d">Sample points scattered on a rolled-up sheet in three dimensions. A point P on the outer turn is joined by a dashed straight line to a point E on the turn just inside it, a short hop across the gap, while the shortest path over the sheet from P to E runs a full turn around the roll. A third point M sits a little further along P’s own turn: farther than E in a straight line, much nearer along the sheet.</desc>
<line class="mf-edge" x1="245.2" y1="161.8" x2="246.1" y2="158.2"/>
<line class="mf-edge" x1="244" y1="165.4" x2="245.2" y2="161.8"/>
<line class="mf-edge" x1="246.1" y1="158.2" x2="247" y2="154.4"/>
<line class="mf-edge" x1="242.8" y1="168.9" x2="244" y2="165.4"/>
<line class="mf-edge" x1="247" y1="154.4" x2="247.7" y2="150.7"/>
<line class="mf-edge" x1="241.5" y1="172.4" x2="242.8" y2="168.9"/>
<line class="mf-edge" x1="240" y1="175.7" x2="241.5" y2="172.4"/>
<line class="mf-edge" x1="247.7" y1="150.7" x2="248.3" y2="146.9"/>
<line class="mf-edge" x1="238.4" y1="179" x2="240" y2="175.7"/>
<line class="mf-edge" x1="248.3" y1="146.9" x2="248.7" y2="143"/>
<line class="mf-edge" x1="236.8" y1="182.1" x2="238.4" y2="179"/>
<line class="mf-edge" x1="248.7" y1="143" x2="249" y2="139.2"/>
<circle class="mf-dot" cx="247.1" cy="165" r="2"/>
<line class="mf-edge" x1="235" y1="185.1" x2="236.8" y2="182.1"/>
<line class="mf-edge" x1="249" y1="139.2" x2="249.2" y2="135.3"/>
<line class="mf-edge" x1="233.1" y1="188" x2="235" y2="185.1"/>
<line class="mf-edge" x1="249.2" y1="135.3" x2="249.2" y2="131.4"/>
<line class="mf-edge" x1="231.2" y1="190.8" x2="233.1" y2="188"/>
<line class="mf-edge" x1="249.2" y1="131.4" x2="249" y2="127.5"/>
<line class="mf-edge" x1="229.2" y1="193.5" x2="231.2" y2="190.8"/>
<line class="mf-edge" x1="249" y1="127.5" x2="248.7" y2="123.7"/>
<circle class="mf-dot" cx="238.2" cy="181.5" r="2"/>
<line class="mf-edge" x1="227.1" y1="196" x2="229.2" y2="193.5"/>
<line class="mf-edge" x1="197.9" y1="291" x2="203.2" y2="289.8"/>
<line class="mf-edge" x1="248.7" y1="123.7" x2="248.2" y2="119.9"/>
<circle class="mf-dot" cx="227.9" cy="196" r="2"/>
<line class="mf-edge" x1="225" y1="198.4" x2="227.1" y2="196"/>
<line class="mf-edge" x1="248.2" y1="119.9" x2="247.6" y2="116.1"/>
<line class="mf-edge" x1="222.8" y1="200.6" x2="225" y2="198.4"/>
<line class="mf-edge" x1="247.6" y1="116.1" x2="246.8" y2="112.3"/>
<line class="mf-edge" x1="220.5" y1="202.7" x2="222.8" y2="200.6"/>
<line class="mf-edge" x1="192.7" y1="292" x2="197.9" y2="291"/>
<circle class="mf-dot" cx="246.9" cy="113.5" r="2"/>
<line class="mf-edge" x1="246.8" y1="112.3" x2="245.8" y2="108.7"/>
<line class="mf-edge" x1="218.3" y1="204.6" x2="220.5" y2="202.7"/>
<circle class="mf-dot" cx="204.5" cy="292.7" r="2"/>
<circle class="mf-dot" cx="253.1" cy="126.4" r="2"/>
<circle class="mf-dot" cx="203.1" cy="289.9" r="2"/>
<line class="mf-edge" x1="215.9" y1="206.4" x2="218.3" y2="204.6"/>
<line class="mf-edge" x1="245.8" y1="108.7" x2="244.7" y2="105.1"/>
<circle class="mf-dot" cx="255.1" cy="132.6" r="2"/>
<line class="mf-edge" x1="213.6" y1="208.1" x2="215.9" y2="206.4"/>
<line class="mf-edge" x1="187.5" y1="292.6" x2="192.7" y2="292"/>
<line class="mf-edge" x1="244.7" y1="105.1" x2="243.5" y2="101.5"/>
<line class="mf-edge" x1="211.2" y1="209.5" x2="213.6" y2="208.1"/>
<circle class="mf-dot" cx="257.4" cy="176.5" r="2"/>
<circle class="mf-dot" cx="224.5" cy="205.3" r="2"/>
<line class="mf-edge" x1="243.5" y1="101.5" x2="242" y2="98.1"/>
<circle class="mf-dot" cx="218.3" cy="211.2" r="2"/>
<line class="mf-edge" x1="208.8" y1="210.9" x2="211.2" y2="209.5"/>
<line class="mf-edge" x1="182.4" y1="292.8" x2="187.5" y2="292.6"/>
<line class="mf-edge" x1="242" y1="98.1" x2="240.5" y2="94.8"/>
<line class="mf-edge" x1="206.4" y1="212" x2="208.8" y2="210.9"/>
<circle class="mf-dot" cx="198.5" cy="293.3" r="2"/>
<circle class="mf-dot" cx="213.1" cy="210" r="2"/>
<circle class="mf-dot" cx="248" cy="101.2" r="2"/>
<line class="mf-edge" x1="204" y1="213" x2="206.4" y2="212"/>
<line class="mf-edge" x1="240.5" y1="94.8" x2="238.7" y2="91.5"/>
<circle class="mf-dot" cx="261.2" cy="135.5" r="2"/>
<circle class="mf-dot" cx="263.8" cy="178.4" r="2"/>
<line class="mf-edge" x1="201.6" y1="213.9" x2="204" y2="213"/>
<line class="mf-edge" x1="177.3" y1="292.8" x2="182.4" y2="292.8"/>
<line class="mf-edge" x1="238.7" y1="91.5" x2="236.9" y2="88.4"/>
<circle class="mf-dot" cx="262.5" cy="168.3" r="2"/>
<circle class="mf-dot" cx="257.2" cy="117.7" r="2"/>
<line class="mf-edge" x1="199.3" y1="214.6" x2="201.6" y2="213.9"/>
<line class="mf-edge" x1="236.9" y1="88.4" x2="234.8" y2="85.5"/>
<line class="mf-edge" x1="196.9" y1="215.1" x2="199.3" y2="214.6"/>
<circle class="mf-dot" cx="211.7" cy="214" r="2"/>
<line class="mf-edge" x1="172.3" y1="292.4" x2="177.3" y2="292.8"/>
<circle class="mf-dot" cx="235.3" cy="86.3" r="2"/>
<circle class="mf-dot" cx="252" cy="105.4" r="2"/>
<circle class="mf-dot" cx="269.4" cy="171.3" r="2"/>
<line class="mf-edge" x1="234.8" y1="85.5" x2="232.6" y2="82.6"/>
<line class="mf-edge" x1="194.6" y1="215.5" x2="196.9" y2="215.1"/>
<circle class="mf-dot" cx="249.8" cy="200.9" r="2"/>
<circle class="mf-dot" cx="269.9" cy="141" r="2"/>
<line class="mf-edge" x1="192.3" y1="215.7" x2="194.6" y2="215.5"/>
<line class="mf-edge" x1="232.6" y1="82.6" x2="230.3" y2="79.9"/>
<circle class="mf-dot" cx="278.9" cy="162" r="2"/>
<circle class="mf-dot" cx="183.6" cy="294.9" r="2"/>
<line class="mf-edge" x1="167.3" y1="291.7" x2="172.3" y2="292.4"/>
<circle class="mf-dot" cx="254.5" cy="206.2" r="2"/>
<line class="mf-edge" x1="190" y1="215.8" x2="192.3" y2="215.7"/>
<line class="mf-edge" x1="230.3" y1="79.9" x2="227.9" y2="77.4"/>
<circle class="mf-dot" cx="248.2" cy="202.8" r="2"/>
<line class="mf-edge" x1="187.7" y1="215.7" x2="190" y2="215.8"/>
<circle class="mf-dot" cx="205.9" cy="298.5" r="2"/>
<circle class="mf-dot" cx="185.8" cy="297.7" r="2"/>
<line class="mf-edge" x1="162.5" y1="290.7" x2="167.3" y2="291.7"/>
<line class="mf-edge" x1="185.5" y1="215.5" x2="187.7" y2="215.7"/>
<line class="mf-edge" x1="227.9" y1="77.4" x2="225.3" y2="75"/>
<circle class="mf-dot" cx="261.2" cy="104.1" r="2"/>
<circle class="mf-dot" cx="280" cy="139.2" r="2"/>
<circle class="mf-dot" cx="225.6" cy="213.8" r="2"/>
<circle class="mf-dot" cx="213" cy="297.7" r="2"/>
<circle class="mf-dot" cx="275.7" cy="119.9" r="2"/>
<line class="mf-edge" x1="183.4" y1="215.1" x2="185.5" y2="215.5"/>
<line class="mf-edge" x1="225.3" y1="75" x2="222.6" y2="72.9"/>
<line class="mf-edge" x1="181.3" y1="214.6" x2="183.4" y2="215.1"/>
<line class="mf-edge" x1="157.8" y1="289.4" x2="162.5" y2="290.7"/>
<line class="mf-edge" x1="179.3" y1="214" x2="181.3" y2="214.6"/>
<line class="mf-edge" x1="222.6" y1="72.9" x2="219.7" y2="70.8"/>
<circle class="mf-dot" cx="185.4" cy="216.4" r="2"/>
<line class="mf-edge" x1="177.3" y1="213.2" x2="179.3" y2="214"/>
<circle class="mf-dot" cx="196.6" cy="296.8" r="2"/>
<line class="mf-edge" x1="153.2" y1="287.7" x2="157.8" y2="289.4"/>
<circle class="mf-dot" cx="277.6" cy="120.8" r="2"/>
<line class="mf-edge" x1="219.7" y1="70.8" x2="216.8" y2="69"/>
<circle class="mf-dot" cx="261" cy="97" r="2"/>
<circle class="mf-dot" cx="177.5" cy="293.8" r="2"/>
<line class="mf-edge" x1="175.5" y1="212.3" x2="177.3" y2="213.2"/>
<circle class="mf-dot" cx="239.5" cy="217.1" r="2"/>
<circle class="mf-dot" cx="189.4" cy="216.5" r="2"/>
<circle class="mf-dot" cx="163.8" cy="288.6" r="2"/>
<circle class="mf-dot" cx="289.5" cy="153.4" r="2"/>
<circle class="mf-dot" cx="274.2" cy="116.7" r="2"/>
<line class="mf-edge" x1="173.6" y1="211.3" x2="175.5" y2="212.3"/>
<circle class="mf-dot" cx="219.3" cy="302.7" r="2"/>
<circle class="mf-dot" cx="292.5" cy="142.5" r="2"/>
<circle class="mf-dot" cx="222.8" cy="220.9" r="2"/>
<line class="mf-edge" x1="216.8" y1="69" x2="213.7" y2="67.4"/>
<circle class="mf-dot" cx="297.6" cy="166" r="2"/>
<line class="mf-edge" x1="148.7" y1="285.8" x2="153.2" y2="287.7"/>
<line class="mf-edge" x1="171.9" y1="210.2" x2="173.6" y2="211.3"/>
<circle class="mf-dot" cx="225.6" cy="74.3" r="2"/>
<circle class="mf-dot" cx="199.4" cy="215.7" r="2"/>
<circle class="mf-dot" cx="274.7" cy="121.2" r="2"/>
<circle class="mf-dot" cx="292.6" cy="148.8" r="2"/>
<circle class="mf-dot" cx="256.5" cy="219.5" r="2"/>
<line class="mf-edge" x1="170.2" y1="208.9" x2="171.9" y2="210.2"/>
<line class="mf-edge" x1="213.7" y1="67.4" x2="210.6" y2="66"/>
<circle class="mf-dot" cx="226" cy="299.6" r="2"/>
<circle class="mf-dot" cx="199.5" cy="300.9" r="2"/>
<line class="mf-edge" x1="190.1" y1="140.8" x2="189.5" y2="140.2"/>
<circle class="mf-dot" cx="172.2" cy="206.4" r="2"/>
<circle class="mf-dot" cx="176.3" cy="295.1" r="2"/>
<line class="mf-edge" x1="189.5" y1="140.2" x2="188.9" y2="139.6"/>
<line class="mf-edge" x1="168.7" y1="207.6" x2="170.2" y2="208.9"/>
<circle class="mf-dot" cx="181.3" cy="219.9" r="2"/>
<circle class="mf-dot" cx="210.2" cy="67.1" r="2"/>
<circle class="mf-dot" cx="250.1" cy="90.8" r="2"/>
<line class="mf-edge" x1="188.9" y1="139.6" x2="188.2" y2="139.1"/>
<line class="mf-edge" x1="144.3" y1="283.6" x2="148.7" y2="285.8"/>
<line class="mf-edge" x1="188.2" y1="139.1" x2="187.4" y2="138.7"/>
<line class="mf-edge" x1="210.6" y1="66" x2="207.3" y2="64.8"/>
<line class="mf-edge" x1="167.2" y1="206.2" x2="168.7" y2="207.6"/>
<circle class="mf-dot" cx="184.3" cy="216" r="2"/>
<path class="mf-sheet" d="M243.5 167L245.5 160.5L341.9 188.3L339.9 194.8Z"/>
<line class="mf-geo mf-geo--long" x1="292.3" y1="179.1" x2="293.5" y2="175.3"/>
<line class="mf-geo mf-geo--long" x1="293.5" y1="175.3" x2="294.5" y2="171.3"/>
<path class="mf-sheet" d="M245.5 160.5L247.1 153.8L343.6 181.6L341.9 188.3Z"/>
<line class="mf-geo mf-geo--long" x1="291" y1="182.9" x2="292.3" y2="179.1"/>
<line class="mf-geo mf-geo--long" x1="294.5" y1="171.3" x2="295.4" y2="167.3"/>
<line class="mf-edge" x1="187.4" y1="138.7" x2="186.6" y2="138.3"/>
<circle class="mf-dot" cx="230.1" cy="77.1" r="2"/>
<path class="mf-sheet" d="M241.1 173.3L243.5 167L339.9 194.8L337.5 201.1Z"/>
<circle class="mf-dot" cx="221.5" cy="221.6" r="2"/>
<circle class="mf-dot" cx="158.5" cy="288.8" r="2"/>
<line class="mf-geo mf-geo--long" x1="289.5" y1="186.6" x2="291" y2="182.9"/>
<line class="mf-geo mf-geo--long" x1="295.4" y1="167.3" x2="296.1" y2="163.2"/>
<path class="mf-sheet" d="M247.1 153.8L248.3 146.9L344.7 174.7L343.6 181.6Z"/>
<circle class="mf-dot" cx="237.7" cy="302.6" r="2"/>
<line class="mf-geo mf-geo--long" x1="287.9" y1="190.2" x2="289.5" y2="186.6"/>
<line class="mf-geo mf-geo--long" x1="296.1" y1="163.2" x2="296.7" y2="159.1"/>
<line class="mf-edge" x1="186.6" y1="138.3" x2="185.8" y2="138"/>
<path class="mf-sheet" d="M238.3 179.2L241.1 173.3L337.5 201.1L334.7 207Z"/>
<line class="mf-edge" x1="165.8" y1="204.6" x2="167.2" y2="206.2"/>
<line class="mf-geo mf-geo--long" x1="286.2" y1="193.6" x2="287.9" y2="190.2"/>
<path class="mf-sheet" d="M248.3 146.9L249 139.9L345.4 167.7L344.7 174.7Z"/>
<line class="mf-geo mf-geo--long" x1="296.7" y1="159.1" x2="297.1" y2="155"/>
<line class="mf-edge" x1="185.8" y1="138" x2="184.9" y2="137.7"/>
<circle class="mf-dot" cx="290.3" cy="191.6" r="2"/>
<line class="mf-geo mf-geo--long" x1="284.4" y1="197" x2="286.2" y2="193.6"/>
<circle class="mf-dot" cx="241.7" cy="83.7" r="2"/>
<path class="mf-sheet" d="M235.2 184.9L238.3 179.2L334.7 207L331.6 212.6Z"/>
<line class="mf-geo mf-geo--long" x1="297.1" y1="155" x2="297.3" y2="150.8"/>
<circle class="mf-dot" cx="254.6" cy="85.7" r="2"/>
<line class="mf-edge" x1="184.9" y1="137.7" x2="184" y2="137.5"/>
<line class="mf-edge" x1="207.3" y1="64.8" x2="203.9" y2="63.8"/>
<line class="mf-geo mf-geo--long" x1="282.5" y1="200.2" x2="284.4" y2="197"/>
<path class="mf-sheet" d="M249 139.9L249.2 132.8L345.6 160.6L345.4 167.7Z"/>
<line class="mf-edge" x1="164.5" y1="203" x2="165.8" y2="204.6"/>
<circle class="mf-dot" cx="278.4" cy="199" r="2"/>
<line class="mf-edge" x1="140.1" y1="281.1" x2="144.3" y2="283.6"/>
<line class="mf-geo mf-geo--long" x1="297.3" y1="150.8" x2="297.4" y2="146.6"/>
<circle class="mf-dot" cx="226" cy="224" r="2"/>
<line class="mf-edge" x1="184" y1="137.5" x2="183.1" y2="137.4"/>
<circle class="mf-dot" cx="240.7" cy="77.1" r="2"/>
<path class="mf-sheet" d="M231.7 190.1L235.2 184.9L331.6 212.6L328.2 217.9Z"/>
<line class="mf-geo mf-geo--long" x1="280.4" y1="203.3" x2="282.5" y2="200.2"/>
<line class="mf-geo mf-geo--long" x1="297.4" y1="146.6" x2="297.3" y2="142.5"/>
<line class="mf-edge mf-edge--ruling" x1="203.2" y1="289.8" x2="299.6" y2="317.6"/>
<line class="mf-edge" x1="183.1" y1="137.4" x2="182.1" y2="137.3"/>
<line class="mf-edge" x1="163.2" y1="201.3" x2="164.5" y2="203"/>
<circle class="mf-dot" cx="224.4" cy="304.2" r="2"/>
<path class="mf-sheet" d="M249.2 132.8L248.9 125.8L345.3 153.6L345.6 160.6Z"/>
<line class="mf-geo mf-geo--long" x1="278.3" y1="206.2" x2="280.4" y2="203.3"/>
<circle class="mf-dot" cx="228.4" cy="303.9" r="2"/>
<line class="mf-edge" x1="182.1" y1="137.3" x2="181.1" y2="137.3"/>
<circle class="mf-dot" cx="167.4" cy="295.3" r="2"/>
<path class="mf-sheet" d="M228.1 194.9L231.7 190.1L328.2 217.9L324.5 222.7Z"/>
<line class="mf-geo mf-geo--long" x1="297.3" y1="142.5" x2="297" y2="138.3"/>
<line class="mf-edge" x1="203.9" y1="63.8" x2="200.5" y2="63"/>
<line class="mf-edge" x1="162.1" y1="199.5" x2="163.2" y2="201.3"/>
<line class="mf-geo mf-geo--long" x1="276.1" y1="209" x2="278.3" y2="206.2"/>
<line class="mf-edge" x1="181.1" y1="137.3" x2="180.1" y2="137.4"/>
<circle class="mf-dot" cx="205.9" cy="301.6" r="2"/>
<circle class="mf-dot" cx="302.4" cy="167.2" r="2"/>
<circle class="mf-dot" cx="230.1" cy="305.9" r="2"/>
<circle class="mf-dot" cx="279" cy="209.8" r="2"/>
<line class="mf-geo mf-geo--long" x1="297" y1="138.3" x2="296.5" y2="134.2"/>
<path class="mf-sheet" d="M248.9 125.8L248.1 118.8L344.5 146.6L345.3 153.6Z"/>
<line class="mf-edge" x1="180.1" y1="137.4" x2="179" y2="137.6"/>
<line class="mf-geo mf-geo--long" x1="273.8" y1="211.6" x2="276.1" y2="209"/>
<line class="mf-edge" x1="161.1" y1="197.7" x2="162.1" y2="199.5"/>
<circle class="mf-dot" cx="159.2" cy="290.1" r="2"/>
<line class="mf-edge" x1="136" y1="278.4" x2="140.1" y2="281.1"/>
<circle class="mf-dot" cx="225.2" cy="221.7" r="2"/>
<path class="mf-sheet" d="M224.2 199.2L228.1 194.9L324.5 222.7L320.6 227Z"/>
<line class="mf-edge" x1="179" y1="137.6" x2="178" y2="137.9"/>
<circle class="mf-dot" cx="222.3" cy="222.1" r="2"/>
<path class="mf-sheet" d="M193.6 291.8L203.2 289.8L299.6 317.6L290.1 319.6Z"/>
<line class="mf-geo mf-geo--long" x1="296.5" y1="134.2" x2="295.8" y2="130.1"/>
<line class="mf-edge" x1="160.2" y1="195.8" x2="161.1" y2="197.7"/>
<line class="mf-geo mf-geo--long" x1="271.5" y1="214" x2="273.8" y2="211.6"/>
<line class="mf-edge" x1="178" y1="137.9" x2="176.9" y2="138.2"/>
<line class="mf-edge" x1="200.5" y1="63" x2="197" y2="62.4"/>
<circle class="mf-dot" cx="147.5" cy="279.8" r="2"/>
<line class="mf-edge" x1="176.9" y1="138.2" x2="175.8" y2="138.7"/>
<path class="mf-sheet" d="M248.1 118.8L246.7 112L343.1 139.8L344.5 146.6Z"/>
<line class="mf-edge" x1="159.3" y1="193.8" x2="160.2" y2="195.8"/>
<path class="mf-sheet" d="M220.1 203.1L224.2 199.2L320.6 227L316.6 230.9Z"/>
<circle class="mf-dot" cx="250.3" cy="303.7" r="2"/>
<line class="mf-geo mf-geo--long" x1="295.8" y1="130.1" x2="295" y2="126.1"/>
<line class="mf-geo mf-geo--long" x1="269.1" y1="216.3" x2="271.5" y2="214"/>
<line class="mf-edge" x1="175.8" y1="138.7" x2="174.7" y2="139.2"/>
<line class="mf-edge" x1="158.6" y1="191.8" x2="159.3" y2="193.8"/>
<circle class="mf-dot" cx="177.3" cy="208.5" r="2"/>
<line class="mf-edge" x1="174.7" y1="139.2" x2="173.5" y2="139.8"/>
<circle class="mf-dot" cx="243.5" cy="77.8" r="2"/>
<line class="mf-edge" x1="132.1" y1="275.3" x2="136" y2="278.4"/>
<line class="mf-geo mf-geo--long" x1="266.6" y1="218.4" x2="269.1" y2="216.3"/>
<circle class="mf-dot" cx="223.5" cy="301.7" r="2"/>
<line class="mf-geo mf-geo--long" x1="295" y1="126.1" x2="293.9" y2="122.2"/>
<line class="mf-edge" x1="173.5" y1="139.8" x2="172.4" y2="140.5"/>
<line class="mf-edge" x1="157.9" y1="189.8" x2="158.6" y2="191.8"/>
<line class="mf-edge" x1="197" y1="62.4" x2="193.4" y2="62.1"/>
<circle class="mf-dot" cx="218.9" cy="221.1" r="2"/>
<circle class="mf-dot" cx="233" cy="72.3" r="2"/>
<circle class="mf-dot" cx="226.2" cy="223.5" r="2"/>
<path class="mf-sheet" d="M246.7 112L244.8 105.4L341.3 133.2L343.1 139.8Z"/>
<path class="mf-sheet" d="M215.9 206.4L220.1 203.1L316.6 230.9L312.4 234.2Z"/>
<line class="mf-edge" x1="172.4" y1="140.5" x2="171.3" y2="141.3"/>
<line class="mf-edge" x1="157.4" y1="187.7" x2="157.9" y2="189.8"/>
<circle class="mf-dot" cx="243" cy="225.9" r="2"/>
<line class="mf-geo mf-geo--long" x1="264.1" y1="220.3" x2="266.6" y2="218.4"/>
<line class="mf-edge" x1="171.3" y1="141.3" x2="170.2" y2="142.2"/>
<line class="mf-geo mf-geo--long" x1="293.9" y1="122.2" x2="292.7" y2="118.3"/>
<circle class="mf-dot" cx="299.6" cy="188.9" r="2"/>
<line class="mf-edge mf-edge--ruling" x1="215.9" y1="206.4" x2="312.4" y2="234.2"/>
<line class="mf-edge" x1="156.9" y1="185.6" x2="157.4" y2="187.7"/>
<circle class="mf-dot" cx="284.9" cy="110.8" r="2"/>
<line class="mf-edge" x1="170.2" y1="142.2" x2="169.1" y2="143.1"/>
<circle class="mf-dot" cx="159.7" cy="183.8" r="2"/>
<line class="mf-edge" x1="169.1" y1="143.1" x2="168" y2="144.2"/>
<line class="mf-edge" x1="156.6" y1="183.5" x2="156.9" y2="185.6"/>
<line class="mf-geo mf-geo--long" x1="261.6" y1="222.1" x2="264.1" y2="220.3"/>
<circle class="mf-dot" cx="203.8" cy="304.2" r="2"/>
<line class="mf-edge" x1="193.4" y1="62.1" x2="189.8" y2="62"/>
<path class="mf-sheet" d="M211.7 209.3L215.9 206.4L312.4 234.2L308.1 237.1Z"/>
<line class="mf-edge" x1="168" y1="144.2" x2="167" y2="145.3"/>
<line class="mf-edge" x1="128.4" y1="272.1" x2="132.1" y2="275.3"/>
<line class="mf-edge" x1="156.3" y1="181.4" x2="156.6" y2="183.5"/>
<line class="mf-geo mf-geo--long" x1="292.7" y1="118.3" x2="291.3" y2="114.5"/>
<path class="mf-sheet" d="M184.2 292.8L193.6 291.8L290.1 319.6L280.6 320.6Z"/>
<path class="mf-sheet" d="M244.8 105.4L242.4 99L338.9 126.8L341.3 133.2Z"/>
<line class="mf-edge" x1="167" y1="145.3" x2="165.9" y2="146.5"/>
<circle class="mf-dot" cx="216.8" cy="224.5" r="2"/>
<line class="mf-edge" x1="156.1" y1="179.3" x2="156.3" y2="181.4"/>
<circle class="mf-dot" cx="301.1" cy="194" r="2"/>
<line class="mf-geo mf-geo--long" x1="259.1" y1="223.7" x2="261.6" y2="222.1"/>
<line class="mf-edge" x1="165.9" y1="146.5" x2="164.9" y2="147.8"/>
<circle class="mf-dot" cx="303" cy="132" r="2"/>
<line class="mf-edge" x1="156.1" y1="177.1" x2="156.1" y2="179.3"/>
<line class="mf-edge" x1="164.9" y1="147.8" x2="163.9" y2="149.2"/>
<line class="mf-edge" x1="156.1" y1="175" x2="156.1" y2="177.1"/>
<line class="mf-edge" x1="163.9" y1="149.2" x2="163" y2="150.7"/>
<line class="mf-geo mf-geo--long" x1="291.3" y1="114.5" x2="289.7" y2="110.9"/>
<line class="mf-edge" x1="156.2" y1="172.9" x2="156.1" y2="175"/>
<line class="mf-edge" x1="163" y1="150.7" x2="162.1" y2="152.2"/>
<circle class="mf-dot" cx="310.4" cy="170.1" r="2"/>
<line class="mf-edge" x1="189.8" y1="62" x2="186.1" y2="62.2"/>
<line class="mf-edge" x1="156.3" y1="170.8" x2="156.2" y2="172.9"/>
<line class="mf-edge" x1="162.1" y1="152.2" x2="161.3" y2="153.8"/>
<line class="mf-geo mf-geo--long" x1="256.5" y1="225" x2="259.1" y2="223.7"/>
<path class="mf-sheet" d="M207.3 211.6L211.7 209.3L308.1 237.1L303.7 239.4Z"/>
<circle class="mf-dot" cx="206.5" cy="143.4" r="2"/>
<line class="mf-edge" x1="161.3" y1="153.8" x2="160.5" y2="155.5"/>
<line class="mf-edge" x1="156.6" y1="168.7" x2="156.3" y2="170.8"/>
<circle class="mf-dot" cx="225.8" cy="227.4" r="2"/>
<circle class="mf-dot" cx="310.1" cy="176.6" r="2"/>
<line class="mf-edge" x1="160.5" y1="155.5" x2="159.7" y2="157.2"/>
<line class="mf-edge" x1="156.9" y1="166.7" x2="156.6" y2="168.7"/>
<line class="mf-edge" x1="159.7" y1="157.2" x2="159" y2="159"/>
<line class="mf-edge" x1="157.4" y1="164.7" x2="156.9" y2="166.7"/>
<circle class="mf-dot" cx="250.6" cy="228.1" r="2"/>
<line class="mf-edge" x1="159" y1="159" x2="158.4" y2="160.9"/>
<line class="mf-edge" x1="157.8" y1="162.8" x2="157.4" y2="164.7"/>
<line class="mf-edge" x1="158.4" y1="160.9" x2="157.8" y2="162.8"/>
<line class="mf-edge" x1="124.9" y1="268.5" x2="128.4" y2="272.1"/>
<circle class="mf-dot" cx="302.5" cy="126.1" r="2"/>
<circle class="mf-dot" cx="170.6" cy="203" r="2"/>
<path class="mf-sheet" d="M242.4 99L239.5 93L336 120.8L338.9 126.8Z"/>
<circle class="mf-dot" cx="247.6" cy="80.9" r="2"/>
<line class="mf-geo mf-geo--long" x1="289.7" y1="110.9" x2="288" y2="107.3"/>
<line class="mf-geo mf-geo--long" x1="253.9" y1="226.3" x2="256.5" y2="225"/>
<circle class="mf-dot" cx="302.6" cy="201.6" r="2"/>
<circle class="mf-dot" cx="168.2" cy="192.6" r="2"/>
<line class="mf-edge" x1="186.1" y1="62.2" x2="182.4" y2="62.6"/>
<circle class="mf-dot" cx="170.6" cy="293.5" r="2"/>
<path class="mf-sheet" d="M203 213.4L207.3 211.6L303.7 239.4L299.4 241.2Z"/>
<line class="mf-geo mf-geo--long" x1="251.3" y1="227.3" x2="253.9" y2="226.3"/>
<line class="mf-geo mf-geo--long" x1="288" y1="107.3" x2="286" y2="103.9"/>
<circle class="mf-dot" cx="282.8" cy="219" r="2"/>
<circle class="mf-dot" cx="200.3" cy="62" r="2"/>
<circle class="mf-dot" cx="222" cy="306.4" r="2"/>
<line class="mf-edge" x1="121.5" y1="264.8" x2="124.9" y2="268.5"/>
<circle class="mf-dot" cx="160.6" cy="286.1" r="2"/>
<circle class="mf-dot" cx="160.1" cy="166.5" r="2"/>
<path class="mf-sheet" d="M175 292.6L184.2 292.8L280.6 320.6L271.4 320.4Z"/>
<circle class="mf-dot" cx="253.7" cy="226" r="2"/>
<path class="mf-sheet" d="M239.5 93L236.1 87.3L332.5 115.1L336 120.8Z"/>
<line class="mf-geo mf-geo--long" x1="248.8" y1="228.1" x2="251.3" y2="227.3"/>
<line class="mf-edge" x1="182.4" y1="62.6" x2="178.6" y2="63.2"/>
<path class="mf-sheet" d="M198.6 214.7L203 213.4L299.4 241.2L295 242.5Z"/>
<circle class="mf-dot" cx="296.3" cy="122.5" r="2"/>
<circle class="mf-dot" cx="174.9" cy="152" r="2"/>
<line class="mf-geo mf-geo--long" x1="286" y1="103.9" x2="283.9" y2="100.7"/>
<circle class="mf-dot" cx="128.7" cy="271.7" r="2"/>
<circle class="mf-dot" cx="312.7" cy="190.6" r="2"/>
<line class="mf-geo mf-geo--long" x1="246.2" y1="228.8" x2="248.8" y2="228.1"/>
<circle class="mf-dot" cx="236.3" cy="75.1" r="2"/>
<line class="mf-edge" x1="118.3" y1="260.8" x2="121.5" y2="264.8"/>
<circle class="mf-dot" cx="163.6" cy="162.4" r="2"/>
<line class="mf-edge" x1="178.6" y1="63.2" x2="174.8" y2="64"/>
<circle class="mf-dot" cx="160.4" cy="289.4" r="2"/>
<line class="mf-geo mf-geo--long" x1="283.9" y1="100.7" x2="281.7" y2="97.5"/>
<circle class="mf-dot" cx="312.7" cy="193.4" r="2"/>
<line class="mf-geo mf-geo--long" x1="243.7" y1="229.3" x2="246.2" y2="228.8"/>
<circle class="mf-dot" cx="180.7" cy="295.8" r="2"/>
<path class="mf-sheet" d="M236.1 87.3L232.2 82.1L328.7 109.9L332.5 115.1Z"/>
<path class="mf-sheet" d="M194.4 215.5L198.6 214.7L295 242.5L290.8 243.3Z"/>
<circle class="mf-dot" cx="319" cy="167.6" r="2"/>
<circle class="mf-dot" cx="174.9" cy="198.7" r="2"/>
<circle class="mf-dot" cx="315.7" cy="189.1" r="2"/>
<circle class="mf-dot" cx="170.6" cy="170" r="2"/>
<circle class="mf-dot" cx="325.4" cy="183.8" r="2"/>
<circle class="mf-dot" cx="274.5" cy="228.2" r="2"/>
<circle class="mf-dot" cx="192" cy="211.6" r="2"/>
<line class="mf-geo mf-geo--long" x1="241.2" y1="229.6" x2="243.7" y2="229.3"/>
<line class="mf-edge" x1="174.8" y1="64" x2="171" y2="65.2"/>
<circle class="mf-dot" cx="258.6" cy="79.5" r="2"/>
<line class="mf-edge" x1="115.4" y1="256.6" x2="118.3" y2="260.8"/>
<line class="mf-geo mf-geo--long" x1="281.7" y1="97.5" x2="279.2" y2="94.6"/>
<circle class="mf-dot" cx="288.7" cy="104.1" r="2"/>
<circle class="mf-dot" cx="201" cy="303.4" r="2"/>
<circle class="mf-dot" cx="235.9" cy="309.2" r="2"/>
<path class="mf-sheet" d="M166 291.5L175 292.6L271.4 320.4L262.4 319.3Z"/>
<path class="mf-sheet" d="M190.2 215.8L194.4 215.5L290.8 243.3L286.6 243.6Z"/>
<circle class="mf-dot" cx="275.7" cy="230.7" r="2"/>
<circle class="mf-dot" cx="313.5" cy="145.2" r="2"/>
<line class="mf-geo mf-geo--long" x1="238.7" y1="229.7" x2="241.2" y2="229.6"/>
<path class="mf-sheet" d="M232.2 82.1L227.9 77.4L324.3 105.2L328.7 109.9Z"/>
<circle class="mf-dot" cx="245" cy="76.6" r="2"/>
<line class="mf-edge" x1="171" y1="65.2" x2="167.2" y2="66.5"/>
<line class="mf-geo mf-geo--long" x1="279.2" y1="94.6" x2="276.6" y2="91.8"/>
<circle class="mf-dot" cx="309.9" cy="207.8" r="2"/>
<line class="mf-edge" x1="112.6" y1="252.2" x2="115.4" y2="256.6"/>
<circle class="mf-dot" cx="182.6" cy="153.2" r="2"/>
<line class="mf-geo mf-geo--long" x1="236.3" y1="229.6" x2="238.7" y2="229.7"/>
<circle class="mf-dot" cx="263.2" cy="232.3" r="2"/>
<circle class="mf-dot" cx="181.5" cy="296.2" r="2"/>
<circle class="mf-dot" cx="262.3" cy="85.1" r="2"/>
<circle class="mf-dot" cx="263.2" cy="312.4" r="2"/>
<path class="mf-sheet" d="M186.1 215.6L190.2 215.8L286.6 243.6L282.6 243.4Z"/>
<line class="mf-edge mf-edge--ruling" x1="227.9" y1="77.4" x2="324.3" y2="105.2"/>
<circle class="mf-dot" cx="162.8" cy="285" r="2"/>
<circle class="mf-dot" cx="261.3" cy="81.2" r="2"/>
<line class="mf-edge" x1="167.2" y1="66.5" x2="163.4" y2="68.1"/>
<line class="mf-geo mf-geo--long" x1="276.6" y1="91.8" x2="273.9" y2="89.3"/>
<line class="mf-geo mf-geo--long" x1="234" y1="229.4" x2="236.3" y2="229.6"/>
<circle class="mf-dot" cx="200.9" cy="222.2" r="2"/>
<circle class="mf-dot" cx="127" cy="262.3" r="2"/>
<circle class="mf-dot" cx="163.3" cy="71.5" r="2"/>
<line class="mf-edge" x1="110" y1="247.7" x2="112.6" y2="252.2"/>
<circle class="mf-dot" cx="303.9" cy="113.2" r="2"/>
<path class="mf-sheet" d="M227.9 77.4L223.1 73.2L319.5 101L324.3 105.2Z"/>
<circle class="mf-dot" cx="257.7" cy="230" r="2"/>
<circle class="mf-dot" cx="180.4" cy="294" r="2"/>
<circle class="mf-dot" cx="295.4" cy="216.5" r="2"/>
<line class="mf-geo mf-geo--long" x1="231.7" y1="229" x2="234" y2="229.4"/>
<circle class="mf-dot" cx="325.9" cy="199.3" r="2"/>
<path class="mf-sheet" d="M182.3 214.9L186.1 215.6L282.6 243.4L278.7 242.7Z"/>
<line class="mf-edge" x1="163.4" y1="68.1" x2="159.6" y2="69.9"/>
<circle class="mf-dot" cx="237" cy="235.6" r="2"/>
<circle class="mf-dot" cx="210" cy="304.1" r="2"/>
<line class="mf-geo mf-geo--long" x1="273.9" y1="89.3" x2="271" y2="86.9"/>
<path class="mf-sheet" d="M157.3 289.2L166 291.5L262.4 319.3L253.8 317Z"/>
<circle class="mf-dot" cx="329" cy="176.1" r="2"/>
<circle class="mf-dot" cx="262.5" cy="312.7" r="2"/>
<line class="mf-geo mf-geo--long" x1="229.4" y1="228.5" x2="231.7" y2="229"/>
<line class="mf-edge" x1="107.7" y1="242.9" x2="110" y2="247.7"/>
<circle class="mf-dot" cx="296.7" cy="223" r="2"/>
<circle class="mf-dot" cx="182.9" cy="300.2" r="2"/>
<line class="mf-edge" x1="159.6" y1="69.9" x2="155.8" y2="72"/>
<circle class="mf-dot" cx="307.2" cy="218.2" r="2"/>
<circle class="mf-dot" cx="135.5" cy="268.2" r="2"/>
<circle class="mf-dot" cx="333.1" cy="177.2" r="2"/>
<path class="mf-sheet" d="M178.6 213.7L182.3 214.9L278.7 242.7L275 241.5Z"/>
<line class="mf-geo mf-geo--long" x1="271" y1="86.9" x2="267.9" y2="84.7"/>
<line class="mf-geo mf-geo--long" x1="227.3" y1="227.8" x2="229.4" y2="228.5"/>
<circle class="mf-dot" cx="222.2" cy="223.3" r="2"/>
<path class="mf-sheet" d="M223.1 73.2L217.9 69.7L314.3 97.5L319.5 101Z"/>
<circle class="mf-dot" cx="271.6" cy="234.9" r="2"/>
<circle class="mf-dot" cx="163.6" cy="286.5" r="2"/>
<circle class="mf-dot" cx="328.9" cy="147.7" r="2"/>
<circle class="mf-dot" cx="222.3" cy="225.3" r="2"/>
<line class="mf-edge" x1="105.5" y1="238" x2="107.7" y2="242.9"/>
<circle class="mf-dot" cx="216.5" cy="147.4" r="2"/>
<circle class="mf-dot" cx="206" cy="305.4" r="2"/>
<line class="mf-edge" x1="155.8" y1="72" x2="152.1" y2="74.3"/>
<line class="mf-geo mf-geo--long" x1="225.2" y1="226.9" x2="227.3" y2="227.8"/>
<path class="mf-sheet" d="M175.1 212.1L178.6 213.7L275 241.5L271.5 239.9Z"/>
<line class="mf-geo mf-geo--long" x1="267.9" y1="84.7" x2="264.7" y2="82.8"/>
<circle class="mf-dot" cx="212" cy="144" r="2"/>
<line class="mf-geo mf-geo--long" x1="223.2" y1="226" x2="225.2" y2="226.9"/>
<line class="mf-edge" x1="103.6" y1="233" x2="105.5" y2="238"/>
<circle class="mf-dot" cx="224.7" cy="146.2" r="2"/>
<line class="mf-edge" x1="152.1" y1="74.3" x2="148.4" y2="76.8"/>
<circle class="mf-dot" cx="261.4" cy="236.7" r="2"/>
<path class="mf-sheet" d="M149.1 286L157.3 289.2L253.8 317L245.5 313.8Z"/>
<circle class="mf-dot" cx="198" cy="299.2" r="2"/>
<circle class="mf-dot" cx="306.4" cy="109.3" r="2"/>
<circle class="mf-dot" cx="123.8" cy="251.8" r="2"/>
<circle class="mf-dot" cx="186.7" cy="294.6" r="2"/>
<circle class="mf-dot" cx="179.5" cy="187.2" r="2"/>
<circle class="mf-dot" cx="156.8" cy="73.5" r="2"/>
<line class="mf-geo mf-geo--long" x1="221.2" y1="224.8" x2="223.2" y2="226"/>
<path class="mf-sheet" d="M217.9 69.7L212.3 66.7L308.7 94.5L314.3 97.5Z"/>
<line class="mf-geo mf-geo--long" x1="264.7" y1="82.8" x2="261.4" y2="81.1"/>
<path class="mf-sheet" d="M171.9 210.2L175.1 212.1L271.5 239.9L268.3 238Z"/>
<circle class="mf-dot" cx="201.6" cy="212.9" r="2"/>
<circle class="mf-dot" cx="330.6" cy="201.7" r="2"/>
<line class="mf-edge" x1="101.9" y1="227.8" x2="103.6" y2="233"/>
<line class="mf-edge" x1="148.4" y1="76.8" x2="144.8" y2="79.6"/>
<circle class="mf-dot" cx="197.4" cy="153.9" r="2"/>
<circle class="mf-dot" cx="186.3" cy="162" r="2"/>
<circle class="mf-dot" cx="156.1" cy="277.5" r="2"/>
<line class="mf-geo mf-geo--long" x1="219.4" y1="223.6" x2="221.2" y2="224.8"/>
<circle class="mf-dot" cx="255.5" cy="78.8" r="2"/>
<circle class="mf-dot" cx="296.3" cy="228.8" r="2"/>
<circle class="mf-dot" cx="185.3" cy="297.8" r="2"/>
<circle class="mf-dot" cx="147.2" cy="278.1" r="2"/>
<circle class="mf-dot" cx="141.9" cy="263.6" r="2"/>
<line class="mf-edge" x1="144.8" y1="79.6" x2="141.2" y2="82.6"/>
<path class="mf-sheet" d="M169 207.8L171.9 210.2L268.3 238L265.4 235.6Z"/>
<line class="mf-edge mf-edge--ruling" x1="190.1" y1="140.8" x2="286.5" y2="168.6"/>
<line class="mf-geo mf-geo--long" x1="261.4" y1="81.1" x2="258" y2="79.6"/>
<line class="mf-edge" x1="100.4" y1="222.5" x2="101.9" y2="227.8"/>
<circle class="mf-dot" cx="306.3" cy="104.9" r="2"/>
<line class="mf-geo mf-geo--long" x1="217.6" y1="222.2" x2="219.4" y2="223.6"/>
<circle class="mf-dot" cx="170.5" cy="75.9" r="2"/>
<circle class="mf-dot" cx="247.2" cy="229" r="2"/>
<path class="mf-sheet" d="M190.1 140.8L189 139.7L285.4 167.5L286.5 168.6Z"/>
<path class="mf-sheet" d="M189 139.7L187.7 138.8L284.1 166.6L285.4 167.5Z"/>
<line class="mf-geo mf-geo--long" x1="216" y1="220.7" x2="217.6" y2="222.2"/>
<path class="mf-sheet" d="M212.3 66.7L206.4 64.5L302.8 92.3L308.7 94.5Z"/>
<line class="mf-edge" x1="141.2" y1="82.6" x2="137.7" y2="85.8"/>
<circle class="mf-dot" cx="287.9" cy="95" r="2"/>
<line class="mf-edge" x1="99.2" y1="217.1" x2="100.4" y2="222.5"/>
<line class="mf-edge" x1="341.6" y1="189.6" x2="342.6" y2="186"/>
<line class="mf-edge" x1="340.5" y1="193.2" x2="341.6" y2="189.6"/>
<circle class="mf-dot" cx="338.4" cy="147.9" r="2"/>
<circle class="mf-dot" cx="185" cy="73.9" r="2"/>
<line class="mf-edge" x1="342.6" y1="186" x2="343.4" y2="182.2"/>
<path class="mf-sheet" d="M166.3 205.2L169 207.8L265.4 235.6L262.7 233Z"/>
<line class="mf-edge" x1="339.2" y1="196.7" x2="340.5" y2="193.2"/>
<circle class="mf-dot" cx="226.1" cy="223.9" r="2"/>
<path class="mf-sheet" d="M141.2 281.8L149.1 286L245.5 313.8L237.6 309.6Z"/>
<path class="mf-sheet" d="M187.7 138.8L186.3 138.1L282.7 165.9L284.1 166.6Z"/>
<line class="mf-edge" x1="343.4" y1="182.2" x2="344.1" y2="178.5"/>
<line class="mf-edge" x1="337.9" y1="200.2" x2="339.2" y2="196.7"/>
<line class="mf-geo mf-geo--long" x1="258" y1="79.6" x2="254.5" y2="78.3"/>
<line class="mf-edge" x1="336.4" y1="203.5" x2="337.9" y2="200.2"/>
<line class="mf-edge" x1="344.1" y1="178.5" x2="344.7" y2="174.7"/>
<line class="mf-geo mf-geo--long" x1="214.5" y1="219.1" x2="216" y2="220.7"/>
<line class="mf-edge" x1="334.8" y1="206.8" x2="336.4" y2="203.5"/>
<line class="mf-edge" x1="344.7" y1="174.7" x2="345.2" y2="170.8"/>
<line class="mf-edge" x1="137.7" y1="85.8" x2="134.3" y2="89.2"/>
<circle class="mf-dot" cx="292.1" cy="93.8" r="2"/>
<path class="mf-sheet" d="M186.3 138.1L184.7 137.6L281.1 165.4L282.7 165.9Z"/>
<line class="mf-edge" x1="333.2" y1="209.9" x2="334.8" y2="206.8"/>
<line class="mf-edge" x1="345.2" y1="170.8" x2="345.4" y2="167"/>
<line class="mf-edge" x1="98.2" y1="211.7" x2="99.2" y2="217.1"/>
<circle class="mf-dot" cx="130.5" cy="262.9" r="2"/>
<circle class="mf-dot" cx="229.5" cy="308.6" r="2"/>
<line class="mf-geo mf-geo--long" x1="213" y1="217.3" x2="214.5" y2="219.1"/>
<line class="mf-edge" x1="331.4" y1="212.9" x2="333.2" y2="209.9"/>
<circle class="mf-dot" cx="188.6" cy="185.7" r="2"/>
<line class="mf-edge" x1="345.4" y1="167" x2="345.6" y2="163.1"/>
<path class="mf-sheet" d="M163.9 202.2L166.3 205.2L262.7 233L260.3 230Z"/>
<circle class="mf-dot" cx="316.6" cy="115.6" r="2"/>
<circle class="mf-dot" cx="296.3" cy="314.8" r="2"/>
<circle class="mf-dot" cx="300.3" cy="101.9" r="2"/>
<circle class="mf-dot" cx="200.8" cy="202.7" r="2"/>
<path class="mf-sheet" d="M184.7 137.6L183 137.4L279.4 165.2L281.1 165.4Z"/>
<line class="mf-edge" x1="329.6" y1="215.8" x2="331.4" y2="212.9"/>
<line class="mf-edge" x1="134.3" y1="89.2" x2="131" y2="92.8"/>
<line class="mf-edge" x1="345.6" y1="163.1" x2="345.6" y2="159.2"/>
<circle class="mf-dot" cx="147.7" cy="264.8" r="2"/>
<line class="mf-geo mf-geo--long" x1="254.5" y1="78.3" x2="250.8" y2="77.3"/>
<line class="mf-geo mf-geo--long" x1="211.7" y1="215.5" x2="213" y2="217.3"/>
<line class="mf-edge" x1="97.4" y1="206.1" x2="98.2" y2="211.7"/>
<line class="mf-edge" x1="327.6" y1="218.6" x2="329.6" y2="215.8"/>
<line class="mf-edge" x1="345.6" y1="159.2" x2="345.4" y2="155.3"/>
<path class="mf-sheet" d="M183 137.4L181.2 137.3L277.6 165.1L279.4 165.2Z"/>
<path class="mf-sheet" d="M206.4 64.5L200.2 62.9L296.6 90.7L302.8 92.3Z"/>
<line class="mf-edge" x1="131" y1="92.8" x2="127.8" y2="96.7"/>
<line class="mf-edge" x1="325.6" y1="221.3" x2="327.6" y2="218.6"/>
<circle class="mf-dot" cx="248.1" cy="234" r="2"/>
<path class="mf-sheet" d="M161.8 199L163.9 202.2L260.3 230L258.3 226.8Z"/>
<line class="mf-geo mf-geo--long" x1="210.5" y1="213.6" x2="211.7" y2="215.5"/>
<line class="mf-edge" x1="345.4" y1="155.3" x2="345.1" y2="151.5"/>
<circle class="mf-dot" cx="203" cy="72.1" r="2"/>
<line class="mf-edge" x1="96.8" y1="200.5" x2="97.4" y2="206.1"/>
<path class="mf-sheet" d="M181.2 137.3L179.3 137.6L275.7 165.4L277.6 165.1Z"/>
<line class="mf-edge" x1="323.5" y1="223.8" x2="325.6" y2="221.3"/>
<line class="mf-edge" x1="294.3" y1="318.8" x2="299.6" y2="317.6"/>
<line class="mf-edge" x1="127.8" y1="96.7" x2="124.7" y2="100.7"/>
<line class="mf-edge" x1="345.1" y1="151.5" x2="344.6" y2="147.7"/>
<line class="mf-geo mf-geo--long" x1="209.3" y1="211.7" x2="210.5" y2="213.6"/>
<line class="mf-geo mf-geo--long" x1="250.8" y1="77.3" x2="247.1" y2="76.6"/>
<line class="mf-edge" x1="321.4" y1="226.2" x2="323.5" y2="223.8"/>
<path class="mf-sheet" d="M179.3 137.6L177.4 138.1L273.8 165.9L275.7 165.4Z"/>
<path class="mf-sheet" d="M133.9 276.8L141.2 281.8L237.6 309.6L230.3 304.5Z"/>
<line class="mf-edge" x1="96.4" y1="194.8" x2="96.8" y2="200.5"/>
<path class="mf-sheet" d="M160.1 195.6L161.8 199L258.3 226.8L256.5 223.4Z"/>
<line class="mf-edge" x1="344.6" y1="147.7" x2="344" y2="143.9"/>
<line class="mf-geo mf-geo--long" x1="208.3" y1="209.6" x2="209.3" y2="211.7"/>
<line class="mf-edge" x1="124.7" y1="100.7" x2="121.7" y2="104.9"/>
<circle class="mf-dot" cx="155.8" cy="273.6" r="2"/>
<line class="mf-edge" x1="319.2" y1="228.4" x2="321.4" y2="226.2"/>
<circle class="mf-dot" cx="247.3" cy="156.1" r="2"/>
<path class="mf-sheet" d="M177.4 138.1L175.4 138.9L271.8 166.7L273.8 165.9Z"/>
<circle class="mf-dot" cx="121.1" cy="107.1" r="2"/>
<line class="mf-edge" x1="96.3" y1="189.1" x2="96.4" y2="194.8"/>
<circle class="mf-dot" cx="236.3" cy="76" r="2"/>
<line class="mf-geo mf-geo--long" x1="207.4" y1="207.5" x2="208.3" y2="209.6"/>
<line class="mf-edge" x1="344" y1="143.9" x2="343.2" y2="140.1"/>
<line class="mf-edge" x1="121.7" y1="104.9" x2="118.8" y2="109.3"/>
<circle class="mf-dot" cx="146.2" cy="265" r="2"/>
<circle class="mf-dot" cx="183.3" cy="291.5" r="2"/>
<line class="mf-edge" x1="317" y1="230.5" x2="319.2" y2="228.4"/>
<path class="mf-sheet" d="M158.6 192L160.1 195.6L256.5 223.4L255.1 219.8Z"/>
<path class="mf-sheet" d="M200.2 62.9L193.7 62.1L290.2 89.9L296.6 90.7Z"/>
<line class="mf-geo mf-geo--long" x1="247.1" y1="76.6" x2="243.3" y2="76.1"/>
<line class="mf-edge" x1="289.1" y1="319.8" x2="294.3" y2="318.8"/>
<path class="mf-sheet" d="M175.4 138.9L173.3 139.9L269.8 167.7L271.8 166.7Z"/>
<line class="mf-edge" x1="96.4" y1="183.4" x2="96.3" y2="189.1"/>
<line class="mf-geo mf-geo--long" x1="206.7" y1="205.4" x2="207.4" y2="207.5"/>
<circle class="mf-dot" cx="303.5" cy="238.5" r="2"/>
<line class="mf-edge" x1="118.8" y1="109.3" x2="116.1" y2="113.9"/>
<circle class="mf-dot" cx="273.9" cy="316.3" r="2"/>
<line class="mf-edge" x1="343.2" y1="140.1" x2="342.3" y2="136.5"/>
<circle class="mf-dot" cx="124.8" cy="243.8" r="2"/>
<line class="mf-edge" x1="314.7" y1="232.4" x2="317" y2="230.5"/>
<circle class="mf-dot" cx="169.2" cy="84.4" r="2"/>
<line class="mf-edge" x1="96.7" y1="177.7" x2="96.4" y2="183.4"/>
<line class="mf-geo mf-geo--long" x1="206" y1="203.2" x2="206.7" y2="205.4"/>
<path class="mf-sheet" d="M157.5 188.3L158.6 192L255.1 219.8L253.9 216.1Z"/>
<path class="mf-sheet" d="M173.3 139.9L171.3 141.3L267.7 169.1L269.8 167.7Z"/>
<line class="mf-edge" x1="116.1" y1="113.9" x2="113.5" y2="118.6"/>
<circle class="mf-dot" cx="207.7" cy="74.6" r="2"/>
<circle class="mf-dot" cx="308.1" cy="102.6" r="2"/>
<circle class="mf-dot" cx="208.8" cy="157.9" r="2"/>
<line class="mf-edge" x1="312.4" y1="234.2" x2="314.7" y2="232.4"/>
<line class="mf-edge" x1="97.3" y1="172" x2="96.7" y2="177.7"/>
<line class="mf-geo mf-geo--long" x1="205.4" y1="200.9" x2="206" y2="203.2"/>
<line class="mf-edge" x1="113.5" y1="118.6" x2="111.1" y2="123.4"/>
<line class="mf-edge" x1="342.3" y1="136.5" x2="341.1" y2="132.9"/>
<circle class="mf-dot" cx="168.4" cy="277.6" r="2"/>
<path class="mf-sheet" d="M171.3 141.3L169.3 142.9L265.7 170.7L267.7 169.1Z"/>
<line class="mf-geo mf-geo--long" x1="243.3" y1="76.1" x2="239.4" y2="75.9"/>
<circle class="mf-dot" cx="99.9" cy="201.9" r="2"/>
<line class="mf-edge" x1="98" y1="166.3" x2="97.3" y2="172"/>
<path class="mf-sheet" d="M156.7 184.5L157.5 188.3L253.9 216.1L253.1 212.3Z"/>
<line class="mf-edge" x1="111.1" y1="123.4" x2="108.8" y2="128.4"/>
<line class="mf-geo mf-geo--long" x1="205" y1="198.7" x2="205.4" y2="200.9"/>
<circle class="mf-dot" cx="191.1" cy="75.1" r="2"/>
<line class="mf-edge" x1="99" y1="160.7" x2="98" y2="166.3"/>
<line class="mf-edge" x1="310" y1="235.9" x2="312.4" y2="234.2"/>
<line class="mf-edge" x1="108.8" y1="128.4" x2="106.7" y2="133.6"/>
<line class="mf-edge" x1="283.9" y1="320.4" x2="289.1" y2="319.8"/>
<path class="mf-sheet" d="M169.3 142.9L167.3 144.9L263.8 172.7L265.7 170.7Z"/>
<line class="mf-edge" x1="100.1" y1="155.1" x2="99" y2="160.7"/>
<circle class="mf-dot" cx="230.5" cy="309.8" r="2"/>
<line class="mf-geo mf-geo--long" x1="204.6" y1="196.4" x2="205" y2="198.7"/>
<line class="mf-edge" x1="106.7" y1="133.6" x2="104.8" y2="138.8"/>
<path class="mf-sheet" d="M127.1 270.8L133.9 276.8L230.3 304.5L223.5 298.6Z"/>
<line class="mf-edge" x1="341.1" y1="132.9" x2="339.9" y2="129.3"/>
<circle class="mf-dot" cx="149.2" cy="89.5" r="2"/>
<line class="mf-edge" x1="101.5" y1="149.6" x2="100.1" y2="155.1"/>
<line class="mf-edge" x1="104.8" y1="138.8" x2="103" y2="144.2"/>
<path class="mf-sheet" d="M156.2 180.6L156.7 184.5L253.1 212.3L252.7 208.4Z"/>
<line class="mf-edge" x1="103" y1="144.2" x2="101.5" y2="149.6"/>
<circle class="mf-dot" cx="238.6" cy="78.1" r="2"/>
<line class="mf-geo mf-geo--long" x1="204.4" y1="194.1" x2="204.6" y2="196.4"/>
<path class="mf-sheet" d="M167.3 144.9L165.5 147.1L261.9 174.9L263.8 172.7Z"/>
<path class="mf-sheet" d="M193.7 62.1L187.1 62.1L283.5 89.9L290.2 89.9Z"/>
<line class="mf-edge" x1="307.6" y1="237.3" x2="310" y2="235.9"/>
<circle class="mf-dot" cx="123.8" cy="118.4" r="2"/>
<line class="mf-geo mf-geo--long" x1="204.3" y1="191.8" x2="204.4" y2="194.1"/>
<path class="mf-sheet" d="M156.1 176.7L156.2 180.6L252.7 208.4L252.5 204.5Z"/>
<circle class="mf-dot" cx="99.1" cy="198.3" r="2"/>
<circle class="mf-dot" cx="265.8" cy="236.5" r="2"/>
<path class="mf-sheet" d="M165.5 147.1L163.7 149.6L260.1 177.4L261.9 174.9Z"/>
<circle class="mf-dot" cx="182.7" cy="290.8" r="2"/>
<line class="mf-edge" x1="339.9" y1="129.3" x2="338.5" y2="125.9"/>
<line class="mf-geo mf-geo--long" x1="239.4" y1="75.9" x2="235.5" y2="76"/>
<line class="mf-geo mf-geo--long" x1="204.3" y1="189.5" x2="204.3" y2="191.8"/>
<circle class="mf-point" cx="204.3" cy="189.5" r="5.5"/>
<path class="mf-sheet" d="M156.2 172.9L156.1 176.7L252.5 204.5L252.6 200.7Z"/>
<path class="mf-sheet" d="M163.7 149.6L162 152.3L258.4 180.1L260.1 177.4Z"/>
<line class="mf-edge" x1="305.2" y1="238.7" x2="307.6" y2="237.3"/>
<line class="mf-edge mf-edge--ruling" x1="156.2" y1="172.9" x2="252.6" y2="200.7"/>
<path class="mf-sheet" d="M156.5 169.1L156.2 172.9L252.6 200.7L253 196.9Z"/>
<path class="mf-sheet" d="M162 152.3L160.5 155.3L256.9 183.1L258.4 180.1Z"/>
<circle class="mf-dot" cx="193.9" cy="293.6" r="2"/>
<path class="mf-sheet" d="M160.5 155.3L159.2 158.5L255.6 186.3L256.9 183.1Z"/>
<path class="mf-sheet" d="M157.2 165.4L156.5 169.1L253 196.9L253.6 193.2Z"/>
<line class="mf-edge" x1="278.8" y1="320.6" x2="283.9" y2="320.4"/>
<path class="mf-sheet" d="M159.2 158.5L158.1 161.9L254.5 189.7L255.6 186.3Z"/>
<path class="mf-sheet" d="M158.1 161.9L157.2 165.4L253.6 193.2L254.5 189.7Z"/>
<line class="mf-edge" x1="338.5" y1="125.9" x2="336.9" y2="122.6"/>
<circle class="mf-dot" cx="156.8" cy="269.9" r="2"/>
<circle class="mf-dot" cx="184.7" cy="290.9" r="2"/>
<line class="mf-edge" x1="302.9" y1="239.8" x2="305.2" y2="238.7"/>
<circle class="mf-dot" cx="105.9" cy="198.6" r="2"/>
<circle class="mf-dot" cx="225.6" cy="309.8" r="2"/>
<circle class="mf-dot" cx="211.8" cy="188.2" r="2"/>
<line class="mf-geo mf-geo--long" x1="235.5" y1="76" x2="231.5" y2="76.3"/>
<circle class="mf-dot" cx="240.5" cy="315.4" r="2"/>
<circle class="mf-dot" cx="107.2" cy="193" r="2"/>
<line class="mf-edge" x1="300.5" y1="240.8" x2="302.9" y2="239.8"/>
<line class="mf-edge" x1="336.9" y1="122.6" x2="335.2" y2="119.3"/>
<circle class="mf-dot" cx="146.4" cy="261.6" r="2"/>
<path class="mf-sheet" d="M187.1 62.1L180.3 62.9L276.7 90.7L283.5 89.9Z"/>
<circle class="mf-dot" cx="211.3" cy="199.6" r="2"/>
<circle class="mf-dot" cx="230.4" cy="156.3" r="2"/>
<path class="mf-sheet" d="M120.9 264.1L127.1 270.8L223.5 298.6L217.3 291.9Z"/>
<circle class="mf-dot" cx="223" cy="308.1" r="2"/>
<circle class="mf-dot" cx="156.9" cy="89.8" r="2"/>
<circle class="mf-dot" cx="245.9" cy="72.5" r="2"/>
<line class="mf-edge" x1="298.1" y1="241.7" x2="300.5" y2="240.8"/>
<line class="mf-edge" x1="273.7" y1="320.6" x2="278.8" y2="320.6"/>
<circle class="mf-dot" cx="104.6" cy="182.8" r="2"/>
<line class="mf-edge" x1="335.2" y1="119.3" x2="333.3" y2="116.2"/>
<line class="mf-geo mf-geo--long" x1="231.5" y1="76.3" x2="227.4" y2="77"/>
<circle class="mf-dot" cx="154.4" cy="100.5" r="2"/>
<circle class="mf-dot" cx="209" cy="300.9" r="2"/>
<circle class="mf-dot" cx="108" cy="182.5" r="2"/>
<circle class="mf-dot" cx="178.7" cy="284.6" r="2"/>
<line class="mf-edge" x1="295.7" y1="242.4" x2="298.1" y2="241.7"/>
<circle class="mf-dot" cx="222" cy="306.6" r="2"/>
<circle class="mf-dot" cx="231.7" cy="156.6" r="2"/>
<circle class="mf-dot" cx="132" cy="111.3" r="2"/>
<line class="mf-edge" x1="333.3" y1="116.2" x2="331.2" y2="113.3"/>
<circle class="mf-dot" cx="169.1" cy="95.8" r="2"/>
<line class="mf-edge" x1="293.3" y1="242.9" x2="295.7" y2="242.4"/>
<line class="mf-geo mf-geo--long" x1="227.4" y1="77" x2="223.3" y2="77.9"/>
<path class="mf-sheet" d="M180.3 62.9L173.4 64.4L269.8 92.2L276.7 90.7Z"/>
<line class="mf-edge" x1="268.7" y1="320.2" x2="273.7" y2="320.6"/>
<line class="mf-edge" x1="331.2" y1="113.3" x2="329.1" y2="110.4"/>
<line class="mf-edge" x1="291" y1="243.3" x2="293.3" y2="242.9"/>
<path class="mf-sheet" d="M115.4 256.6L120.9 264.1L217.3 291.9L211.8 284.4Z"/>
<circle class="mf-dot" cx="164.5" cy="91.4" r="2"/>
<circle class="mf-dot" cx="241.2" cy="227.1" r="2"/>
<circle class="mf-dot" cx="165" cy="88.5" r="2"/>
<circle class="mf-dot" cx="153" cy="260" r="2"/>
<line class="mf-geo mf-geo--long" x1="223.3" y1="77.9" x2="219.3" y2="79"/>
<circle class="mf-dot" cx="160.1" cy="99.8" r="2"/>
<circle class="mf-dot" cx="226.3" cy="75.5" r="2"/>
<line class="mf-edge" x1="288.7" y1="243.5" x2="291" y2="243.3"/>
<circle class="mf-dot" cx="214.2" cy="78" r="2"/>
<line class="mf-edge" x1="329.1" y1="110.4" x2="326.7" y2="107.7"/>
<circle class="mf-dot" cx="151" cy="259.7" r="2"/>
<circle class="mf-dot" cx="139.2" cy="248.2" r="2"/>
<circle class="mf-dot" cx="256.4" cy="157.4" r="2"/>
<line class="mf-edge" x1="263.8" y1="319.5" x2="268.7" y2="320.2"/>
<circle class="mf-dot" cx="164.8" cy="88.5" r="2"/>
<circle class="mf-dot" cx="165.8" cy="93.1" r="2"/>
<circle class="mf-dot" cx="258" cy="78.1" r="2"/>
<path class="mf-sheet" d="M173.4 64.4L166.5 66.8L262.9 94.6L269.8 92.2Z"/>
<line class="mf-edge" x1="286.4" y1="243.6" x2="288.7" y2="243.5"/>
<circle class="mf-dot" cx="302.8" cy="97" r="2"/>
<circle class="mf-dot" cx="214" cy="188.1" r="2"/>
<line class="mf-geo mf-geo--long" x1="219.3" y1="79" x2="215.2" y2="80.5"/>
<circle class="mf-dot" cx="270.2" cy="80.4" r="2"/>
<line class="mf-edge" x1="326.7" y1="107.7" x2="324.3" y2="105.2"/>
<circle class="mf-dot" cx="234.6" cy="83.1" r="2"/>
<circle class="mf-dot" cx="160.2" cy="266.6" r="2"/>
<line class="mf-edge" x1="284.2" y1="243.5" x2="286.4" y2="243.6"/>
<path class="mf-sheet" d="M110.5 248.5L115.4 256.6L211.8 284.4L206.9 276.3Z"/>
<circle class="mf-dot" cx="247.4" cy="227.3" r="2"/>
<circle class="mf-dot" cx="124.3" cy="144.1" r="2"/>
<circle class="mf-dot" cx="201.1" cy="295" r="2"/>
<circle class="mf-dot" cx="146.2" cy="247.2" r="2"/>
<circle class="mf-dot" cx="239.6" cy="221.2" r="2"/>
<line class="mf-edge" x1="258.9" y1="318.5" x2="263.8" y2="319.5"/>
<line class="mf-edge" x1="282" y1="243.3" x2="284.2" y2="243.5"/>
<line class="mf-geo mf-geo--long" x1="215.2" y1="80.5" x2="211.1" y2="82.2"/>
<circle class="mf-dot" cx="230.1" cy="307.8" r="2"/>
<line class="mf-edge" x1="324.3" y1="105.2" x2="321.7" y2="102.8"/>
<circle class="mf-dot" cx="127.5" cy="222.5" r="2"/>
<path class="mf-sheet" d="M166.5 66.8L159.6 69.9L256 97.7L262.9 94.6Z"/>
<circle class="mf-dot" cx="147.3" cy="247.8" r="2"/>
<line class="mf-edge" x1="279.8" y1="242.9" x2="282" y2="243.3"/>
<circle class="mf-dot" cx="235" cy="224.4" r="2"/>
<line class="mf-edge" x1="321.7" y1="102.8" x2="319" y2="100.7"/>
<line class="mf-geo mf-geo--long" x1="211.1" y1="82.2" x2="207" y2="84.2"/>
<circle class="mf-dot" cx="203.7" cy="87" r="2"/>
<line class="mf-edge" x1="277.7" y1="242.4" x2="279.8" y2="242.9"/>
<circle class="mf-dot" cx="117.4" cy="198.2" r="2"/>
<circle class="mf-dot" cx="216.7" cy="81.7" r="2"/>
<line class="mf-edge" x1="254.2" y1="317.2" x2="258.9" y2="318.5"/>
<circle class="mf-dot" cx="263.8" cy="85" r="2"/>
<circle class="mf-dot" cx="119.5" cy="169.2" r="2"/>
<circle class="mf-dot" cx="248.5" cy="81.5" r="2"/>
<circle class="mf-dot" cx="120.3" cy="187.1" r="2"/>
<path class="mf-sheet" d="M106.3 239.8L110.5 248.5L206.9 276.3L202.7 267.6Z"/>
<circle class="mf-dot" cx="159.1" cy="105" r="2"/>
<circle class="mf-dot" cx="224.4" cy="80.7" r="2"/>
<circle class="mf-dot" cx="233.5" cy="312" r="2"/>
<line class="mf-edge" x1="275.7" y1="241.8" x2="277.7" y2="242.4"/>
<circle class="mf-dot" cx="261.8" cy="238.5" r="2"/>
<line class="mf-edge" x1="319" y1="100.7" x2="316.2" y2="98.6"/>
<line class="mf-geo mf-geo--long" x1="207" y1="84.2" x2="203" y2="86.5"/>
<circle class="mf-dot" cx="256.8" cy="85.6" r="2"/>
<circle class="mf-dot" cx="202.2" cy="83.7" r="2"/>
<path class="mf-sheet" d="M159.6 69.9L152.8 73.9L249.2 101.6L256 97.7Z"/>
<circle class="mf-dot" cx="228.6" cy="78.3" r="2"/>
<circle class="mf-dot" cx="227.6" cy="180.6" r="2"/>
<circle class="mf-dot" cx="199.3" cy="85.3" r="2"/>
<circle class="mf-dot" cx="236.6" cy="167.5" r="2"/>
<line class="mf-edge" x1="273.8" y1="241" x2="275.7" y2="241.8"/>
<circle class="mf-dot" cx="159.7" cy="264" r="2"/>
<circle class="mf-dot" cx="289.1" cy="86.7" r="2"/>
<line class="mf-edge" x1="249.6" y1="315.5" x2="254.2" y2="317.2"/>
<line class="mf-geo mf-geo--long" x1="203" y1="86.5" x2="199" y2="89.1"/>
<line class="mf-edge" x1="316.2" y1="98.6" x2="313.2" y2="96.8"/>
<circle class="mf-dot" cx="130.6" cy="201.1" r="2"/>
<circle class="mf-dot" cx="177.8" cy="276.7" r="2"/>
<line class="mf-edge" x1="271.9" y1="240.1" x2="273.8" y2="241"/>
<circle class="mf-dot" cx="170.4" cy="100.2" r="2"/>
<circle class="mf-dot" cx="135.3" cy="146.4" r="2"/>
<circle class="mf-dot" cx="131.2" cy="136.9" r="2"/>
<path class="mf-sheet" d="M102.8 230.7L106.3 239.8L202.7 267.6L199.2 258.5Z"/>
<circle class="mf-dot" cx="225.6" cy="79.4" r="2"/>
<circle class="mf-dot" cx="140" cy="125.4" r="2"/>
<path class="mf-sheet" d="M152.8 73.9L146.1 78.6L242.5 106.4L249.2 101.6Z"/>
<line class="mf-edge" x1="270.1" y1="239.1" x2="271.9" y2="240.1"/>
<line class="mf-geo mf-geo--long" x1="199" y1="89.1" x2="195" y2="91.9"/>
<line class="mf-edge" x1="313.2" y1="96.8" x2="310.1" y2="95.2"/>
<circle class="mf-dot" cx="184" cy="279.5" r="2"/>
<circle class="mf-dot" cx="271.2" cy="85.7" r="2"/>
<circle class="mf-dot" cx="286.7" cy="89.7" r="2"/>
<line class="mf-edge" x1="245.1" y1="313.6" x2="249.6" y2="315.5"/>
<line class="mf-edge" x1="268.3" y1="238" x2="270.1" y2="239.1"/>
<line class="mf-geo mf-geo--long" x1="195" y1="91.9" x2="191.2" y2="95"/>
<line class="mf-edge" x1="266.7" y1="236.7" x2="268.3" y2="238"/>
<line class="mf-edge" x1="310.1" y1="95.2" x2="307" y2="93.8"/>
<circle class="mf-dot" cx="132.4" cy="152.5" r="2"/>
<path class="mf-sheet" d="M100.1 221.1L102.8 230.7L199.2 258.5L196.5 248.9Z"/>
<path class="mf-sheet" d="M146.1 78.6L139.6 84L236 111.8L242.5 106.4Z"/>
<circle class="mf-dot" cx="221.6" cy="300" r="2"/>
<circle class="mf-dot" cx="255.9" cy="165.2" r="2"/>
<circle class="mf-dot" cx="172.7" cy="262.4" r="2"/>
<line class="mf-edge" x1="286.5" y1="168.6" x2="285.9" y2="168"/>
<circle class="mf-dot" cx="262" cy="168.5" r="2"/>
<line class="mf-edge" x1="285.9" y1="168" x2="285.3" y2="167.4"/>
<line class="mf-edge" x1="265.1" y1="235.4" x2="266.7" y2="236.7"/>
<line class="mf-geo mf-geo--long" x1="191.2" y1="95" x2="187.4" y2="98.3"/>
<line class="mf-edge" x1="285.3" y1="167.4" x2="284.6" y2="166.9"/>
<circle class="mf-dot" cx="183.2" cy="100.2" r="2"/>
<line class="mf-edge" x1="240.7" y1="311.4" x2="245.1" y2="313.6"/>
<circle class="mf-dot" cx="237.2" cy="194.1" r="2"/>
<line class="mf-edge" x1="284.6" y1="166.9" x2="283.8" y2="166.5"/>
<line class="mf-edge" x1="307" y1="93.8" x2="303.7" y2="92.6"/>
<line class="mf-edge" x1="263.6" y1="234" x2="265.1" y2="235.4"/>
<circle class="mf-dot" cx="273.4" cy="164.4" r="2"/>
<line class="mf-edge" x1="283.8" y1="166.5" x2="283.1" y2="166.1"/>
<line class="mf-geo mf-geo--long" x1="187.4" y1="98.3" x2="183.7" y2="101.9"/>
<circle class="mf-dot" cx="211.9" cy="296.8" r="2"/>
<circle class="mf-dot" cx="234.2" cy="310" r="2"/>
<path class="mf-sheet" d="M139.6 84L133.4 90.2L229.8 118L236 111.8Z"/>
<line class="mf-edge" x1="283.1" y1="166.1" x2="282.2" y2="165.8"/>
<circle class="mf-dot" cx="163.9" cy="112.6" r="2"/>
<path class="mf-sheet" d="M98.1 211.2L100.1 221.1L196.5 248.9L194.5 239Z"/>
<line class="mf-edge" x1="262.2" y1="232.4" x2="263.6" y2="234"/>
<circle class="mf-dot" cx="132.6" cy="174.4" r="2"/>
<circle class="mf-dot" cx="237.7" cy="88.9" r="2"/>
<line class="mf-edge" x1="282.2" y1="165.8" x2="281.4" y2="165.5"/>
<circle class="mf-dot" cx="144.7" cy="215.6" r="2"/>
<line class="mf-edge" x1="281.4" y1="165.5" x2="280.5" y2="165.3"/>
<line class="mf-edge" x1="303.7" y1="92.6" x2="300.4" y2="91.6"/>
<line class="mf-geo mf-geo--long" x1="183.7" y1="101.9" x2="180" y2="105.8"/>
<line class="mf-edge" x1="260.9" y1="230.8" x2="262.2" y2="232.4"/>
<line class="mf-edge" x1="236.5" y1="308.9" x2="240.7" y2="311.4"/>
<line class="mf-edge" x1="280.5" y1="165.3" x2="279.5" y2="165.2"/>
<circle class="mf-dot" cx="244.6" cy="197.3" r="2"/>
<circle class="mf-dot" cx="248" cy="170.4" r="2"/>
<line class="mf-edge" x1="279.5" y1="165.2" x2="278.5" y2="165.1"/>
<line class="mf-edge" x1="259.7" y1="229.1" x2="260.9" y2="230.8"/>
<line class="mf-euclid" x1="145.8" y1="221.8" x2="204.3" y2="189.5"/>
<path class="mf-sheet" d="M133.4 90.2L127.5 97L223.9 124.8L229.8 118Z"/>
<circle class="mf-point" cx="145.8" cy="221.8" r="5.5"/>
<line class="mf-geo" x1="145.7" y1="220.9" x2="145.8" y2="221.8"/>
<line class="mf-geo mf-geo--long" x1="180" y1="105.8" x2="176.6" y2="109.9"/>
<line class="mf-geo" x1="145.6" y1="220" x2="145.7" y2="220.9"/>
<path class="mf-sheet" d="M96.8 201L98.1 211.2L194.5 239L193.2 228.8Z"/>
<line class="mf-edge" x1="278.5" y1="165.1" x2="277.5" y2="165.1"/>
<line class="mf-geo" x1="145.5" y1="219.1" x2="145.6" y2="220"/>
<line class="mf-geo mf-geo--long" x1="145.1" y1="215.8" x2="145.8" y2="221.8"/>
<circle class="mf-dot" cx="135" cy="191.4" r="2"/>
<line class="mf-geo" x1="145.4" y1="218.2" x2="145.5" y2="219.1"/>
<line class="mf-edge" x1="300.4" y1="91.6" x2="296.9" y2="90.8"/>
<line class="mf-edge" x1="258.5" y1="227.3" x2="259.7" y2="229.1"/>
<line class="mf-geo" x1="145.3" y1="217.3" x2="145.4" y2="218.2"/>
<line class="mf-edge" x1="277.5" y1="165.1" x2="276.5" y2="165.2"/>
<circle class="mf-dot" cx="171.6" cy="119.7" r="2"/>
<line class="mf-geo" x1="145.2" y1="216.4" x2="145.3" y2="217.3"/>
<line class="mf-geo" x1="145.1" y1="215.4" x2="145.2" y2="216.4"/>
<line class="mf-geo mf-geo--long" x1="176.6" y1="109.9" x2="173.2" y2="114.2"/>
<line class="mf-geo" x1="145" y1="214.5" x2="145.1" y2="215.4"/>
<line class="mf-edge" x1="276.5" y1="165.2" x2="275.5" y2="165.4"/>
<line class="mf-geo" x1="144.9" y1="213.6" x2="145" y2="214.5"/>
<line class="mf-edge" x1="257.5" y1="225.5" x2="258.5" y2="227.3"/>
<line class="mf-edge" x1="232.5" y1="306.2" x2="236.5" y2="308.9"/>
<circle class="mf-dot" cx="148.1" cy="149" r="2"/>
<line class="mf-geo" x1="144.9" y1="212.7" x2="144.9" y2="213.6"/>
<line class="mf-geo mf-geo--long" x1="144.7" y1="209.7" x2="145.1" y2="215.8"/>
<path class="mf-sheet" d="M127.5 97L121.9 104.5L218.4 132.3L223.9 124.8Z"/>
<line class="mf-geo" x1="144.8" y1="211.8" x2="144.9" y2="212.7"/>
<line class="mf-edge" x1="275.5" y1="165.4" x2="274.4" y2="165.7"/>
<line class="mf-geo" x1="144.8" y1="210.8" x2="144.8" y2="211.8"/>
<line class="mf-geo" x1="144.7" y1="209.9" x2="144.8" y2="210.8"/>
<path class="mf-sheet" d="M96.3 190.7L96.8 201L193.2 228.8L192.7 218.5Z"/>
<circle class="mf-dot" cx="161.7" cy="126.8" r="2"/>
<line class="mf-geo mf-geo--long" x1="173.2" y1="114.2" x2="170" y2="118.7"/>
<line class="mf-edge" x1="256.6" y1="223.6" x2="257.5" y2="225.5"/>
<line class="mf-geo" x1="144.7" y1="209" x2="144.7" y2="209.9"/>
<line class="mf-edge" x1="274.4" y1="165.7" x2="273.3" y2="166"/>
<line class="mf-geo" x1="144.6" y1="208.1" x2="144.7" y2="209"/>
<line class="mf-edge" x1="296.9" y1="90.8" x2="293.4" y2="90.2"/>
<line class="mf-geo" x1="144.6" y1="207.2" x2="144.6" y2="208.1"/>
<line class="mf-euclid mf-euclid--faint" x1="145.8" y1="221.8" x2="170.4" y2="118"/>
<circle class="mf-point" cx="170.4" cy="118" r="5.5"/>
<line class="mf-geo" x1="170.4" y1="118" x2="169.9" y2="118.7"/>
<line class="mf-geo mf-geo--long" x1="144.5" y1="203.6" x2="144.7" y2="209.7"/>
<line class="mf-geo" x1="144.6" y1="206.2" x2="144.6" y2="207.2"/>
<line class="mf-edge" x1="273.3" y1="166" x2="272.2" y2="166.5"/>
<line class="mf-geo" x1="169.9" y1="118.7" x2="169.5" y2="119.4"/>
<circle class="mf-dot" cx="193.2" cy="277.8" r="2"/>
<line class="mf-geo" x1="144.5" y1="205.3" x2="144.6" y2="206.2"/>
<circle class="mf-dot" cx="270.7" cy="88.7" r="2"/>
<line class="mf-geo" x1="169.5" y1="119.4" x2="169" y2="120.1"/>
<line class="mf-edge" x1="255.7" y1="221.6" x2="256.6" y2="223.6"/>
<line class="mf-geo" x1="144.5" y1="204.4" x2="144.5" y2="205.3"/>
<line class="mf-geo" x1="169" y1="120.1" x2="168.5" y2="120.8"/>
<line class="mf-geo mf-geo--long" x1="170" y1="118.7" x2="166.9" y2="123.4"/>
<line class="mf-geo" x1="144.5" y1="203.4" x2="144.5" y2="204.4"/>
<line class="mf-geo" x1="168.5" y1="120.8" x2="168.1" y2="121.5"/>
<circle class="mf-dot" cx="253.2" cy="208.8" r="2"/>
<line class="mf-edge" x1="272.2" y1="166.5" x2="271.1" y2="167"/>
<line class="mf-geo" x1="144.5" y1="202.5" x2="144.5" y2="203.4"/>
<line class="mf-geo" x1="168.1" y1="121.5" x2="167.6" y2="122.3"/>
<path class="mf-sheet" d="M121.9 104.5L116.8 112.6L213.2 140.4L218.4 132.3Z"/>
<line class="mf-geo" x1="144.5" y1="201.6" x2="144.5" y2="202.5"/>
<line class="mf-geo" x1="167.6" y1="122.3" x2="167.2" y2="123"/>
<line class="mf-geo" x1="144.5" y1="200.7" x2="144.5" y2="201.6"/>
<line class="mf-geo" x1="167.2" y1="123" x2="166.7" y2="123.7"/>
<circle class="mf-dot" cx="259.1" cy="169.3" r="2"/>
<line class="mf-geo mf-geo--long" x1="144.6" y1="197.5" x2="144.5" y2="203.6"/>
<line class="mf-edge" x1="255" y1="219.6" x2="255.7" y2="221.6"/>
<line class="mf-geo" x1="144.6" y1="199.7" x2="144.5" y2="200.7"/>
<line class="mf-geo" x1="166.7" y1="123.7" x2="166.2" y2="124.4"/>
<path class="mf-sheet" d="M96.6 180.3L96.3 190.7L192.7 218.5L193 208.1Z"/>
<line class="mf-edge" x1="271.1" y1="167" x2="270" y2="167.6"/>
<line class="mf-geo" x1="144.6" y1="198.8" x2="144.6" y2="199.7"/>
<line class="mf-geo" x1="166.2" y1="124.4" x2="165.8" y2="125.2"/>
<line class="mf-geo" x1="165.8" y1="125.2" x2="165.4" y2="125.9"/>
<line class="mf-geo" x1="144.6" y1="197.9" x2="144.6" y2="198.8"/>
<line class="mf-geo mf-geo--long" x1="166.9" y1="123.4" x2="164" y2="128.3"/>
<line class="mf-edge" x1="228.6" y1="303.1" x2="232.5" y2="306.2"/>
<circle class="mf-dot" cx="206.5" cy="98.6" r="2"/>
<line class="mf-geo" x1="165.4" y1="125.9" x2="164.9" y2="126.7"/>
<line class="mf-geo" x1="144.6" y1="196.9" x2="144.6" y2="197.9"/>
<line class="mf-geo" x1="164.9" y1="126.7" x2="164.5" y2="127.4"/>
<line class="mf-geo" x1="144.7" y1="196" x2="144.6" y2="196.9"/>
<line class="mf-edge" x1="270" y1="167.6" x2="268.8" y2="168.3"/>
<line class="mf-geo" x1="164.5" y1="127.4" x2="164.1" y2="128.2"/>
<line class="mf-geo" x1="144.7" y1="195.1" x2="144.7" y2="196"/>
<line class="mf-edge" x1="254.4" y1="217.6" x2="255" y2="219.6"/>
<line class="mf-edge" x1="293.4" y1="90.2" x2="289.8" y2="89.9"/>
<line class="mf-geo" x1="164.1" y1="128.2" x2="163.6" y2="128.9"/>
<line class="mf-geo" x1="144.8" y1="194.2" x2="144.7" y2="195.1"/>
<line class="mf-geo mf-geo--long" x1="145" y1="191.3" x2="144.6" y2="197.5"/>
<line class="mf-geo" x1="163.6" y1="128.9" x2="163.2" y2="129.7"/>
<line class="mf-geo" x1="144.8" y1="193.2" x2="144.8" y2="194.2"/>
<line class="mf-geo" x1="163.2" y1="129.7" x2="162.8" y2="130.5"/>
<path class="mf-sheet" d="M116.8 112.6L112.2 121.2L208.6 149L213.2 140.4Z"/>
<line class="mf-geo" x1="144.9" y1="192.3" x2="144.8" y2="193.2"/>
<line class="mf-geo mf-geo--long" x1="164" y1="128.3" x2="161.2" y2="133.4"/>
<line class="mf-geo" x1="162.8" y1="130.5" x2="162.4" y2="131.2"/>
<line class="mf-edge" x1="268.8" y1="168.3" x2="267.7" y2="169.1"/>
<line class="mf-geo" x1="145" y1="191.4" x2="144.9" y2="192.3"/>
<line class="mf-geo" x1="162.4" y1="131.2" x2="162" y2="132"/>
<line class="mf-geo" x1="145" y1="190.5" x2="145" y2="191.4"/>
<line class="mf-geo" x1="162" y1="132" x2="161.5" y2="132.8"/>
<line class="mf-edge" x1="253.8" y1="215.5" x2="254.4" y2="217.6"/>
<line class="mf-geo" x1="145.1" y1="189.5" x2="145" y2="190.5"/>
<path class="mf-sheet" d="M97.5 170L96.6 180.3L193 208.1L193.9 197.8Z"/>
<line class="mf-geo" x1="161.5" y1="132.8" x2="161.1" y2="133.6"/>
<line class="mf-geo" x1="145.2" y1="188.6" x2="145.1" y2="189.5"/>
<line class="mf-geo" x1="161.1" y1="133.6" x2="160.7" y2="134.4"/>
<line class="mf-geo mf-geo--long" x1="145.6" y1="185.2" x2="145" y2="191.3"/>
<line class="mf-geo" x1="145.3" y1="187.7" x2="145.2" y2="188.6"/>
<line class="mf-edge" x1="267.7" y1="169.1" x2="266.6" y2="170"/>
<line class="mf-geo" x1="160.7" y1="134.4" x2="160.3" y2="135.1"/>
<circle class="mf-dot" cx="161.7" cy="133.8" r="2"/>
<line class="mf-geo" x1="145.4" y1="186.7" x2="145.3" y2="187.7"/>
<line class="mf-geo" x1="160.3" y1="135.1" x2="160" y2="135.9"/>
<line class="mf-geo mf-geo--long" x1="161.2" y1="133.4" x2="158.7" y2="138.7"/>
<line class="mf-geo" x1="145.5" y1="185.8" x2="145.4" y2="186.7"/>
<line class="mf-geo" x1="160" y1="135.9" x2="159.6" y2="136.7"/>
<line class="mf-geo" x1="145.6" y1="184.9" x2="145.5" y2="185.8"/>
<line class="mf-geo" x1="159.6" y1="136.7" x2="159.2" y2="137.5"/>
<line class="mf-geo" x1="145.7" y1="184" x2="145.6" y2="184.9"/>
<line class="mf-edge" x1="253.3" y1="213.4" x2="253.8" y2="215.5"/>
<line class="mf-geo" x1="159.2" y1="137.5" x2="158.8" y2="138.3"/>
<line class="mf-geo" x1="145.8" y1="183" x2="145.7" y2="184"/>
<line class="mf-geo" x1="158.8" y1="138.3" x2="158.4" y2="139.2"/>
<path class="mf-sheet" d="M112.2 121.2L108 130.3L204.4 158.1L208.6 149Z"/>
<line class="mf-edge" x1="266.6" y1="170" x2="265.5" y2="170.9"/>
<line class="mf-geo" x1="145.9" y1="182.1" x2="145.8" y2="183"/>
<line class="mf-geo mf-geo--long" x1="146.4" y1="179.1" x2="145.6" y2="185.2"/>
<line class="mf-geo" x1="158.4" y1="139.2" x2="158.1" y2="140"/>
<line class="mf-geo" x1="146.1" y1="181.2" x2="145.9" y2="182.1"/>
<line class="mf-geo" x1="158.1" y1="140" x2="157.7" y2="140.8"/>
<circle class="mf-dot" cx="261.3" cy="173.1" r="2"/>
<line class="mf-geo" x1="146.2" y1="180.3" x2="146.1" y2="181.2"/>
<line class="mf-geo mf-geo--long" x1="158.7" y1="138.7" x2="156.3" y2="144.1"/>
<line class="mf-geo" x1="157.7" y1="140.8" x2="157.3" y2="141.6"/>
<path class="mf-sheet" d="M99.2 159.7L97.5 170L193.9 197.8L195.6 187.5Z"/>
<line class="mf-geo" x1="146.4" y1="179.4" x2="146.2" y2="180.3"/>
<line class="mf-geo" x1="157.3" y1="141.6" x2="157" y2="142.4"/>
<line class="mf-geo" x1="146.5" y1="178.4" x2="146.4" y2="179.4"/>
<line class="mf-geo" x1="157" y1="142.4" x2="156.6" y2="143.2"/>
<circle class="mf-dot" cx="192.5" cy="111.6" r="2"/>
<line class="mf-geo" x1="146.7" y1="177.5" x2="146.5" y2="178.4"/>
<line class="mf-geo" x1="156.6" y1="143.2" x2="156.3" y2="144.1"/>
<line class="mf-geo" x1="146.8" y1="176.6" x2="146.7" y2="177.5"/>
<line class="mf-edge" x1="265.5" y1="170.9" x2="264.4" y2="172"/>
<line class="mf-edge" x1="253" y1="211.3" x2="253.3" y2="213.4"/>
<line class="mf-geo" x1="156.3" y1="144.1" x2="155.9" y2="144.9"/>
<line class="mf-geo mf-geo--long" x1="147.5" y1="173" x2="146.4" y2="179.1"/>
<line class="mf-geo" x1="147" y1="175.7" x2="146.8" y2="176.6"/>
<line class="mf-geo" x1="155.9" y1="144.9" x2="155.6" y2="145.7"/>
<line class="mf-geo" x1="147.1" y1="174.8" x2="147" y2="175.7"/>
<line class="mf-geo" x1="155.6" y1="145.7" x2="155.3" y2="146.6"/>
<circle class="mf-dot" cx="253.7" cy="87.7" r="2"/>
<line class="mf-geo mf-geo--long" x1="156.3" y1="144.1" x2="154.1" y2="149.7"/>
<line class="mf-geo" x1="147.3" y1="173.9" x2="147.1" y2="174.8"/>
<line class="mf-geo" x1="155.3" y1="146.6" x2="154.9" y2="147.4"/>
<path class="mf-sheet" d="M108 130.3L104.5 139.8L200.9 167.6L204.4 158.1Z"/>
<line class="mf-geo" x1="147.5" y1="173" x2="147.3" y2="173.9"/>
<line class="mf-geo" x1="154.9" y1="147.4" x2="154.6" y2="148.3"/>
<line class="mf-geo" x1="147.7" y1="172.1" x2="147.5" y2="173"/>
<line class="mf-geo" x1="154.6" y1="148.3" x2="154.3" y2="149.1"/>
<line class="mf-edge" x1="289.8" y1="89.9" x2="286.2" y2="89.8"/>
<line class="mf-geo" x1="147.9" y1="171.1" x2="147.7" y2="172.1"/>
<line class="mf-geo" x1="154.3" y1="149.1" x2="154" y2="150"/>
<path class="mf-sheet" d="M101.5 149.6L99.2 159.7L195.6 187.5L197.9 177.4Z"/>
<line class="mf-geo" x1="148.1" y1="170.2" x2="147.9" y2="171.1"/>
<line class="mf-geo" x1="154" y1="150" x2="153.7" y2="150.8"/>
<line class="mf-geo mf-geo--long" x1="148.8" y1="167.1" x2="147.5" y2="173"/>
<line class="mf-geo" x1="148.3" y1="169.3" x2="148.1" y2="170.2"/>
<line class="mf-geo" x1="153.7" y1="150.8" x2="153.4" y2="151.7"/>
<line class="mf-geo mf-geo--long" x1="154.1" y1="149.7" x2="152.1" y2="155.4"/>
<line class="mf-geo" x1="148.5" y1="168.4" x2="148.3" y2="169.3"/>
<line class="mf-geo" x1="153.4" y1="151.7" x2="153.1" y2="152.5"/>
<line class="mf-edge" x1="264.4" y1="172" x2="263.4" y2="173.1"/>
<line class="mf-geo" x1="148.7" y1="167.5" x2="148.5" y2="168.4"/>
<line class="mf-geo" x1="153.1" y1="152.5" x2="152.8" y2="153.4"/>
<line class="mf-edge" x1="224.8" y1="299.9" x2="228.6" y2="303.1"/>
<line class="mf-geo" x1="148.9" y1="166.6" x2="148.7" y2="167.5"/>
<line class="mf-geo" x1="152.8" y1="153.4" x2="152.5" y2="154.3"/>
<path class="mf-sheet" d="M104.5 139.8L101.5 149.6L197.9 177.4L200.9 167.6Z"/>
<line class="mf-geo" x1="149.1" y1="165.7" x2="148.9" y2="166.6"/>
<line class="mf-geo" x1="152.5" y1="154.3" x2="152.2" y2="155.1"/>
<line class="mf-geo" x1="152.2" y1="155.1" x2="151.9" y2="156"/>
<line class="mf-geo" x1="149.3" y1="164.8" x2="149.1" y2="165.7"/>
<line class="mf-edge mf-edge--ruling" x1="101.5" y1="149.6" x2="197.9" y2="177.4"/>
<line class="mf-geo mf-geo--long" x1="150.3" y1="161.2" x2="148.8" y2="167.1"/>
<line class="mf-geo" x1="151.9" y1="156" x2="151.6" y2="156.9"/>
<line class="mf-geo" x1="149.6" y1="163.9" x2="149.3" y2="164.8"/>
<line class="mf-geo mf-geo--long" x1="152.1" y1="155.4" x2="150.3" y2="161.2"/>
<line class="mf-edge" x1="252.7" y1="209.2" x2="253" y2="211.3"/>
<line class="mf-geo" x1="151.6" y1="156.9" x2="151.3" y2="157.8"/>
<line class="mf-geo" x1="149.8" y1="163.1" x2="149.6" y2="163.9"/>
<line class="mf-geo" x1="151.3" y1="157.8" x2="151.1" y2="158.6"/>
<line class="mf-geo" x1="150.1" y1="162.2" x2="149.8" y2="163.1"/>
<line class="mf-geo" x1="151.1" y1="158.6" x2="150.8" y2="159.5"/>
<line class="mf-geo" x1="150.3" y1="161.3" x2="150.1" y2="162.2"/>
<line class="mf-geo" x1="150.8" y1="159.5" x2="150.6" y2="160.4"/>
<line class="mf-geo" x1="150.6" y1="160.4" x2="150.3" y2="161.3"/>
<circle class="mf-dot" cx="249.9" cy="204.8" r="2"/>
<line class="mf-edge" x1="263.4" y1="173.1" x2="262.3" y2="174.3"/>
<line class="mf-edge" x1="252.6" y1="207.1" x2="252.7" y2="209.2"/>
<line class="mf-edge" x1="262.3" y1="174.3" x2="261.3" y2="175.6"/>
<line class="mf-edge" x1="252.5" y1="204.9" x2="252.6" y2="207.1"/>
<line class="mf-edge" x1="261.3" y1="175.6" x2="260.4" y2="177"/>
<line class="mf-edge" x1="252.5" y1="202.8" x2="252.5" y2="204.9"/>
<line class="mf-edge" x1="260.4" y1="177" x2="259.4" y2="178.5"/>
<circle class="mf-dot" cx="192.6" cy="280.1" r="2"/>
<line class="mf-edge" x1="252.6" y1="200.7" x2="252.5" y2="202.8"/>
<line class="mf-edge" x1="259.4" y1="178.5" x2="258.5" y2="180"/>
<line class="mf-edge" x1="286.2" y1="89.8" x2="282.5" y2="90"/>
<line class="mf-edge" x1="252.8" y1="198.6" x2="252.6" y2="200.7"/>
<circle class="mf-dot" cx="162.3" cy="140.7" r="2"/>
<line class="mf-edge" x1="258.5" y1="180" x2="257.7" y2="181.6"/>
<line class="mf-edge" x1="257.7" y1="181.6" x2="256.9" y2="183.3"/>
<line class="mf-edge" x1="253" y1="196.5" x2="252.8" y2="198.6"/>
<line class="mf-edge" x1="256.9" y1="183.3" x2="256.1" y2="185"/>
<line class="mf-edge" x1="253.4" y1="194.5" x2="253" y2="196.5"/>
<line class="mf-edge" x1="256.1" y1="185" x2="255.4" y2="186.8"/>
<line class="mf-edge" x1="253.8" y1="192.5" x2="253.4" y2="194.5"/>
<line class="mf-edge" x1="255.4" y1="186.8" x2="254.8" y2="188.7"/>
<line class="mf-edge" x1="254.3" y1="190.6" x2="253.8" y2="192.5"/>
<line class="mf-edge" x1="254.8" y1="188.7" x2="254.3" y2="190.6"/>
<line class="mf-edge" x1="221.3" y1="296.3" x2="224.8" y2="299.9"/>
<circle class="mf-dot" cx="148.1" cy="183.2" r="2"/>
<circle class="mf-dot" cx="162.3" cy="130.2" r="2"/>
<line class="mf-edge" x1="282.5" y1="90" x2="278.8" y2="90.4"/>
<circle class="mf-dot" cx="246.4" cy="89.9" r="2"/>
<circle class="mf-dot" cx="206.5" cy="108.8" r="2"/>
<circle class="mf-dot" cx="154" cy="213.1" r="2"/>
<line class="mf-edge" x1="217.9" y1="292.6" x2="221.3" y2="296.3"/>
<circle class="mf-dot" cx="239.7" cy="93.3" r="2"/>
<line class="mf-edge" x1="278.8" y1="90.4" x2="275" y2="91"/>
<circle class="mf-dot" cx="165.2" cy="234.1" r="2"/>
<circle class="mf-dot" cx="166.2" cy="143.2" r="2"/>
<circle class="mf-dot" cx="265" cy="92.7" r="2"/>
<line class="mf-edge" x1="214.7" y1="288.6" x2="217.9" y2="292.6"/>
<line class="mf-edge" x1="275" y1="91" x2="271.2" y2="91.8"/>
<circle class="mf-dot" cx="183" cy="127.1" r="2"/>
<circle class="mf-dot" cx="161.9" cy="161.6" r="2"/>
<circle class="mf-dot" cx="168.1" cy="225.7" r="2"/>
<circle class="mf-dot" cx="186.3" cy="126.3" r="2"/>
<line class="mf-edge" x1="271.2" y1="91.8" x2="267.4" y2="92.9"/>
<line class="mf-edge" x1="211.8" y1="284.4" x2="214.7" y2="288.6"/>
<circle class="mf-dot" cx="169.1" cy="160.7" r="2"/>
<circle class="mf-dot" cx="175.1" cy="141.8" r="2"/>
<line class="mf-edge" x1="267.4" y1="92.9" x2="263.6" y2="94.3"/>
<circle class="mf-dot" cx="175" cy="244.3" r="2"/>
<line class="mf-edge" x1="209" y1="280" x2="211.8" y2="284.4"/>
<circle class="mf-dot" cx="169.5" cy="219.9" r="2"/>
<circle class="mf-dot" cx="183" cy="144.3" r="2"/>
<circle class="mf-dot" cx="230.3" cy="100.7" r="2"/>
<circle class="mf-dot" cx="190.3" cy="259.8" r="2"/>
<line class="mf-edge" x1="263.6" y1="94.3" x2="259.8" y2="95.9"/>
<circle class="mf-dot" cx="164.7" cy="214.2" r="2"/>
<line class="mf-edge" x1="206.4" y1="275.5" x2="209" y2="280"/>
<circle class="mf-dot" cx="204" cy="269.7" r="2"/>
<circle class="mf-dot" cx="172.6" cy="222.3" r="2"/>
<line class="mf-edge" x1="259.8" y1="95.9" x2="256" y2="97.7"/>
<circle class="mf-dot" cx="196.6" cy="125.1" r="2"/>
<circle class="mf-dot" cx="194.7" cy="126.8" r="2"/>
<circle class="mf-dot" cx="211" cy="117.7" r="2"/>
<circle class="mf-dot" cx="238.6" cy="102.8" r="2"/>
<circle class="mf-dot" cx="200.8" cy="131.2" r="2"/>
<line class="mf-edge" x1="204.1" y1="270.7" x2="206.4" y2="275.5"/>
<line class="mf-edge" x1="256" y1="97.7" x2="252.3" y2="99.8"/>
<circle class="mf-dot" cx="172.3" cy="188" r="2"/>
<line class="mf-edge" x1="201.9" y1="265.8" x2="204.1" y2="270.7"/>
<line class="mf-edge" x1="252.3" y1="99.8" x2="248.5" y2="102.1"/>
<circle class="mf-dot" cx="191.3" cy="135.9" r="2"/>
<line class="mf-edge" x1="200" y1="260.8" x2="201.9" y2="265.8"/>
<line class="mf-edge" x1="248.5" y1="102.1" x2="244.8" y2="104.6"/>
<circle class="mf-dot" cx="194.2" cy="256.3" r="2"/>
<line class="mf-edge" x1="198.3" y1="255.6" x2="200" y2="260.8"/>
<line class="mf-edge" x1="244.8" y1="104.6" x2="241.2" y2="107.4"/>
<circle class="mf-dot" cx="201.2" cy="139.9" r="2"/>
<circle class="mf-dot" cx="185.1" cy="212.2" r="2"/>
<line class="mf-edge" x1="241.2" y1="107.4" x2="237.6" y2="110.4"/>
<line class="mf-edge" x1="196.8" y1="250.3" x2="198.3" y2="255.6"/>
<circle class="mf-dot" cx="197.9" cy="142.4" r="2"/>
<line class="mf-edge" x1="237.6" y1="110.4" x2="234.1" y2="113.6"/>
<line class="mf-edge" x1="195.6" y1="244.9" x2="196.8" y2="250.3"/>
<circle class="mf-dot" cx="178.6" cy="201.3" r="2"/>
<line class="mf-edge" x1="234.1" y1="113.6" x2="230.7" y2="117"/>
<circle class="mf-dot" cx="233.1" cy="110.7" r="2"/>
<line class="mf-edge" x1="194.6" y1="239.5" x2="195.6" y2="244.9"/>
<circle class="mf-dot" cx="184.6" cy="214" r="2"/>
<line class="mf-edge" x1="230.7" y1="117" x2="227.4" y2="120.6"/>
<line class="mf-edge" x1="193.8" y1="233.9" x2="194.6" y2="239.5"/>
<circle class="mf-dot" cx="206.9" cy="140.4" r="2"/>
<line class="mf-edge" x1="227.4" y1="120.6" x2="224.2" y2="124.5"/>
<line class="mf-edge" x1="193.2" y1="228.3" x2="193.8" y2="233.9"/>
<line class="mf-edge" x1="224.2" y1="124.5" x2="221.1" y2="128.5"/>
<line class="mf-edge" x1="192.9" y1="222.6" x2="193.2" y2="228.3"/>
<line class="mf-edge" x1="221.1" y1="128.5" x2="218.1" y2="132.7"/>
<circle class="mf-dot" cx="187.3" cy="179.3" r="2"/>
<line class="mf-edge" x1="192.7" y1="216.9" x2="192.9" y2="222.6"/>
<line class="mf-edge" x1="218.1" y1="132.7" x2="215.2" y2="137.1"/>
<line class="mf-edge" x1="192.8" y1="211.2" x2="192.7" y2="216.9"/>
<line class="mf-edge" x1="215.2" y1="137.1" x2="212.5" y2="141.7"/>
<line class="mf-edge" x1="193.1" y1="205.5" x2="192.8" y2="211.2"/>
<line class="mf-edge" x1="212.5" y1="141.7" x2="209.9" y2="146.4"/>
<line class="mf-edge" x1="193.7" y1="199.8" x2="193.1" y2="205.5"/>
<line class="mf-edge" x1="209.9" y1="146.4" x2="207.5" y2="151.2"/>
<line class="mf-edge" x1="194.4" y1="194.1" x2="193.7" y2="199.8"/>
<line class="mf-edge" x1="207.5" y1="151.2" x2="205.2" y2="156.2"/>
<line class="mf-edge" x1="195.4" y1="188.5" x2="194.4" y2="194.1"/>
<line class="mf-edge" x1="205.2" y1="156.2" x2="203.1" y2="161.4"/>
<line class="mf-edge" x1="196.5" y1="182.9" x2="195.4" y2="188.5"/>
<line class="mf-edge" x1="203.1" y1="161.4" x2="201.2" y2="166.6"/>
<line class="mf-edge" x1="197.9" y1="177.4" x2="196.5" y2="182.9"/>
<line class="mf-edge" x1="201.2" y1="166.6" x2="199.5" y2="172"/>
<line class="mf-edge" x1="199.5" y1="172" x2="197.9" y2="177.4"/>
<text class="mf-label" x="155.8" y="226.8">P</text><text class="mf-label" x="192.3" y="194.5">E</text><text class="mf-label" x="174.4" y="137">M</text>
<g class="mf-legend"><line class="mf-euclid" x1="452" y1="130" x2="486" y2="130"/><text x="494" y="134">straight line: E is P’s nearest neighbour</text><path class="mf-geo" d="M452 156C464 146,474 166,486 156"/><text x="494" y="160">along the sheet: M is, and E is far away</text><rect class="mf-sheet" x="452" y="175" width="34" height="12"/><text x="494" y="186">the manifold the samples concentrate on</text></g>
</svg>
<figcaption>Two ways to be near. Samples scatter along a curved structure — the manifold — that fills only a sliver of the space they live in. Across the fold, E is P's closest point in a straight line; along the data it is a full turn away, and M is the neighbour. Nearest-neighbour graphs measure the second kind of distance.</figcaption>
</figure>

For microbiomes the geodesic notion of distance is also the biologically
plausible one. A community of microbes can't be perturbed arbitrarily; the
abundances can only change in ways that leave a community stable enough to
exist. Take a real sample and inflate one pathogen's count by an arbitrary
amount, and you have a point that exists in $\mathbb{R}^{26{,}726}$ and nowhere in
nature. Euclidean distance treats that point as a near neighbour. Distance
along the cloud of real samples does not, because no path of real
communities leads there.

## Experimental setup

The data is the [American Gut Project](https://doi.org/10.1128/mSystems.00031-18):
crowd-sourced, about 19,000 samples and 335,000 distinct ASVs, reduced
after filtering rare sequences and shallow samples to a matrix of 18,480
samples by 26,726 ASVs. Alongside the counts, participants filled in a long
survey — diet, allergies, diseases, exercise.

How do you score an embedding? [Tataru and David (2020)](https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1007859),
who first applied GloVe to this data, proposed a proxy: train a classifier
to predict inflammatory bowel disease from the embedded data, and treat its
performance as the information the embedding kept. The raw data sets the
"nothing lost" baseline. IBD is a good choice because it is rare — 856
diagnosed participants against 5,018 self-reported healthy — so retaining
it means retaining a small effect with real meaning, which is what one
wants an embedding to do. Their finding: random forests on GloVe
embeddings matched the raw data (AUC 0.81 against 0.79), while PCA with 100
components trailed both (0.77). GloVe with a two-hundredth of the variables
had lost nothing.

## Replicate before you believe

Their numbers came from one embedding, fitted on one random draw of the
training data. Embeddings change with the data they are fitted on, and
nothing in the original setup says by how much. So the first thing we did
was run the whole experiment 27 times — new split, new embedding, new
forest each time — and drop the 13 dietary variables that had gone into
the original classifiers, so that whatever is left can be traced to the
microbes and not to what people said they eat.

<figure class="mb__figure">
<svg class="mb-fig" viewBox="0 0 672 300" role="img" aria-labelledby="mb-b-t mb-b-d">
<title id="mb-b-t">IBD prediction performance over 27 replications</title>
<desc id="mb-b-d">Two panels of box plots, AUC and F1, each for random forests trained on raw data, GloVe embeddings and PCA embeddings. On AUC the raw data has the highest median and the narrowest box, GloVe is close behind with a wider spread, PCA is clearly lower. On F1 GloVe and PCA have similar medians above the raw data, and the PCA box is by far the widest.</desc>
<text class="mb-title" x="185" y="22">AUC</text>
<g class="mb-axis"><line x1="60" y1="40" x2="60" y2="248"/><line x1="60" y1="248" x2="310" y2="248"/></g>
<line class="mb-whisker" x1="101.7" y1="54.9" x2="101.7" y2="74.3"/>
<line class="mb-whisker" x1="101.7" y1="92.2" x2="101.7" y2="110.7"/>
<line class="mb-whisker" x1="93.7" y1="54.9" x2="109.7" y2="54.9"/>
<line class="mb-whisker" x1="93.7" y1="110.7" x2="109.7" y2="110.7"/>
<rect class="mb-box" x="81.7" y="74.3" width="40" height="18"/>
<line class="mb-median" x1="81.7" y1="80.6" x2="121.7" y2="80.6"/>
<circle class="mb-flier" cx="101.7" cy="127.7" r="3"/>
<circle class="mb-flier" cx="101.7" cy="130.7" r="3"/>
<line class="mb-whisker" x1="185" y1="52.8" x2="185" y2="70.6"/>
<line class="mb-whisker" x1="185" y1="104.6" x2="185" y2="143.6"/>
<line class="mb-whisker" x1="177" y1="52.8" x2="193" y2="52.8"/>
<line class="mb-whisker" x1="177" y1="143.6" x2="193" y2="143.6"/>
<rect class="mb-box" x="165" y="70.6" width="40" height="34"/>
<line class="mb-median" x1="165" y1="91.6" x2="205" y2="91.6"/>
<circle class="mb-flier" cx="185" cy="165.7" r="3"/>
<line class="mb-whisker" x1="268.3" y1="88.8" x2="268.3" y2="123.7"/>
<line class="mb-whisker" x1="268.3" y1="157.2" x2="268.3" y2="181"/>
<line class="mb-whisker" x1="260.3" y1="88.8" x2="276.3" y2="88.8"/>
<line class="mb-whisker" x1="260.3" y1="181" x2="276.3" y2="181"/>
<rect class="mb-box" x="248.3" y="123.7" width="40" height="33.5"/>
<line class="mb-median" x1="248.3" y1="132.4" x2="288.3" y2="132.4"/>
<circle class="mb-flier" cx="268.3" cy="218.9" r="3"/>
<g class="mb-ticks"><line x1="56" y1="248" x2="60" y2="248"/><text class="mb-tick mb-tick--y" x="53" y="251.5">0.5</text><line x1="56" y1="178.7" x2="60" y2="178.7"/><text class="mb-tick mb-tick--y" x="53" y="182.2">0.6</text><line x1="56" y1="109.3" x2="60" y2="109.3"/><text class="mb-tick mb-tick--y" x="53" y="112.8">0.7</text><line x1="56" y1="40" x2="60" y2="40"/><text class="mb-tick mb-tick--y" x="53" y="43.5">0.8</text><text class="mb-cat" x="101.7" y="266">raw data</text><text class="mb-cat" x="185" y="266">GloVe</text><text class="mb-cat" x="268.3" y="266">PCA</text></g>
<text class="mb-title" x="531" y="22">F₁</text>
<g class="mb-axis"><line x1="406" y1="40" x2="406" y2="248"/><line x1="406" y1="248" x2="656" y2="248"/></g>
<line class="mb-whisker" x1="447.7" y1="132.2" x2="447.7" y2="165.4"/>
<line class="mb-whisker" x1="447.7" y1="199.4" x2="447.7" y2="228.2"/>
<line class="mb-whisker" x1="439.7" y1="132.2" x2="455.7" y2="132.2"/>
<line class="mb-whisker" x1="439.7" y1="228.2" x2="455.7" y2="228.2"/>
<rect class="mb-box" x="427.7" y="165.4" width="40" height="34.1"/>
<line class="mb-median" x1="427.7" y1="178.8" x2="467.7" y2="178.8"/>
<line class="mb-whisker" x1="531" y1="109.4" x2="531" y2="140.3"/>
<line class="mb-whisker" x1="531" y1="171.5" x2="531" y2="200.3"/>
<line class="mb-whisker" x1="523" y1="109.4" x2="539" y2="109.4"/>
<line class="mb-whisker" x1="523" y1="200.3" x2="539" y2="200.3"/>
<rect class="mb-box" x="511" y="140.3" width="40" height="31.1"/>
<line class="mb-median" x1="511" y1="157.5" x2="551" y2="157.5"/>
<line class="mb-whisker" x1="614.3" y1="59.4" x2="614.3" y2="130.7"/>
<line class="mb-whisker" x1="614.3" y1="186.2" x2="614.3" y2="217.3"/>
<line class="mb-whisker" x1="606.3" y1="59.4" x2="622.3" y2="59.4"/>
<line class="mb-whisker" x1="606.3" y1="217.3" x2="622.3" y2="217.3"/>
<rect class="mb-box" x="594.3" y="130.7" width="40" height="55.5"/>
<line class="mb-median" x1="594.3" y1="157.2" x2="634.3" y2="157.2"/>
<g class="mb-ticks"><line x1="402" y1="248" x2="406" y2="248"/><text class="mb-tick mb-tick--y" x="399" y="251.5">0.1</text><line x1="402" y1="188.6" x2="406" y2="188.6"/><text class="mb-tick mb-tick--y" x="399" y="192.1">0.2</text><line x1="402" y1="129.1" x2="406" y2="129.1"/><text class="mb-tick mb-tick--y" x="399" y="132.6">0.3</text><line x1="402" y1="69.7" x2="406" y2="69.7"/><text class="mb-tick mb-tick--y" x="399" y="73.2">0.4</text><text class="mb-cat" x="447.7" y="266">raw data</text><text class="mb-cat" x="531" y="266">GloVe</text><text class="mb-cat" x="614.3" y="266">PCA</text></g>
</svg>
<figcaption>Random forests predicting IBD from three inputs, 27 replications each, no survey variables. Boxes span the middle half of the runs, the line is the median, whiskers the range without outliers. On AUC the raw data leads and varies least; on F₁, which weights the rare class, GloVe edges ahead of it. PCA is worst on AUC and by far the least stable on F₁.</figcaption>
</figure>

Two things fall out. The ranking survives — PCA is last — but the headline
does not: on AUC the raw data now beats GloVe, by about two points in the
median and with a visibly tighter spread. The original result was one
draw that happened to favour GloVe. And the dietary variables had been
doing real work: without them the AUCs drop by five to seven points,
and GloVe's advantage over the raw data goes with them. On F₁, which
rewards catching the rare positives, GloVe does edge ahead of the raw
data — so the honest summary is that GloVe keeps most of the IBD signal,
not all of it, and keeps it less reliably than the data it was fitted to.

## Why PCA loses

Ranking methods is the easy part. Our actual question was *why* the
standard one loses so much, and the answer is in the variances.

For the raw-data forests and the PCA forests separately, we listed the
microbes that mattered most for the prediction. The two lists barely
overlap. Three ASVs are strongly discriminative on their own — all three markedly
more common in sick hosts — and the raw-data forests lean on them. The PCA
forests use none of the three. They can't: those ASVs have small loadings on every principal component,
because their variance across samples is small next to a few very loud
microbes. The ASVs PCA *does* rely on have a median variance around
200 × 10³ — twenty times that of the ones the raw data uses — and none
below 100 × 10³.

<figure class="mb__figure">
<svg class="mb-fig" viewBox="0 0 672 320" role="img" aria-labelledby="mb-a-t mb-a-d">
<title id="mb-a-t">Cumulative distribution of ASV abundance variances</title>
<desc id="mb-a-d">An S-shaped cumulative curve on a logarithmic variance axis from 0.01 to ten million. It reaches 92 percent at a variance of 100 and is flat well before 100,000, where a shaded band marks the region containing every ASV the PCA model relied on.</desc>
<defs><marker id="mb-arrow" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path class="mb-arrowhead" d="M0 0.5L7.5 4L0 7.5Z"/></marker></defs>
<rect class="mb-band" x="494.6" y="34" width="153.4" height="228"/>
<g class="mb-axis"><line x1="58" y1="262" x2="648" y2="262"/><line x1="58" y1="34" x2="58" y2="262"/></g>
<g class="mb-ticks"><line x1="81.6" y1="262" x2="81.6" y2="266"/><text class="mb-tick" x="81.6" y="278">0.01</text><line x1="140.6" y1="262" x2="140.6" y2="266"/><text class="mb-tick" x="140.6" y="278">0.1</text><line x1="199.6" y1="262" x2="199.6" y2="266"/><text class="mb-tick" x="199.6" y="278">1</text><line x1="258.6" y1="262" x2="258.6" y2="266"/><text class="mb-tick" x="258.6" y="278">10</text><line x1="317.6" y1="262" x2="317.6" y2="266"/><text class="mb-tick" x="317.6" y="278">10²</text><line x1="376.6" y1="262" x2="376.6" y2="266"/><text class="mb-tick" x="376.6" y="278">10³</text><line x1="435.6" y1="262" x2="435.6" y2="266"/><text class="mb-tick" x="435.6" y="278">10⁴</text><line x1="494.6" y1="262" x2="494.6" y2="266"/><text class="mb-tick" x="494.6" y="278">10⁵</text><line x1="553.6" y1="262" x2="553.6" y2="266"/><text class="mb-tick" x="553.6" y="278">10⁶</text><line x1="612.6" y1="262" x2="612.6" y2="266"/><text class="mb-tick" x="612.6" y="278">10⁷</text><line x1="54" y1="262" x2="58" y2="262"/><text class="mb-tick mb-tick--y" x="51" y="265.5">0</text><line x1="54" y1="205" x2="58" y2="205"/><text class="mb-tick mb-tick--y" x="51" y="208.5">0.25</text><line x1="54" y1="148" x2="58" y2="148"/><text class="mb-tick mb-tick--y" x="51" y="151.5">0.5</text><line x1="54" y1="91" x2="58" y2="91"/><text class="mb-tick mb-tick--y" x="51" y="94.5">0.75</text><line x1="54" y1="34" x2="58" y2="34"/><text class="mb-tick mb-tick--y" x="51" y="37.5">1</text></g>
<text class="mb-axis-title" x="353" y="308">variance of an ASV's abundance across samples</text>
<text class="mb-axis-title" x="16" y="148" transform="rotate(-90 16 148)">share of all ASVs</text>
<line class="mb-guide" x1="317.6" y1="52.7" x2="317.6" y2="262"/>
<line class="mb-guide" x1="58" y1="52.7" x2="317.6" y2="52.7"/>
<circle class="mb-dot" cx="317.6" cy="52.7" r="3.5"/>
<text class="mb-note" x="327.6" y="148">92 % of all ASVs have a</text>
<text class="mb-note" x="327.6" y="162">variance below 100</text>
<text class="mb-note mb-note--band" x="642" y="50">variance above 10⁵:</text>
<text class="mb-note mb-note--band" x="642" y="64">every ASV the PCA model relied on</text>
<text class="mb-note mb-note--band" x="642" y="78">— 0.2 % of all ASVs</text>
<path class="mb-curve" d="M65.6 261.8L81.7 261.7L87.1 261.7L88.7 261.6L92.1 261.6L93.5 261.5L95.5 261.5L96.4 261.3L97.4 261.2L98.6 261.1L99.6 260.9L100.7 260.7L101.6 260.5L102.6 260.4L103.5 260.1L104.3 259.9L105.3 259.7L106.3 259.4L107.2 259.2L108 258.9L108.8 258.6L109.7 258.3L110.4 258L111.2 257.7L112 257.4L112.7 257L113.4 256.6L114.2 256.4L114.8 256L115.6 255.6L116.3 255.3L116.9 254.9L117.6 254.5L118.2 254L118.9 253.6L119.4 253.1L119.9 252.6L120.6 252.2L121.1 251.6L121.6 251.1L122.2 250.5L122.8 250L123.4 249.5L123.9 249L124.4 248.5L125 248L125.5 247.5L126 246.9L126.6 246.3L127.1 245.8L127.6 245.3L128.1 244.7L128.6 244.1L129.2 243.6L129.7 243L130.1 242.4L130.6 241.8L131.1 241.1L131.6 240.6L132.1 239.9L132.6 239.4L133 238.7L133.5 238.1L133.9 237.4L134.4 236.9L134.9 236.3L135.4 235.7L135.9 235.1L136.4 234.5L136.8 233.9L137.2 233.2L137.6 232.6L138 231.8L138.4 231.2L138.8 230.6L139.2 229.9L139.6 229.3L140.1 228.7L140.5 228L140.9 227.3L141.2 226.6L141.6 226L142 225.3L142.4 224.6L142.9 223.9L143.3 223.2L143.7 222.4L144.1 221.8L144.5 221.2L144.8 220.5L145.2 219.8L145.6 219.2L145.9 218.5L146.3 217.9L146.7 217.2L147.1 216.5L147.5 215.8L147.9 215.1L148.3 214.5L148.8 213.8L149.1 213.2L149.5 212.5L149.9 211.8L150.3 211L150.7 210.2L151 209.6L151.4 208.9L151.8 208.2L152.2 207.5L152.6 206.7L152.9 206L153.3 205.2L153.7 204.5L154.1 203.9L154.4 203.1L154.8 202.3L155.2 201.6L155.6 200.9L155.9 200.2L156.3 199.4L156.7 198.8L157 198.1L157.4 197.3L157.8 196.6L158.1 195.9L158.5 195.2L158.8 194.5L159.2 193.9L159.6 193.2L160 192.5L160.3 191.7L160.7 191L161.2 190.3L161.6 189.7L162 188.9L162.3 188.2L162.7 187.5L163 186.8L163.4 186.1L163.8 185.3L164.2 184.6L164.5 184L164.9 183.2L165.3 182.5L165.7 181.8L166.1 181.2L166.5 180.4L166.9 179.7L167.3 179.1L167.7 178.3L168 177.6L168.4 177L168.8 176.3L169.2 175.6L169.6 175L170 174.2L170.4 173.6L170.8 172.8L171.2 172.1L171.5 171.4L172 170.7L172.3 170L172.7 169.4L173.1 168.7L173.4 168.1L173.8 167.4L174.2 166.8L174.6 166.1L174.9 165.4L175.4 164.6L175.7 163.9L176.2 163.3L176.5 162.6L177 161.9L177.4 161.3L177.8 160.6L178.2 160L178.6 159.4L179 158.8L179.4 158.1L179.9 157.5L180.2 156.9L180.6 156.2L181 155.6L181.4 154.8L181.9 154.2L182.2 153.4L182.6 152.8L183 152.1L183.4 151.6L183.9 150.9L184.2 150.2L184.6 149.6L185.1 148.9L185.5 148.3L185.9 147.5L186.4 146.9L186.8 146.3L187.3 145.7L187.7 145.1L188.1 144.4L188.5 143.7L188.9 143.1L189.3 142.4L189.7 141.8L190.2 141.2L190.6 140.6L191 140L191.5 139.4L191.9 138.7L192.3 138.1L192.7 137.5L193.1 136.9L193.6 136.2L194.1 135.6L194.5 135L195 134.3L195.3 133.6L195.8 132.9L196.2 132.3L196.6 131.7L197.1 131.1L197.6 130.4L198 129.9L198.5 129.2L198.9 128.6L199.4 127.9L199.8 127.3L200.3 126.7L200.7 126.1L201.2 125.4L201.6 124.8L202.1 124.3L202.5 123.6L203 123L203.3 122.3L203.7 121.7L204.1 121.1L204.6 120.5L205.1 120L205.6 119.4L206.1 118.9L206.7 118.2L207.1 117.7L207.6 117.2L208.1 116.6L208.6 116L209 115.5L209.5 115L210.1 114.5L210.6 113.9L211.1 113.4L211.6 112.9L212.2 112.4L212.7 111.8L213.2 111.3L213.7 110.7L214.3 110.2L214.8 109.7L215.3 109.1L215.8 108.6L216.3 108L216.8 107.5L217.3 107L217.8 106.4L218.3 105.9L218.8 105.4L219.3 104.8L219.8 104.3L220.3 103.7L220.9 103.2L221.4 102.7L222 102.2L222.5 101.7L223 101.2L223.5 100.6L224.1 100.2L224.6 99.6L225.2 99.2L225.9 98.8L226.4 98.3L226.9 97.7L227.5 97.2L228.1 96.8L228.7 96.4L229.2 95.8L229.8 95.4L230.4 94.9L231 94.4L231.6 94L232.1 93.5L232.7 93L233.3 92.5L233.8 92L234.4 91.6L235.1 91.2L235.7 90.7L236.4 90.3L237 89.9L237.6 89.4L238.2 88.9L238.8 88.5L239.4 88L240 87.6L240.7 87.1L241.3 86.7L241.8 86.2L242.4 85.8L243.1 85.4L243.7 84.9L244.4 84.4L245 84L245.6 83.6L246.2 83.1L246.9 82.7L247.6 82.3L248.2 81.8L248.8 81.4L249.4 80.9L250 80.4L250.7 80L251.3 79.6L252 79.2L252.6 78.8L253.4 78.4L254.1 78L254.8 77.6L255.5 77.3L256.1 76.9L256.8 76.5L257.4 76L258.1 75.7L258.8 75.3L259.5 74.9L260.2 74.5L260.8 74.1L261.6 73.7L262.3 73.4L262.9 73L263.6 72.6L264.4 72.2L265.1 71.8L265.8 71.5L266.4 71.1L267.2 70.8L267.8 70.4L268.5 70L269.3 69.7L270 69.3L270.7 69L271.5 68.7L272.2 68.3L272.9 68L273.7 67.7L274.3 67.3L275 67L275.8 66.7L276.5 66.3L277.4 66L278.1 65.7L278.8 65.4L279.5 65.1L280.3 64.8L281 64.5L281.7 64.2L282.6 63.9L283.3 63.5L283.9 63.2L284.9 62.9L285.6 62.6L286.5 62.3L287.4 62L288.2 61.8L288.9 61.5L289.8 61.2L290.7 60.9L291.7 60.6L292.5 60.3L293.4 60L294.3 59.7L295.1 59.4L295.9 59.2L296.7 58.9L297.4 58.6L298.2 58.4L299.1 58.1L299.9 57.8L300.8 57.6L301.5 57.3L302.3 57.1L303.1 56.8L303.9 56.6L304.8 56.3L305.7 56.1L306.8 56L307.5 55.7L308.3 55.3L309.1 55.1L309.9 54.8L310.8 54.6L311.8 54.3L312.6 54.1L313.7 53.8L314.6 53.5L315.4 53.3L316.4 53L317.2 52.8L318.2 52.6L319 52.4L319.8 52.1L320.7 51.9L321.7 51.7L322.6 51.5L323.6 51.2L324.6 51L325.4 50.8L326.4 50.6L327.4 50.3L328.5 50.1L329.2 49.9L330.1 49.7L331.1 49.5L332.5 49.3L333.5 49.1L334.4 48.9L335.4 48.7L336.3 48.4L337.1 48.2L338 48L338.9 47.8L339.9 47.5L341.1 47.4L342.1 47.2L342.9 47L343.8 46.8L344.7 46.7L345.7 46.5L346.5 46.3L347.4 46.2L348.4 46L349.4 45.9L350.4 45.7L351.5 45.5L352.3 45.3L353.2 45.1L354.1 44.9L355.3 44.7L356.1 44.6L357.3 44.4L358.6 44.2L359.5 44.1L360.3 43.9L361.9 43.8L363.4 43.7L364.4 43.6L365.5 43.4L367.1 43.3L368.3 43.1L369.4 43L370.3 42.8L371.4 42.6L372.5 42.5L373.6 42.3L374.7 42.2L375.8 42L376.8 41.9L377.7 41.7L379 41.6L380 41.5L381.1 41.4L382.1 41.3L383.4 41.1L384.2 40.9L385.2 40.8L386.2 40.7L387.2 40.5L388.6 40.5L389.6 40.3L391.1 40.2L392.4 40L393.5 39.9L394.4 39.7L395.5 39.6L396.9 39.5L398.6 39.3L400 39.2L400.9 39.1L402.8 39L404.2 38.9L405.2 38.8L406.3 38.7L408 38.6L409.1 38.5L410.2 38.4L411.3 38.3L412.3 38.2L413.3 38.1L414.7 38L416.1 37.9L417 37.8L418.2 37.8L419.4 37.7L421.3 37.6L423.1 37.5L424 37.5L425.7 37.4L427.4 37.3L429 37.1L430 37L431.7 37L433.6 36.8L435.3 36.7L437.1 36.6L438.4 36.5L439.6 36.4L440.6 36.4L442.3 36.3L443.8 36.2L445.2 36.1L447.3 36.1L449.4 35.9L450.3 35.9L452.2 35.8L454.5 35.7L455.5 35.7L456.5 35.6L457.6 35.6L459.6 35.5L461.8 35.4L463.4 35.3L465.7 35.3L468.3 35.3L469.6 35.2L471.6 35.1L473.3 35.1L474.6 35L475.7 35L477.4 34.9L480.1 34.9L481.9 34.8L484.6 34.8L486.2 34.7L489.8 34.7L491.5 34.6L494.1 34.5L496.5 34.5L497.9 34.5L502 34.4L507 34.3L508 34.3L511.5 34.3L517.1 34.2L522.4 34.1L528.2 34.1L534.5 34L538.8 34L543.4 33.9L555.9 33.9L575.8 33.8L644 33.8L644 33.8"/>
</svg>
<figcaption>The distribution of abundance variances over all 26,726 ASVs, on a logarithmic axis. Nine in ten ASVs have a variance under 100; the shaded band, above 10⁵, holds every ASV the PCA forests relied on — a fifth of one percent of them.</figcaption>
</figure>

Put the two facts together and PCA's failure is not a mystery. A space of
100 principal components, on this data, is a description of the loudest
percent or so of microbes. Everything the rest know about the host is
discarded before any classifier sees it — not because that information
was small, but because it was quiet.

Plotting the coordinate systems themselves shows what GloVe does instead.
Each of its 100 axes is a vector over the 26,726 ASVs; clustered, they
fall into four groups of axes pointing into similar regions of the input
space, with the axes within a group differing in nuance. PCA's axes can't
do that, because they are orthogonal by construction — and the picture of
them is a handful of dark columns on the left, the loud ASVs, and near
silence everywhere else. GloVe outperforming PCA then says something about
the data: the samples concentrate around a few regions of the input space,
and an embedding that is allowed to point its axes there keeps more than
one that must spread them out evenly.

## Distances along the manifold

If the shape of the point cloud is what matters, an embedding that measures
distance along it should do better still. We checked with a separate,
smaller experiment: fecal samples only — about 9,000, with 5.5 % positive
— five-fold cross-validation, and a deliberately weak classifier on the
UMAP side. Random forests on GloVe embeddings, tuned, against
$k$-nearest-neighbours on UMAP distances, so that whatever UMAP scores
comes from the distances alone:

| | GloVe + random forest | UMAP + $k$-NN |
|---|---|---|
| F₁ | 0.20 ± 0.11 | 0.34 ± 0.14 |
| precision | 0.26 ± 0.12 | 0.28 ± 0.10 |

*Mean and standard deviation over five folds. Scores are lower than above throughout: this subset is a harder problem.*

The nearest-neighbour rule on manifold distances beats the stronger model
on the linear embedding, and $k$-NN on GloVe distances does worse than
either — distances in GloVe space carry less meaning than distances along
the data. It is one disease, one body site, one data set — preliminary, no
more.

## In short

- On this data, PCA is the wrong tool, and the reason is structural: a
  handful of microbes carry almost all the variance, so 100 components
  describe the loud few and discard the quiet many — including the three
  ASVs most predictive of IBD.
- GloVe keeps most of that signal, but the published claim that it keeps
  *all* of it was one lucky split. Over 27 replications the raw data wins on
  AUC and is more stable; GloVe wins only on F₁.
- Distances along the data manifold, with no axes chosen at all, retained
  the most IBD signal of anything we tried — on a preliminary experiment
  that wants repeating elsewhere.
- What we left unresolved, and worth saying: the importance thresholds
  were heuristic, PCA was run on untransformed counts (a log transform
  might narrow the gap), and "predicts IBD" is one proxy for "kept the
  information," not a definition of it.
