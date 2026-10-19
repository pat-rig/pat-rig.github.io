---
title: Ask the preceding question
date: 2026-09-15
summary: >-
  Most questions we put to a model already contain a solution. Stating the
  problem instead costs one sentence, and lets the model judge the solution too.
tags: [llm-applications]
track: business
mark: fork
kind: Quick tip
---

When we ask a model for help, we often skip a step. We have a problem, solve
part of it in our head, and then ask the model only about what is left. The
model helps with what we asked. Whether the part we settled on our own was a
good idea, it cannot judge, because it never heard what problem we were trying
to solve.

The alternative is to start one step earlier and simply state the problem.
That is what I mean by asking the preceding question. Then the model can also
judge the solution we had in mind. Often it turns out to be a good one, and
all it cost was one sentence. Sometimes there is a better one, and we find out
before we have spent time on ours.

<figure class="pq__figure">
<svg class="pq-fig" viewBox="0 0 672 176" role="img" aria-labelledby="pq-t pq-d">
<title id="pq-t">Where the question is usually asked, and where it could be</title>
<desc id="pq-d">Three boxes in a row (the problem, the solution you worked out, the question you ask), with arrows from each to the next and from the last to a circle marked model. A dashed arrow runs from the first box, the problem, straight to the model, labelled the preceding question. The solid route through all three boxes is labelled what usually happens.</desc>
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
<figcaption>The solid route is the one we take without noticing: part of the problem is solved in our head, and only what is left reaches the model. The dashed one costs a sentence.</figcaption>
</figure>

Take a smaller decision: buying a lock for a bicycle worth stealing. There are
three ways I could bring a model into it, and each leaves a different amount of
the work with me.

<figure class="lk__figure">
<p class="lk__problem">The problem: a bike worth stealing, and no lock for it.</p>
<div class="lk">
<div class="lk__rung">
<p class="lk__n">Approach 1</p>
<div class="lk__body">
<p class="lk__kind">Ask about the product</p>
<p class="lk__q">“Which lock suits an expensive bike?”</p>
<ol class="lk__flow">
<li class="lk__step lk__step--ai">The model explains what to look for.</li>
<li class="lk__step">I search shops myself and pick a lock.</li>
<li class="lk__step">Then the same again for a mount.</li>
</ol>
</div>
</div>
<div class="lk__rung">
<p class="lk__n">Approach 2</p>
<div class="lk__body">
<p class="lk__kind">Send an agent for the lock</p>
<p class="lk__q">“Search second-hand marketplaces for U-locks at security level 15.”</p>
<ol class="lk__flow">
<li class="lk__step">I settle on a lock.</li>
<li class="lk__step lk__step--ai">An agent searches for offers.</li>
<li class="lk__step">I ask about mounts and compare them.</li>
<li class="lk__step lk__step--ai">An agent searches for one that fits.</li>
</ol>
</div>
</div>
<div class="lk__rung lk__rung--on">
<p class="lk__n">Approach 3</p>
<div class="lk__body">
<p class="lk__kind">Hand over the whole task</p>
<p class="lk__q">“I have this bike. Find a lock that suits it, including a mount that fits the frame. Stay inside my budget. Look for a second-hand one first, then for new ones on sale.”</p>
<ol class="lk__flow">
<li class="lk__step lk__step--ai">An agent finds the lock and the mount, within budget.</li>
<li class="lk__step">I check and buy.</li>
</ol>
</div>
</div>
</div>
<figcaption>One purchase, three ways to bring in a model. Filled dots are steps the model or an agent takes, open dots are mine. Only approach 3 leaves room for the parts I did not think to ask about.</figcaption>
</figure>

In approach 1, the model only gives advice. Finding and comparing actual locks
is still up to me. In approach 2, an agent does the searching, but only for
the lock I had already settled on before the model saw anything. The mount
then means going through the same loop again: asking about mounts, comparing
them, searching for one that fits. By then it is not clear whether the lock I
picked can be mounted on my bike’s frame, because the question never said
anything about the bike. On an e-bike, that can actually be a problem, since
mounting a lock is more constrained than on a regular bike. In approach 3, I
hand over the whole task. The mount is part of the answer from the start, and
I never had to know that mounting was a question.

Generally speaking, the hard part is noticing that we skipped a step at all.
Once we have picked a solution in our head, it no longer feels like a choice
we made. It just feels like the task, so it does not occur to us to mention
the problem behind it. Mentioning it anyway, *asking the preceding question*,
can sometimes lead to more creative solutions. The animation at the top of
[another post on this site](/writing/agent-leap/) is a case where I should have
asked the preceding question.

I wanted to show how much more I can build since I started working with coding
agents. I had two panels in mind, before and after: a figure on a bicycle
among small hills, and the same figure in a starfighter among planets. That is
what I asked for, and we started building it. Halfway through, it became clear
that one continuous camera move, from the bicycle out to the planets, would
show the difference much better. Had I said at the start what I wanted to
show, I think the animation would have been the first suggestion.

People talk about unhobbling models: removing the limits that training left in
them. Asking the preceding question is the same move on our side of the
screen: unhobbling yourself. Often it is not the model that limits the answer;
it is the question we chose to ask because it already carries an assumption.
