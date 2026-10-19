---
title: What is good context?
date: 2026-10-19
summary: >-
  For a holiday, the relevant context is obvious: put all the documents in one
  folder. For most other questions you cannot tell in advance which fact will
  matter, so I tell the whole story in one conversation instead.
tags: [llm-applications]
track: business
mark: network
kind: Essay
---

We all know that giving the AI as much relevant information as possible for
the task at hand is crucial. Which raises a question I find surprisingly hard
to answer: what exactly is the relevant context for a given prompt, and how do
I make sure I have not left anything out?

The tricky part is that you usually don't notice when context is missing. The
model answers anyway, and the answer is not wrong. It is just the same answer
anyone else would get. What it could have told you with the full picture, you
simply never see.

A quick case to start with, which happened to us recently. We were already
standing in the bus on the tarmac, right in front of our plane, but they were
not letting us board, and nobody was telling us why. At some point we started
to worry that we might not make it onto the plane, and onto our holiday. All
the documents for the trip sat in a folder our agent could access, so I opened
the phone and told it, *I think we might not make our flight. Can you look for
alternative flights, check who we have to let know, and draft a message to the
car rental station that we won't make it in time?* A two-sentence prompt, and
it took care of a lot in that moment without needing much from us. In the end
we made the flight. But getting a plan B ready took almost no effort at that
point; without the folder, we would first have been digging out the details of
the car rental, looking up what the airline owes us in compensation, and so
on, before the model could do anything with them.

Here, it is clear what the relevant context is: everything about the trip —
the flights, the car rental, the holiday home, and so on. We put all of it in
the folder, and that is it. For many other tasks, it is much less clear what
belongs in there. So how do we proceed for those?

My answer, for anything non-trivial, is not to select it at all. I start the
conversation from zero, well before the question that is in my head right now,
and walk the model through the whole line of thought that leads into the
project. In essence, this is closely related to a principle I describe in a
separate post and call [asking the preceding
question](/writing/ask-the-preceding-question/).

Here is a longer example of what that looks like. Say we have just bought our
first home, and I am using a model to think through the decisions over the
coming weeks: layout, heating, windows, flooring, the kitchen, and so on.
Let's compare two approaches. In the first, it is one conversation running
from the day we signed the contract, each decision arriving as it comes up. In
the second, each decision is its own fresh question, the way I would normally
reach for a model mid-task.

<figure class="hc__figure">
<p class="hc__label">Illustrative example · invented for this post, not a transcript</p>
<div class="hc">
<div class="hc__col hc__col--l">
<p class="hc__col-title"><span class="hc__col-num">Approach 1</span>Start from zero</p>
<div class="hc__thread">
<div class="hc__msg hc__msg--me hc__msg--story">
<p>We just signed the contract on our first place — a house outside town. I’d like to go through the big decisions with you as they come up over the next few weeks: layout, heating, windows, flooring, the kitchen, that sort of thing. I’ll bring each one to you when it’s actually in front of us; flag anything I should be thinking about that I haven’t mentioned.</p>
</div>
<p class="hc__head">Layout</p>
<p class="hc__collapsed">… 6 messages: open kitchen, a study …</p>
<p class="hc__head">Heating</p>
<p class="hc__collapsed">… 9 messages: heat pump or gas …</p>
<div class="hc__msg hc__msg--me hc__msg--aside">
<p><span class="hc__ref">1</span>Oh — and we just found out we’re expecting a baby, due in the spring.</p>
</div>
<p class="hc__head">Windows</p>
<p class="hc__collapsed">… 5 messages: triple glazing …</p>
<div class="hc__msg hc__msg--me hc__msg--aside">
<p><span class="hc__ref">2</span>Also, if it’s not too impractical, we’d love to use natural materials where we can — real wood, that kind of thing.</p>
</div>
<p class="hc__head">Kitchen</p>
<p class="hc__collapsed">… 7 messages: layout, worktops …</p>
<div class="hc__msg hc__msg--me hc__msg--aside">
<p><span class="hc__ref">3</span>By the way, the construction costs are running higher than we planned.</p>
</div>
<p class="hc__head">Floor</p>
<div class="hc__msg hc__msg--me">
<p>Which floor should we go for in the living area?</p>
</div>
<div class="hc__msg hc__msg--ai">
<p>Worth weighing more than looks, with a baby arriving in the spring<span class="hc__ref">1</span> and the budget tighter than planned<span class="hc__ref">3</span>. Real wood fits the wish for natural materials<span class="hc__ref">2</span>, but solid boards are the priciest way to get there; engineered wood or a wood-look vinyl gets most of the warmth and softness for less, and holds up just as well to toys and spills. I’d put the saving toward a better finish in the living area — a matte, oiled surface that’s easy to keep clean once there’s a baby crawling around — and use the plainer option in rooms that see less wear, like the hallway or the guest room.</p>
</div>
</div>
</div>
<div class="hc__col hc__col--r">
<p class="hc__col-title"><span class="hc__col-num">Approach 2</span>Ask right away</p>
<div class="hc__chats">
<div class="hc__chat">
<p class="hc__chat-head">New chat · Layout</p>
<div class="hc__msg hc__msg--me"><p><span class="hc__more">[…]</span> Open kitchen or a separate one? <span class="hc__more">[…]</span></p></div>
</div>
<div class="hc__chat">
<p class="hc__chat-head">New chat · Heating</p>
<div class="hc__msg hc__msg--me"><p><span class="hc__more">[…]</span> Heat pump or gas for a house outside town? <span class="hc__more">[…]</span></p></div>
</div>
<div class="hc__chat">
<p class="hc__chat-head">New chat · Windows</p>
<div class="hc__msg hc__msg--me"><p><span class="hc__more">[…]</span> Is triple glazing worth it? <span class="hc__more">[…]</span></p></div>
</div>
<div class="hc__chat">
<p class="hc__chat-head">New chat · Kitchen</p>
<div class="hc__msg hc__msg--me"><p><span class="hc__more">[…]</span> Which worktop material holds up best? <span class="hc__more">[…]</span></p></div>
</div>
<div class="hc__chat">
<p class="hc__chat-head">New chat · Floor</p>
<div class="hc__msg hc__msg--me"><p><span class="hc__more">[…]</span> Which floor should we go for in the living area? <span class="hc__more">[…]</span></p></div>
<div class="hc__msg hc__msg--ai"><p>A few common options: engineered wood for a warm look with moderate upkeep, vinyl if budget and water-resistance matter most, tile for durability in wet areas, or laminate as the cheaper option that shows wear sooner. Pick based on budget, the room’s use, and how much maintenance you want.</p></div>
</div>
</div>
</div>
</div>
<figcaption>The same house topics, two ways. Approach 1: one conversation; a baby due in spring, a wish for real wood, and rising costs are each mentioned once, long before the floor comes up — then all three shape the answer, marked with matching numbers. Approach 2: each topic is its own new chat, with nothing to connect them.</figcaption>
</figure>

Asked on its own, the floor question gets the standard rundown: engineered
wood for a warm look, vinyl if budget and water-resistance matter most, tile
for durability, laminate as the cheap option — pick by budget and how the room
is used. Nothing in that is wrong for us. It just does not know who “us” is.

In the long conversation, three sentences from weeks earlier do the work. We
mentioned a baby due in the spring somewhere around the heating question,
because that was just on our minds that day, not because it seemed relevant to
flooring. We mentioned wanting natural materials around the windows question,
as a general wish, not yet a decision. Later, near the kitchen, we mentioned
that the build was running over budget — not a question, just something we
told it in passing. None of that looked like flooring information when we said
it. By the time the floor comes up, the model weighs real wood against cheaper
alternatives with both a crawling baby and a tighter budget in mind: it steers
us toward spending on the finish where the baby will actually be, and saving
with a plainer option in rooms that see less wear.

I would not have thought to put any of these sentences into a prompt about
floors. When we said them, they had nothing to do with flooring; they were
just on our minds at the time. And that is my answer to the title, as far as I
have one: I cannot make the list of relevant context, because I cannot tell in
advance which fact will matter for which question. The long conversation does
not need me to.

So I tell the whole story in one thread, instead of jumping straight to the
question I need answered right now. To me, this also simply feels more
natural. It feels like a conversation, not like an engineered prompt where I
think hard about whether I have put in everything relevant. That makes working
with the AI a bit more effortless, and the answers tend to fit our situation
instead of being the ones anyone would get.
