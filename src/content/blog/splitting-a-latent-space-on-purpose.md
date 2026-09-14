---
title: Splitting a latent space on purpose
date: 2021-06-28
summary: >-
  Trustworthiness again, but not in a classifier's output this time — in what
  a latent-variable model is built to represent in the first place, and a
  seminar project that split a VAE's latent code on purpose.
tags: [vae, variational-inference]
track: data-science
mark: contour
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
  url: /papers/csvae-counterfactual-recourse-2021.pdf
  mark: network
---

Another look at trustworthiness of Machine Learning models is through the lens of their internal representation of the data.
[We've written before](/writing/well-calibrated-predictors/) about
well-calibrated predictors — trustworthiness as a property of a classifier's
*output*. Here it's a property of the model's architecture: what a model is built
to represent, decided before it ever produces an output at all.

This post is a high-level motivation for probabilistic latent spaces: what they are, what
a model learns about them, and why you might want a say in how they are
structured. It sets the stage for a separate article that goes much deeper
into structuring latent spaces —
[A VAE loss that enforces statistical dependencies](/writing/vae-loss-statistical-dependencies/)
— including the derivations, and an original
contribution of mine. 

For now, we stay one abstraction level before the derivations and focus on the rationale behind explicitly structured latent spaces.
Find detailed explanations of the involved loss functions in my seminar write-up linked at the end of this article.

## Latent variables

For high-dimensional data we often assume that it can be described as a combination of a few lower-dimensional properties.
A portrait is a few million pixel values, but what actually differs
between two portraits is a short list: who it is, the pose, the lighting,
the expression, whether there are glasses. A voice recording is tens of
thousands of samples per second, and what matters in it is what was
said, who said it, and the room it was said in. In both cases the data is
high-dimensional and the description is not. The models below take that
assumption and build it into the architecture itself, so that what the
model holds internally *is* that short list.

Autoencoder models leverage this heuristic by compressing an input — an image, say — into a handful of
numbers, the latent code, and train a second network to reconstruct the
input from that code alone. If the reconstruction is good, the code is a
compact description of what the image contains. More broadly speaking, that is the premise of a
latent-variable model: assume the data was generated from some
lower-dimensional set of unobserved variables, and fit a network that
recovers them.

## What a variational autoencoder learns

Having a latent representation comes with a useful benefit: we can choose
points in the latent space and decode them back into the observable
space. For instance, we can compute the latent representation of an
image, edit it slightly, and decode the edited representation. What we
end up with is a new image that looks very similar to the old one but is
changed in some aspect.

A plain autoencoder gives no guarantee about what an edited point decodes
into. It maps each input to a single point in latent space, and nothing
keeps those points tidy. Encoded data tends to land in an irregular
cloud, and the decoder has no reason to produce anything sensible for a
point picked from one of its gaps.

<figure class="ls__figure">
<svg class="ls-fig" viewBox="0 0 672 290" role="img" aria-labelledby="ls-a-t ls-a-d">
<title id="ls-a-t">Regular and irregular distributions over a two-dimensional latent space</title>
<desc id="ls-a-d">Two contour plots. Left, a single round bump centred on the origin. Right, two separate peaks joined by a ridge, with a small island off to the side and empty space between them.</desc>
<text class="ls-title" x="176" y="24">Regular probability distribution</text>
<g class="ls-axis"><line x1="36" y1="260" x2="316" y2="260"/><line x1="36" y1="40" x2="36" y2="260"/></g>
<g class="ls-ticks"><line x1="42.7" y1="260" x2="42.7" y2="264"/><text class="ls-tick" x="42.7" y="275">-4</text><line x1="109.3" y1="260" x2="109.3" y2="264"/><text class="ls-tick" x="109.3" y="275">-2</text><line x1="176" y1="260" x2="176" y2="264"/><text class="ls-tick" x="176" y="275">0</text><line x1="242.7" y1="260" x2="242.7" y2="264"/><text class="ls-tick" x="242.7" y="275">2</text><line x1="309.3" y1="260" x2="309.3" y2="264"/><text class="ls-tick" x="309.3" y="275">4</text><line x1="32" y1="254.8" x2="36" y2="254.8"/><text class="ls-tick ls-tick--y" x="29" y="258.3">-4</text><line x1="32" y1="202.4" x2="36" y2="202.4"/><text class="ls-tick ls-tick--y" x="29" y="205.9">-2</text><line x1="32" y1="150" x2="36" y2="150"/><text class="ls-tick ls-tick--y" x="29" y="153.5">0</text><line x1="32" y1="97.6" x2="36" y2="97.6"/><text class="ls-tick ls-tick--y" x="29" y="101.1">2</text><line x1="32" y1="45.2" x2="36" y2="45.2"/><text class="ls-tick ls-tick--y" x="29" y="48.7">4</text></g>
<g class="ls-contour"><path d="M154 212.5L156.9 213.1L160.9 213.7L164.9 214L168.9 214L173 213.8L177 213.3L181 212.6L183.1 212.2L187.1 211.2L189.1 210.7L193.1 209.5L195.1 208.9L198.8 207.8L201.2 207.1L204 206.2L207.2 205.2L209.2 204.5L213.3 203.1L215.3 202.4L217.6 201.4L221.1 199.9L223.3 198.7L225.4 197.5L227.4 196.2L229.4 194.8L231.4 193.2L233.4 191.5L235.4 189.5L237.4 187.4L239.1 185.6L240.4 184L241.6 182.4L243.5 179.8L244.8 177.7L245.7 176.1L247.3 172.9L248 171.4L249.1 168.2L249.5 166.4L250.1 163.5L250.3 160.3L250.2 157.1L249.8 154L249.5 152.4L248.6 149.2L247.5 146.5L246.6 144.5L245.5 142.2L244.2 139.7L243.3 138.1L241.5 135L240.5 133.4L239.5 131.7L237.6 128.6L236.6 127.1L235.4 125.3L233.4 122.3L232.3 120.7L231.1 119.1L229.4 116.9L227.4 114.5L225.8 112.8L224.2 111.2L222.6 109.6L220.8 108.1L219 106.5L217.1 104.9L215.2 103.3L213.1 101.7L211 100.1L208.8 98.6L206.3 97L203.5 95.4L201.2 94.3L199.2 93.4L195.5 92.2L193.1 91.6L189.1 91L185.1 90.7L181 90.7L177 91.1L173 91.7L170.5 92.2L166.9 93.1L164.5 93.8L160.9 95L158.9 95.7L155.8 97L152.8 98.3L150.8 99.2L148.8 100.2L145.8 101.7L142.8 103.3L140.7 104.5L138.7 105.6L136.7 106.8L134.7 108.1L132.1 109.6L129.6 111.2L127.1 112.8L124.8 114.4L122.6 115.9L120.6 117.4L118.6 119L116.6 120.7L115 122.3L113.4 123.9L112.1 125.5L110.5 127.5L108.8 130.2L107.9 131.8L106.5 135L105.9 136.5L104.9 139.7L104.4 141.3L103.6 144.5L102.9 147.6L102.5 149.9L102 152.4L101.6 155.5L101.3 158.7L101.2 161.9L101.4 165L101.7 168.2L102.5 171.4L102.9 172.9L104.1 176.1L104.9 177.7L106.5 180.5L107.8 182.4L109 184L110.5 185.8L112.5 187.9L114.6 189.8L116.6 191.6L118.6 193.2L120.6 194.8L122.6 196.2L124.6 197.7L126.6 199.1L128.7 200.5L130.7 201.8L132.7 203.1L135.2 204.6L138 206.2L140.7 207.6L142.8 208.6L144.8 209.5L148.6 210.9L150.8 211.7L154 212.5" opacity="0.30"/><path d="M163.4 203L166.9 203.4L171 203.4L175 203.2L177 203L181 202.3L185 201.4L187.1 200.9L190.9 199.9L193.1 199.2L195.9 198.3L199.2 197.1L201.2 196.4L204.6 195.1L207.2 194L209.2 193.1L211.8 191.9L214.8 190.4L217.3 188.9L219.3 187.6L221.3 186.1L223.3 184.5L225.4 182.7L227.2 180.9L228.7 179.3L230 177.7L231.4 175.8L233.2 172.9L234.1 171.4L235.4 168.4L236.1 166.6L237 163.5L237.4 160.7L237.6 158.7L237.5 155.5L237.4 154L236.8 150.8L235.8 147.6L235.2 146L233.9 142.9L233.1 141.3L231.4 138.3L230.3 136.5L229.3 135L227.4 132.3L225.7 130.2L224.4 128.6L223 127.1L221.3 125.3L219.3 123.3L217.3 121.5L215.3 119.8L213.3 118.3L211.3 116.8L209.2 115.3L207.2 114L205.2 112.7L202.7 111.2L199.9 109.6L197.2 108.2L195.1 107.3L193 106.5L189.1 105.2L187.1 104.8L183.1 104.1L179 103.8L175 103.9L171 104.4L168.1 104.9L164.9 105.6L162 106.5L158.9 107.5L156.9 108.3L153.8 109.6L150.8 111.1L148.8 112.1L146.8 113.3L144.8 114.5L142.4 116L140 117.6L137.8 119.1L135.7 120.7L133.7 122.3L131.8 123.9L130 125.5L128.3 127.1L126.6 128.8L124.6 131.1L122.9 133.4L121.8 135L120.6 137L119.1 139.7L118.4 141.3L117.2 144.5L116.6 146.2L115.7 149.2L115 152.4L114.6 155.5L114.4 157.1L114.4 160.3L114.6 163.1L114.8 165L115.6 168.2L116.6 170.9L117.6 172.9L118.6 174.7L120.6 177.6L122 179.3L123.5 180.9L125.2 182.4L127 184L128.9 185.6L131 187.2L133.1 188.8L135.3 190.4L137.7 191.9L140.1 193.5L142.6 195.1L144.8 196.4L146.8 197.5L148.8 198.5L151.8 199.9L154.8 201L156.9 201.6L160.9 202.6L163.4 203" opacity="0.40"/><path d="M163.8 195.1L166.9 195.7L171 196L175 195.9L179 195.5L181.6 195.1L185.1 194.4L188.5 193.5L191.1 192.8L193.6 191.9L197.2 190.7L199.2 189.9L201.7 188.8L205.2 187.2L207.2 186.1L209.2 185L211.3 183.8L213.3 182.4L215.5 180.9L217.4 179.3L219.3 177.5L221.3 175.3L223.2 172.9L224.3 171.4L225.4 169.6L226.8 166.6L227.4 165L228.3 161.9L228.8 158.7L228.8 155.5L228.4 152.4L227.7 149.2L227.2 147.6L225.9 144.5L225.1 142.9L223.3 139.7L222.3 138.1L221.2 136.5L219.3 134.2L217.3 131.9L215.6 130.2L213.9 128.6L212.1 127.1L210.2 125.5L208 123.9L205.7 122.3L203.2 120.7L201.2 119.5L199.2 118.4L197.2 117.3L194.2 116L191.1 114.7L189.1 114L185.1 112.9L183.1 112.5L179 112L175 112L171 112.3L167.9 112.8L164.9 113.5L162 114.4L158.9 115.6L156.9 116.4L154.6 117.6L151.8 119.1L149.2 120.7L146.9 122.3L144.8 123.9L142.8 125.5L140.9 127.1L139.2 128.6L137.5 130.2L136 131.8L134.6 133.4L132.7 135.8L131 138.1L130 139.7L128.7 142L127.5 144.5L126.6 146.4L125.7 149.2L124.9 152.4L124.6 154L124.3 157.1L124.4 160.3L124.6 162.2L125.3 165L126.4 168.2L127.2 169.8L128.7 172.1L130.5 174.5L131.9 176.1L133.4 177.7L135.1 179.3L136.9 180.9L138.9 182.4L141 184L143.2 185.6L145.6 187.2L148.2 188.8L150.8 190.3L152.8 191.3L154.8 192.2L158.1 193.5L160.9 194.4L163.8 195.1" opacity="0.50"/><path d="M164.6 188.8L166.9 189.3L171 189.8L175 189.9L179 189.6L183.1 189L185.1 188.6L189.1 187.5L191.1 186.8L194.4 185.6L197.2 184.5L199.2 183.5L201.4 182.4L204.2 180.9L206.8 179.3L209 177.7L211 176.1L212.7 174.5L214.3 172.9L215.7 171.4L217.3 169.1L218.8 166.6L219.5 165L220.6 161.9L221.2 158.7L221.3 157.1L221.3 155L221 152.4L220.3 149.2L219.3 146.5L218.4 144.5L217.3 142.5L215.5 139.7L214.3 138.1L213 136.5L211.3 134.7L209.2 132.7L207.2 131L205.2 129.4L203.2 127.9L201.2 126.6L199.2 125.4L196.5 123.9L193.2 122.3L191.1 121.4L189.1 120.7L185.1 119.4L183.1 119L179 118.4L175 118.3L171 118.6L168.1 119.1L164.9 120L162.7 120.7L159.1 122.3L156.9 123.4L154.8 124.6L152.8 126L150.8 127.4L148.8 129.1L146.8 130.8L144.8 132.8L142.8 134.9L141.4 136.5L140.1 138.1L138.7 140.1L137 142.9L136.1 144.5L134.7 147.6L134.1 149.2L133.2 152.4L132.8 155.5L132.8 158.7L133.2 161.9L134.2 165L134.9 166.6L136.7 169.8L137.8 171.4L139.1 172.9L140.7 174.7L142.8 176.6L144.8 178.3L146.8 179.9L148.8 181.4L150.8 182.7L153 184L156 185.6L158.9 186.9L160.9 187.7L164.6 188.8" opacity="0.60"/><path d="M169.5 184L173 184.4L177 184.4L180.5 184L183.1 183.6L187.1 182.6L189.1 181.9L191.9 180.9L195.1 179.4L197.2 178.4L199.2 177.3L201.2 176L203.3 174.5L205.3 172.9L207.2 171.2L209.2 168.9L211 166.6L211.9 165L213.3 162L213.8 160.3L214.3 157.1L214.3 154L213.8 150.8L213.3 149.1L212 146L211.2 144.5L209.2 141.4L207.9 139.7L206.5 138.1L205 136.5L203.2 134.9L201.2 133.3L199.1 131.8L196.7 130.2L193.8 128.6L191.1 127.3L189.1 126.5L186.2 125.5L183.1 124.6L179 124L175 123.9L171 124.3L166.9 125.2L164.9 125.9L162.3 127.1L159.3 128.6L156.9 130.2L154.8 131.7L152.8 133.4L151.1 135L149.6 136.5L148.2 138.1L146.8 139.8L144.8 142.7L143.7 144.5L142.8 146.3L141.6 149.2L140.7 152.1L140.4 154L140.2 157.1L140.6 160.3L140.9 161.9L142.1 165L143 166.6L144.8 169.3L146.5 171.4L148 172.9L149.8 174.5L151.7 176.1L153.9 177.7L156.4 179.3L158.9 180.6L160.9 181.5L163.2 182.4L166.9 183.5L169.5 184" opacity="0.70"/><path d="M166.6 177.7L168.9 178.3L173 178.9L177 179L181 178.5L184.5 177.7L187.1 176.9L189.1 176.1L192.5 174.5L195.1 173L197.2 171.7L199.2 170.1L201.2 168.3L202.7 166.6L203.9 165L205.2 162.9L206.4 160.3L207.1 157.1L207.3 155.5L207.2 153.8L206.7 150.8L205.6 147.6L204.9 146L203.2 143.4L201.5 141.3L200.1 139.7L198.4 138.1L196.4 136.5L194.2 135L191.5 133.4L189.1 132.2L187.1 131.3L183.5 130.2L181 129.7L177 129.3L173 129.5L169.6 130.2L166.9 131.1L164.9 131.9L162.2 133.4L159.8 135L157.8 136.5L156.1 138.1L154.5 139.7L152.8 141.7L150.9 144.5L150 146L148.8 148.6L148 150.8L147.4 154L147.3 157.1L147.8 160.3L148.8 163.2L149.7 165L150.8 166.7L152.8 169.1L154.8 171.1L156.9 172.7L158.9 174.1L160.9 175.3L162.9 176.3L166.6 177.7" opacity="0.80"/><path d="M173 172.9L175 173.1L177.9 172.9L181 172.5L184.8 171.4L187.1 170.4L189.1 169.4L191.1 168.1L193.1 166.6L195.1 164.7L197.2 162.1L198.2 160.3L199.2 157.8L199.6 155.5L199.5 152.4L199.2 150.7L198 147.6L197.1 146L195.1 143.5L193.1 141.4L191.1 139.8L189.1 138.5L187.1 137.4L185 136.5L181 135.4L177 135L173 135.3L168.9 136.5L166.9 137.4L164.9 138.5L162.9 140L160.9 141.7L158.9 143.9L157.4 146L156.4 147.6L155.1 150.8L154.7 152.4L154.4 155.5L154.7 158.7L155.2 160.3L156.8 163.5L157.9 165L159.4 166.6L161.2 168.2L163.5 169.8L166.7 171.4L168.9 172.2L173 172.9" opacity="0.90"/><path d="M171.5 165L175 165.6L179 165.3L181 164.7L183.8 163.5L186.1 161.9L187.8 160.3L189.1 158.5L190.3 155.5L190.4 152.4L189.4 149.2L188.4 147.6L187 146L185.1 144.5L181.8 142.9L179 142.2L175 142.1L172 142.9L168.9 144.4L166.9 145.9L165.4 147.6L164.3 149.2L163 152.4L162.8 154L162.9 156.1L163.7 158.7L164.9 160.7L166.9 162.7L168.9 164L171.5 165" opacity="1.00"/></g>
<text class="ls-title" x="512" y="24">Irregular probability distribution</text>
<g class="ls-axis"><line x1="372" y1="260" x2="652" y2="260"/><line x1="372" y1="40" x2="372" y2="260"/></g>
<g class="ls-ticks"><line x1="400" y1="260" x2="400" y2="264"/><text class="ls-tick" x="400" y="275">-6</text><line x1="456" y1="260" x2="456" y2="264"/><text class="ls-tick" x="456" y="275">-3</text><line x1="512" y1="260" x2="512" y2="264"/><text class="ls-tick" x="512" y="275">0</text><line x1="568" y1="260" x2="568" y2="264"/><text class="ls-tick" x="568" y="275">3</text><line x1="624" y1="260" x2="624" y2="264"/><text class="ls-tick" x="624" y="275">6</text><line x1="368" y1="253.1" x2="372" y2="253.1"/><text class="ls-tick ls-tick--y" x="365" y="256.6">-6</text><line x1="368" y1="201.6" x2="372" y2="201.6"/><text class="ls-tick ls-tick--y" x="365" y="205.1">-3</text><line x1="368" y1="150" x2="372" y2="150"/><text class="ls-tick ls-tick--y" x="365" y="153.5">0</text><line x1="368" y1="98.4" x2="372" y2="98.4"/><text class="ls-tick ls-tick--y" x="365" y="101.9">3</text><line x1="368" y1="46.9" x2="372" y2="46.9"/><text class="ls-tick ls-tick--y" x="365" y="50.4">6</text></g>
<g class="ls-contour"><path d="M475.4 228.3L478.8 228.9L482.8 229.1L486.8 228.7L488.8 228.3L492.9 227.2L494.9 226.5L498 225.2L500.9 223.9L502.9 222.9L504.9 221.9L507.7 220.4L510.5 218.8L513 217.4L515 216.1L517 214.6L519.1 213L521.1 211.2L522.8 209.4L524.1 207.8L525.1 206.2L526.9 203L527.6 201.4L528.6 198.3L529.1 195.4L529.3 193.5L529.3 190.4L529.1 188.7L528.5 185.6L527.5 182.4L526.8 180.9L525.2 177.7L524.4 176.1L523.1 174.1L521.2 171.4L520 169.8L518.6 168.2L517 166.6L515 164.8L513 163.3L510.7 161.9L507.7 160.3L504.9 158.9L502.9 158L500.9 157L498.5 155.5L496.5 154L494.9 151.9L493.9 149.2L494 146L494.9 143.6L496.1 141.3L497.2 139.7L498.9 137.6L500.9 135.2L502.4 133.4L503.5 131.8L504.9 129.6L506.3 127.1L507 125.4L507.9 122.3L508.6 119.1L509 116.8L509.5 114.4L510.2 111.2L510.9 108.1L511.3 106.5L512 103.3L512.4 100.1L512.4 97L511.6 93.8L510.9 92.2L509 89.1L507.6 87.5L506 85.9L504.2 84.3L502.2 82.7L499.9 81.2L497.4 79.6L494.9 78.2L492.9 77.1L490.8 76.1L487.7 74.8L484.8 73.8L482.8 73.2L478.8 72.2L475.6 71.7L472.7 71.3L468.7 71L464.7 70.9L460.6 71.1L456.6 71.6L454.6 71.9L450.6 72.9L448.5 73.5L445.3 74.8L442.5 76.2L440.5 77.5L438.5 79.1L436.5 81L435 82.7L433.8 84.3L432.4 86.8L431.4 89.1L430.4 91.8L429.8 93.8L428.9 97L428.4 98.8L427.5 101.7L426.4 104.7L425.6 106.5L424.4 109.2L423.3 111.2L422.4 113.3L421.1 116L420.3 117.8L419.3 120.7L418.6 123.9L418.3 126L418 128.6L417.8 131.8L417.4 135L416.8 138.1L416.3 140.3L415.5 142.9L414.4 146L413.8 147.6L412.8 150.8L412.3 153.2L412 155.5L412.1 158.7L412.4 160.3L413.3 163.5L414.3 165.4L416.1 168.2L417.5 169.8L419.2 171.4L421.4 172.9L423.9 174.5L426.4 175.9L428.4 177L430.4 178.2L432.4 179.6L434.4 181.1L436.5 183L438.5 185.3L439.9 187.2L441 188.8L442.5 191L444 193.5L444.9 195.1L446.5 198L447.5 199.9L448.5 201.8L450 204.6L450.8 206.2L452.5 209.4L453.4 210.9L454.6 212.8L456.6 215.7L457.8 217.3L459.2 218.8L460.8 220.4L462.6 222L464.7 223.6L467.3 225.2L470.5 226.8L472.7 227.6L475.4 228.3" opacity="0.30"/><path d="M592.7 165L595.6 165.6L599.6 165.5L601.7 165L605.7 163.6L607.7 162.5L609.7 161.1L611.7 159.3L613.7 157.1L614.8 155.5L615.7 153.9L617.1 150.8L617.8 147.7L617.9 146L617.8 143.4L617.4 141.3L616.1 138.1L615.1 136.5L613.7 134.8L611.7 132.9L609.7 131.5L607.2 130.2L603.7 129L601.6 128.6L597.6 128.4L595.6 128.7L591.6 129.9L589.6 131L587.5 132.5L585.5 134.4L583.9 136.5L582.9 138.1L581.5 141.3L581 142.9L580.4 146L580.3 149.2L580.8 152.4L581.5 154.5L582.7 157.1L583.7 158.7L585.5 160.8L587.5 162.6L589.6 163.8L592.7 165" opacity="0.30"/><path d="M474.1 220.4L476.7 221.2L480.8 221.8L484.8 221.8L488.8 221.2L491.7 220.4L494.9 219.4L496.9 218.7L500.2 217.3L502.9 216L504.9 215L507 213.9L509.2 212.5L511.5 210.9L513.5 209.4L515.2 207.8L517 205.7L519 203L519.9 201.4L521.1 198.4L521.5 196.7L522 193.5L521.9 190.4L521.4 187.2L520.9 185.6L519.6 182.4L518.8 180.9L517 177.8L515.8 176.1L514.6 174.5L513 172.8L511 171L509 169.5L506.8 168.2L503.4 166.6L500.9 165.7L498.5 165L494.9 164L492.9 163.4L488.8 162.1L486.8 161.1L484.8 160.1L482.8 158.6L480.8 156.2L479.8 154L479.7 150.8L480.6 147.6L481.3 146L482.8 143.6L484.3 141.3L485.5 139.7L486.8 138.1L488.8 135.7L490.8 133.4L492.2 131.8L493.5 130.2L494.9 128.4L496.8 125.5L497.7 123.9L498.9 121L499.6 119.1L500.5 116L500.9 114.3L501.6 111.2L502.2 108.1L502.6 104.9L502.7 101.7L502.4 98.6L501.4 95.4L500.5 93.8L498.9 91.4L496.9 89.2L495.1 87.5L493.2 85.9L490.9 84.3L488.8 83L486.8 81.9L484.8 81L481.1 79.6L478.8 78.8L474.8 78L472.7 77.7L468.7 77.3L464.7 77.2L460.6 77.5L457 78L454.6 78.5L450.9 79.6L448.5 80.5L446.5 81.6L444.5 83L442.5 84.7L440.5 87L439.1 89.1L438.2 90.6L436.9 93.8L436.3 95.4L435.3 98.6L434.5 101.7L434 103.3L433.1 106.5L432.4 108.8L431.6 111.2L430.6 114.4L430.2 116L429.3 119.1L428.7 122.3L428.4 125.2L428.3 127.1L428.3 130.2L428.4 133.4L428.4 135.8L428.4 137.2L428.3 139.7L428 142.9L427.5 146L427 149.2L426.8 152.4L427.1 155.5L428.4 158.7L429.5 160.3L431.1 161.9L433.2 163.5L436 165L438.5 166.3L440.5 167.4L442.5 168.7L444.5 170.3L446.5 172.8L447.4 174.5L448.5 177.5L449 179.3L449.8 182.4L450.6 185.1L451.1 187.2L452.1 190.4L452.6 191.9L453.8 195.1L454.6 197L455.8 199.9L456.6 201.7L458 204.6L458.8 206.2L460.6 209.3L461.7 210.9L462.9 212.5L464.7 214.4L466.7 216.3L468.7 217.8L470.7 219L474.1 220.4" opacity="0.40"/><path d="M594.7 155.5L597.6 156.2L601.6 155.6L603.7 154.5L605.7 152.8L607.1 150.8L607.9 149.2L608.4 146L607.7 142.9L606.8 141.3L605.4 139.7L602.9 138.1L599.6 137.4L595.6 138L593.6 139.2L591.6 141.1L590.5 142.9L589.6 146L589.5 147.6L589.6 149.2L590.9 152.4L592.3 154L594.7 155.5" opacity="0.40"/><path d="M477.9 215.7L480.8 216.2L484.8 216.3L488.8 215.8L490.8 215.4L494.9 214.2L496.9 213.5L499.2 212.5L502.5 210.9L504.9 209.5L507 208.2L509 206.6L511 204.6L512.3 203L513.4 201.4L514.9 198.3L515.4 196.7L515.9 193.5L515.8 190.4L515 187.2L514.5 185.6L513 182.7L511.9 180.9L510.7 179.3L509 177.4L507 175.6L504.9 174.2L502.5 172.9L498.9 171.6L496.9 171.1L492.9 170.2L490.4 169.8L486.8 169.1L482.8 168.4L480.8 168L476.7 167.4L472.7 167.2L468.7 167.8L466.7 168.7L464.7 170L462.6 172.1L461 174.5L460.2 176.1L459.1 179.3L458.6 181.8L458.4 184L458.5 187.2L458.7 188.8L459.3 191.9L460.2 195.1L460.7 196.7L462 199.9L462.7 201.4L464.3 204.6L465.2 206.2L466.7 208.2L468.7 210.5L470.7 212.3L472.7 213.6L474.7 214.6L477.9 215.7" opacity="0.50"/><path d="M458.3 147.6L460.6 147.9L463.3 147.6L466.7 146.7L468.7 145.7L470.7 144.4L472.8 142.9L474.7 141.3L476.7 139.4L478.8 137.5L480.8 135.5L482.7 133.4L484.2 131.8L485.6 130.2L487 128.6L488.8 126.3L490.5 123.9L491.5 122.3L492.9 119.5L493.7 117.6L494.7 114.4L495.2 112.8L495.8 109.6L496.1 106.5L496.1 103.3L495.6 100.1L494.9 98.1L493.5 95.4L492.5 93.8L490.8 91.9L488.8 89.9L486.8 88.2L484.8 86.8L482.8 85.6L480 84.3L476.7 83.1L474.7 82.6L470.7 81.9L466.7 81.6L462.6 81.7L458.6 82.2L456.3 82.7L452.6 84L450.6 84.9L448.5 86.2L446.5 87.8L444.5 89.9L442.9 92.2L442.1 93.8L440.7 97L440.1 98.6L439.2 101.7L438.5 104.4L437.9 106.5L437.2 109.6L436.5 112.8L436.2 114.4L435.7 117.6L435.4 120.7L435.4 123.9L435.7 127.1L436.4 130.2L436.9 131.8L438.2 135L439.1 136.5L440.5 138.6L442.5 140.7L444.5 142.3L446.5 143.6L448.5 144.6L452.2 146L454.6 146.9L458.3 147.6" opacity="0.50"/><path d="M480.5 210.9L482.8 211.3L486.8 211.3L489.4 210.9L492.9 210.1L495.2 209.4L498.9 207.8L500.9 206.7L502.9 205.3L504.9 203.7L507 201.5L508.1 199.9L509 198.1L509.8 195.1L509.9 191.9L509.3 188.8L508.7 187.2L507 184.2L505.6 182.4L504 180.9L501.8 179.3L498.9 177.7L496.9 177L493.7 176.1L490.8 175.5L486.8 174.9L483 174.5L480.8 174.4L477.1 174.5L474.7 174.9L471.4 176.1L469.1 177.7L467.6 179.3L466.5 180.9L465.2 184L464.7 187.2L464.8 190.4L465.4 193.5L466.3 196.7L466.9 198.3L468.5 201.4L469.4 203L470.7 204.8L472.7 207L474.7 208.5L476.7 209.7L480.5 210.9" opacity="0.60"/><path d="M454.7 138.1L458.6 139L462.6 139.2L466.7 138.4L468.7 137.6L470.8 136.5L473.2 135L475.3 133.4L477.2 131.8L478.9 130.2L480.8 128.2L482.8 126L484.4 123.9L485.6 122.3L486.8 120.3L488.3 117.6L488.9 116L490 112.8L490.6 109.6L490.8 106.6L490.8 106.4L490.6 103.3L489.7 100.1L488.8 98.2L487.1 95.4L485.8 93.8L484.3 92.2L482.4 90.6L480 89.1L476.9 87.5L474.7 86.6L471.9 85.9L468.7 85.4L464.7 85.3L460.6 85.6L458.6 86L454.6 87.4L452.6 88.4L450.6 89.8L448.5 91.6L446.7 93.8L445.7 95.4L444.5 97.8L443.6 100.1L442.6 103.3L442.2 104.9L441.5 108.1L440.9 111.2L440.5 114.4L440.4 116L440.3 119.1L440.5 121.2L440.9 123.9L441.9 127.1L442.6 128.6L444.5 131.5L446.2 133.4L448.2 135L450.6 136.4L452.6 137.4L454.7 138.1" opacity="0.60"/><path d="M485.7 206.2L487.1 206.2L490.8 205.7L494.3 204.6L496.9 203.3L498.9 202L500.9 200.1L502.2 198.3L503 196.7L503.5 193.5L503 190.4L502.2 188.8L500.9 186.8L498.9 184.8L496.9 183.5L494.9 182.4L490.8 181.2L488.8 180.7L484.8 180.3L480.8 180.4L478.1 180.9L474.7 182.4L472.9 184L471.9 185.6L471 188.8L471 191.9L471.7 195.1L472.7 197.6L474 199.9L475.2 201.4L476.8 203L479.2 204.6L482.8 205.9L485.7 206.2" opacity="0.70"/><path d="M454.1 131.8L456.6 132.7L460.6 133.4L464.7 133.1L468.6 131.8L470.7 130.7L472.7 129.4L474.7 127.9L476.7 126.1L478.8 124L480.2 122.3L481.3 120.7L482.8 118.5L484.1 116L484.8 114.3L485.7 111.2L486.1 108.1L486 104.9L485.2 101.7L484.6 100.1L482.8 97.1L481.4 95.4L479.7 93.8L477.6 92.2L474.8 90.6L472.7 89.8L469.7 89.1L466.7 88.7L462.6 88.8L460.6 89.1L456.6 90.4L454.6 91.4L452.6 92.8L450.6 94.8L448.9 97L448 98.6L446.6 101.7L446.1 103.3L445.3 106.5L444.7 109.6L444.5 111.4L444.3 114.4L444.5 117.6L444.6 119.1L445.4 122.3L446.5 124.9L447.9 127.1L449.3 128.6L451.3 130.2L454.1 131.8" opacity="0.70"/><path d="M483.4 198.3L486.8 199.2L490.8 198.5L492.9 197.1L494.2 195.1L493.9 191.9L492.9 190.3L490.7 188.8L486.8 187.7L482.8 188.1L480.8 189.3L479.5 191.9L480.2 195.1L481.3 196.7L483.4 198.3" opacity="0.80"/><path d="M455.9 127.1L458.6 128L462.6 128.3L466.7 127.4L468.7 126.6L470.7 125.4L472.8 123.9L474.7 122.2L476.7 119.9L478.5 117.6L479.4 116L480.8 112.9L481.3 111.2L481.7 108.1L481.5 104.9L480.8 102.5L479.7 100.1L478.6 98.6L476.7 96.5L474.7 94.9L472.7 93.7L468.7 92.4L466.7 92.1L462.6 92.2L460.6 92.6L457.5 93.8L455 95.4L453.3 97L452 98.6L450.6 101L449.6 103.3L448.7 106.5L448.4 108.1L448 111.2L448.1 114.4L448.5 117.6L449 119.1L450.4 122.3L451.6 123.9L453.3 125.5L455.9 127.1" opacity="0.80"/><path d="M457.9 122.3L460.6 123.1L464.7 123L466.8 122.3L469.7 120.7L471.7 119.1L473.2 117.6L474.7 115.5L476.2 112.8L476.7 111.2L477.2 108.1L476.9 104.9L476.4 103.3L474.7 100.5L472.8 98.6L470.7 97.2L468.7 96.3L464.7 95.8L460.6 96.5L458.6 97.4L456.6 98.9L454.6 101.2L453.4 103.3L452.6 105.5L452 108.1L451.7 111.2L452.1 114.4L452.6 116.3L454.1 119.1L455.5 120.7L457.9 122.3" opacity="0.90"/><path d="M458.9 116L462.6 117.4L466.7 116.4L468.7 115L470.5 112.8L471.3 111.2L472 108.1L471.3 104.9L470.4 103.3L468.7 101.7L464.7 100.5L460.6 101.6L458.6 103.3L457.6 104.9L456.6 107.3L456.3 109.6L456.6 112.2L457.6 114.4L458.9 116" opacity="1.00"/></g>
</svg>
<figcaption>Left, the kind of latent distribution you can sample from. Right, the kind a plain autoencoder tends to produce: a random point lands in a gap more often than not.</figcaption>
</figure>

So we can change an image by modifying its latent representation — but
the modification might produce changes that are unrealistic, changes that
do not reflect anything in the data. What we want is a
latent space in which every point we might move to decodes into a
plausible image — one that could have come from the data — and not only
the points the training images happened to land on.

The so called variational version of the autoencoder changes what the encoder produces. Instead of one
point per input, it outputs a *distribution* over the latent space — a mean
and a variance per dimension.
We keep those distributions close to a simple prior, a standard
Gaussian. That regularity is what makes the latent space safe to move
around in, not only to compress into. Points nearby now decode into
something plausible.

<figure class="ls__figure">
<svg class="ls-fig" viewBox="0 0 672 270" role="img" aria-labelledby="ls-b-t ls-b-d">
<title id="ls-b-t">Autoencoder and variational autoencoder architectures</title>
<desc id="ls-b-d">Left, a plain autoencoder: the input x narrows to a small latent layer z, then widens back out to a reconstruction x′. Right, a variational autoencoder: the input maps to a mean μ and a variance σ², a sample z is drawn from the Gaussian they define, and the decoder reconstructs x′ from that sample.</desc>
<defs><marker id="ls-arrow-b" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="ls-arrowhead" d="M0 0.5L7.5 4L0 7.5Z"/></marker></defs>
<g class="ls-edges"><line x1="67.6" y1="73.3" x2="140.5" y2="90.8" marker-end="url(#ls-arrow-b)"/><line x1="65.9" y1="77.4" x2="142.7" y2="125.5" marker-end="url(#ls-arrow-b)"/><line x1="63.9" y1="79.9" x2="145.3" y2="162.2" marker-end="url(#ls-arrow-b)"/><line x1="67.9" y1="108" x2="140.2" y2="97.6" marker-end="url(#ls-arrow-b)"/><line x1="67.6" y1="113.3" x2="140.5" y2="130.8" marker-end="url(#ls-arrow-b)"/><line x1="65.9" y1="117.4" x2="142.7" y2="165.5" marker-end="url(#ls-arrow-b)"/><line x1="63.9" y1="190.1" x2="145.3" y2="107.8" marker-end="url(#ls-arrow-b)"/><line x1="65.9" y1="192.6" x2="142.7" y2="144.5" marker-end="url(#ls-arrow-b)"/><line x1="67.6" y1="196.7" x2="140.5" y2="179.2" marker-end="url(#ls-arrow-b)"/><line x1="171.6" y1="91.7" x2="244.5" y2="74.2" marker-end="url(#ls-arrow-b)"/><line x1="171.9" y1="97" x2="244.2" y2="107.4" marker-end="url(#ls-arrow-b)"/><line x1="167.9" y1="104.9" x2="249.3" y2="187.2" marker-end="url(#ls-arrow-b)"/><line x1="169.9" y1="127.6" x2="246.7" y2="79.5" marker-end="url(#ls-arrow-b)"/><line x1="171.6" y1="131.7" x2="244.5" y2="114.2" marker-end="url(#ls-arrow-b)"/><line x1="169.9" y1="142.4" x2="246.7" y2="190.5" marker-end="url(#ls-arrow-b)"/><line x1="167.9" y1="165.1" x2="249.3" y2="82.8" marker-end="url(#ls-arrow-b)"/><line x1="169.9" y1="167.6" x2="246.7" y2="119.5" marker-end="url(#ls-arrow-b)"/><line x1="171.6" y1="178.3" x2="244.5" y2="195.8" marker-end="url(#ls-arrow-b)"/></g>
<circle class="ls-node" cx="54" cy="70" r="14"/><circle class="ls-node" cx="54" cy="110" r="14"/><circle class="ls-node" cx="54" cy="200" r="14"/><circle class="ls-node" cx="158" cy="95" r="14"/><circle class="ls-node" cx="158" cy="135" r="14"/><circle class="ls-node" cx="158" cy="175" r="14"/><circle class="ls-node" cx="262" cy="70" r="14"/><circle class="ls-node" cx="262" cy="110" r="14"/><circle class="ls-node" cx="262" cy="200" r="14"/>
<text class="ls-dots" x="54" y="162">⋮</text><text class="ls-dots" x="262" y="162">⋮</text>
<text class="ls-var" x="54" y="44">x</text><text class="ls-var" x="158" y="44">z</text><text class="ls-var" x="262" y="44">x′</text>
<g class="ls-brace"><path d="M54 235V240H158V235"/><text x="106" y="255">encode</text></g><g class="ls-brace"><path d="M164 235V240H262V235"/><text x="213" y="255">decode</text></g>
<g class="ls-edges"><line x1="405.2" y1="74.6" x2="461" y2="94.1" marker-end="url(#ls-arrow-b)"/><line x1="401.1" y1="80.6" x2="466.3" y2="156.4" marker-end="url(#ls-arrow-b)"/><line x1="405.9" y1="108.4" x2="460.1" y2="102.1" marker-end="url(#ls-arrow-b)"/><line x1="403.5" y1="118" x2="463.2" y2="159.7" marker-end="url(#ls-arrow-b)"/><line x1="401.1" y1="189.4" x2="466.3" y2="113.6" marker-end="url(#ls-arrow-b)"/><line x1="405.2" y1="195.4" x2="461" y2="175.9" marker-end="url(#ls-arrow-b)"/><line x1="490.8" y1="105.7" x2="539.6" y2="127.6" marker-end="url(#ls-arrow-b)"/><line x1="490.8" y1="164.3" x2="539.6" y2="142.4" marker-end="url(#ls-arrow-b)"/><line x1="566.8" y1="126" x2="620.2" y2="81.5" marker-end="url(#ls-arrow-b)"/><line x1="569.3" y1="130.7" x2="616.9" y2="115.5" marker-end="url(#ls-arrow-b)"/><line x1="566.8" y1="144" x2="620.2" y2="188.5" marker-end="url(#ls-arrow-b)"/></g>
<circle class="ls-node" cx="392" cy="70" r="14"/><circle class="ls-node" cx="392" cy="110" r="14"/><circle class="ls-node" cx="392" cy="200" r="14"/><circle class="ls-node ls-node--param" cx="478" cy="100" r="14"/><circle class="ls-node ls-node--param" cx="478" cy="170" r="14"/><circle class="ls-node ls-node--param" cx="556" cy="135" r="14"/><circle class="ls-node" cx="634" cy="70" r="14"/><circle class="ls-node" cx="634" cy="110" r="14"/><circle class="ls-node" cx="634" cy="200" r="14"/>
<text class="ls-dots" x="392" y="162">⋮</text><text class="ls-dots" x="634" y="162">⋮</text>
<text class="ls-var" x="392" y="44">x</text><text class="ls-var" x="478" y="79">μ</text><text class="ls-var" x="478" y="203">σ²</text><text class="ls-var" x="556" y="114">z</text><text class="ls-var" x="634" y="44">x′</text><text class="ls-formula" x="542" y="44">z ∼ 𝒩(μ, σ²I)</text>
<g class="ls-brace"><path d="M392 235V240H478V235"/><text x="435" y="255">encode</text></g><g class="ls-brace"><path d="M484 235V240H556V235"/><text x="520" y="255">sampling</text></g><g class="ls-brace"><path d="M562 235V240H634V235"/><text x="598" y="255">decode</text></g>
</svg>
<figcaption>Left, an autoencoder: each input becomes one point <code>z</code>. Right, a variational autoencoder: each input becomes a mean and a variance, and <code>z</code> is a draw from that Gaussian.</figcaption>
</figure>

## What that objective doesn't say

So far we designed the latent space in a way that allows us to reconstruct the original input well and that the distribution stays close to a Gaussian.
Neither demand says anything about *which* part of the latent space should carry *which* information. So by
default it carries all of it, mixed.

Take a diagnostic model that flags a scan as malignant. A natural follow-up
question is what the image would need to look like for the model to call it
benign instead. If the answer only changes what the diagnosis actually
depends on — a tumor's shape, its margins — a physician learns something
real about what the model built its decision on. If it also changes the patient's bone density or the scanner's
contrast setting, it has learned nothing, because the model never kept those
two kinds of information apart. The latent space has picked up a dependency
between the label and features that have nothing to do with it — not because
the data demanded one, but because nothing in the loss ever asked it not to.

## Forcing the split

The obvious fix — hand the label to the encoder as one more input — turns
out not to be enough. In the experiments behind the model below, that single
number was outweighed by everything else the latent representation had to carry.

A [Conditional Subspace VAE](https://proceedings.neurips.cc/paper/2018/hash/73e5080f0f3804cb9cf470a8ce895dac-Abstract.html)
*(Klys, Snell & Zemel, 2018)* goes further. It splits the latent space into
two subspaces: one that receives the label as an input and is meant to hold
everything about it, and one meant to hold everything *else* — with a term
in the loss that actively pushes label information out of the second. That
last part is the point. The subspaces don't stay separate on their own;
we have to enforce that explicitly.

<figure class="ls__figure">
<svg class="ls-fig" viewBox="0 0 672 352" role="img" aria-labelledby="ls-c-t ls-c-d">
<title id="ls-c-t">The Conditional Subspace VAE as a graphical model</title>
<desc id="ls-c-d">Left, the encoder: the input x feeds two latent variables, z and w; the label y also feeds w; a dashed arrow from z to y marks the adversarial constraint that z must not predict y. Right, the decoder: z and w together reconstruct x, with no direct path from y.</desc>
<defs><marker id="ls-arrow-c" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path class="ls-garrowhead" d="M0 0.5L7.5 4L0 7.5Z"/></marker></defs>
<line class="ls-gedge" x1="155.3" y1="244" x2="112.1" y2="182.9" marker-end="url(#ls-arrow-c)"/><line class="ls-gedge" x1="180.7" y1="244" x2="223.9" y2="182.9" marker-end="url(#ls-arrow-c)"/><line class="ls-gedge" x1="240" y1="80" x2="240" y2="132" marker-end="url(#ls-arrow-c)"/>
<path class="ls-gedge ls-gedge--adversarial" d="M92 139C86 81,151 54,211 62" marker-end="url(#ls-arrow-c)"/>
<circle class="ls-gnode ls-gnode--observed" cx="168" cy="262" r="22"/><text class="ls-glabel" x="168" y="269">x</text><circle class="ls-gnode" cx="96" cy="160" r="22"/><text class="ls-glabel" x="96" y="167">z</text><circle class="ls-gnode" cx="240" cy="160" r="22"/><text class="ls-glabel" x="240" y="167">w</text><circle class="ls-gnode ls-gnode--observed" cx="240" cy="58" r="22"/><text class="ls-glabel" x="240" y="65">y</text>
<text class="ls-gcaption" x="168" y="308">encoder</text>
<line class="ls-gedge" x1="443.6" y1="118.7" x2="501.3" y2="212.2" marker-end="url(#ls-arrow-c)"/><line class="ls-gedge" x1="588.4" y1="118.7" x2="530.7" y2="212.2" marker-end="url(#ls-arrow-c)"/>
<circle class="ls-gnode ls-gnode--observed" cx="432" cy="100" r="22"/><text class="ls-glabel" x="432" y="107">z</text><circle class="ls-gnode ls-gnode--observed" cx="600" cy="100" r="22"/><text class="ls-glabel" x="600" y="107">w</text><circle class="ls-gnode" cx="516" cy="236" r="22"/><text class="ls-glabel" x="516" y="243">x</text>
<text class="ls-gcaption" x="516" y="308">decoder</text>
<g class="ls-glegend"><circle class="ls-gnode ls-gnode--observed" cx="220" cy="338" r="6"/><text x="232" y="342">given</text><circle class="ls-gnode" cx="296" cy="338" r="6"/><text x="308" y="342">inferred</text><path class="ls-gedge ls-gedge--adversarial" d="M384 338H412"/><text x="420" y="342">adversarial</text></g>
</svg>
<figcaption>The CS-VAE as a graph, after Klys et al. (2018). Left, encoding: <code>w</code> gets the label <code>y</code> as input, <code>z</code> does not — and the dashed arrow is the fight, a second network trying to read <code>y</code> off <code>z</code> while the encoder trains to make that impossible. Right, decoding from both.</figcaption>
</figure>

The loss functions behind VAEs and this Conditional Subspace extension — how that push is actually built — are
worked through in detail in the seminar paper referenced below the post. How far the idea can be taken is what the
[longer article](/writing/vae-loss-statistical-dependencies/) is for. The
short version of today's post: **information doesn't separate itself. If two things
shouldn't share a representation, something in the loss has to be actively
keeping them apart.**
