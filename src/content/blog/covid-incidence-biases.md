---
title: Three biases in the Covid incidence statistic
date: 2021-10-04
summary: >-
  German lockdown law tied contact rules to one number, with the same
  threshold everywhere. Three ways that number misread the thing it was
  standing in for.
tags: [statistics, public-policy, measurement]
track: data-science
mark: virus
kind: Report
pin: 3
status: draft
repo: https://github.com/pat-rig/Covid_Incidence_Biases
paper:
  label: Data analysis report — not peer-reviewed
  title: Misleading Biases in Covid Incidence
  authors: Patrick Köhler
  venue: University of Tübingen
  year: 2021
  url: /papers/covid-incidence-biases-2021.pdf
  mark: virus
---

During the Covid pandemic, political interventions in Germany were routinely
discussed in the light of one number: the incidence statistic. Contact
restrictions were tied to it directly, with the same thresholds everywhere.
Look closely and that number carries several biases, and stops reflecting the
pandemic situation it was standing in for.

This post takes three of them at a very superficial level. More rigorous
descriptions are in the report referenced at the foot of this page, written
during my studies at the University of Tübingen in 2021.

One thing worth saying up front to recall the context of the pandemic.
The reason to restrict contacts was to keep hospitals functioning. So
the fair test of the incidence number is not whether it counts cases
correctly, but whether it predicts **intensive care occupancy**. Every bias
below is a way it fails that test.

## It counts tests, not infections

Incidence is positive tests per 100,000 people over seven days. Test more
people and you find more cases, with nothing about the pandemic having
changed. What actually indicates risk is the *share* of tests coming back
positive.

Germany's second wave shows the gap plainly. One week carried an incidence of
205 with 8.5% of tests positive. Another week carried a slightly higher 210 —
with roughly 16% positive. The headline number is the same; the fraction of
tested people who turned out to be infected is double.

<figure class="cv__figure">
<svg class="cv-fig" viewBox="0 0 672 336" role="img" aria-labelledby="cv1-t cv1-d">
<title id="cv1-t">Positive rate against incidence, Germany and Israel</title>
<desc id="cv1-d">Two scatter plots. Within each country the same incidence occurs at very different positive rates, and each wave forms its own band with a different slope.</desc>
<g class="cv-panel">
<text class="cv-title" x="198" y="26">Germany (weekly)</text>
<g class="cv-axis"><line x1="52" y1="272" x2="343" y2="272"/><line x1="52" y1="40" x2="52" y2="272"/></g>
<g class="cv-tick"><line x1="52.0" y1="272" x2="52.0" y2="276"/><text class="cv-ticklabel" x="52.0" y="288">0</text></g>
<g class="cv-tick"><line x1="102.2" y1="272" x2="102.2" y2="276"/><text class="cv-ticklabel" x="102.2" y="288">50</text></g>
<g class="cv-tick"><line x1="152.3" y1="272" x2="152.3" y2="276"/><text class="cv-ticklabel" x="152.3" y="288">100</text></g>
<g class="cv-tick"><line x1="202.5" y1="272" x2="202.5" y2="276"/><text class="cv-ticklabel" x="202.5" y="288">150</text></g>
<g class="cv-tick"><line x1="252.7" y1="272" x2="252.7" y2="276"/><text class="cv-ticklabel" x="252.7" y="288">200</text></g>
<g class="cv-tick"><line x1="302.9" y1="272" x2="302.9" y2="276"/><text class="cv-ticklabel" x="302.9" y="288">250</text></g>
<g class="cv-tick"><line x1="48" y1="272.0" x2="52" y2="272.0"/><text class="cv-ticklabel cv-ticklabel--y" x="44" y="275.5">0.00</text></g>
<g class="cv-tick"><line x1="48" y1="243.0" x2="52" y2="243.0"/><text class="cv-ticklabel cv-ticklabel--y" x="44" y="246.5">0.02</text></g>
<g class="cv-tick"><line x1="48" y1="214.0" x2="52" y2="214.0"/><text class="cv-ticklabel cv-ticklabel--y" x="44" y="217.5">0.04</text></g>
<g class="cv-tick"><line x1="48" y1="185.0" x2="52" y2="185.0"/><text class="cv-ticklabel cv-ticklabel--y" x="44" y="188.5">0.06</text></g>
<g class="cv-tick"><line x1="48" y1="156.0" x2="52" y2="156.0"/><text class="cv-ticklabel cv-ticklabel--y" x="44" y="159.5">0.08</text></g>
<g class="cv-tick"><line x1="48" y1="127.0" x2="52" y2="127.0"/><text class="cv-ticklabel cv-ticklabel--y" x="44" y="130.5">0.10</text></g>
<g class="cv-tick"><line x1="48" y1="98.0" x2="52" y2="98.0"/><text class="cv-ticklabel cv-ticklabel--y" x="44" y="101.5">0.12</text></g>
<g class="cv-tick"><line x1="48" y1="69.0" x2="52" y2="69.0"/><text class="cv-ticklabel cv-ticklabel--y" x="44" y="72.5">0.14</text></g>
<g class="cv-tick"><line x1="48" y1="40.0" x2="52" y2="40.0"/><text class="cv-ticklabel cv-ticklabel--y" x="44" y="43.5">0.16</text></g>
<g class="cv-mark cv-between">
<circle cx="59.7" cy="247.3" r="2.4"/>
<circle cx="58.8" cy="250.2" r="2.4"/>
<circle cx="57.3" cy="256.1" r="2.4"/>
<circle cx="56.0" cy="258.9" r="2.4"/>
<circle cx="55.0" cy="258.9" r="2.4"/>
<circle cx="58.4" cy="250.2" r="2.4"/>
<circle cx="57.8" cy="260.4" r="2.4"/>
<circle cx="56.8" cy="263.3" r="2.4"/>
<circle cx="56.1" cy="263.3" r="2.4"/>
<circle cx="56.8" cy="261.9" r="2.4"/>
<circle cx="58.7" cy="260.4" r="2.4"/>
<circle cx="59.8" cy="257.5" r="2.4"/>
<circle cx="62.4" cy="257.5" r="2.4"/>
<circle cx="65.2" cy="257.5" r="2.4"/>
<circle cx="68.2" cy="258.9" r="2.4"/>
<circle cx="67.1" cy="261.9" r="2.4"/>
</g>
<g class="cv-mark cv-w1">
<circle cx="60.1" cy="187.9" r="2.4"/>
<circle cx="84.6" cy="171.9" r="2.4"/>
<circle cx="115.6" cy="144.4" r="2.4"/>
<circle cx="117.0" cy="141.5" r="2.4"/>
<circle cx="99.4" cy="156.0" r="2.4"/>
<circle cx="81.6" cy="174.8" r="2.4"/>
<circle cx="73.5" cy="199.5" r="2.4"/>
<circle cx="65.5" cy="216.9" r="2.4"/>
<circle cx="62.6" cy="234.3" r="2.4"/>
</g>
<g class="cv-mark cv-w2">
<circle cx="66.4" cy="260.4" r="2.4"/>
<circle cx="69.1" cy="258.9" r="2.4"/>
<circle cx="72.9" cy="254.6" r="2.4"/>
<circle cx="73.1" cy="254.6" r="2.4"/>
<circle cx="78.0" cy="245.9" r="2.4"/>
<circle cx="94.3" cy="235.8" r="2.4"/>
<circle cx="124.4" cy="219.8" r="2.4"/>
<circle cx="169.9" cy="192.2" r="2.4"/>
<circle cx="234.2" cy="169.1" r="2.4"/>
<circle cx="288.3" cy="157.4" r="2.4"/>
<circle cx="257.6" cy="144.4" r="2.4"/>
<circle cx="273.1" cy="135.7" r="2.4"/>
<circle cx="262.7" cy="137.2" r="2.4"/>
<circle cx="289.3" cy="128.4" r="2.4"/>
<circle cx="319.0" cy="109.6" r="2.4"/>
<circle cx="332.5" cy="108.1" r="2.4"/>
<circle cx="297.5" cy="83.5" r="2.4"/>
<circle cx="266.0" cy="48.7" r="2.4"/>
<circle cx="300.6" cy="86.4" r="2.4"/>
<circle cx="258.3" cy="121.2" r="2.4"/>
<circle cx="218.8" cy="128.4" r="2.4"/>
<circle cx="185.1" cy="148.8" r="2.4"/>
<circle cx="164.8" cy="163.2" r="2.4"/>
<circle cx="137.5" cy="179.2" r="2.4"/>
</g>
<g class="cv-mark cv-w3">
<circle cx="142.2" cy="183.6" r="2.4"/>
<circle cx="147.3" cy="183.6" r="2.4"/>
<circle cx="151.7" cy="182.1" r="2.4"/>
<circle cx="171.9" cy="174.8" r="2.4"/>
<circle cx="207.8" cy="157.4" r="2.4"/>
<circle cx="247.9" cy="137.2" r="2.4"/>
<circle cx="242.8" cy="113.9" r="2.4"/>
<circle cx="249.9" cy="98.0" r="2.4"/>
<circle cx="296.9" cy="92.2" r="2.4"/>
<circle cx="310.3" cy="92.2" r="2.4"/>
<circle cx="267.3" cy="109.6" r="2.4"/>
<circle cx="219.8" cy="124.1" r="2.4"/>
<circle cx="175.1" cy="153.1" r="2.4"/>
<circle cx="145.5" cy="187.9" r="2.4"/>
<circle cx="103.3" cy="212.6" r="2.4"/>
<circle cx="88.2" cy="227.1" r="2.4"/>
<circle cx="76.6" cy="238.7" r="2.4"/>
<circle cx="63.7" cy="251.7" r="2.4"/>
<circle cx="59.5" cy="257.5" r="2.4"/>
</g>
<g class="cv-mark cv-w4">
<circle cx="58.8" cy="260.4" r="2.4"/>
<circle cx="61.0" cy="256.1" r="2.4"/>
<circle cx="66.5" cy="248.8" r="2.4"/>
<circle cx="70.4" cy="238.7" r="2.4"/>
<circle cx="78.1" cy="229.9" r="2.4"/>
<circle cx="85.4" cy="216.9" r="2.4"/>
<circle cx="104.0" cy="185.0" r="2.4"/>
<circle cx="133.6" cy="158.9" r="2.4"/>
<circle cx="161.6" cy="153.1" r="2.4"/>
<circle cx="177.7" cy="145.9" r="2.4"/>
<circle cx="177.3" cy="157.4" r="2.4"/>
<circle cx="159.1" cy="163.2" r="2.4"/>
</g>
</g>
<g class="cv-panel">
<text class="cv-title" x="518" y="26">Israel (daily)</text>
<g class="cv-axis"><line x1="373" y1="272" x2="664" y2="272"/><line x1="373" y1="40" x2="373" y2="272"/></g>
<g class="cv-tick"><line x1="373.0" y1="272" x2="373.0" y2="276"/><text class="cv-ticklabel" x="373.0" y="288">0</text></g>
<g class="cv-tick"><line x1="417.8" y1="272" x2="417.8" y2="276"/><text class="cv-ticklabel" x="417.8" y="288">200</text></g>
<g class="cv-tick"><line x1="462.5" y1="272" x2="462.5" y2="276"/><text class="cv-ticklabel" x="462.5" y="288">400</text></g>
<g class="cv-tick"><line x1="507.3" y1="272" x2="507.3" y2="276"/><text class="cv-ticklabel" x="507.3" y="288">600</text></g>
<g class="cv-tick"><line x1="552.1" y1="272" x2="552.1" y2="276"/><text class="cv-ticklabel" x="552.1" y="288">800</text></g>
<g class="cv-tick"><line x1="596.8" y1="272" x2="596.8" y2="276"/><text class="cv-ticklabel" x="596.8" y="288">1000</text></g>
<g class="cv-tick"><line x1="641.6" y1="272" x2="641.6" y2="276"/><text class="cv-ticklabel" x="641.6" y="288">1200</text></g>
<g class="cv-mark cv-between">
<circle cx="376.2" cy="254.6" r="2.4"/>
<circle cx="375.8" cy="254.6" r="2.4"/>
<circle cx="375.6" cy="256.1" r="2.4"/>
<circle cx="375.3" cy="257.5" r="2.4"/>
<circle cx="374.9" cy="260.4" r="2.4"/>
<circle cx="374.8" cy="260.4" r="2.4"/>
<circle cx="374.5" cy="261.9" r="2.4"/>
<circle cx="374.2" cy="263.3" r="2.4"/>
<circle cx="374.1" cy="264.8" r="2.4"/>
<circle cx="374.1" cy="264.8" r="2.4"/>
<circle cx="374.0" cy="264.8" r="2.4"/>
<circle cx="374.0" cy="264.8" r="2.4"/>
<circle cx="373.9" cy="264.8" r="2.4"/>
<circle cx="373.7" cy="266.2" r="2.4"/>
<circle cx="373.7" cy="266.2" r="2.4"/>
<circle cx="373.6" cy="266.2" r="2.4"/>
<circle cx="373.6" cy="267.6" r="2.4"/>
<circle cx="373.5" cy="267.6" r="2.4"/>
<circle cx="373.5" cy="267.6" r="2.4"/>
<circle cx="373.4" cy="267.6" r="2.4"/>
<circle cx="373.4" cy="267.6" r="2.4"/>
<circle cx="373.4" cy="267.6" r="2.4"/>
<circle cx="373.4" cy="267.6" r="2.4"/>
<circle cx="373.4" cy="267.6" r="2.4"/>
<circle cx="373.4" cy="267.6" r="2.4"/>
<circle cx="373.5" cy="266.2" r="2.4"/>
<circle cx="373.6" cy="264.8" r="2.4"/>
<circle cx="373.8" cy="261.9" r="2.4"/>
<circle cx="374.2" cy="257.5" r="2.4"/>
<circle cx="374.3" cy="256.1" r="2.4"/>
<circle cx="374.5" cy="253.2" r="2.4"/>
<circle cx="374.8" cy="251.7" r="2.4"/>
<circle cx="375.1" cy="251.7" r="2.4"/>
<circle cx="375.3" cy="253.2" r="2.4"/>
<circle cx="375.5" cy="254.6" r="2.4"/>
<circle cx="375.6" cy="257.5" r="2.4"/>
<circle cx="375.7" cy="258.9" r="2.4"/>
<circle cx="375.9" cy="258.9" r="2.4"/>
<circle cx="376.2" cy="258.9" r="2.4"/>
<circle cx="376.4" cy="258.9" r="2.4"/>
<circle cx="376.9" cy="257.5" r="2.4"/>
<circle cx="377.1" cy="256.1" r="2.4"/>
<circle cx="377.3" cy="256.1" r="2.4"/>
<circle cx="377.6" cy="253.2" r="2.4"/>
<circle cx="377.6" cy="253.2" r="2.4"/>
<circle cx="377.6" cy="251.7" r="2.4"/>
<circle cx="378.1" cy="250.2" r="2.4"/>
<circle cx="378.2" cy="248.8" r="2.4"/>
<circle cx="378.6" cy="247.3" r="2.4"/>
<circle cx="379.1" cy="245.9" r="2.4"/>
<circle cx="379.1" cy="245.9" r="2.4"/>
<circle cx="379.2" cy="244.4" r="2.4"/>
<circle cx="379.8" cy="243.0" r="2.4"/>
<circle cx="380.3" cy="241.6" r="2.4"/>
<circle cx="381.1" cy="238.7" r="2.4"/>
<circle cx="381.9" cy="235.8" r="2.4"/>
<circle cx="389.5" cy="241.6" r="2.4"/>
<circle cx="378.9" cy="263.3" r="2.4"/>
<circle cx="379.3" cy="263.3" r="2.4"/>
<circle cx="379.6" cy="263.3" r="2.4"/>
<circle cx="380.6" cy="261.9" r="2.4"/>
<circle cx="381.3" cy="260.4" r="2.4"/>
<circle cx="381.8" cy="260.4" r="2.4"/>
<circle cx="382.5" cy="260.4" r="2.4"/>
<circle cx="383.6" cy="258.9" r="2.4"/>
</g>
<g class="cv-mark cv-w1">
<circle cx="373.0" cy="264.8" r="2.4"/>
<circle cx="373.0" cy="260.4" r="2.4"/>
<circle cx="373.0" cy="263.3" r="2.4"/>
<circle cx="373.0" cy="263.3" r="2.4"/>
<circle cx="373.0" cy="256.1" r="2.4"/>
<circle cx="373.1" cy="254.6" r="2.4"/>
<circle cx="373.0" cy="256.1" r="2.4"/>
<circle cx="373.1" cy="250.2" r="2.4"/>
<circle cx="373.1" cy="238.7" r="2.4"/>
<circle cx="373.1" cy="232.8" r="2.4"/>
<circle cx="373.2" cy="231.4" r="2.4"/>
<circle cx="373.2" cy="238.7" r="2.4"/>
<circle cx="373.3" cy="227.1" r="2.4"/>
<circle cx="373.2" cy="247.3" r="2.4"/>
<circle cx="373.2" cy="244.4" r="2.4"/>
<circle cx="373.3" cy="241.6" r="2.4"/>
<circle cx="373.3" cy="237.2" r="2.4"/>
<circle cx="373.4" cy="232.8" r="2.4"/>
<circle cx="373.7" cy="219.8" r="2.4"/>
<circle cx="373.8" cy="225.6" r="2.4"/>
<circle cx="374.1" cy="216.9" r="2.4"/>
<circle cx="374.1" cy="225.6" r="2.4"/>
<circle cx="374.9" cy="205.3" r="2.4"/>
<circle cx="375.6" cy="192.2" r="2.4"/>
<circle cx="376.3" cy="183.6" r="2.4"/>
<circle cx="376.6" cy="186.4" r="2.4"/>
<circle cx="376.8" cy="195.2" r="2.4"/>
<circle cx="380.6" cy="144.4" r="2.4"/>
<circle cx="382.5" cy="138.6" r="2.4"/>
<circle cx="383.2" cy="144.4" r="2.4"/>
<circle cx="384.1" cy="145.9" r="2.4"/>
<circle cx="385.2" cy="148.8" r="2.4"/>
<circle cx="386.6" cy="147.3" r="2.4"/>
<circle cx="388.9" cy="135.7" r="2.4"/>
<circle cx="387.4" cy="156.0" r="2.4"/>
<circle cx="388.1" cy="158.9" r="2.4"/>
<circle cx="388.7" cy="164.7" r="2.4"/>
<circle cx="388.5" cy="166.2" r="2.4"/>
<circle cx="388.7" cy="169.1" r="2.4"/>
<circle cx="388.3" cy="171.9" r="2.4"/>
<circle cx="387.0" cy="179.2" r="2.4"/>
<circle cx="385.7" cy="182.1" r="2.4"/>
<circle cx="384.3" cy="185.0" r="2.4"/>
<circle cx="383.5" cy="186.4" r="2.4"/>
<circle cx="383.2" cy="190.8" r="2.4"/>
<circle cx="383.1" cy="193.7" r="2.4"/>
<circle cx="383.0" cy="198.1" r="2.4"/>
<circle cx="383.1" cy="205.3" r="2.4"/>
<circle cx="383.0" cy="209.7" r="2.4"/>
<circle cx="382.8" cy="216.9" r="2.4"/>
<circle cx="382.6" cy="221.2" r="2.4"/>
<circle cx="382.4" cy="224.2" r="2.4"/>
<circle cx="381.4" cy="229.9" r="2.4"/>
<circle cx="380.9" cy="234.3" r="2.4"/>
<circle cx="380.5" cy="237.2" r="2.4"/>
<circle cx="380.2" cy="240.1" r="2.4"/>
<circle cx="380.1" cy="240.1" r="2.4"/>
<circle cx="379.9" cy="241.6" r="2.4"/>
<circle cx="379.4" cy="243.0" r="2.4"/>
<circle cx="378.7" cy="245.9" r="2.4"/>
<circle cx="378.1" cy="247.3" r="2.4"/>
<circle cx="377.6" cy="248.8" r="2.4"/>
<circle cx="377.1" cy="250.2" r="2.4"/>
<circle cx="376.6" cy="251.7" r="2.4"/>
</g>
<g class="cv-mark cv-w2">
<circle cx="382.4" cy="235.8" r="2.4"/>
<circle cx="383.3" cy="234.3" r="2.4"/>
<circle cx="384.1" cy="231.4" r="2.4"/>
<circle cx="385.6" cy="228.5" r="2.4"/>
<circle cx="386.8" cy="224.2" r="2.4"/>
<circle cx="388.6" cy="219.8" r="2.4"/>
<circle cx="390.9" cy="215.4" r="2.4"/>
<circle cx="392.6" cy="212.6" r="2.4"/>
<circle cx="394.1" cy="211.1" r="2.4"/>
<circle cx="395.7" cy="211.1" r="2.4"/>
<circle cx="397.1" cy="208.2" r="2.4"/>
<circle cx="399.3" cy="206.8" r="2.4"/>
<circle cx="400.6" cy="206.8" r="2.4"/>
<circle cx="402.0" cy="205.3" r="2.4"/>
<circle cx="403.7" cy="203.8" r="2.4"/>
<circle cx="405.0" cy="200.9" r="2.4"/>
<circle cx="406.4" cy="198.1" r="2.4"/>
<circle cx="408.6" cy="195.2" r="2.4"/>
<circle cx="409.3" cy="195.2" r="2.4"/>
<circle cx="411.3" cy="190.8" r="2.4"/>
<circle cx="412.9" cy="189.3" r="2.4"/>
<circle cx="413.6" cy="187.9" r="2.4"/>
<circle cx="414.6" cy="185.0" r="2.4"/>
<circle cx="413.8" cy="186.4" r="2.4"/>
<circle cx="414.4" cy="183.6" r="2.4"/>
<circle cx="415.8" cy="180.7" r="2.4"/>
<circle cx="416.5" cy="177.8" r="2.4"/>
<circle cx="416.6" cy="177.8" r="2.4"/>
<circle cx="417.5" cy="176.3" r="2.4"/>
<circle cx="416.2" cy="176.3" r="2.4"/>
<circle cx="416.3" cy="170.5" r="2.4"/>
<circle cx="416.9" cy="170.5" r="2.4"/>
<circle cx="417.4" cy="167.6" r="2.4"/>
<circle cx="417.0" cy="166.2" r="2.4"/>
<circle cx="416.3" cy="160.3" r="2.4"/>
<circle cx="414.6" cy="164.7" r="2.4"/>
<circle cx="412.8" cy="163.2" r="2.4"/>
<circle cx="411.6" cy="164.7" r="2.4"/>
<circle cx="410.7" cy="163.2" r="2.4"/>
<circle cx="409.3" cy="167.6" r="2.4"/>
<circle cx="408.3" cy="170.5" r="2.4"/>
<circle cx="407.9" cy="176.3" r="2.4"/>
<circle cx="409.4" cy="173.4" r="2.4"/>
<circle cx="409.8" cy="173.4" r="2.4"/>
<circle cx="410.6" cy="171.9" r="2.4"/>
<circle cx="410.3" cy="173.4" r="2.4"/>
<circle cx="410.6" cy="173.4" r="2.4"/>
<circle cx="410.4" cy="174.8" r="2.4"/>
<circle cx="410.2" cy="174.8" r="2.4"/>
<circle cx="408.9" cy="176.3" r="2.4"/>
<circle cx="408.9" cy="176.3" r="2.4"/>
<circle cx="409.4" cy="174.8" r="2.4"/>
<circle cx="409.2" cy="176.3" r="2.4"/>
<circle cx="408.6" cy="179.2" r="2.4"/>
<circle cx="408.6" cy="179.2" r="2.4"/>
<circle cx="408.1" cy="180.7" r="2.4"/>
<circle cx="408.4" cy="183.6" r="2.4"/>
<circle cx="408.3" cy="185.0" r="2.4"/>
<circle cx="407.9" cy="186.4" r="2.4"/>
<circle cx="408.8" cy="186.4" r="2.4"/>
<circle cx="409.9" cy="186.4" r="2.4"/>
<circle cx="411.1" cy="187.9" r="2.4"/>
<circle cx="413.2" cy="186.4" r="2.4"/>
<circle cx="414.4" cy="182.1" r="2.4"/>
<circle cx="415.2" cy="179.2" r="2.4"/>
<circle cx="415.6" cy="179.2" r="2.4"/>
<circle cx="416.7" cy="177.8" r="2.4"/>
<circle cx="417.7" cy="171.9" r="2.4"/>
<circle cx="422.2" cy="163.2" r="2.4"/>
<circle cx="424.4" cy="157.4" r="2.4"/>
<circle cx="427.3" cy="156.0" r="2.4"/>
<circle cx="429.4" cy="154.6" r="2.4"/>
<circle cx="433.4" cy="151.6" r="2.4"/>
<circle cx="437.8" cy="148.8" r="2.4"/>
<circle cx="442.3" cy="150.2" r="2.4"/>
<circle cx="445.2" cy="150.2" r="2.4"/>
<circle cx="450.6" cy="147.3" r="2.4"/>
<circle cx="455.6" cy="145.9" r="2.4"/>
<circle cx="460.0" cy="145.9" r="2.4"/>
<circle cx="463.6" cy="148.8" r="2.4"/>
<circle cx="468.8" cy="144.4" r="2.4"/>
<circle cx="476.2" cy="140.1" r="2.4"/>
<circle cx="478.3" cy="140.1" r="2.4"/>
<circle cx="482.8" cy="138.6" r="2.4"/>
<circle cx="487.7" cy="137.2" r="2.4"/>
<circle cx="491.7" cy="137.2" r="2.4"/>
<circle cx="489.5" cy="135.7" r="2.4"/>
<circle cx="486.1" cy="134.2" r="2.4"/>
<circle cx="491.5" cy="129.9" r="2.4"/>
<circle cx="500.8" cy="121.2" r="2.4"/>
<circle cx="511.2" cy="112.5" r="2.4"/>
<circle cx="522.2" cy="103.8" r="2.4"/>
<circle cx="529.8" cy="98.0" r="2.4"/>
<circle cx="532.8" cy="95.1" r="2.4"/>
<circle cx="523.0" cy="92.2" r="2.4"/>
<circle cx="515.6" cy="84.9" r="2.4"/>
<circle cx="522.7" cy="83.5" r="2.4"/>
<circle cx="520.9" cy="83.5" r="2.4"/>
<circle cx="516.0" cy="89.3" r="2.4"/>
<circle cx="504.1" cy="92.2" r="2.4"/>
<circle cx="502.3" cy="96.6" r="2.4"/>
<circle cx="518.9" cy="99.5" r="2.4"/>
<circle cx="517.9" cy="106.7" r="2.4"/>
<circle cx="500.1" cy="118.3" r="2.4"/>
<circle cx="485.6" cy="128.4" r="2.4"/>
<circle cx="470.7" cy="137.2" r="2.4"/>
<circle cx="464.6" cy="140.1" r="2.4"/>
<circle cx="459.9" cy="144.4" r="2.4"/>
<circle cx="450.6" cy="156.0" r="2.4"/>
<circle cx="441.9" cy="169.1" r="2.4"/>
<circle cx="434.5" cy="176.3" r="2.4"/>
<circle cx="426.7" cy="185.0" r="2.4"/>
<circle cx="421.4" cy="192.2" r="2.4"/>
<circle cx="419.5" cy="196.6" r="2.4"/>
<circle cx="416.9" cy="200.9" r="2.4"/>
<circle cx="410.9" cy="209.7" r="2.4"/>
<circle cx="406.7" cy="215.4" r="2.4"/>
<circle cx="403.3" cy="222.7" r="2.4"/>
<circle cx="401.2" cy="225.6" r="2.4"/>
<circle cx="398.8" cy="228.5" r="2.4"/>
<circle cx="398.2" cy="228.5" r="2.4"/>
<circle cx="397.1" cy="228.5" r="2.4"/>
<circle cx="394.8" cy="232.8" r="2.4"/>
<circle cx="393.7" cy="234.3" r="2.4"/>
<circle cx="392.0" cy="235.8" r="2.4"/>
<circle cx="390.6" cy="238.7" r="2.4"/>
<circle cx="390.0" cy="240.1" r="2.4"/>
<circle cx="389.9" cy="241.6" r="2.4"/>
<circle cx="390.1" cy="240.1" r="2.4"/>
<circle cx="389.8" cy="240.1" r="2.4"/>
<circle cx="389.6" cy="241.6" r="2.4"/>
<circle cx="389.8" cy="241.6" r="2.4"/>
<circle cx="389.5" cy="241.6" r="2.4"/>
<circle cx="389.6" cy="241.6" r="2.4"/>
</g>
<g class="cv-mark cv-w3">
<circle cx="389.0" cy="241.6" r="2.4"/>
<circle cx="388.8" cy="243.0" r="2.4"/>
<circle cx="388.2" cy="244.4" r="2.4"/>
<circle cx="388.1" cy="244.4" r="2.4"/>
<circle cx="389.1" cy="243.0" r="2.4"/>
<circle cx="389.4" cy="243.0" r="2.4"/>
<circle cx="389.7" cy="243.0" r="2.4"/>
<circle cx="390.0" cy="243.0" r="2.4"/>
<circle cx="390.6" cy="243.0" r="2.4"/>
<circle cx="391.1" cy="243.0" r="2.4"/>
<circle cx="391.2" cy="244.4" r="2.4"/>
<circle cx="391.0" cy="245.9" r="2.4"/>
<circle cx="391.0" cy="245.9" r="2.4"/>
<circle cx="391.5" cy="245.9" r="2.4"/>
<circle cx="392.0" cy="245.9" r="2.4"/>
<circle cx="392.3" cy="245.9" r="2.4"/>
<circle cx="392.4" cy="245.9" r="2.4"/>
<circle cx="393.5" cy="245.9" r="2.4"/>
<circle cx="394.6" cy="244.4" r="2.4"/>
<circle cx="395.6" cy="244.4" r="2.4"/>
<circle cx="396.1" cy="243.0" r="2.4"/>
<circle cx="397.1" cy="243.0" r="2.4"/>
<circle cx="398.2" cy="241.6" r="2.4"/>
<circle cx="399.4" cy="241.6" r="2.4"/>
<circle cx="401.2" cy="240.1" r="2.4"/>
<circle cx="402.5" cy="240.1" r="2.4"/>
<circle cx="401.3" cy="241.6" r="2.4"/>
<circle cx="405.4" cy="238.7" r="2.4"/>
<circle cx="405.6" cy="238.7" r="2.4"/>
<circle cx="407.9" cy="237.2" r="2.4"/>
<circle cx="409.0" cy="235.8" r="2.4"/>
<circle cx="410.5" cy="235.8" r="2.4"/>
<circle cx="413.0" cy="234.3" r="2.4"/>
<circle cx="413.6" cy="234.3" r="2.4"/>
<circle cx="416.5" cy="234.3" r="2.4"/>
<circle cx="417.6" cy="232.8" r="2.4"/>
<circle cx="419.2" cy="232.8" r="2.4"/>
<circle cx="417.9" cy="234.3" r="2.4"/>
<circle cx="426.7" cy="228.5" r="2.4"/>
<circle cx="429.7" cy="227.1" r="2.4"/>
<circle cx="434.4" cy="222.7" r="2.4"/>
<circle cx="435.2" cy="224.2" r="2.4"/>
<circle cx="437.0" cy="224.2" r="2.4"/>
<circle cx="441.2" cy="222.7" r="2.4"/>
<circle cx="452.5" cy="215.4" r="2.4"/>
<circle cx="445.7" cy="221.2" r="2.4"/>
<circle cx="452.0" cy="219.8" r="2.4"/>
<circle cx="461.2" cy="214.0" r="2.4"/>
<circle cx="466.8" cy="209.7" r="2.4"/>
<circle cx="470.2" cy="208.2" r="2.4"/>
<circle cx="478.6" cy="203.8" r="2.4"/>
<circle cx="481.8" cy="202.4" r="2.4"/>
<circle cx="487.8" cy="198.1" r="2.4"/>
<circle cx="495.2" cy="195.2" r="2.4"/>
<circle cx="497.1" cy="195.2" r="2.4"/>
<circle cx="504.5" cy="192.2" r="2.4"/>
<circle cx="518.8" cy="185.0" r="2.4"/>
<circle cx="521.8" cy="185.0" r="2.4"/>
<circle cx="532.1" cy="180.7" r="2.4"/>
<circle cx="543.5" cy="176.3" r="2.4"/>
<circle cx="546.8" cy="176.3" r="2.4"/>
<circle cx="550.7" cy="176.3" r="2.4"/>
<circle cx="557.2" cy="173.4" r="2.4"/>
<circle cx="554.1" cy="177.8" r="2.4"/>
<circle cx="565.5" cy="173.4" r="2.4"/>
<circle cx="569.2" cy="171.9" r="2.4"/>
<circle cx="579.0" cy="166.2" r="2.4"/>
<circle cx="586.8" cy="163.2" r="2.4"/>
<circle cx="582.9" cy="163.2" r="2.4"/>
<circle cx="584.2" cy="161.8" r="2.4"/>
<circle cx="592.6" cy="153.1" r="2.4"/>
<circle cx="581.0" cy="154.6" r="2.4"/>
<circle cx="575.2" cy="154.6" r="2.4"/>
<circle cx="575.9" cy="148.8" r="2.4"/>
<circle cx="566.0" cy="145.9" r="2.4"/>
<circle cx="569.4" cy="140.1" r="2.4"/>
<circle cx="556.6" cy="140.1" r="2.4"/>
<circle cx="539.3" cy="150.2" r="2.4"/>
<circle cx="528.8" cy="156.0" r="2.4"/>
<circle cx="533.2" cy="150.2" r="2.4"/>
<circle cx="539.4" cy="143.0" r="2.4"/>
<circle cx="540.4" cy="141.5" r="2.4"/>
<circle cx="536.6" cy="141.5" r="2.4"/>
<circle cx="536.1" cy="141.5" r="2.4"/>
<circle cx="540.5" cy="137.2" r="2.4"/>
<circle cx="559.2" cy="122.7" r="2.4"/>
<circle cx="556.1" cy="127.0" r="2.4"/>
<circle cx="545.0" cy="135.7" r="2.4"/>
<circle cx="543.0" cy="138.6" r="2.4"/>
<circle cx="543.5" cy="141.5" r="2.4"/>
<circle cx="543.2" cy="141.5" r="2.4"/>
<circle cx="550.1" cy="135.7" r="2.4"/>
<circle cx="534.1" cy="148.8" r="2.4"/>
<circle cx="532.1" cy="147.3" r="2.4"/>
<circle cx="521.6" cy="154.6" r="2.4"/>
<circle cx="515.6" cy="157.4" r="2.4"/>
<circle cx="510.8" cy="157.4" r="2.4"/>
<circle cx="504.9" cy="160.3" r="2.4"/>
<circle cx="490.4" cy="171.9" r="2.4"/>
<circle cx="495.8" cy="161.8" r="2.4"/>
<circle cx="485.3" cy="170.5" r="2.4"/>
<circle cx="478.1" cy="173.4" r="2.4"/>
<circle cx="471.7" cy="174.8" r="2.4"/>
<circle cx="466.7" cy="177.8" r="2.4"/>
<circle cx="455.5" cy="187.9" r="2.4"/>
<circle cx="466.4" cy="177.8" r="2.4"/>
<circle cx="462.9" cy="180.7" r="2.4"/>
<circle cx="463.9" cy="179.2" r="2.4"/>
<circle cx="464.4" cy="180.7" r="2.4"/>
<circle cx="466.8" cy="182.1" r="2.4"/>
<circle cx="468.6" cy="182.1" r="2.4"/>
<circle cx="477.9" cy="173.4" r="2.4"/>
<circle cx="466.7" cy="185.0" r="2.4"/>
<circle cx="463.8" cy="192.2" r="2.4"/>
<circle cx="466.3" cy="192.2" r="2.4"/>
<circle cx="466.6" cy="195.2" r="2.4"/>
<circle cx="466.4" cy="198.1" r="2.4"/>
<circle cx="466.4" cy="203.8" r="2.4"/>
<circle cx="469.0" cy="203.8" r="2.4"/>
<circle cx="466.7" cy="206.8" r="2.4"/>
<circle cx="464.5" cy="208.2" r="2.4"/>
<circle cx="456.8" cy="214.0" r="2.4"/>
<circle cx="453.1" cy="216.9" r="2.4"/>
<circle cx="448.8" cy="218.3" r="2.4"/>
<circle cx="444.8" cy="219.8" r="2.4"/>
<circle cx="438.7" cy="222.7" r="2.4"/>
<circle cx="436.3" cy="224.2" r="2.4"/>
<circle cx="430.5" cy="227.1" r="2.4"/>
<circle cx="425.5" cy="229.9" r="2.4"/>
<circle cx="419.2" cy="232.8" r="2.4"/>
<circle cx="414.2" cy="235.8" r="2.4"/>
<circle cx="410.9" cy="237.2" r="2.4"/>
<circle cx="407.3" cy="240.1" r="2.4"/>
<circle cx="405.0" cy="241.6" r="2.4"/>
<circle cx="401.6" cy="243.0" r="2.4"/>
<circle cx="398.4" cy="244.4" r="2.4"/>
<circle cx="394.3" cy="245.9" r="2.4"/>
<circle cx="392.2" cy="248.8" r="2.4"/>
<circle cx="390.4" cy="250.2" r="2.4"/>
<circle cx="388.1" cy="253.2" r="2.4"/>
<circle cx="388.1" cy="250.2" r="2.4"/>
<circle cx="385.2" cy="253.2" r="2.4"/>
<circle cx="383.7" cy="256.1" r="2.4"/>
<circle cx="384.2" cy="254.6" r="2.4"/>
<circle cx="382.5" cy="256.1" r="2.4"/>
<circle cx="381.5" cy="256.1" r="2.4"/>
<circle cx="382.8" cy="253.2" r="2.4"/>
<circle cx="381.5" cy="257.5" r="2.4"/>
<circle cx="382.0" cy="257.5" r="2.4"/>
<circle cx="381.3" cy="258.9" r="2.4"/>
<circle cx="380.7" cy="260.4" r="2.4"/>
<circle cx="380.4" cy="260.4" r="2.4"/>
<circle cx="380.2" cy="261.9" r="2.4"/>
<circle cx="379.3" cy="261.9" r="2.4"/>
<circle cx="379.1" cy="263.3" r="2.4"/>
<circle cx="378.7" cy="263.3" r="2.4"/>
<circle cx="378.1" cy="264.8" r="2.4"/>
<circle cx="378.0" cy="264.8" r="2.4"/>
<circle cx="378.2" cy="264.8" r="2.4"/>
<circle cx="377.6" cy="264.8" r="2.4"/>
<circle cx="376.9" cy="266.2" r="2.4"/>
<circle cx="377.1" cy="266.2" r="2.4"/>
<circle cx="376.9" cy="266.2" r="2.4"/>
<circle cx="376.7" cy="266.2" r="2.4"/>
<circle cx="376.3" cy="266.2" r="2.4"/>
<circle cx="376.3" cy="266.2" r="2.4"/>
<circle cx="376.5" cy="266.2" r="2.4"/>
<circle cx="377.0" cy="266.2" r="2.4"/>
<circle cx="376.6" cy="266.2" r="2.4"/>
<circle cx="376.2" cy="266.2" r="2.4"/>
<circle cx="376.1" cy="266.2" r="2.4"/>
<circle cx="376.0" cy="266.2" r="2.4"/>
<circle cx="375.2" cy="267.6" r="2.4"/>
<circle cx="375.1" cy="267.6" r="2.4"/>
<circle cx="374.8" cy="269.1" r="2.4"/>
<circle cx="374.9" cy="267.6" r="2.4"/>
<circle cx="374.9" cy="267.6" r="2.4"/>
<circle cx="374.7" cy="269.1" r="2.4"/>
<circle cx="374.6" cy="269.1" r="2.4"/>
<circle cx="374.5" cy="269.1" r="2.4"/>
<circle cx="374.4" cy="269.1" r="2.4"/>
<circle cx="374.5" cy="269.1" r="2.4"/>
<circle cx="374.2" cy="269.1" r="2.4"/>
<circle cx="374.2" cy="269.1" r="2.4"/>
<circle cx="374.1" cy="269.1" r="2.4"/>
<circle cx="374.0" cy="270.6" r="2.4"/>
<circle cx="373.8" cy="270.6" r="2.4"/>
<circle cx="373.8" cy="270.6" r="2.4"/>
<circle cx="373.8" cy="270.6" r="2.4"/>
<circle cx="373.8" cy="270.6" r="2.4"/>
<circle cx="373.7" cy="269.1" r="2.4"/>
<circle cx="373.6" cy="270.6" r="2.4"/>
<circle cx="373.7" cy="269.1" r="2.4"/>
<circle cx="373.7" cy="269.1" r="2.4"/>
<circle cx="373.8" cy="269.1" r="2.4"/>
<circle cx="373.7" cy="270.6" r="2.4"/>
<circle cx="373.7" cy="270.6" r="2.4"/>
<circle cx="373.8" cy="270.6" r="2.4"/>
<circle cx="373.8" cy="270.6" r="2.4"/>
<circle cx="373.7" cy="270.6" r="2.4"/>
<circle cx="373.6" cy="270.6" r="2.4"/>
<circle cx="373.5" cy="270.6" r="2.4"/>
<circle cx="373.5" cy="270.6" r="2.4"/>
<circle cx="373.5" cy="270.6" r="2.4"/>
<circle cx="373.4" cy="270.6" r="2.4"/>
<circle cx="373.4" cy="270.6" r="2.4"/>
<circle cx="373.4" cy="270.6" r="2.4"/>
<circle cx="373.4" cy="270.6" r="2.4"/>
<circle cx="373.4" cy="270.6" r="2.4"/>
<circle cx="373.4" cy="270.6" r="2.4"/>
<circle cx="373.4" cy="270.6" r="2.4"/>
<circle cx="373.4" cy="270.6" r="2.4"/>
<circle cx="373.3" cy="270.6" r="2.4"/>
<circle cx="373.2" cy="270.6" r="2.4"/>
<circle cx="373.4" cy="270.6" r="2.4"/>
<circle cx="373.4" cy="270.6" r="2.4"/>
<circle cx="373.3" cy="270.6" r="2.4"/>
<circle cx="373.3" cy="270.6" r="2.4"/>
<circle cx="373.4" cy="270.6" r="2.4"/>
<circle cx="373.4" cy="270.6" r="2.4"/>
<circle cx="373.5" cy="270.6" r="2.4"/>
<circle cx="373.4" cy="270.6" r="2.4"/>
<circle cx="373.4" cy="270.6" r="2.4"/>
<circle cx="373.6" cy="270.6" r="2.4"/>
<circle cx="373.7" cy="270.6" r="2.4"/>
<circle cx="374.1" cy="269.1" r="2.4"/>
<circle cx="374.4" cy="269.1" r="2.4"/>
<circle cx="374.8" cy="267.6" r="2.4"/>
<circle cx="375.5" cy="266.2" r="2.4"/>
<circle cx="376.2" cy="266.2" r="2.4"/>
<circle cx="376.6" cy="264.8" r="2.4"/>
<circle cx="376.7" cy="264.8" r="2.4"/>
<circle cx="377.4" cy="264.8" r="2.4"/>
<circle cx="378.1" cy="263.3" r="2.4"/>
<circle cx="378.6" cy="263.3" r="2.4"/>
</g>
<g class="cv-mark cv-w4">
<circle cx="383.9" cy="258.9" r="2.4"/>
<circle cx="384.5" cy="258.9" r="2.4"/>
<circle cx="384.5" cy="258.9" r="2.4"/>
<circle cx="383.4" cy="260.4" r="2.4"/>
<circle cx="386.5" cy="257.5" r="2.4"/>
<circle cx="387.3" cy="257.5" r="2.4"/>
<circle cx="388.6" cy="256.1" r="2.4"/>
<circle cx="390.2" cy="256.1" r="2.4"/>
<circle cx="391.8" cy="253.2" r="2.4"/>
<circle cx="393.3" cy="253.2" r="2.4"/>
<circle cx="397.1" cy="250.2" r="2.4"/>
<circle cx="397.9" cy="251.7" r="2.4"/>
<circle cx="399.3" cy="250.2" r="2.4"/>
<circle cx="401.1" cy="250.2" r="2.4"/>
<circle cx="401.6" cy="250.2" r="2.4"/>
<circle cx="403.7" cy="250.2" r="2.4"/>
<circle cx="405.5" cy="248.8" r="2.4"/>
<circle cx="408.6" cy="248.8" r="2.4"/>
<circle cx="411.1" cy="247.3" r="2.4"/>
<circle cx="415.5" cy="244.4" r="2.4"/>
<circle cx="416.9" cy="244.4" r="2.4"/>
<circle cx="421.6" cy="243.0" r="2.4"/>
<circle cx="426.2" cy="240.1" r="2.4"/>
<circle cx="428.1" cy="240.1" r="2.4"/>
<circle cx="434.6" cy="235.8" r="2.4"/>
<circle cx="438.1" cy="234.3" r="2.4"/>
<circle cx="440.4" cy="234.3" r="2.4"/>
<circle cx="449.9" cy="229.9" r="2.4"/>
<circle cx="452.2" cy="228.5" r="2.4"/>
<circle cx="457.8" cy="225.6" r="2.4"/>
<circle cx="462.8" cy="224.2" r="2.4"/>
<circle cx="470.3" cy="222.7" r="2.4"/>
<circle cx="474.0" cy="221.2" r="2.4"/>
<circle cx="491.1" cy="215.4" r="2.4"/>
<circle cx="498.7" cy="212.6" r="2.4"/>
<circle cx="504.6" cy="211.1" r="2.4"/>
<circle cx="509.7" cy="208.2" r="2.4"/>
<circle cx="514.4" cy="205.3" r="2.4"/>
<circle cx="524.5" cy="202.4" r="2.4"/>
<circle cx="539.4" cy="196.6" r="2.4"/>
<circle cx="532.9" cy="200.9" r="2.4"/>
<circle cx="539.8" cy="198.1" r="2.4"/>
<circle cx="551.0" cy="195.2" r="2.4"/>
<circle cx="557.1" cy="195.2" r="2.4"/>
<circle cx="559.1" cy="195.2" r="2.4"/>
<circle cx="558.7" cy="195.2" r="2.4"/>
<circle cx="572.8" cy="190.8" r="2.4"/>
<circle cx="575.4" cy="189.3" r="2.4"/>
<circle cx="582.8" cy="186.4" r="2.4"/>
<circle cx="578.2" cy="187.9" r="2.4"/>
<circle cx="592.4" cy="182.1" r="2.4"/>
<circle cx="595.2" cy="179.2" r="2.4"/>
<circle cx="599.9" cy="176.3" r="2.4"/>
<circle cx="573.6" cy="187.9" r="2.4"/>
<circle cx="610.0" cy="173.4" r="2.4"/>
<circle cx="622.6" cy="166.2" r="2.4"/>
<circle cx="628.9" cy="164.7" r="2.4"/>
<circle cx="617.3" cy="167.6" r="2.4"/>
<circle cx="613.1" cy="171.9" r="2.4"/>
<circle cx="577.1" cy="190.8" r="2.4"/>
<circle cx="559.4" cy="192.2" r="2.4"/>
<circle cx="580.0" cy="174.8" r="2.4"/>
<circle cx="551.5" cy="187.9" r="2.4"/>
<circle cx="552.4" cy="189.3" r="2.4"/>
<circle cx="564.8" cy="190.8" r="2.4"/>
<circle cx="571.8" cy="192.2" r="2.4"/>
<circle cx="614.8" cy="174.8" r="2.4"/>
<circle cx="653.8" cy="167.6" r="2.4"/>
<circle cx="599.7" cy="195.2" r="2.4"/>
<circle cx="600.3" cy="187.9" r="2.4"/>
<circle cx="580.9" cy="189.3" r="2.4"/>
<circle cx="572.1" cy="190.8" r="2.4"/>
<circle cx="576.3" cy="186.4" r="2.4"/>
<circle cx="558.6" cy="193.7" r="2.4"/>
<circle cx="545.7" cy="193.7" r="2.4"/>
<circle cx="538.2" cy="192.2" r="2.4"/>
<circle cx="540.2" cy="198.1" r="2.4"/>
<circle cx="537.3" cy="202.4" r="2.4"/>
<circle cx="527.8" cy="200.9" r="2.4"/>
<circle cx="511.5" cy="205.3" r="2.4"/>
<circle cx="500.9" cy="202.4" r="2.4"/>
</g>
</g>
<text class="cv-legend-title" x="66" y="56">Waves</text>
<circle class="cv-mark cv-between" cx="69" cy="67.5" r="3.2"/>
<text class="cv-legend" x="79" y="71">in between</text>
<circle class="cv-mark cv-w1" cx="173" cy="67.5" r="3.2"/>
<text class="cv-legend" x="183" y="71">1st</text>
<circle class="cv-mark cv-w2" cx="69" cy="82.5" r="3.2"/>
<text class="cv-legend" x="79" y="86">2nd</text>
<circle class="cv-mark cv-w3" cx="173" cy="82.5" r="3.2"/>
<text class="cv-legend" x="183" y="86">3rd</text>
<circle class="cv-mark cv-w4" cx="69" cy="97.5" r="3.2"/>
<text class="cv-legend" x="79" y="101">4th</text>
<text class="cv-axis-title" x="336" y="332">Incidence</text>
<text class="cv-axis-title" x="12" y="156" transform="rotate(-90 12 156)">Positive rate</text>
</svg>
<figcaption>Germany, where the positive rate is only reported weekly, and Israel daily. Each wave is its own band: the same incidence sits at very different positive rates depending on when it was measured.</figcaption>
</figure>

Israel, on the right, shows the mechanism cleanly, because the waves separate
into distinct lines. They get flatter from wave to wave: the same incidence
arrives with a lower and lower positive rate. That is testing volume rising —
at peak incidence Israel ran 1.5 tests per 1,000 people in the first wave,
5.8 in the second, 12.8 in the third and 19 in the fourth. Read the other
way, the first wave is the steep blue line, and steep is bad: a high positive
rate off very few detected cases means far more infections went unseen then
than in any later wave. The incidence understated the pandemic most exactly
when it was newest.

The correction is cheap, because the positive rate is already collected —
though it was not published per district, which is the scale the rules were
set at. It can also be more than a correction: hold the positive rate down and
you are testing widely enough to catch outbreaks while they are small, which
makes it a target for testing policy rather than only a reading of it. Denmark
is the illustration: the only European country through just two waves by late 2021,
and the only one holding a mostly constant positive rate below 2%.

## The same number means different things depending on how full the ICUs are

An incidence of 400 is not one situation. It depends entirely on how much
headroom the hospitals have when it arrives.

Italy's second wave peaked near an incidence of 600; its third peaked below
400. Yet ICU patients per million peaked at roughly the same level — about 60
— in both. The reason is what the third wave started from: half the ICU beds
were still occupied in March 2021, before it began.

<figure class="cv__figure">
<svg class="cv-fig" viewBox="0 0 672 356" role="img" aria-labelledby="cv2-t cv2-d">
<title id="cv2-t">Italy: incidence, positive rate and ICU occupancy</title>
<desc id="cv2-d">Three series on three separate vertical scales. The second wave peaks near an incidence of 600 and the third below 400, but ICU patients per million reach roughly the same height in both.</desc>
<text class="cv-title" x="296" y="16">Italy</text>
<g class="cv-axis"><line x1="46" y1="276" x2="546" y2="276"/><line x1="46" y1="26" x2="46" y2="276"/><line x1="546" y1="26" x2="546" y2="276"/><line x1="598" y1="26" x2="598" y2="276"/></g>
<g class="cv-tick"><line x1="117.5" y1="276" x2="117.5" y2="280"/><text class="cv-ticklabel" x="117.5" y="292">May</text></g>
<g class="cv-tick"><line x1="194.1" y1="276" x2="194.1" y2="280"/><text class="cv-ticklabel" x="194.1" y="292">Aug</text></g>
<g class="cv-tick"><line x1="270.6" y1="276" x2="270.6" y2="280"/><text class="cv-ticklabel" x="270.6" y="292">Nov</text></g>
<g class="cv-tick"><line x1="347.2" y1="276" x2="347.2" y2="280"/><text class="cv-ticklabel" x="347.2" y="292">Feb</text></g>
<g class="cv-tick"><line x1="421.2" y1="276" x2="421.2" y2="280"/><text class="cv-ticklabel" x="421.2" y="292">May</text></g>
<g class="cv-tick"><line x1="497.7" y1="276" x2="497.7" y2="280"/><text class="cv-ticklabel" x="497.7" y="292">Aug</text></g>
<g class="cv-tick"><line x1="42" y1="276.0" x2="46" y2="276.0"/><text class="cv-ticklabel cv-ticklabel--y" x="38" y="279.5">0</text></g>
<g class="cv-tick"><line x1="42" y1="234.3" x2="46" y2="234.3"/><text class="cv-ticklabel cv-ticklabel--y" x="38" y="237.8">100</text></g>
<g class="cv-tick"><line x1="42" y1="192.7" x2="46" y2="192.7"/><text class="cv-ticklabel cv-ticklabel--y" x="38" y="196.2">200</text></g>
<g class="cv-tick"><line x1="42" y1="151.0" x2="46" y2="151.0"/><text class="cv-ticklabel cv-ticklabel--y" x="38" y="154.5">300</text></g>
<g class="cv-tick"><line x1="42" y1="109.3" x2="46" y2="109.3"/><text class="cv-ticklabel cv-ticklabel--y" x="38" y="112.8">400</text></g>
<g class="cv-tick"><line x1="42" y1="67.7" x2="46" y2="67.7"/><text class="cv-ticklabel cv-ticklabel--y" x="38" y="71.2">500</text></g>
<g class="cv-tick"><line x1="42" y1="26.0" x2="46" y2="26.0"/><text class="cv-ticklabel cv-ticklabel--y" x="38" y="29.5">600</text></g>
<g class="cv-tick"><line x1="546" y1="276.0" x2="550" y2="276.0"/><text class="cv-ticklabel cv-ticklabel--r" x="554" y="279.5">0</text></g>
<g class="cv-tick"><line x1="546" y1="240.3" x2="550" y2="240.3"/><text class="cv-ticklabel cv-ticklabel--r" x="554" y="243.8">10</text></g>
<g class="cv-tick"><line x1="546" y1="204.6" x2="550" y2="204.6"/><text class="cv-ticklabel cv-ticklabel--r" x="554" y="208.1">20</text></g>
<g class="cv-tick"><line x1="546" y1="168.9" x2="550" y2="168.9"/><text class="cv-ticklabel cv-ticklabel--r" x="554" y="172.4">30</text></g>
<g class="cv-tick"><line x1="546" y1="133.1" x2="550" y2="133.1"/><text class="cv-ticklabel cv-ticklabel--r" x="554" y="136.6">40</text></g>
<g class="cv-tick"><line x1="546" y1="97.4" x2="550" y2="97.4"/><text class="cv-ticklabel cv-ticklabel--r" x="554" y="100.9">50</text></g>
<g class="cv-tick"><line x1="546" y1="61.7" x2="550" y2="61.7"/><text class="cv-ticklabel cv-ticklabel--r" x="554" y="65.2">60</text></g>
<g class="cv-tick"><line x1="546" y1="26.0" x2="550" y2="26.0"/><text class="cv-ticklabel cv-ticklabel--r" x="554" y="29.5">70</text></g>
<g class="cv-tick"><line x1="598" y1="276.0" x2="602" y2="276.0"/><text class="cv-ticklabel cv-ticklabel--r" x="606" y="279.5">0.00</text></g>
<g class="cv-tick"><line x1="598" y1="226.0" x2="602" y2="226.0"/><text class="cv-ticklabel cv-ticklabel--r" x="606" y="229.5">0.05</text></g>
<g class="cv-tick"><line x1="598" y1="176.0" x2="602" y2="176.0"/><text class="cv-ticklabel cv-ticklabel--r" x="606" y="179.5">0.10</text></g>
<g class="cv-tick"><line x1="598" y1="126.0" x2="602" y2="126.0"/><text class="cv-ticklabel cv-ticklabel--r" x="606" y="129.5">0.15</text></g>
<g class="cv-tick"><line x1="598" y1="76.0" x2="602" y2="76.0"/><text class="cv-ticklabel cv-ticklabel--r" x="606" y="79.5">0.20</text></g>
<g class="cv-tick"><line x1="598" y1="26.0" x2="602" y2="26.0"/><text class="cv-ticklabel cv-ticklabel--r" x="606" y="29.5">0.25</text></g>
<path class="cv-line cv-inc" d="M46.0 276.0 L46.8 276.0 L47.7 276.0 L48.5 276.0 L49.3 276.0 L50.2 276.0 L51.0 276.0 L51.8 276.0 L52.7 276.0 L53.5 276.0 L54.3 276.0 L55.2 276.0 L56.0 276.0 L56.8 276.0 L57.6 276.0 L58.5 276.0 L59.3 276.0 L60.1 275.9 L61.0 275.9 L61.8 275.8 L62.6 275.7 L63.5 275.6 L64.3 275.4 L65.1 275.1 L66.0 274.9 L66.8 274.5 L67.6 274.2 L68.5 273.9 L69.3 273.4 L70.1 272.8 L71.0 272.3 L71.8 271.3 L72.6 270.4 L73.5 269.0 L74.3 268.5 L75.1 266.8 L76.0 264.9 L76.8 263.2 L77.6 260.9 L78.4 258.9 L79.3 257.5 L80.1 254.9 L80.9 253.1 L81.8 250.4 L82.6 247.0 L83.4 244.0 L84.3 242.1 L85.1 240.6 L85.9 238.9 L86.8 237.9 L87.6 237.0 L88.4 237.1 L89.3 237.6 L90.1 238.0 L90.9 238.7 L91.8 239.9 L92.6 240.3 L93.4 241.8 L94.3 243.1 L95.1 244.3 L95.9 245.2 L96.7 245.6 L97.6 246.6 L98.4 247.6 L99.2 248.0 L100.1 248.6 L100.9 248.7 L101.7 249.0 L102.6 249.4 L103.4 249.5 L104.2 250.6 L105.1 251.0 L105.9 251.5 L106.7 252.7 L107.6 253.7 L108.4 254.6 L109.2 254.8 L110.1 254.1 L110.9 255.3 L111.7 255.7 L112.6 256.8 L113.4 257.6 L114.2 258.1 L115.1 258.7 L115.9 260.0 L116.7 260.7 L117.5 261.8 L118.4 262.2 L119.2 263.1 L120.0 263.7 L120.9 264.7 L121.7 265.3 L122.5 265.8 L123.4 266.4 L124.2 267.2 L125.0 267.8 L125.9 268.2 L126.7 267.9 L127.5 268.5 L128.4 268.9 L129.2 269.4 L130.0 269.6 L130.9 269.7 L131.7 270.0 L132.5 270.6 L133.4 270.8 L134.2 271.2 L135.0 271.3 L135.9 271.5 L136.7 271.6 L137.5 271.8 L138.3 272.2 L139.2 272.3 L140.0 272.3 L140.8 272.5 L141.7 272.7 L142.5 272.9 L143.3 273.0 L144.2 273.1 L145.0 273.3 L145.8 273.8 L146.7 273.7 L147.5 273.9 L148.3 274.0 L149.2 273.9 L150.0 274.0 L150.8 274.1 L151.7 273.9 L152.5 274.3 L153.3 274.2 L154.2 274.0 L155.0 274.0 L155.8 274.1 L156.6 274.0 L157.5 274.0 L158.3 274.3 L159.1 274.4 L160.0 274.5 L160.8 274.6 L161.6 274.7 L162.5 274.4 L163.3 274.5 L164.1 274.1 L165.0 274.2 L165.8 274.2 L166.6 274.3 L167.5 274.3 L168.3 274.7 L169.1 274.8 L170.0 274.8 L170.8 274.7 L171.6 274.7 L172.5 274.6 L173.3 274.6 L174.1 274.6 L175.0 274.6 L175.8 274.6 L176.6 274.6 L177.4 274.6 L178.3 274.6 L179.1 274.6 L179.9 274.7 L180.8 274.6 L181.6 274.7 L182.4 274.6 L183.3 274.6 L184.1 274.6 L184.9 274.6 L185.8 274.5 L186.6 274.4 L187.4 274.4 L188.3 274.4 L189.1 274.3 L189.9 274.4 L190.8 274.3 L191.6 274.3 L192.4 274.2 L193.3 274.1 L194.1 274.1 L194.9 274.1 L195.8 274.1 L196.6 274.1 L197.4 274.0 L198.2 274.0 L199.1 273.8 L199.9 273.8 L200.7 273.5 L201.6 273.4 L202.4 273.2 L203.2 273.1 L204.1 273.0 L204.9 273.0 L205.7 272.7 L206.6 272.7 L207.4 272.6 L208.2 272.6 L209.1 272.5 L209.9 272.2 L210.7 271.8 L211.6 271.4 L212.4 270.6 L213.2 270.0 L214.1 269.6 L214.9 268.8 L215.7 268.3 L216.5 267.8 L217.4 267.4 L218.2 267.3 L219.0 267.2 L219.9 267.1 L220.7 267.2 L221.5 267.2 L222.4 266.9 L223.2 266.6 L224.0 266.7 L224.9 266.6 L225.7 266.2 L226.5 266.1 L227.4 265.9 L228.2 266.0 L229.0 266.2 L229.9 266.0 L230.7 266.2 L231.5 266.3 L232.4 266.3 L233.2 266.3 L234.0 266.0 L234.9 265.9 L235.7 265.7 L236.5 265.4 L237.3 265.2 L238.2 265.1 L239.0 264.9 L239.8 264.9 L240.7 264.6 L241.5 264.4 L242.3 264.3 L243.2 264.1 L244.0 263.8 L244.8 263.1 L245.7 262.5 L246.5 261.6 L247.3 260.8 L248.2 260.0 L249.0 259.0 L249.8 257.2 L250.7 255.3 L251.5 252.5 L252.3 249.6 L253.2 246.8 L254.0 244.5 L254.8 241.3 L255.7 237.7 L256.5 233.4 L257.3 228.8 L258.1 223.7 L259.0 217.5 L259.8 212.9 L260.6 208.0 L261.5 200.2 L262.3 193.1 L263.1 184.0 L264.0 175.5 L264.8 166.0 L265.6 158.5 L266.5 147.5 L267.3 137.8 L268.1 127.2 L269.0 115.5 L269.8 103.5 L270.6 95.0 L271.5 89.8 L272.3 83.7 L273.1 78.2 L274.0 70.6 L274.8 64.0 L275.6 56.1 L276.4 53.4 L277.3 50.4 L278.1 43.7 L278.9 41.3 L279.8 37.9 L280.6 34.8 L281.4 37.3 L282.3 36.0 L283.1 33.9 L283.9 36.8 L284.8 35.5 L285.6 37.3 L286.4 40.9 L287.3 43.3 L288.1 48.9 L288.9 53.2 L289.8 62.1 L290.6 70.4 L291.4 77.5 L292.3 86.2 L293.1 94.6 L293.9 102.2 L294.8 108.6 L295.6 112.4 L296.4 117.5 L297.2 123.2 L298.1 127.4 L298.9 132.6 L299.7 134.3 L300.6 137.0 L301.4 141.4 L302.2 149.3 L303.1 155.4 L303.9 160.7 L304.7 161.8 L305.6 162.8 L306.4 164.4 L307.2 164.4 L308.1 159.7 L308.9 158.4 L309.7 161.7 L310.6 165.3 L311.4 168.1 L312.2 169.2 L313.1 170.7 L313.9 174.3 L314.7 174.5 L315.6 170.9 L316.4 176.7 L317.2 182.8 L318.0 185.1 L318.9 187.1 L319.7 184.9 L320.5 179.5 L321.4 176.4 L322.2 175.0 L323.0 169.8 L323.9 167.6 L324.7 163.5 L325.5 159.4 L326.4 164.4 L327.2 169.0 L328.0 161.0 L328.9 156.6 L329.7 154.9 L330.5 156.1 L331.4 160.5 L332.2 161.7 L333.0 163.1 L333.9 166.7 L334.7 172.7 L335.5 176.3 L336.3 180.0 L337.2 182.2 L338.0 185.3 L338.8 187.8 L339.7 190.8 L340.5 191.7 L341.3 191.9 L342.2 191.8 L343.0 190.2 L343.8 189.9 L344.7 190.0 L345.5 190.6 L346.3 191.0 L347.2 191.6 L348.0 192.5 L348.8 194.5 L349.7 195.2 L350.5 194.6 L351.3 193.8 L352.2 193.5 L353.0 193.4 L353.8 192.5 L354.7 192.7 L355.5 191.2 L356.3 191.6 L357.1 191.5 L358.0 192.0 L358.8 192.7 L359.6 192.9 L360.5 193.8 L361.3 195.1 L362.1 193.6 L363.0 192.2 L363.8 189.9 L364.6 187.6 L365.5 184.7 L366.3 180.4 L367.1 174.4 L368.0 169.5 L368.8 165.5 L369.6 161.6 L370.5 158.2 L371.3 154.5 L372.1 150.1 L373.0 147.1 L373.8 143.7 L374.6 139.0 L375.5 135.8 L376.3 135.0 L377.1 132.4 L377.9 131.0 L378.8 128.2 L379.6 125.5 L380.4 123.1 L381.3 122.5 L382.1 121.2 L382.9 120.5 L383.8 119.8 L384.6 120.5 L385.4 121.6 L386.3 123.7 L387.1 124.9 L387.9 115.8 L388.8 117.4 L389.6 119.2 L390.4 120.4 L391.3 122.0 L392.1 122.1 L392.9 122.5 L393.8 133.9 L394.6 136.6 L395.4 134.0 L396.2 135.5 L397.1 137.6 L397.9 140.1 L398.7 141.7 L399.6 143.9 L400.4 152.1 L401.2 162.1 L402.1 167.0 L402.9 170.0 L403.7 173.6 L404.6 175.9 L405.4 176.8 L406.2 171.2 L407.1 168.7 L407.9 169.0 L408.7 171.9 L409.6 174.1 L410.4 177.1 L411.2 178.0 L412.1 179.3 L412.9 181.6 L413.7 182.5 L414.6 183.7 L415.4 185.2 L416.2 184.8 L417.0 185.2 L417.9 186.8 L418.7 187.3 L419.5 189.0 L420.4 190.3 L421.2 191.1 L422.0 195.1 L422.9 197.5 L423.7 198.8 L424.5 201.5 L425.4 204.0 L426.2 206.9 L427.0 209.6 L427.9 210.5 L428.7 211.3 L429.5 213.5 L430.4 216.2 L431.2 219.8 L432.0 222.8 L432.9 226.3 L433.7 228.8 L434.5 230.4 L435.4 232.8 L436.2 235.1 L437.0 237.4 L437.8 239.8 L438.7 241.7 L439.5 243.4 L440.3 244.4 L441.2 245.6 L442.0 247.1 L442.8 248.7 L443.7 250.1 L444.5 251.5 L445.3 252.5 L446.2 253.2 L447.0 253.9 L447.8 254.9 L448.7 257.1 L449.5 258.2 L450.3 259.1 L451.2 259.8 L452.0 260.3 L452.8 260.9 L453.7 261.6 L454.5 261.5 L455.3 262.2 L456.1 262.9 L457.0 263.7 L457.8 264.1 L458.6 264.7 L459.5 265.5 L460.3 266.3 L461.1 267.0 L462.0 267.5 L462.8 268.0 L463.6 268.4 L464.5 268.8 L465.3 269.1 L466.1 270.1 L467.0 270.5 L467.8 270.9 L468.6 271.0 L469.5 271.1 L470.3 271.2 L471.1 271.6 L472.0 271.0 L472.8 270.9 L473.6 270.9 L474.5 270.8 L475.3 270.7 L476.1 270.5 L476.9 270.3 L477.8 269.8 L478.6 269.2 L479.4 268.7 L480.3 268.2 L481.1 267.8 L481.9 267.1 L482.8 266.0 L483.6 264.9 L484.4 263.5 L485.3 261.8 L486.1 260.0 L486.9 258.9 L487.8 256.9 L488.6 254.8 L489.4 252.3 L490.3 250.0 L491.1 248.1 L491.9 246.5 L492.8 245.4 L493.6 244.5 L494.4 243.1 L495.3 242.0 L496.1 240.5 L496.9 239.2 L497.7 238.6 L498.6 238.5 L499.4 238.2 L500.2 237.3 L501.1 236.3 L501.9 236.3 L502.7 235.9 L503.6 235.5 L504.4 234.5 L505.2 233.7 L506.1 233.4 L506.9 233.4 L507.7 232.6 L508.6 232.3 L509.4 232.4 L510.2 232.9 L511.1 233.2 L511.9 233.0 L512.7 233.0 L513.6 233.2 L514.4 232.9 L515.2 232.7 L516.0 232.2 L516.9 231.4 L517.7 231.0 L518.5 231.0 L519.4 230.4 L520.2 231.0 L521.0 231.0 L521.9 230.9 L522.7 231.5 L523.5 232.5 L524.4 233.0 L525.2 234.1 L526.0 234.8 L526.9 235.4 L527.7 236.3 L528.5 237.0 L529.4 237.6 L530.2 238.8 L531.0 239.9 L531.9 240.9 L532.7 241.5 L533.5 242.1 L534.4 242.8 L535.2 243.8 L536.0 244.2 L536.8 245.3 L537.7 245.9 L538.5 246.7 L539.3 247.1 L540.2 247.7 L541.0 248.6 L541.8 249.6 L542.7 250.4 L543.5 251.4 L544.3 252.1 L545.2 252.8 L546.0 253.2"/>
<path class="cv-line cv-icu" d="M61.8 274.5 L62.6 273.9 L63.5 273.9 L64.3 272.7 L65.1 272.2 L66.0 269.8 L66.8 267.7 L67.6 266.2 L68.5 262.5 L69.3 258.5 L70.1 255.2 L71.0 248.7 L71.8 242.5 L72.6 237.5 L73.5 232.6 L74.3 224.1 L75.1 215.2 L76.0 207.8 L76.8 197.4 L77.6 186.2 L78.4 177.1 L79.3 166.5 L80.1 154.1 L80.9 142.5 L81.8 128.2 L82.6 118.9 L83.4 107.0 L84.3 98.0 L85.1 86.4 L85.9 75.1 L86.8 69.6 L87.6 62.3 L88.4 55.2 L89.3 47.9 L90.1 44.9 L90.9 40.5 L91.8 38.0 L92.6 37.3 L93.4 36.2 L94.3 35.3 L95.1 39.7 L95.9 40.7 L96.7 45.4 L97.6 51.7 L98.4 57.5 L99.2 62.7 L100.1 69.1 L100.9 76.0 L101.7 78.2 L102.6 83.1 L103.4 87.5 L104.2 93.8 L105.1 102.3 L105.9 109.6 L106.7 114.3 L107.6 120.1 L108.4 123.8 L109.2 129.8 L110.1 135.0 L110.9 141.9 L111.7 147.4 L112.6 151.6 L113.4 157.1 L114.2 160.3 L115.1 165.8 L115.9 169.8 L116.7 175.8 L117.5 182.6 L118.4 184.9 L119.2 187.2 L120.0 188.5 L120.9 191.6 L121.7 197.1 L122.5 198.4 L123.4 206.9 L124.2 214.8 L125.0 215.2 L125.9 216.9 L126.7 219.7 L127.5 223.2 L128.4 225.4 L129.2 228.2 L130.0 230.2 L130.9 230.9 L131.7 231.7 L132.5 233.6 L133.4 236.0 L134.2 238.1 L135.0 240.8 L135.9 242.2 L136.7 243.3 L137.5 244.0 L138.3 245.2 L139.2 246.1 L140.0 247.1 L140.8 247.9 L141.7 249.4 L142.5 250.3 L143.3 250.9 L144.2 251.9 L145.0 255.1 L145.8 256.0 L146.7 257.3 L147.5 258.7 L148.3 259.0 L149.2 259.3 L150.0 260.4 L150.8 261.3 L151.7 262.0 L152.5 262.6 L153.3 263.0 L154.2 263.6 L155.0 263.8 L155.8 265.5 L156.6 266.4 L157.5 266.1 L158.3 266.5 L159.1 267.0 L160.0 267.2 L160.8 268.5 L161.6 269.2 L162.5 269.7 L163.3 269.9 L164.1 269.8 L165.0 270.3 L165.8 270.2 L166.6 270.3 L167.5 270.5 L168.3 270.9 L169.1 271.1 L170.0 271.3 L170.8 271.8 L171.6 271.6 L172.5 271.7 L173.3 271.9 L174.1 271.8 L175.0 271.9 L175.8 272.2 L176.6 272.0 L177.4 272.0 L178.3 272.2 L179.1 272.4 L179.9 272.6 L180.8 272.9 L181.6 273.0 L182.4 273.0 L183.3 273.1 L184.1 273.2 L184.9 273.1 L185.8 273.2 L186.6 273.1 L187.4 273.3 L188.3 273.6 L189.1 273.4 L189.9 273.3 L190.8 273.6 L191.6 273.8 L192.4 273.2 L193.3 273.6 L194.1 273.5 L194.9 273.5 L195.8 273.6 L196.6 273.6 L197.4 273.6 L198.2 273.5 L199.1 273.5 L199.9 273.5 L200.7 273.3 L201.6 273.3 L202.4 273.1 L203.2 272.9 L204.1 272.7 L204.9 272.7 L205.7 272.7 L206.6 272.7 L207.4 272.6 L208.2 272.6 L209.1 272.1 L209.9 272.0 L210.7 271.9 L211.6 272.2 L212.4 271.9 L213.2 272.2 L214.1 272.1 L214.9 271.9 L215.7 272.0 L216.5 271.6 L217.4 271.3 L218.2 270.9 L219.0 270.4 L219.9 269.7 L220.7 269.6 L221.5 268.9 L222.4 268.8 L223.2 268.8 L224.0 268.1 L224.9 267.6 L225.7 267.5 L226.5 267.1 L227.4 266.3 L228.2 265.6 L229.0 265.2 L229.9 264.9 L230.7 264.3 L231.5 264.1 L232.4 263.8 L233.2 263.5 L234.0 263.7 L234.9 263.3 L235.7 262.9 L236.5 262.3 L237.3 261.9 L238.2 261.6 L239.0 261.4 L239.8 261.6 L240.7 261.4 L241.5 261.0 L242.3 260.4 L243.2 260.0 L244.0 259.4 L244.8 258.8 L245.7 258.6 L246.5 258.4 L247.3 258.1 L248.2 256.9 L249.0 257.1 L249.8 256.1 L250.7 254.8 L251.5 253.1 L252.3 252.9 L253.2 251.2 L254.0 249.3 L254.8 245.6 L255.7 244.1 L256.5 241.3 L257.3 238.3 L258.1 234.3 L259.0 231.6 L259.8 228.8 L260.6 224.5 L261.5 221.2 L262.3 217.3 L263.1 213.9 L264.0 209.3 L264.8 204.5 L265.6 200.0 L266.5 192.5 L267.3 185.1 L268.1 178.3 L269.0 172.7 L269.8 167.0 L270.6 161.3 L271.5 156.4 L272.3 144.4 L273.1 140.4 L274.0 134.5 L274.8 127.2 L275.6 120.2 L276.4 113.4 L277.3 107.4 L278.1 100.2 L278.9 93.7 L279.8 88.5 L280.6 84.9 L281.4 80.4 L282.3 73.6 L283.1 69.4 L283.9 62.3 L284.8 58.9 L285.6 56.4 L286.4 54.3 L287.3 53.7 L288.1 51.1 L288.9 50.6 L289.8 50.2 L290.6 48.3 L291.4 48.5 L292.3 52.2 L293.1 53.4 L293.9 54.0 L294.8 54.5 L295.6 59.3 L296.4 62.1 L297.2 63.2 L298.1 65.0 L298.9 67.9 L299.7 71.7 L300.6 75.9 L301.4 78.1 L302.2 79.6 L303.1 81.3 L303.9 82.8 L304.7 86.7 L305.6 89.2 L306.4 92.9 L307.2 98.3 L308.1 102.9 L308.9 107.1 L309.7 109.2 L310.6 111.3 L311.4 113.7 L312.2 114.4 L313.1 117.0 L313.9 120.8 L314.7 122.8 L315.6 123.1 L316.4 123.4 L317.2 123.4 L318.0 124.2 L318.9 125.2 L319.7 126.4 L320.5 124.8 L321.4 125.0 L322.2 124.0 L323.0 123.2 L323.9 123.4 L324.7 124.0 L325.5 123.9 L326.4 123.0 L327.2 123.0 L328.0 122.6 L328.9 121.3 L329.7 119.7 L330.5 120.1 L331.4 123.4 L332.2 124.7 L333.0 126.8 L333.9 126.9 L334.7 127.9 L335.5 125.5 L336.3 128.9 L337.2 130.4 L338.0 132.9 L338.8 134.6 L339.7 134.8 L340.5 134.0 L341.3 132.8 L342.2 135.7 L343.0 136.9 L343.8 140.6 L344.7 141.7 L345.5 144.8 L346.3 145.0 L347.2 142.8 L348.0 145.0 L348.8 149.1 L349.7 148.7 L350.5 149.3 L351.3 151.2 L352.2 151.3 L353.0 149.2 L353.8 149.2 L354.7 150.1 L355.5 150.2 L356.3 152.1 L357.1 154.0 L358.0 152.7 L358.8 152.4 L359.6 153.3 L360.5 155.1 L361.3 155.0 L362.1 154.2 L363.0 153.9 L363.8 152.1 L364.6 150.7 L365.5 149.0 L366.3 148.4 L367.1 147.7 L368.0 146.2 L368.8 144.9 L369.6 144.0 L370.5 140.6 L371.3 138.3 L372.1 133.4 L373.0 129.6 L373.8 126.6 L374.6 123.9 L375.5 121.9 L376.3 116.3 L377.1 112.9 L377.9 108.8 L378.8 106.9 L379.6 103.6 L380.4 99.6 L381.3 93.7 L382.1 89.2 L382.9 83.4 L383.8 79.8 L384.6 78.8 L385.4 77.0 L386.3 75.6 L387.1 72.0 L387.9 68.3 L388.8 66.2 L389.6 63.7 L390.4 61.8 L391.3 61.4 L392.1 60.9 L392.9 58.3 L393.8 55.9 L394.6 56.2 L395.4 56.5 L396.2 58.2 L397.1 56.9 L397.9 56.3 L398.7 56.9 L399.6 54.9 L400.4 54.6 L401.2 58.1 L402.1 59.3 L402.9 62.8 L403.7 63.7 L404.6 63.9 L405.4 63.4 L406.2 67.4 L407.1 69.5 L407.9 73.8 L408.7 76.9 L409.6 78.4 L410.4 80.1 L411.2 84.1 L412.1 89.6 L412.9 94.0 L413.7 97.3 L414.6 99.8 L415.4 104.8 L416.2 106.7 L417.0 107.4 L417.9 113.4 L418.7 115.6 L419.5 119.8 L420.4 123.2 L421.2 126.8 L422.0 126.7 L422.9 128.7 L423.7 132.7 L424.5 135.9 L425.4 139.5 L426.2 142.7 L427.0 145.2 L427.9 146.3 L428.7 148.3 L429.5 154.4 L430.4 158.2 L431.2 164.0 L432.0 166.0 L432.9 169.2 L433.7 170.8 L434.5 172.2 L435.4 176.1 L436.2 178.8 L437.0 184.7 L437.8 189.1 L438.7 191.4 L439.5 192.6 L440.3 194.2 L441.2 197.7 L442.0 200.4 L442.8 204.6 L443.7 208.4 L444.5 211.2 L445.3 213.2 L446.2 214.9 L447.0 217.5 L447.8 220.8 L448.7 223.2 L449.5 226.5 L450.3 229.4 L451.2 230.2 L452.0 231.1 L452.8 235.3 L453.7 236.9 L454.5 239.0 L455.3 240.7 L456.1 242.0 L457.0 242.6 L457.8 244.3 L458.6 246.2 L459.5 248.1 L460.3 249.7 L461.1 251.4 L462.0 252.7 L462.8 253.0 L463.6 253.2 L464.5 254.6 L465.3 255.7 L466.1 256.6 L467.0 257.9 L467.8 258.4 L468.6 258.6 L469.5 258.9 L470.3 260.0 L471.1 261.4 L472.0 262.5 L472.8 263.4 L473.6 263.9 L474.5 264.3 L475.3 264.7 L476.1 264.9 L476.9 265.4 L477.8 265.4 L478.6 266.0 L479.4 266.5 L480.3 266.5 L481.1 266.7 L481.9 266.7 L482.8 267.1 L483.6 266.9 L484.4 266.5 L485.3 266.4 L486.1 266.8 L486.9 266.4 L487.8 266.2 L488.6 266.7 L489.4 266.7 L490.3 266.8 L491.1 265.8 L491.9 265.5 L492.8 265.2 L493.6 264.8 L494.4 265.2 L495.3 264.5 L496.1 264.1 L496.9 263.3 L497.7 262.4 L498.6 261.3 L499.4 260.7 L500.2 260.6 L501.1 260.1 L501.9 259.6 L502.7 259.0 L503.6 258.3 L504.4 256.9 L505.2 256.9 L506.1 256.1 L506.9 255.2 L507.7 254.2 L508.6 254.0 L509.4 253.3 L510.2 252.1 L511.1 251.0 L511.9 249.8 L512.7 248.8 L513.6 249.1 L514.4 248.4 L515.2 248.1 L516.0 247.3 L516.9 246.2 L517.7 246.5 L518.5 246.2 L519.4 245.8 L520.2 245.8 L521.0 244.9 L521.9 243.6 L522.7 243.8 L523.5 244.1 L524.4 243.2 L525.2 243.1 L526.0 242.3 L526.9 242.2 L527.7 242.3 L528.5 242.7 L529.4 242.6 L530.2 243.0 L531.0 243.6 L531.9 243.6 L532.7 242.9 L533.5 242.7 L534.4 243.2 L535.2 244.1 L536.0 244.6 L536.8 244.9 L537.7 245.3 L538.5 244.6"/>
<path class="cv-line cv-pos" d="M67.6 181.0 L68.5 150.0 L69.3 146.0 L70.1 119.0 L71.0 95.0 L71.8 73.0 L72.6 79.0 L73.5 42.0 L74.3 57.0 L75.1 60.0 L76.0 66.0 L76.8 63.0 L77.6 48.0 L78.4 44.0 L79.3 52.0 L80.1 33.0 L80.9 24.0 L81.8 8.0 L82.6 8.0 L83.4 15.0 L84.3 18.0 L85.1 15.0 L85.9 22.0 L86.8 33.0 L87.6 54.0 L88.4 65.0 L89.3 78.0 L90.1 79.0 L90.9 89.0 L91.8 102.0 L92.6 109.0 L93.4 119.0 L94.3 128.0 L95.1 135.0 L95.9 144.0 L96.7 150.0 L97.6 156.0 L98.4 167.0 L99.2 172.0 L100.1 179.0 L100.9 186.0 L101.7 190.0 L102.6 193.0 L103.4 191.0 L104.2 193.0 L105.1 198.0 L105.9 202.0 L106.7 207.0 L107.6 211.0 L108.4 214.0 L109.2 219.0 L110.1 220.0 L110.9 224.0 L111.7 224.0 L112.6 228.0 L113.4 229.0 L114.2 230.0 L115.1 232.0 L115.9 235.0 L116.7 237.0 L117.5 241.0 L118.4 241.0 L119.2 243.0 L120.0 245.0 L120.9 247.0 L121.7 249.0 L122.5 250.0 L123.4 251.0 L124.2 254.0 L125.0 256.0 L125.9 257.0 L126.7 257.0 L127.5 258.0 L128.4 259.0 L129.2 260.0 L130.0 261.0 L130.9 262.0 L131.7 262.0 L132.5 263.0 L133.4 264.0 L134.2 265.0 L135.0 265.0 L135.9 266.0 L136.7 266.0 L137.5 266.0 L138.3 267.0 L139.2 267.0 L140.0 268.0 L140.8 268.0 L141.7 268.0 L142.5 269.0 L143.3 269.0 L144.2 269.0 L145.0 269.0 L145.8 270.0 L146.7 270.0 L147.5 270.0 L148.3 270.0 L149.2 270.0 L150.0 270.0 L150.8 271.0 L151.7 271.0 L152.5 272.0 L153.3 271.0 L154.2 271.0 L155.0 271.0 L155.8 271.0 L156.6 271.0 L157.5 271.0 L158.3 271.0 L159.1 272.0 L160.0 272.0 L160.8 272.0 L161.6 272.0 L162.5 271.0 L163.3 271.0 L164.1 270.0 L165.0 270.0 L165.8 271.0 L166.6 271.0 L167.5 271.0 L168.3 272.0 L169.1 272.0 L170.0 272.0 L170.8 272.0 L171.6 272.0 L172.5 272.0 L173.3 272.0 L174.1 271.0 L175.0 271.0 L175.8 271.0 L176.6 271.0 L177.4 271.0 L178.3 271.0 L179.1 271.0 L179.9 271.0 L180.8 271.0 L181.6 272.0 L182.4 271.0 L183.3 271.0 L184.1 271.0 L184.9 271.0 L185.8 271.0 L186.6 271.0 L187.4 271.0 L188.3 271.0 L189.1 271.0 L189.9 271.0 L190.8 271.0 L191.6 271.0 L192.4 271.0 L193.3 270.0 L194.1 270.0 L194.9 271.0 L195.8 271.0 L196.6 270.0 L197.4 270.0 L198.2 270.0 L199.1 270.0 L199.9 269.0 L200.7 269.0 L201.6 268.0 L202.4 268.0 L203.2 267.0 L204.1 267.0 L204.9 266.0 L205.7 265.0 L206.6 265.0 L207.4 265.0 L208.2 266.0 L209.1 266.0 L209.9 266.0 L210.7 265.0 L211.6 265.0 L212.4 264.0 L213.2 263.0 L214.1 262.0 L214.9 262.0 L215.7 261.0 L216.5 261.0 L217.4 261.0 L218.2 261.0 L219.0 261.0 L219.9 261.0 L220.7 261.0 L221.5 261.0 L222.4 261.0 L223.2 261.0 L224.0 261.0 L224.9 261.0 L225.7 260.0 L226.5 260.0 L227.4 260.0 L228.2 260.0 L229.0 259.0 L229.9 259.0 L230.7 259.0 L231.5 259.0 L232.4 259.0 L233.2 259.0 L234.0 259.0 L234.9 259.0 L235.7 259.0 L236.5 259.0 L237.3 259.0 L238.2 259.0 L239.0 258.0 L239.8 259.0 L240.7 258.0 L241.5 258.0 L242.3 258.0 L243.2 257.0 L244.0 257.0 L244.8 256.0 L245.7 256.0 L246.5 255.0 L247.3 254.0 L248.2 253.0 L249.0 252.0 L249.8 250.0 L250.7 248.0 L251.5 244.0 L252.3 241.0 L253.2 238.0 L254.0 236.0 L254.8 233.0 L255.7 230.0 L256.5 227.0 L257.3 223.0 L258.1 219.0 L259.0 215.0 L259.8 211.0 L260.6 208.0 L261.5 203.0 L262.3 196.0 L263.1 190.0 L264.0 183.0 L264.8 176.0 L265.6 171.0 L266.5 165.0 L267.3 158.0 L268.1 152.0 L269.0 146.0 L269.8 141.0 L270.6 136.0 L271.5 134.0 L272.3 130.0 L273.1 127.0 L274.0 123.0 L274.8 121.0 L275.6 117.0 L276.4 116.0 L277.3 115.0 L278.1 114.0 L278.9 114.0 L279.8 113.0 L280.6 113.0 L281.4 115.0 L282.3 114.0 L283.1 113.0 L283.9 114.0 L284.8 114.0 L285.6 117.0 L286.4 118.0 L287.3 120.0 L288.1 123.0 L288.9 126.0 L289.8 130.0 L290.6 135.0 L291.4 139.0 L292.3 143.0 L293.1 148.0 L293.9 152.0 L294.8 155.0 L295.6 158.0 L296.4 159.0 L297.2 163.0 L298.1 165.0 L298.9 166.0 L299.7 166.0 L300.6 167.0 L301.4 168.0 L302.2 166.0 L303.1 167.0 L303.9 170.0 L304.7 171.0 L305.6 171.0 L306.4 171.0 L307.2 173.0 L308.1 164.0 L308.9 152.0 L309.7 154.0 L310.6 155.0 L311.4 156.0 L312.2 155.0 L313.1 156.0 L313.9 173.0 L314.7 184.0 L315.6 178.0 L316.4 175.0 L317.2 173.0 L318.0 173.0 L318.9 172.0 L319.7 168.0 L320.5 160.0 L321.4 157.0 L322.2 154.0 L323.0 154.0 L323.9 152.0 L324.7 149.0 L325.5 145.0 L326.4 141.0 L327.2 144.0 L328.0 150.0 L328.9 151.0 L329.7 151.0 L330.5 153.0 L331.4 157.0 L332.2 163.0 L333.0 177.0 L333.9 187.0 L334.7 196.0 L335.5 203.0 L336.3 211.0 L337.2 217.0 L338.0 222.0 L338.8 223.0 L339.7 226.0 L340.5 226.0 L341.3 226.0 L342.2 226.0 L343.0 225.0 L343.8 225.0 L344.7 225.0 L345.5 226.0 L346.3 226.0 L347.2 227.0 L348.0 227.0 L348.8 228.0 L349.7 228.0 L350.5 228.0 L351.3 227.0 L352.2 227.0 L353.0 227.0 L353.8 227.0 L354.7 228.0 L355.5 228.0 L356.3 228.0 L357.1 229.0 L358.0 229.0 L358.8 230.0 L359.6 230.0 L360.5 230.0 L361.3 231.0 L362.1 230.0 L363.0 230.0 L363.8 230.0 L364.6 228.0 L365.5 228.0 L366.3 226.0 L367.1 225.0 L368.0 223.0 L368.8 222.0 L369.6 220.0 L370.5 218.0 L371.3 217.0 L372.1 216.0 L373.0 214.0 L373.8 214.0 L374.6 213.0 L375.5 212.0 L376.3 212.0 L377.1 211.0 L377.9 210.0 L378.8 210.0 L379.6 208.0 L380.4 208.0 L381.3 208.0 L382.1 207.0 L382.9 207.0 L383.8 207.0 L384.6 207.0 L385.4 207.0 L386.3 208.0 L387.1 208.0 L387.9 204.0 L388.8 204.0 L389.6 204.0 L390.4 205.0 L391.3 205.0 L392.1 205.0 L392.9 205.0 L393.8 210.0 L394.6 210.0 L395.4 209.0 L396.2 210.0 L397.1 210.0 L397.9 211.0 L398.7 211.0 L399.6 211.0 L400.4 209.0 L401.2 214.0 L402.1 217.0 L402.9 219.0 L403.7 220.0 L404.6 221.0 L405.4 224.0 L406.2 226.0 L407.1 225.0 L407.9 224.0 L408.7 225.0 L409.6 226.0 L410.4 227.0 L411.2 226.0 L412.1 227.0 L412.9 228.0 L413.7 230.0 L414.6 230.0 L415.4 230.0 L416.2 230.0 L417.0 231.0 L417.9 232.0 L418.7 232.0 L419.5 232.0 L420.4 233.0 L421.2 234.0 L422.0 235.0 L422.9 235.0 L423.7 236.0 L424.5 238.0 L425.4 239.0 L426.2 240.0 L427.0 241.0 L427.9 242.0 L428.7 243.0 L429.5 244.0 L430.4 245.0 L431.2 246.0 L432.0 247.0 L432.9 248.0 L433.7 249.0 L434.5 250.0 L435.4 251.0 L436.2 252.0 L437.0 253.0 L437.8 254.0 L438.7 255.0 L439.5 256.0 L440.3 256.0 L441.2 257.0 L442.0 258.0 L442.8 259.0 L443.7 259.0 L444.5 260.0 L445.3 260.0 L446.2 261.0 L447.0 261.0 L447.8 261.0 L448.7 261.0 L449.5 262.0 L450.3 262.0 L451.2 263.0 L452.0 263.0 L452.8 264.0 L453.7 264.0 L454.5 265.0 L455.3 265.0 L456.1 266.0 L457.0 266.0 L457.8 266.0 L458.6 267.0 L459.5 267.0 L460.3 268.0 L461.1 269.0 L462.0 269.0 L462.8 270.0 L463.6 270.0 L464.5 270.0 L465.3 271.0 L466.1 271.0 L467.0 272.0 L467.8 272.0 L468.6 272.0 L469.5 272.0 L470.3 272.0 L471.1 272.0 L472.0 272.0 L472.8 272.0 L473.6 272.0 L474.5 272.0 L475.3 272.0 L476.1 271.0 L476.9 271.0 L477.8 271.0 L478.6 270.0 L479.4 270.0 L480.3 269.0 L481.1 269.0 L481.9 268.0 L482.8 268.0 L483.6 267.0 L484.4 266.0 L485.3 265.0 L486.1 263.0 L486.9 263.0 L487.8 261.0 L488.6 260.0 L489.4 259.0 L490.3 257.0 L491.1 256.0 L491.9 255.0 L492.8 254.0 L493.6 254.0 L494.4 253.0 L495.3 253.0 L496.1 252.0 L496.9 251.0 L497.7 250.0 L498.6 250.0 L499.4 249.0 L500.2 248.0 L501.1 247.0 L501.9 247.0 L502.7 248.0 L503.6 248.0 L504.4 248.0 L505.2 248.0 L506.1 248.0 L506.9 248.0 L507.7 247.0 L508.6 246.0 L509.4 245.0 L510.2 245.0 L511.1 245.0 L511.9 245.0 L512.7 245.0 L513.6 245.0 L514.4 244.0 L515.2 245.0 L516.0 245.0 L516.9 245.0 L517.7 245.0 L518.5 245.0 L519.4 246.0 L520.2 247.0 L521.0 248.0 L521.9 248.0 L522.7 249.0 L523.5 250.0 L524.4 252.0 L525.2 253.0 L526.0 254.0 L526.9 254.0 L527.7 255.0 L528.5 256.0 L529.4 256.0 L530.2 257.0 L531.0 257.0 L531.9 258.0 L532.7 258.0 L533.5 258.0 L534.4 258.0 L535.2 259.0 L536.0 259.0 L536.8 260.0 L537.7 261.0 L538.5 261.0 L539.3 261.0 L540.2 262.0 L541.0 262.0 L541.8 262.0 L542.7 263.0 L543.5 263.0 L544.3 264.0"/>
<line class="cv-line cv-inc" x1="46" y1="316" x2="62" y2="316"/><text class="cv-legend" x="68" y="320">Incidence</text>
<line class="cv-line cv-icu" x1="142" y1="316" x2="158" y2="316"/><text class="cv-legend" x="164" y="320">ICU per million (right)</text>
<line class="cv-line cv-pos" x1="310" y1="316" x2="326" y2="316"/><text class="cv-legend" x="332" y="320">Positive rate (far right)</text>
<text class="cv-axis-title" x="9" y="151" transform="rotate(-90 9 151)">Incidence</text>
<text class="cv-axis-title" x="666" y="151" transform="rotate(-90 666 151)">Positive rate</text>
<text class="cv-axis-title" x="296" y="350">Date</text>
</svg>
<figcaption>The second wave peaks near an incidence of 600 and the third below 400 &#8212; yet ICU patients per million reach the same height in both, because the third wave started with half the beds still full. Three scales on one frame, as published.</figcaption>
</figure>

This one is not a testing artefact, and the numbers rule that out directly.
At peak incidence, Italy ran 6.1 tests per positive case in the second wave
and 14 in the third. They were testing *more*, not less.

It also argues against a single national threshold. German contact rules were
set per district, but ICU capacity is not distributed evenly — Saarland has
roughly 50 intensive care beds per 100,000 inhabitants, Brandenburg about 25.
The same incidence in both places describes two different degrees of trouble.

## Vaccination breaks the link between Incidence and ICU capacity

Vaccination causes incidence and ICU occupancy to drift apart — a given
incidence increasingly overstates ICU risk as vaccination progresses. The
same number of cases sends fewer people to intensive care as coverage grows.
The Italy chart above shows it in its last stretch — from July 2021 the ICU curve
trails the incidence curve by longer than usual, and climbs more slowly than
it, which had not happened in any wave since the first.

The chart below is the cleaner test, and it needs a word on how to read it.
Each country's two curves are running totals — cases so far, ICU patients so
far — drawn on separate axes, so the distance between them means nothing. Only
the slopes do. Climbing together means every new case still carries its old ICU
cost; pulling apart means cases that no longer end in intensive care. The three
countries vaccinated at very different times, which is the point of setting
them side by side.

<figure class="cv__figure">
<svg class="cv-fig" viewBox="0 0 672 316" role="img" aria-labelledby="cv3-t cv3-d">
<title id="cv3-t">Cumulative ICU occupancy against cumulative incidence, three countries</title>
<desc id="cv3-d">Denmark, the United Kingdom and Israel. Dotted verticals mark the first vaccination record and the days 25 and 50 per cent of the population were fully vaccinated. The two curves separate after vaccination begins; in Israel they converge again by the end.</desc>
<g class="cv-panel">
<text class="cv-title" x="120" y="16">Denmark</text>
<g class="cv-axis"><line x1="40" y1="226" x2="200" y2="226"/><line x1="40" y1="26" x2="40" y2="226"/><line x1="200" y1="26" x2="200" y2="226"/></g>
<g class="cv-tick"><line x1="40.0" y1="226" x2="40.0" y2="230"/><text class="cv-ticklabel" x="40.0" y="241">Oct</text></g>
<g class="cv-tick"><line x1="94.4" y1="226" x2="94.4" y2="230"/><text class="cv-ticklabel" x="94.4" y="241">Feb</text></g>
<g class="cv-tick"><line x1="147.4" y1="226" x2="147.4" y2="230"/><text class="cv-ticklabel" x="147.4" y="241">Jun</text></g>
<line class="cv-milestone cv-ms1" x1="80.7" y1="26" x2="80.7" y2="226"/>
<line class="cv-milestone cv-ms2" x1="151.8" y1="26" x2="151.8" y2="226"/>
<line class="cv-milestone cv-ms3" x1="170.4" y1="26" x2="170.4" y2="226"/>
<path class="cv-line cv-inc" d="M40.0 178.6 L40.4 178.5 L40.9 178.3 L41.3 178.1 L41.8 177.9 L42.2 177.8 L42.7 177.6 L43.1 177.5 L43.5 177.3 L44.0 177.1 L44.4 176.9 L44.9 176.7 L45.3 176.5 L45.7 176.3 L46.2 176.2 L46.6 176.0 L47.1 175.8 L47.5 175.7 L48.0 175.5 L48.4 175.3 L48.8 175.2 L49.3 175.0 L49.7 174.8 L50.2 174.6 L50.6 174.4 L51.0 174.3 L51.5 174.1 L51.9 173.9 L52.4 173.7 L52.8 173.6 L53.3 173.4 L53.7 173.2 L54.1 172.9 L54.6 172.7 L55.0 172.5 L55.5 172.2 L55.9 172.0 L56.4 171.7 L56.8 171.4 L57.2 171.1 L57.7 170.7 L58.1 170.3 L58.6 169.9 L59.0 169.5 L59.4 169.0 L59.9 168.6 L60.3 168.1 L60.8 167.7 L61.2 167.3 L61.7 166.9 L62.1 166.5 L62.5 166.1 L63.0 165.7 L63.4 165.2 L63.9 164.8 L64.3 164.4 L64.8 164.0 L65.2 163.5 L65.6 163.1 L66.1 162.7 L66.5 162.2 L67.0 161.8 L67.4 161.5 L67.8 161.1 L68.3 160.7 L68.7 160.3 L69.2 159.8 L69.6 159.4 L70.1 159.0 L70.5 158.6 L70.9 158.2 L71.4 157.7 L71.8 157.1 L72.3 156.6 L72.7 155.9 L73.1 155.2 L73.6 154.5 L74.0 153.8 L74.5 153.0 L74.9 152.1 L75.4 151.2 L75.8 150.3 L76.2 149.5 L76.7 148.6 L77.1 147.6 L77.6 146.6 L78.0 145.6 L78.5 144.6 L78.9 143.4 L79.3 142.1 L79.8 140.7 L80.2 139.4 L80.7 138.1 L81.1 136.7 L81.5 135.3 L82.0 133.9 L82.4 132.5 L82.9 131.1 L83.3 129.7 L83.8 128.3 L84.2 127.0 L84.6 125.6 L85.1 124.2 L85.5 122.8 L86.0 121.4 L86.4 120.1 L86.9 118.8 L87.3 117.4 L87.7 116.1 L88.2 114.7 L88.6 113.4 L89.1 112.0 L89.5 110.7 L89.9 109.3 L90.4 108.1 L90.8 106.8 L91.3 105.6 L91.7 104.4 L92.2 103.2 L92.6 102.1 L93.0 101.0 L93.5 100.0 L93.9 99.0 L94.4 98.0 L94.8 97.1 L95.2 96.2 L95.7 95.3 L96.1 94.5 L96.6 93.7 L97.0 92.9 L97.5 92.2 L97.9 91.4 L98.3 90.7 L98.8 90.0 L99.2 89.3 L99.7 88.6 L100.1 88.0 L100.6 87.3 L101.0 86.6 L101.4 86.1 L101.9 85.5 L102.3 85.0 L102.8 84.4 L103.2 83.9 L103.6 83.4 L104.1 82.9 L104.5 82.4 L105.0 82.0 L105.4 81.5 L105.9 81.1 L106.3 80.7 L106.7 80.2 L107.2 79.8 L107.6 79.5 L108.1 79.2 L108.5 78.8 L109.0 78.5 L109.4 78.1 L109.8 77.8 L110.3 77.4 L110.7 76.9 L111.2 76.5 L111.6 76.1 L112.0 75.7 L112.5 75.3 L112.9 74.9 L113.4 74.5 L113.8 74.0 L114.3 73.7 L114.7 73.3 L115.1 72.9 L115.6 72.5 L116.0 72.0 L116.5 71.6 L116.9 71.1 L117.3 70.6 L117.8 70.2 L118.2 69.8 L118.7 69.4 L119.1 69.0 L119.6 68.6 L120.0 68.1 L120.4 67.7 L120.9 67.3 L121.3 66.9 L121.8 66.5 L122.2 66.1 L122.7 65.7 L123.1 65.4 L123.5 65.0 L124.0 64.6 L124.4 64.2 L124.9 63.9 L125.3 63.4 L125.7 63.0 L126.2 62.6 L126.6 62.3 L127.1 61.9 L127.5 61.5 L128.0 61.1 L128.4 60.8 L128.8 60.4 L129.3 60.0 L129.7 59.5 L130.2 59.1 L130.6 58.7 L131.0 58.3 L131.5 57.9 L131.9 57.5 L132.4 57.2 L132.8 56.9 L133.3 56.5 L133.7 56.1 L134.1 55.8 L134.6 55.3 L135.0 54.9 L135.5 54.5 L135.9 54.2 L136.4 53.8 L136.8 53.5 L137.2 53.2 L137.7 52.9 L138.1 52.6 L138.6 52.3 L139.0 52.0 L139.4 51.6 L139.9 51.3 L140.3 51.0 L140.8 50.7 L141.2 50.4 L141.7 50.0 L142.1 49.7 L142.5 49.4 L143.0 49.0 L143.4 48.7 L143.9 48.3 L144.3 47.9 L144.8 47.6 L145.2 47.2 L145.6 46.9 L146.1 46.5 L146.5 46.2 L147.0 45.8 L147.4 45.5 L147.8 45.1 L148.3 44.7 L148.7 44.4 L149.2 44.1 L149.6 43.8 L150.1 43.5 L150.5 43.3 L150.9 43.0 L151.4 42.8 L151.8 42.5 L152.3 42.3 L152.7 42.1 L153.1 41.9 L153.6 41.7 L154.0 41.5 L154.5 41.3 L154.9 41.1 L155.4 40.9 L155.8 40.7 L156.2 40.6 L156.7 40.4 L157.1 40.2 L157.6 40.1 L158.0 39.9 L158.5 39.7 L158.9 39.6 L159.3 39.4 L159.8 39.3 L160.2 39.1 L160.7 39.0 L161.1 38.9 L161.5 38.8 L162.0 38.7 L162.4 38.6 L162.9 38.5 L163.3 38.5 L163.8 38.4 L164.2 38.3 L164.6 38.2 L165.1 38.1 L165.5 38.0 L166.0 37.9 L166.4 37.8 L166.9 37.7 L167.3 37.6 L167.7 37.5 L168.2 37.4 L168.6 37.3 L169.1 37.2 L169.5 37.0 L169.9 36.9 L170.4 36.8 L170.8 36.7 L171.3 36.6 L171.7 36.5 L172.2 36.4 L172.6 36.3 L173.0 36.2 L173.5 36.1 L173.9 36.0 L174.4 35.9 L174.8 35.9 L175.2 35.8 L175.7 35.7 L176.1 35.6 L176.6 35.5 L177.0 35.4 L177.5 35.2 L177.9 35.1 L178.3 35.0 L178.8 34.8 L179.2 34.6 L179.7 34.5 L180.1 34.3 L180.6 34.2 L181.0 34.0 L181.4 33.9 L181.9 33.7 L182.3 33.5 L182.8 33.4 L183.2 33.2 L183.6 33.0 L184.1 32.8 L184.5 32.6 L185.0 32.4 L185.4 32.2 L185.9 32.0 L186.3 31.8 L186.7 31.6 L187.2 31.4 L187.6 31.2 L188.1 31.0 L188.5 30.7 L189.0 30.4 L189.4 30.2 L189.8 29.9 L190.3 29.6 L190.7 29.4 L191.2 29.1 L191.6 28.8 L192.0 28.5 L192.5 28.2 L192.9 27.9 L193.4 27.6 L193.8 27.3 L194.3 27.0 L194.7 26.7 L195.1 26.5 L195.6 26.2 L196.0 26.0 L196.5 26.0 L196.9 26.0 L197.3 26.0 L197.8 26.0 L198.2 26.0 L198.7 26.0 L199.1 26.0 L199.6 26.0 L200.0 26.0"/>
<path class="cv-line cv-icu" d="M40.0 210.6 L40.4 210.4 L40.9 210.1 L41.3 209.9 L41.8 209.6 L42.2 209.4 L42.7 209.2 L43.1 209.0 L43.5 208.8 L44.0 208.5 L44.4 208.3 L44.9 208.1 L45.3 207.9 L45.7 207.6 L46.2 207.4 L46.6 207.2 L47.1 207.0 L47.5 206.7 L48.0 206.5 L48.4 206.2 L48.8 205.9 L49.3 205.6 L49.7 205.3 L50.2 205.0 L50.6 204.6 L51.0 204.1 L51.5 203.7 L51.9 203.2 L52.4 202.7 L52.8 202.1 L53.3 201.6 L53.7 201.0 L54.1 200.5 L54.6 199.9 L55.0 199.3 L55.5 198.7 L55.9 198.1 L56.4 197.4 L56.8 196.8 L57.2 196.2 L57.7 195.6 L58.1 195.0 L58.6 194.4 L59.0 193.9 L59.4 193.3 L59.9 192.8 L60.3 192.2 L60.8 191.6 L61.2 191.0 L61.7 190.3 L62.1 189.6 L62.5 189.0 L63.0 188.3 L63.4 187.6 L63.9 187.0 L64.3 186.3 L64.8 185.6 L65.2 185.0 L65.6 184.3 L66.1 183.6 L66.5 182.9 L67.0 182.1 L67.4 181.4 L67.8 180.6 L68.3 179.8 L68.7 179.0 L69.2 178.1 L69.6 177.1 L70.1 176.1 L70.5 175.0 L70.9 173.8 L71.4 172.4 L71.8 171.0 L72.3 169.4 L72.7 167.8 L73.1 166.1 L73.6 164.3 L74.0 162.5 L74.5 160.5 L74.9 158.5 L75.4 156.6 L75.8 154.6 L76.2 152.7 L76.7 150.8 L77.1 149.0 L77.6 147.3 L78.0 145.7 L78.5 144.2 L78.9 142.8 L79.3 141.3 L79.8 139.9 L80.2 138.5 L80.7 137.2 L81.1 135.9 L81.5 134.7 L82.0 133.5 L82.4 132.3 L82.9 131.2 L83.3 130.2 L83.8 129.1 L84.2 128.1 L84.6 127.1 L85.1 126.2 L85.5 125.3 L86.0 124.5 L86.4 123.8 L86.9 123.1 L87.3 122.5 L87.7 121.9 L88.2 121.3 L88.6 120.7 L89.1 120.2 L89.5 119.7 L89.9 119.2 L90.4 118.8 L90.8 118.3 L91.3 117.9 L91.7 117.5 L92.2 117.1 L92.6 116.7 L93.0 116.3 L93.5 116.0 L93.9 115.7 L94.4 115.4 L94.8 115.1 L95.2 114.8 L95.7 114.6 L96.1 114.3 L96.6 114.1 L97.0 113.8 L97.5 113.6 L97.9 113.3 L98.3 113.1 L98.8 112.9 L99.2 112.6 L99.7 112.4 L100.1 112.2 L100.6 111.9 L101.0 111.7 L101.4 111.5 L101.9 111.3 L102.3 111.1 L102.8 110.8 L103.2 110.6 L103.6 110.3 L104.1 110.0 L104.5 109.8 L105.0 109.5 L105.4 109.2 L105.9 108.9 L106.3 108.6 L106.7 108.3 L107.2 108.0 L107.6 107.7 L108.1 107.4 L108.5 107.1 L109.0 106.9 L109.4 106.6 L109.8 106.3 L110.3 106.0 L110.7 105.6 L111.2 105.2 L111.6 104.7 L112.0 104.3 L112.5 103.8 L112.9 103.4 L113.4 102.9 L113.8 102.5 L114.3 102.1 L114.7 101.7 L115.1 101.4 L115.6 100.9 L116.0 100.5 L116.5 100.1 L116.9 99.9 L117.3 99.7 L117.8 99.5 L118.2 99.3 L118.7 99.1 L119.1 99.0 L119.6 98.7 L120.0 98.3 L120.4 97.9 L120.9 97.4 L121.3 97.0 L121.8 96.6 L122.2 96.2 L122.7 95.8 L123.1 95.5 L123.5 95.1 L124.0 94.8 L124.4 94.4 L124.9 94.1 L125.3 93.7 L125.7 93.3 L126.2 93.0 L126.6 92.6 L127.1 92.2 L127.5 91.9 L128.0 91.5 L128.4 91.1 L128.8 90.7 L129.3 90.2 L129.7 89.8 L130.2 89.4 L130.6 88.9 L131.0 88.5 L131.5 88.1 L131.9 87.8 L132.4 87.4 L132.8 87.0 L133.3 86.7 L133.7 86.3 L134.1 85.8 L134.6 85.4 L135.0 85.0 L135.5 84.6 L135.9 84.1 L136.4 83.6 L136.8 83.1 L137.2 82.6 L137.7 82.1 L138.1 81.6 L138.6 81.0 L139.0 80.4 L139.4 79.8 L139.9 79.3 L140.3 78.7 L140.8 78.1 L141.2 77.5 L141.7 76.9 L142.1 76.4 L142.5 75.8 L143.0 75.2 L143.4 74.6 L143.9 74.1 L144.3 73.5 L144.8 73.0 L145.2 72.4 L145.6 71.9 L146.1 71.3 L146.5 70.8 L147.0 70.2 L147.4 69.7 L147.8 69.1 L148.3 68.6 L148.7 68.1 L149.2 67.6 L149.6 67.1 L150.1 66.6 L150.5 66.2 L150.9 65.8 L151.4 65.4 L151.8 65.1 L152.3 64.8 L152.7 64.5 L153.1 64.3 L153.6 64.0 L154.0 63.8 L154.5 63.6 L154.9 63.5 L155.4 63.3 L155.8 63.2 L156.2 63.0 L156.7 62.9 L157.1 62.8 L157.6 62.7 L158.0 62.6 L158.5 62.5 L158.9 62.4 L159.3 62.3 L159.8 62.2 L160.2 62.0 L160.7 61.9 L161.1 61.7 L161.5 61.6 L162.0 61.4 L162.4 61.2 L162.9 60.9 L163.3 60.7 L163.8 60.4 L164.2 60.1 L164.6 59.8 L165.1 59.5 L165.5 59.1 L166.0 58.7 L166.4 58.3 L166.9 57.8 L167.3 57.3 L167.7 56.7 L168.2 56.2 L168.6 55.6 L169.1 55.1 L169.5 54.6 L169.9 54.1 L170.4 53.7 L170.8 53.2 L171.3 52.8 L171.7 52.4 L172.2 51.9 L172.6 51.5 L173.0 51.0 L173.5 50.6 L173.9 50.1 L174.4 49.6 L174.8 49.1 L175.2 48.6 L175.7 48.1 L176.1 47.6 L176.6 47.1 L177.0 46.6 L177.5 46.1 L177.9 45.6 L178.3 45.1 L178.8 44.6 L179.2 44.0 L179.7 43.5 L180.1 42.9 L180.6 42.3 L181.0 41.8 L181.4 41.2 L181.9 40.7 L182.3 40.1 L182.8 39.6 L183.2 39.0 L183.6 38.5 L184.1 38.0 L184.5 37.4 L185.0 36.9 L185.4 36.3 L185.9 35.8 L186.3 35.3 L186.7 34.7 L187.2 34.2 L187.6 33.7 L188.1 33.2 L188.5 32.8 L189.0 32.3 L189.4 31.9 L189.8 31.5 L190.3 31.2 L190.7 30.8 L191.2 30.5 L191.6 30.2 L192.0 29.9 L192.5 29.6 L192.9 29.3 L193.4 29.1 L193.8 28.8 L194.3 28.6 L194.7 28.4 L195.1 28.2 L195.6 27.9 L196.0 27.8 L196.5 27.6 L196.9 27.4 L197.3 27.2 L197.8 27.0 L198.2 26.8 L198.7 26.6 L199.1 26.4 L199.6 26.2 L200.0 26.0"/>
<g class="cv-tick"><line x1="37" y1="226.0" x2="40" y2="226.0"/><text class="cv-ticklabel cv-ticklabel--y cv-small" x="34" y="229.0">0</text></g>
<g class="cv-tick"><line x1="200" y1="226.0" x2="203" y2="226.0"/><text class="cv-ticklabel cv-ticklabel--r cv-small" x="206" y="229.0">0</text></g>
<g class="cv-tick"><line x1="37" y1="159.3" x2="40" y2="159.3"/><text class="cv-ticklabel cv-ticklabel--y cv-small" x="34" y="162.3">1k</text></g>
<g class="cv-tick"><line x1="200" y1="159.3" x2="203" y2="159.3"/><text class="cv-ticklabel cv-ticklabel--r cv-small" x="206" y="162.3">21k</text></g>
<g class="cv-tick"><line x1="37" y1="92.7" x2="40" y2="92.7"/><text class="cv-ticklabel cv-ticklabel--y cv-small" x="34" y="95.7">2k</text></g>
<g class="cv-tick"><line x1="200" y1="92.7" x2="203" y2="92.7"/><text class="cv-ticklabel cv-ticklabel--r cv-small" x="206" y="95.7">41k</text></g>
<g class="cv-tick"><line x1="37" y1="26.0" x2="40" y2="26.0"/><text class="cv-ticklabel cv-ticklabel--y cv-small" x="34" y="29.0">3k</text></g>
<g class="cv-tick"><line x1="200" y1="26.0" x2="203" y2="26.0"/><text class="cv-ticklabel cv-ticklabel--r cv-small" x="206" y="29.0">62k</text></g>
</g>
<g class="cv-panel">
<text class="cv-title" x="332" y="16">United Kingdom</text>
<g class="cv-axis"><line x1="252" y1="226" x2="412" y2="226"/><line x1="252" y1="26" x2="252" y2="226"/><line x1="412" y1="26" x2="412" y2="226"/></g>
<g class="cv-tick"><line x1="252.0" y1="226" x2="252.0" y2="230"/><text class="cv-ticklabel" x="252.0" y="241">Oct</text></g>
<g class="cv-tick"><line x1="306.4" y1="226" x2="306.4" y2="230"/><text class="cv-ticklabel" x="306.4" y="241">Feb</text></g>
<g class="cv-tick"><line x1="359.4" y1="226" x2="359.4" y2="230"/><text class="cv-ticklabel" x="359.4" y="241">Jun</text></g>
<line class="cv-milestone cv-ms1" x1="296.6" y1="26" x2="296.6" y2="226"/>
<line class="cv-milestone cv-ms2" x1="348.4" y1="26" x2="348.4" y2="226"/>
<line class="cv-milestone cv-ms3" x1="375.3" y1="26" x2="375.3" y2="226"/>
<path class="cv-line cv-inc" d="M252.0 173.9 L252.4 173.7 L252.9 173.6 L253.3 173.5 L253.8 173.3 L254.2 173.2 L254.7 173.0 L255.1 172.9 L255.5 172.7 L256.0 172.5 L256.4 172.4 L256.9 172.2 L257.3 172.0 L257.7 171.8 L258.2 171.6 L258.6 171.4 L259.1 171.2 L259.5 170.9 L260.0 170.7 L260.4 170.4 L260.8 170.2 L261.3 169.9 L261.7 169.7 L262.2 169.4 L262.6 169.1 L263.0 168.8 L263.5 168.5 L263.9 168.1 L264.4 167.8 L264.8 167.4 L265.3 167.1 L265.7 166.7 L266.1 166.3 L266.6 165.9 L267.0 165.5 L267.5 165.1 L267.9 164.7 L268.4 164.2 L268.8 163.8 L269.2 163.3 L269.7 162.9 L270.1 162.4 L270.6 162.0 L271.0 161.5 L271.4 161.0 L271.9 160.5 L272.3 160.0 L272.8 159.5 L273.2 159.0 L273.7 158.5 L274.1 158.0 L274.5 157.5 L275.0 156.9 L275.4 156.4 L275.9 155.9 L276.3 155.3 L276.8 154.8 L277.2 154.3 L277.6 153.8 L278.1 153.3 L278.5 152.8 L279.0 152.4 L279.4 151.9 L279.8 151.4 L280.3 151.0 L280.7 150.5 L281.2 150.1 L281.6 149.6 L282.1 149.2 L282.5 148.7 L282.9 148.3 L283.4 147.8 L283.8 147.4 L284.3 146.9 L284.7 146.5 L285.1 146.0 L285.6 145.5 L286.0 145.0 L286.5 144.5 L286.9 144.0 L287.4 143.5 L287.8 143.0 L288.2 142.4 L288.7 141.9 L289.1 141.3 L289.6 140.7 L290.0 140.1 L290.5 139.5 L290.9 138.8 L291.3 138.1 L291.8 137.4 L292.2 136.6 L292.7 135.9 L293.1 135.1 L293.5 134.2 L294.0 133.3 L294.4 132.3 L294.9 131.3 L295.3 130.3 L295.8 129.2 L296.2 128.1 L296.6 126.9 L297.1 125.7 L297.5 124.4 L298.0 123.1 L298.4 121.8 L298.9 120.5 L299.3 119.1 L299.7 117.7 L300.2 116.3 L300.6 114.9 L301.1 113.5 L301.5 112.1 L301.9 110.6 L302.4 109.2 L302.8 107.7 L303.3 106.3 L303.7 104.8 L304.2 103.4 L304.6 102.0 L305.0 100.7 L305.5 99.3 L305.9 98.0 L306.4 96.7 L306.8 95.4 L307.2 94.1 L307.7 92.8 L308.1 91.5 L308.6 90.3 L309.0 89.1 L309.5 88.0 L309.9 86.9 L310.3 85.7 L310.8 84.6 L311.2 83.6 L311.7 82.6 L312.1 81.6 L312.6 80.6 L313.0 79.6 L313.4 78.7 L313.9 77.7 L314.3 76.9 L314.8 76.0 L315.2 75.2 L315.6 74.4 L316.1 73.6 L316.5 72.9 L317.0 72.1 L317.4 71.4 L317.9 70.7 L318.3 70.1 L318.7 69.5 L319.2 68.8 L319.6 68.3 L320.1 67.7 L320.5 67.1 L321.0 66.6 L321.4 66.1 L321.8 65.6 L322.3 65.2 L322.7 64.7 L323.2 64.3 L323.6 63.9 L324.0 63.5 L324.5 63.1 L324.9 62.8 L325.4 62.4 L325.8 62.1 L326.3 61.8 L326.7 61.5 L327.1 61.2 L327.6 60.9 L328.0 60.7 L328.5 60.4 L328.9 60.2 L329.3 59.9 L329.8 59.7 L330.2 59.5 L330.7 59.3 L331.1 59.1 L331.6 58.9 L332.0 58.7 L332.4 58.5 L332.9 58.3 L333.3 58.2 L333.8 58.0 L334.2 57.8 L334.7 57.7 L335.1 57.5 L335.5 57.4 L336.0 57.2 L336.4 57.1 L336.9 56.9 L337.3 56.8 L337.7 56.7 L338.2 56.6 L338.6 56.4 L339.1 56.3 L339.5 56.2 L340.0 56.1 L340.4 56.0 L340.8 55.9 L341.3 55.8 L341.7 55.7 L342.2 55.6 L342.6 55.5 L343.0 55.4 L343.5 55.3 L343.9 55.3 L344.4 55.2 L344.8 55.1 L345.3 55.1 L345.7 55.0 L346.1 54.9 L346.6 54.8 L347.0 54.8 L347.5 54.7 L347.9 54.7 L348.4 54.6 L348.8 54.6 L349.2 54.5 L349.7 54.4 L350.1 54.4 L350.6 54.3 L351.0 54.3 L351.4 54.3 L351.9 54.2 L352.3 54.2 L352.8 54.1 L353.2 54.1 L353.7 54.0 L354.1 54.0 L354.5 53.9 L355.0 53.9 L355.4 53.9 L355.9 53.8 L356.3 53.8 L356.8 53.7 L357.2 53.7 L357.6 53.6 L358.1 53.6 L358.5 53.6 L359.0 53.5 L359.4 53.5 L359.8 53.4 L360.3 53.4 L360.7 53.3 L361.2 53.3 L361.6 53.2 L362.1 53.2 L362.5 53.1 L362.9 53.1 L363.4 53.0 L363.8 52.9 L364.3 52.9 L364.7 52.8 L365.1 52.7 L365.6 52.7 L366.0 52.6 L366.5 52.5 L366.9 52.4 L367.4 52.4 L367.8 52.3 L368.2 52.2 L368.7 52.1 L369.1 52.0 L369.6 51.9 L370.0 51.9 L370.5 51.8 L370.9 51.7 L371.3 51.6 L371.8 51.5 L372.2 51.4 L372.7 51.2 L373.1 51.1 L373.5 51.0 L374.0 50.9 L374.4 50.8 L374.9 50.6 L375.3 50.5 L375.8 50.3 L376.2 50.2 L376.6 50.0 L377.1 49.8 L377.5 49.7 L378.0 49.5 L378.4 49.3 L378.9 49.1 L379.3 48.9 L379.7 48.7 L380.2 48.5 L380.6 48.3 L381.1 48.0 L381.5 47.8 L381.9 47.6 L382.4 47.3 L382.8 47.0 L383.3 46.8 L383.7 46.5 L384.2 46.2 L384.6 45.8 L385.0 45.5 L385.5 45.2 L385.9 44.9 L386.4 44.6 L386.8 44.3 L387.2 44.0 L387.7 43.6 L388.1 43.3 L388.6 43.0 L389.0 42.7 L389.5 42.4 L389.9 42.1 L390.3 41.8 L390.8 41.5 L391.2 41.2 L391.7 40.8 L392.1 40.5 L392.6 40.2 L393.0 39.9 L393.4 39.5 L393.9 39.2 L394.3 38.9 L394.8 38.5 L395.2 38.2 L395.6 37.9 L396.1 37.5 L396.5 37.2 L397.0 36.8 L397.4 36.5 L397.9 36.1 L398.3 35.8 L398.7 35.4 L399.2 35.1 L399.6 34.7 L400.1 34.4 L400.5 34.0 L401.0 33.6 L401.4 33.2 L401.8 32.9 L402.3 32.5 L402.7 32.1 L403.2 31.8 L403.6 31.4 L404.0 31.0 L404.5 30.6 L404.9 30.3 L405.4 29.9 L405.8 29.5 L406.3 29.1 L406.7 28.7 L407.1 28.4 L407.6 28.0 L408.0 27.7 L408.5 27.3 L408.9 27.0 L409.3 26.6 L409.8 26.3 L410.2 26.0 L410.7 26.0 L411.1 26.0 L411.6 26.0 L412.0 26.0"/>
<path class="cv-line cv-icu" d="M252.0 214.4 L252.4 214.3 L252.9 214.1 L253.3 213.8 L253.8 213.5 L254.2 213.2 L254.7 212.9 L255.1 212.5 L255.5 212.1 L256.0 211.7 L256.4 211.3 L256.9 210.9 L257.3 210.5 L257.7 210.1 L258.2 209.7 L258.6 209.3 L259.1 208.9 L259.5 208.4 L260.0 208.0 L260.4 207.5 L260.8 207.0 L261.3 206.5 L261.7 205.9 L262.2 205.4 L262.6 204.8 L263.0 204.3 L263.5 203.7 L263.9 203.1 L264.4 202.5 L264.8 201.9 L265.3 201.3 L265.7 200.7 L266.1 200.2 L266.6 199.6 L267.0 199.0 L267.5 198.4 L267.9 197.8 L268.4 197.2 L268.8 196.6 L269.2 196.0 L269.7 195.4 L270.1 194.9 L270.6 194.2 L271.0 193.6 L271.4 192.9 L271.9 192.3 L272.3 191.6 L272.8 191.0 L273.2 190.3 L273.7 189.7 L274.1 189.1 L274.5 188.6 L275.0 188.0 L275.4 187.5 L275.9 187.0 L276.3 186.6 L276.8 186.1 L277.2 185.7 L277.6 185.3 L278.1 184.9 L278.5 184.5 L279.0 184.1 L279.4 183.7 L279.8 183.4 L280.3 183.0 L280.7 182.6 L281.2 182.2 L281.6 181.8 L282.1 181.4 L282.5 181.0 L282.9 180.6 L283.4 180.1 L283.8 179.7 L284.3 179.2 L284.7 178.7 L285.1 178.2 L285.6 177.6 L286.0 177.0 L286.5 176.4 L286.9 175.7 L287.4 175.0 L287.8 174.3 L288.2 173.4 L288.7 172.6 L289.1 171.7 L289.6 170.7 L290.0 169.8 L290.5 168.9 L290.9 167.9 L291.3 166.9 L291.8 165.8 L292.2 164.7 L292.7 163.5 L293.1 162.2 L293.5 160.9 L294.0 159.4 L294.4 158.0 L294.9 156.5 L295.3 155.0 L295.8 153.4 L296.2 151.9 L296.6 150.3 L297.1 148.8 L297.5 147.3 L298.0 145.9 L298.4 144.5 L298.9 143.2 L299.3 141.9 L299.7 140.7 L300.2 139.5 L300.6 138.4 L301.1 137.3 L301.5 136.3 L301.9 135.3 L302.4 134.3 L302.8 133.3 L303.3 132.5 L303.7 131.6 L304.2 130.9 L304.6 130.1 L305.0 129.4 L305.5 128.7 L305.9 128.1 L306.4 127.5 L306.8 126.9 L307.2 126.3 L307.7 125.7 L308.1 125.2 L308.6 124.7 L309.0 124.2 L309.5 123.8 L309.9 123.3 L310.3 122.9 L310.8 122.5 L311.2 122.1 L311.7 121.7 L312.1 121.4 L312.6 121.1 L313.0 120.7 L313.4 120.4 L313.9 120.1 L314.3 119.8 L314.8 119.5 L315.2 119.2 L315.6 118.9 L316.1 118.6 L316.5 118.4 L317.0 118.1 L317.4 117.9 L317.9 117.6 L318.3 117.4 L318.7 117.2 L319.2 117.0 L319.6 116.8 L320.1 116.6 L320.5 116.4 L321.0 116.3 L321.4 116.1 L321.8 116.0 L322.3 115.8 L322.7 115.7 L323.2 115.5 L323.6 115.4 L324.0 115.2 L324.5 115.1 L324.9 114.9 L325.4 114.7 L325.8 114.6 L326.3 114.5 L326.7 114.3 L327.1 114.2 L327.6 114.0 L328.0 113.9 L328.5 113.7 L328.9 113.6 L329.3 113.4 L329.8 113.3 L330.2 113.2 L330.7 113.0 L331.1 112.9 L331.6 112.8 L332.0 112.6 L332.4 112.5 L332.9 112.4 L333.3 112.3 L333.8 112.2 L334.2 112.1 L334.7 112.0 L335.1 111.9 L335.5 111.9 L336.0 111.8 L336.4 111.8 L336.9 111.7 L337.3 111.7 L337.7 111.6 L338.2 111.6 L338.6 111.6 L339.1 111.5 L339.5 111.4 L340.0 111.4 L340.4 111.3 L340.8 111.2 L341.3 111.2 L341.7 111.1 L342.2 111.0 L342.6 111.0 L343.0 110.9 L343.5 110.8 L343.9 110.8 L344.4 110.7 L344.8 110.7 L345.3 110.6 L345.7 110.5 L346.1 110.5 L346.6 110.4 L347.0 110.4 L347.5 110.3 L347.9 110.3 L348.4 110.2 L348.8 110.2 L349.2 110.1 L349.7 110.0 L350.1 110.0 L350.6 109.9 L351.0 109.9 L351.4 109.8 L351.9 109.7 L352.3 109.7 L352.8 109.6 L353.2 109.6 L353.7 109.5 L354.1 109.5 L354.5 109.5 L355.0 109.4 L355.4 109.4 L355.9 109.3 L356.3 109.3 L356.8 109.2 L357.2 109.1 L357.6 109.1 L358.1 109.0 L358.5 108.9 L359.0 108.8 L359.4 108.7 L359.8 108.6 L360.3 108.5 L360.7 108.4 L361.2 108.3 L361.6 108.2 L362.1 108.1 L362.5 107.9 L362.9 107.8 L363.4 107.6 L363.8 107.4 L364.3 107.3 L364.7 107.1 L365.1 106.9 L365.6 106.7 L366.0 106.5 L366.5 106.3 L366.9 106.1 L367.4 105.8 L367.8 105.6 L368.2 105.3 L368.7 105.1 L369.1 104.8 L369.6 104.5 L370.0 104.1 L370.5 103.8 L370.9 103.4 L371.3 103.0 L371.8 102.5 L372.2 102.0 L372.7 101.5 L373.1 100.9 L373.5 100.3 L374.0 99.7 L374.4 99.0 L374.9 98.3 L375.3 97.6 L375.8 96.9 L376.2 96.1 L376.6 95.3 L377.1 94.5 L377.5 93.7 L378.0 92.8 L378.4 91.9 L378.9 90.9 L379.3 89.9 L379.7 88.8 L380.2 87.6 L380.6 86.4 L381.1 85.1 L381.5 83.9 L381.9 82.7 L382.4 81.5 L382.8 80.5 L383.3 79.5 L383.7 78.5 L384.2 77.7 L384.6 76.9 L385.0 76.1 L385.5 75.4 L385.9 74.7 L386.4 74.0 L386.8 73.3 L387.2 72.7 L387.7 72.0 L388.1 71.3 L388.6 70.6 L389.0 69.9 L389.5 69.2 L389.9 68.5 L390.3 67.8 L390.8 67.0 L391.2 66.3 L391.7 65.6 L392.1 64.8 L392.6 64.1 L393.0 63.3 L393.4 62.6 L393.9 61.8 L394.3 61.0 L394.8 60.2 L395.2 59.3 L395.6 58.5 L396.1 57.6 L396.5 56.8 L397.0 55.9 L397.4 55.0 L397.9 54.1 L398.3 53.2 L398.7 52.3 L399.2 51.5 L399.6 50.6 L400.1 49.7 L400.5 48.8 L401.0 47.9 L401.4 47.0 L401.8 46.1 L402.3 45.1 L402.7 44.1 L403.2 43.1 L403.6 42.1 L404.0 41.1 L404.5 40.2 L404.9 39.3 L405.4 38.4 L405.8 37.5 L406.3 36.7 L406.7 35.9 L407.1 35.2 L407.6 34.4 L408.0 33.6 L408.5 32.9 L408.9 32.0 L409.3 31.2 L409.8 30.4 L410.2 29.5 L410.7 28.7 L411.1 27.8 L411.6 26.9 L412.0 26.0"/>
<g class="cv-tick"><line x1="249" y1="226.0" x2="252" y2="226.0"/><text class="cv-ticklabel cv-ticklabel--y cv-small" x="246" y="229.0">0</text></g>
<g class="cv-tick"><line x1="412" y1="226.0" x2="415" y2="226.0"/><text class="cv-ticklabel cv-ticklabel--r cv-small" x="418" y="229.0">0</text></g>
<g class="cv-tick"><line x1="249" y1="159.3" x2="252" y2="159.3"/><text class="cv-ticklabel cv-ticklabel--y cv-small" x="246" y="162.3">3k</text></g>
<g class="cv-tick"><line x1="412" y1="159.3" x2="415" y2="159.3"/><text class="cv-ticklabel cv-ticklabel--r cv-small" x="418" y="162.3">37k</text></g>
<g class="cv-tick"><line x1="249" y1="92.7" x2="252" y2="92.7"/><text class="cv-ticklabel cv-ticklabel--y cv-small" x="246" y="95.7">5k</text></g>
<g class="cv-tick"><line x1="412" y1="92.7" x2="415" y2="92.7"/><text class="cv-ticklabel cv-ticklabel--r cv-small" x="418" y="95.7">75k</text></g>
<g class="cv-tick"><line x1="249" y1="26.0" x2="252" y2="26.0"/><text class="cv-ticklabel cv-ticklabel--y cv-small" x="246" y="29.0">8k</text></g>
<g class="cv-tick"><line x1="412" y1="26.0" x2="415" y2="26.0"/><text class="cv-ticklabel cv-ticklabel--r cv-small" x="418" y="29.0">112k</text></g>
</g>
<g class="cv-panel">
<text class="cv-title" x="544" y="16">Israel</text>
<g class="cv-axis"><line x1="464" y1="226" x2="624" y2="226"/><line x1="464" y1="26" x2="464" y2="226"/><line x1="624" y1="26" x2="624" y2="226"/></g>
<g class="cv-tick"><line x1="464.0" y1="226" x2="464.0" y2="230"/><text class="cv-ticklabel" x="464.0" y="241">Oct</text></g>
<g class="cv-tick"><line x1="518.4" y1="226" x2="518.4" y2="230"/><text class="cv-ticklabel" x="518.4" y="241">Feb</text></g>
<g class="cv-tick"><line x1="571.4" y1="226" x2="571.4" y2="230"/><text class="cv-ticklabel" x="571.4" y="241">Jun</text></g>
<line class="cv-milestone cv-ms1" x1="506.0" y1="26" x2="506.0" y2="226"/>
<line class="cv-milestone cv-ms2" x1="521.5" y1="26" x2="521.5" y2="226"/>
<line class="cv-milestone cv-ms3" x1="537.8" y1="26" x2="537.8" y2="226"/>
<path class="cv-line cv-inc" d="M464.0 205.4 L464.4 204.7 L464.9 203.9 L465.3 203.2 L465.8 202.4 L466.2 201.5 L466.7 200.7 L467.1 199.9 L467.5 199.1 L468.0 198.3 L468.4 197.5 L468.9 196.7 L469.3 195.8 L469.7 195.0 L470.2 194.2 L470.6 193.5 L471.1 192.7 L471.5 192.0 L472.0 191.2 L472.4 190.5 L472.8 189.7 L473.3 189.0 L473.7 188.3 L474.2 187.6 L474.6 186.9 L475.0 186.3 L475.5 185.6 L475.9 185.0 L476.4 184.4 L476.8 183.8 L477.3 183.3 L477.7 182.7 L478.1 182.2 L478.6 181.6 L479.0 181.1 L479.5 180.6 L479.9 180.1 L480.4 179.7 L480.8 179.2 L481.2 178.7 L481.7 178.2 L482.1 177.8 L482.6 177.4 L483.0 177.0 L483.4 176.5 L483.9 176.1 L484.3 175.7 L484.8 175.3 L485.2 174.9 L485.7 174.5 L486.1 174.1 L486.5 173.7 L487.0 173.3 L487.4 172.9 L487.9 172.5 L488.3 172.2 L488.8 171.9 L489.2 171.5 L489.6 171.2 L490.1 170.9 L490.5 170.6 L491.0 170.3 L491.4 170.0 L491.8 169.7 L492.3 169.4 L492.7 169.0 L493.2 168.7 L493.6 168.4 L494.1 168.0 L494.5 167.7 L494.9 167.4 L495.4 167.0 L495.8 166.7 L496.3 166.3 L496.7 166.0 L497.1 165.6 L497.6 165.3 L498.0 164.9 L498.5 164.5 L498.9 164.1 L499.4 163.6 L499.8 163.2 L500.2 162.7 L500.7 162.3 L501.1 161.9 L501.6 161.3 L502.0 160.9 L502.5 160.3 L502.9 159.8 L503.3 159.2 L503.8 158.6 L504.2 157.9 L504.7 157.2 L505.1 156.6 L505.5 155.8 L506.0 155.1 L506.4 154.3 L506.9 153.5 L507.3 152.6 L507.8 151.8 L508.2 150.9 L508.6 150.0 L509.1 149.1 L509.5 148.1 L510.0 147.2 L510.4 146.2 L510.9 145.3 L511.3 144.3 L511.7 143.3 L512.2 142.3 L512.6 141.2 L513.1 140.1 L513.5 139.0 L513.9 137.8 L514.4 136.6 L514.8 135.4 L515.3 134.3 L515.7 133.1 L516.2 131.9 L516.6 130.7 L517.0 129.5 L517.5 128.4 L517.9 127.2 L518.4 126.0 L518.8 124.8 L519.2 123.6 L519.7 122.5 L520.1 121.3 L520.6 120.1 L521.0 118.9 L521.5 117.7 L521.9 116.5 L522.3 115.4 L522.8 114.3 L523.2 113.2 L523.7 112.1 L524.1 111.0 L524.6 109.9 L525.0 108.9 L525.4 107.8 L525.9 106.9 L526.3 105.8 L526.8 104.9 L527.2 103.9 L527.6 103.0 L528.1 102.1 L528.5 101.2 L529.0 100.3 L529.4 99.5 L529.9 98.6 L530.3 97.8 L530.7 97.0 L531.2 96.2 L531.6 95.5 L532.1 94.7 L532.5 93.9 L533.0 93.2 L533.4 92.4 L533.8 91.6 L534.3 90.9 L534.7 90.1 L535.2 89.4 L535.6 88.6 L536.0 87.9 L536.5 87.1 L536.9 86.3 L537.4 85.5 L537.8 84.8 L538.3 84.1 L538.7 83.4 L539.1 82.6 L539.6 81.9 L540.0 81.2 L540.5 80.5 L540.9 79.8 L541.3 79.1 L541.8 78.4 L542.2 77.7 L542.7 77.0 L543.1 76.3 L543.6 75.7 L544.0 75.1 L544.4 74.4 L544.9 73.9 L545.3 73.3 L545.8 72.8 L546.2 72.2 L546.7 71.7 L547.1 71.2 L547.5 70.7 L548.0 70.2 L548.4 69.8 L548.9 69.3 L549.3 68.9 L549.7 68.6 L550.2 68.2 L550.6 67.8 L551.1 67.5 L551.5 67.1 L552.0 66.8 L552.4 66.5 L552.8 66.2 L553.3 65.9 L553.7 65.6 L554.2 65.4 L554.6 65.1 L555.0 64.8 L555.5 64.6 L555.9 64.4 L556.4 64.2 L556.8 64.0 L557.3 63.8 L557.7 63.6 L558.1 63.4 L558.6 63.2 L559.0 63.1 L559.5 62.9 L559.9 62.8 L560.4 62.6 L560.8 62.5 L561.2 62.3 L561.7 62.2 L562.1 62.1 L562.6 61.9 L563.0 61.8 L563.4 61.7 L563.9 61.6 L564.3 61.5 L564.8 61.3 L565.2 61.2 L565.7 61.1 L566.1 61.0 L566.5 60.9 L567.0 60.8 L567.4 60.6 L567.9 60.5 L568.3 60.4 L568.8 60.3 L569.2 60.2 L569.6 60.1 L570.1 60.0 L570.5 59.9 L571.0 59.8 L571.4 59.8 L571.8 59.7 L572.3 59.6 L572.7 59.5 L573.2 59.4 L573.6 59.4 L574.1 59.3 L574.5 59.2 L574.9 59.2 L575.4 59.1 L575.8 59.1 L576.3 59.0 L576.7 58.9 L577.1 58.9 L577.6 58.8 L578.0 58.8 L578.5 58.7 L578.9 58.7 L579.4 58.6 L579.8 58.6 L580.2 58.5 L580.7 58.5 L581.1 58.4 L581.6 58.4 L582.0 58.3 L582.5 58.3 L582.9 58.2 L583.3 58.2 L583.8 58.1 L584.2 58.1 L584.7 58.0 L585.1 58.0 L585.5 58.0 L586.0 57.9 L586.4 57.9 L586.9 57.8 L587.3 57.8 L587.8 57.7 L588.2 57.7 L588.6 57.7 L589.1 57.6 L589.5 57.6 L590.0 57.5 L590.4 57.5 L590.9 57.4 L591.3 57.4 L591.7 57.3 L592.2 57.3 L592.6 57.2 L593.1 57.2 L593.5 57.1 L593.9 57.0 L594.4 57.0 L594.8 56.9 L595.3 56.8 L595.7 56.8 L596.2 56.7 L596.6 56.6 L597.0 56.5 L597.5 56.4 L597.9 56.3 L598.4 56.2 L598.8 56.0 L599.2 55.9 L599.7 55.7 L600.1 55.5 L600.6 55.3 L601.0 55.1 L601.5 54.9 L601.9 54.6 L602.3 54.4 L602.8 54.1 L603.2 53.8 L603.7 53.6 L604.1 53.2 L604.6 52.9 L605.0 52.5 L605.4 52.1 L605.9 51.7 L606.3 51.3 L606.8 50.9 L607.2 50.4 L607.6 50.0 L608.1 49.5 L608.5 49.0 L609.0 48.5 L609.4 47.9 L609.9 47.4 L610.3 46.9 L610.7 46.3 L611.2 45.7 L611.6 45.1 L612.1 44.5 L612.5 43.9 L613.0 43.4 L613.4 42.8 L613.8 42.1 L614.3 41.5 L614.7 40.9 L615.2 40.2 L615.6 39.5 L616.0 38.8 L616.5 38.0 L616.9 37.3 L617.4 36.6 L617.8 35.8 L618.3 35.1 L618.7 34.4 L619.1 33.7 L619.6 33.0 L620.0 32.3 L620.5 31.6 L620.9 30.8 L621.3 30.1 L621.8 29.3 L622.2 28.4 L622.7 27.6 L623.1 26.8 L623.6 26.0 L624.0 26.0"/>
<path class="cv-line cv-icu" d="M464.0 188.5 L464.4 187.6 L464.9 186.7 L465.3 185.9 L465.8 185.0 L466.2 184.1 L466.7 183.3 L467.1 182.6 L467.5 182.0 L468.0 181.5 L468.4 180.9 L468.9 180.4 L469.3 180.0 L469.7 179.6 L470.2 179.3 L470.6 179.0 L471.1 178.7 L471.5 178.4 L472.0 178.2 L472.4 178.0 L472.8 177.8 L473.3 177.6 L473.7 177.5 L474.2 177.3 L474.6 177.2 L475.0 177.0 L475.5 176.9 L475.9 176.8 L476.4 176.7 L476.8 176.6 L477.3 176.4 L477.7 176.3 L478.1 176.2 L478.6 176.1 L479.0 176.0 L479.5 175.9 L479.9 175.8 L480.4 175.7 L480.8 175.6 L481.2 175.5 L481.7 175.4 L482.1 175.3 L482.6 175.2 L483.0 175.1 L483.4 175.0 L483.9 174.9 L484.3 174.8 L484.8 174.7 L485.2 174.6 L485.7 174.5 L486.1 174.4 L486.5 174.2 L487.0 174.1 L487.4 174.0 L487.9 173.9 L488.3 173.8 L488.8 173.6 L489.2 173.5 L489.6 173.3 L490.1 173.2 L490.5 173.0 L491.0 172.9 L491.4 172.7 L491.8 172.5 L492.3 172.3 L492.7 172.1 L493.2 171.9 L493.6 171.7 L494.1 171.5 L494.5 171.3 L494.9 171.0 L495.4 170.8 L495.8 170.5 L496.3 170.2 L496.7 169.9 L497.1 169.6 L497.6 169.3 L498.0 169.0 L498.5 168.6 L498.9 168.2 L499.4 167.8 L499.8 167.4 L500.2 166.9 L500.7 166.4 L501.1 165.9 L501.6 165.4 L502.0 164.8 L502.5 164.2 L502.9 163.5 L503.3 162.8 L503.8 162.1 L504.2 161.4 L504.7 160.6 L505.1 159.8 L505.5 158.9 L506.0 157.9 L506.4 157.0 L506.9 155.9 L507.3 154.8 L507.8 153.7 L508.2 152.6 L508.6 151.4 L509.1 150.2 L509.5 149.0 L510.0 147.7 L510.4 146.4 L510.9 145.1 L511.3 143.8 L511.7 142.4 L512.2 141.1 L512.6 139.9 L513.1 138.6 L513.5 137.4 L513.9 136.2 L514.4 135.0 L514.8 134.0 L515.3 133.0 L515.7 132.0 L516.2 131.0 L516.6 130.0 L517.0 128.9 L517.5 127.9 L517.9 126.9 L518.4 125.7 L518.8 124.6 L519.2 123.5 L519.7 122.5 L520.1 121.4 L520.6 120.3 L521.0 119.2 L521.5 118.2 L521.9 117.2 L522.3 116.3 L522.8 115.4 L523.2 114.6 L523.7 113.7 L524.1 113.0 L524.6 112.2 L525.0 111.5 L525.4 110.9 L525.9 110.3 L526.3 109.7 L526.8 109.2 L527.2 108.6 L527.6 108.0 L528.1 107.5 L528.5 106.9 L529.0 106.3 L529.4 105.7 L529.9 105.1 L530.3 104.5 L530.7 103.9 L531.2 103.3 L531.6 102.8 L532.1 102.2 L532.5 101.6 L533.0 101.0 L533.4 100.4 L533.8 99.9 L534.3 99.3 L534.7 98.8 L535.2 98.4 L535.6 97.9 L536.0 97.5 L536.5 97.1 L536.9 96.8 L537.4 96.4 L537.8 96.1 L538.3 95.9 L538.7 95.6 L539.1 95.4 L539.6 95.2 L540.0 95.1 L540.5 94.9 L540.9 94.8 L541.3 94.6 L541.8 94.5 L542.2 94.4 L542.7 94.3 L543.1 94.3 L543.6 94.2 L544.0 94.1 L544.4 94.1 L544.9 94.0 L545.3 94.0 L545.8 93.9 L546.2 93.9 L546.7 93.8 L547.1 93.8 L547.5 93.7 L548.0 93.7 L548.4 93.6 L548.9 93.6 L549.3 93.6 L549.7 93.5 L550.2 93.5 L550.6 93.5 L551.1 93.4 L551.5 93.4 L552.0 93.4 L552.4 93.4 L552.8 93.3 L553.3 93.3 L553.7 93.3 L554.2 93.3 L554.6 93.2 L555.0 93.2 L555.5 93.2 L555.9 93.2 L556.4 93.2 L556.8 93.1 L557.3 93.1 L557.7 93.1 L558.1 93.1 L558.6 93.1 L559.0 93.1 L559.5 93.1 L559.9 93.1 L560.4 93.1 L560.8 93.1 L561.2 93.0 L561.7 93.0 L562.1 93.0 L562.6 93.0 L563.0 93.0 L563.4 93.0 L563.9 93.0 L564.3 93.0 L564.8 93.0 L565.2 93.0 L565.7 93.0 L566.1 93.0 L566.5 93.0 L567.0 93.0 L567.4 93.0 L567.9 93.0 L568.3 93.0 L568.8 93.0 L569.2 93.0 L569.6 93.0 L570.1 92.9 L570.5 92.9 L571.0 92.9 L571.4 92.9 L571.8 92.9 L572.3 92.9 L572.7 92.9 L573.2 92.9 L573.6 92.9 L574.1 92.9 L574.5 92.9 L574.9 92.9 L575.4 92.9 L575.8 92.9 L576.3 92.9 L576.7 92.9 L577.1 92.9 L577.6 92.9 L578.0 92.9 L578.5 92.9 L578.9 92.9 L579.4 92.9 L579.8 92.9 L580.2 92.9 L580.7 92.9 L581.1 92.9 L581.6 92.8 L582.0 92.8 L582.5 92.8 L582.9 92.8 L583.3 92.8 L583.8 92.7 L584.2 92.7 L584.7 92.7 L585.1 92.6 L585.5 92.6 L586.0 92.5 L586.4 92.5 L586.9 92.4 L587.3 92.4 L587.8 92.3 L588.2 92.2 L588.6 92.2 L589.1 92.1 L589.5 92.0 L590.0 91.9 L590.4 91.8 L590.9 91.7 L591.3 91.6 L591.7 91.5 L592.2 91.4 L592.6 91.2 L593.1 91.1 L593.5 90.9 L593.9 90.8 L594.4 90.6 L594.8 90.4 L595.3 90.2 L595.7 90.0 L596.2 89.7 L596.6 89.5 L597.0 89.2 L597.5 88.9 L597.9 88.6 L598.4 88.2 L598.8 87.8 L599.2 87.4 L599.7 87.0 L600.1 86.5 L600.6 86.0 L601.0 85.5 L601.5 84.9 L601.9 84.3 L602.3 83.7 L602.8 83.0 L603.2 82.2 L603.7 81.4 L604.1 80.5 L604.6 79.6 L605.0 78.7 L605.4 77.7 L605.9 76.7 L606.3 75.6 L606.8 74.5 L607.2 73.4 L607.6 72.2 L608.1 71.1 L608.5 69.8 L609.0 68.6 L609.4 67.3 L609.9 66.0 L610.3 64.6 L610.7 63.2 L611.2 61.8 L611.6 60.6 L612.1 59.1 L612.5 57.5 L613.0 55.9 L613.4 54.4 L613.8 52.9 L614.3 51.7 L614.7 50.5 L615.2 49.2 L615.6 48.1 L616.0 47.0 L616.5 45.8 L616.9 44.5 L617.4 43.0 L617.8 41.3 L618.3 39.9 L618.7 38.5 L619.1 37.2 L619.6 35.9 L620.0 34.7 L620.5 33.5 L620.9 32.4 L621.3 31.4 L621.8 30.4 L622.2 29.3 L622.7 28.4 L623.1 27.5 L623.6 26.7 L624.0 26.0"/>
<g class="cv-tick"><line x1="461" y1="226.0" x2="464" y2="226.0"/><text class="cv-ticklabel cv-ticklabel--y cv-small" x="458" y="229.0">0</text></g>
<g class="cv-tick"><line x1="624" y1="226.0" x2="627" y2="226.0"/><text class="cv-ticklabel cv-ticklabel--r cv-small" x="630" y="229.0">0</text></g>
<g class="cv-tick"><line x1="461" y1="159.3" x2="464" y2="159.3"/><text class="cv-ticklabel cv-ticklabel--y cv-small" x="458" y="162.3">3k</text></g>
<g class="cv-tick"><line x1="624" y1="159.3" x2="627" y2="159.3"/><text class="cv-ticklabel cv-ticklabel--r cv-small" x="630" y="162.3">48k</text></g>
<g class="cv-tick"><line x1="461" y1="92.7" x2="464" y2="92.7"/><text class="cv-ticklabel cv-ticklabel--y cv-small" x="458" y="95.7">5k</text></g>
<g class="cv-tick"><line x1="624" y1="92.7" x2="627" y2="92.7"/><text class="cv-ticklabel cv-ticklabel--r cv-small" x="630" y="95.7">96k</text></g>
<g class="cv-tick"><line x1="461" y1="26.0" x2="464" y2="26.0"/><text class="cv-ticklabel cv-ticklabel--y cv-small" x="458" y="29.0">8k</text></g>
<g class="cv-tick"><line x1="624" y1="26.0" x2="627" y2="26.0"/><text class="cv-ticklabel cv-ticklabel--r cv-small" x="630" y="29.0">144k</text></g>
</g>
<text class="cv-axis-title" x="9" y="126" transform="rotate(-90 9 126)">Cumulative ICU</text>
<text class="cv-axis-title" x="668" y="126" transform="rotate(-90 668 126)">Cumulative incidence</text>
<line class="cv-line cv-inc" x1="44" y1="296" x2="60" y2="296"/><text class="cv-legend" x="66" y="300">Cumulative ICU occupancy</text>
<line class="cv-line cv-icu" x1="242" y1="296" x2="258" y2="296"/><text class="cv-legend" x="264" y="300">Cumulative incidence</text>
<line class="cv-milestone cv-ms1" x1="414" y1="289" x2="414" y2="301"/><text class="cv-legend" x="420" y="300">first record</text>
<line class="cv-milestone cv-ms2" x1="516" y1="289" x2="516" y2="301"/><text class="cv-legend" x="522" y="300">25%</text>
<line class="cv-milestone cv-ms3" x1="557" y1="289" x2="557" y2="301"/><text class="cv-legend" x="563" y="300">50%</text>
</svg>
<figcaption>Cumulative ICU occupancy against cumulative incidence, each on its own scale, as published. Dotted verticals mark the first vaccination record and the days 25% and 50% of the population were fully vaccinated. The curves come apart after vaccination begins &#8212; and in Israel, vaccinated earliest, they close again by the autumn.</figcaption>
</figure>

Denmark and the UK are the straightforward cases: the curves separate once
vaccination is under way, and stay separate. Israel is the warning, because the
effect decays. It vaccinated earliest, and by its fourth wave the two curves
were climbing in step again — while in the UK, which reached the same coverage
months later, the gap was still open. Adjusting for vaccination therefore takes
two variables, not one: how much of the population is covered, and how long ago
they were covered.

## Takeaway

Incidence on its own is not expressive of the thing we are actually interested
in. It is a rough, real-time count of the infections that happened to be
detected, and the three biases above are three ways that count parts company
with the pandemic underneath it.

It is simply not, on its own, a measure of how much trouble the hospitals are
in — which is what the decisions attached to it were actually about. Read
alongside the positive rate, current ICU occupancy and the vaccination state
of the population, it becomes considerably more expressive. Read alone, and
tied to a fixed nationwide threshold, it quietly means something different in
every district and in every wave.

## Data

Every series in the figures above — cases, tests, ICU occupancy, vaccinations —
is from the [Our World in Data COVID-19 dataset](https://github.com/owid/covid-19-data)
as it stood in autumn 2021, compiled there from national sources and published
under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Two of its
components have papers of their own, which Our World in Data asks to be cited:

- **Testing** — Hasell, J., Mathieu, E., Beltekian, D., Macdonald, B., Giattino,
  C., Ortiz-Ospina, E., Roser, M., Ritchie, H. (2020). A cross-country database
  of COVID-19 testing. *Scientific Data* 7, 345.
  [doi:10.1038/s41597-020-00688-8](https://doi.org/10.1038/s41597-020-00688-8)
- **Vaccinations** — Mathieu, E., Ritchie, H., Ortiz-Ospina, E., Roser, M.,
  Hasell, J., Appel, C., Giattino, C., Rodés-Guirao, L. (2021). A global
  database of COVID-19 vaccinations. *Nature Human Behaviour* 5, 947–953.
  [doi:10.1038/s41562-021-01122-8](https://doi.org/10.1038/s41562-021-01122-8)
