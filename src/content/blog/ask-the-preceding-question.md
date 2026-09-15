---
title: Ask the preceding question
date: 2026-09-15
summary: >-
  Most questions we put to a model already contain a solution. Stating the
  problem instead costs one sentence, and lets the model judge the solution too.
tags: [llms, principles]
track: business
mark: fork
kind: Quick tip
---

Most questions we put to a model already contain an answer — not to the
question we are asking, but to the one before it. We come with a problem, work
out a solution in our head, and ask the model to carry out the solution. The
assumption rides along unexamined, and the model, asked about the solution,
works on the solution.

Sometimes it is better to simply state the problem — to ask the preceding
question — and let the model work out whether the solution we had in mind is
actually the best one. Often it is, and the cost was one sentence. Sometimes
it is not, and then the question we were about to ask was the wrong one to be
asking.

<figure class="pq__figure">
<svg class="pq-fig" viewBox="0 0 672 176" role="img" aria-labelledby="pq-t pq-d">
<title id="pq-t">Where the question is usually asked, and where it could be</title>
<desc id="pq-d">Three boxes in a row — the problem, the solution you worked out, the question you ask — with arrows from each to the next and from the last to a circle marked model. A dashed arrow runs from the first box, the problem, straight to the model, labelled the preceding question. The solid route through all three boxes is labelled what usually happens.</desc>
<defs><marker id="pq-head" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="pq-head" d="M0 0.5 L8 4 L0 7.5 Z"/></marker></defs>
<rect class="pq-box" x="24" y="26" width="150" height="44" rx="3"/>
<text class="pq-boxlabel" x="99" y="52" text-anchor="middle">the problem</text>
<rect class="pq-box" x="214" y="26" width="150" height="44" rx="3"/>
<text class="pq-boxlabel" x="289" y="45" text-anchor="middle">the solution you</text>
<text class="pq-boxlabel" x="289" y="59" text-anchor="middle">worked out</text>
<rect class="pq-box" x="404" y="26" width="150" height="44" rx="3"/>
<text class="pq-boxlabel" x="479" y="45" text-anchor="middle">the question</text>
<text class="pq-boxlabel" x="479" y="59" text-anchor="middle">you ask</text>
<line class="pq-arrow" x1="177" y1="48" x2="211" y2="48" marker-end="url(#pq-head)"/>
<line class="pq-arrow" x1="367" y1="48" x2="401" y2="48" marker-end="url(#pq-head)"/>
<line class="pq-arrow" x1="557" y1="48" x2="591" y2="48" marker-end="url(#pq-head)"/>
<circle class="pq-model" cx="620" cy="48" r="26"/>
<text class="pq-boxlabel" x="620" y="52" text-anchor="middle">model</text>
<path class="pq-skip" d="M99 73 C99 128,620 128,620 77" marker-end="url(#pq-head)"/>
<text class="pq-route" x="289" y="17" text-anchor="middle">what usually happens</text>
<text class="pq-route pq-route--skip" x="360" y="126" text-anchor="middle">the preceding question</text>
</svg>
<figcaption>The solid route is the one we take without noticing: the problem is solved in our head, and only the last step reaches the model. The dashed one costs a sentence.</figcaption>
</figure>

The hard part is that the solution does not feel like an assumption; it feels
like the task, and nothing in the question reminds you to step back. I know
this sounds abstract, so let's look at an example — the animation at the top
of [another post on this site](/writing/agent-leap/), and how it came about.

**The problem.** I wanted an illustration of how much larger the space of
things I can build became once I started working with coding agents —
something that shows the magnitude rather than claims it.

**The solution I had in mind.** Two panels, side by side. On the left,
before: a tiny figure on a bicycle crossing a small patch of hills, the work
I could reach on my own. On the right, after: the same figure in a
starfighter among planets, the work I can reach with agents.

**The question I asked.** Build me those two panels. So we started
implementing them.

**What happened along the way.** It became clear that an animation would be
much better: one continuous camera move that starts on the hills at bicycle
scale, lifts off, and pulls back until that whole world is a speck among the
planets. That is the version on the site.

Had I said at the start what I actually wanted — a compelling illustration of
that difference — I think the animation would have been the first suggestion,
not something we arrived at halfway through building the wrong thing. I had
asked for my solution, and I got my solution.

People talk about unhobbling models: removing the limits that training left
in them. Asking the preceding question is the same move on our side of the
screen — unhobbling yourself. Often it is not the model that limits the
answer; it is the question we chose to ask because it already carries an assumption.
