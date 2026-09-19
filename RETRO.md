# <mark>\[WIP\]</mark> Retrospective, `MISSION: DARKWHITE`

<details>
<summary>

### Table of Contents

</summary>

- [Personal Context](#personal-context)
- [Overall Process](#overall-process)
- [Regrets](#regrets)
  - [Regret #1](#1-taking-on-a-bit-more-than-my-current-body-could-handle)
  - [Regret #2](#2-not-writing-more-devtools-more-sooner)
  - [Regret #3](#3-deciding-against-an-event-driven-architecture)
  - [Honorary Mention](#honorary-mention-sticking-to-the-mouse)
- [Synthesis](#synthesis)
  - [JS13k first-timer lessons](#js13k-first-timer-lessons)
  - [`mk_code_sml`](#mk_code_sml)
  - [3D Rotation Bestiary](#3d-rotation-bestiary)
- [What's Next?](#whats-next)
  - [Director's Cut](#directors-cut)
  - [Community Contributions](#community-contributions)
- [In Closing](#in-closing)

</details>

## Personal Context

<details>

<summary>
I include this mainly as a "if you're like me, this will be maximally useful to
you" - it's relatively brief.
</summary>

- After obtaining a
  [particularly inscrutible degree in college](https://www.youtube.com/watch?v=2VYRjHPmZdQ)
  I got caught up in the "learn to code" movement and chose it as my preferred
  survival method (aka job). ~12 years of experience, now, depending how you
  count it.
- With a game design minor I'd focused mostly on board games until this. For a
  few years before COVID I co-ran a small
  [design workshop](https://metromage.games/2020/03/29/build-a-game-in-under-2-hours-no-really/).
- All LLM use was in accordance with my
  [current policy](https://github.com/cutout-studios/.github/blob/main/profile/LLM_USE.md),
  though I currently don't have a means of collecting logs so it's a bit of a
  "trust me, bro" situation. My next project is to finalize a
  [local harness](https://github.com/cutout-studios/toolbox/tree/main/experimental/agent)
  to solve that problem going forward.
- My goals with JS13K this year were simple: learn to build a 3D web game as
  concisely as possible and get to know the community a little bit.

</details>

## Overall Process

TODO

<!--
> i spent time learning 3D programming b4 the competition
> similar to workshop
  > initial brainstorming/ideation (pictures)
  > paper prototype - 'it's fun'
  > things mostly came together in the last days
> final hours - deciding to stop so as to not get in a car crash lol
  > shift from "replayability" to "immediate gratification"
-->

## Regrets

### 1. **Taking on a bit more than my current body could handle.**

I've been a full-time informal caretaker for a couple years now and didn't quite
realize how much my own health had slipped. My ambitious nature has been
tempered by age, but my barometer was off. I initially thought "oh surely I'll
run out of space in the first couple weeks" - I ended up working right up to the
deadline, and I probably could have kept scraping against the byte limit for
another few days.

I still managed to complete ~90% of what I'd initially planned, but don't be
fooled - JS13k is just as much about energy and time management as it is byte
management.

### 2. **Not writing more devtools more sooner.**

I admittedly over-focused on the things that were relatively new to me - the 3D
programming and the golfing.

It is difficult, though, to justify tests or tools for things you're not even
sure you can fit. This led to a lot of "running ahead" with imperfect logic to
get a rough idea of how much code it would be or compress to. <mark>I also found
that one line of sketch code ultimately averaged to ~5 bytes in the compressed
final product,</mark> but YMMV (the final ratio was 1 line:3 bytes).

I also didn't realize how painful debugging that same "sketch logic" would be.
Logging from the game loop crashes Safari, and debugging is too tedious. Do we
really need a separate widget to confirm our games work? A previous boss of mine
[worked with internet standards bodies](https://datatracker.ietf.org/doc/rfc9460/) -
unless I'm missing something, it's so bad I am in fact planning on
[proposing a `console.log` extension](#community-contributions) of my own.

Overall JS13K kinda forces you to choose small software over your own developer
experience and I <mark>got stuck a bit too long in the mindset that I couldn't
have ANYTHING nice</mark>, to my detriment.

When I did break that mentality, the lion's share of my total LLM use was in
service of [spitting out crappy devtools](./devtools/) to make it easier to work
with my custom formats in the final days. They're decent at that, pretty much
everything else was hit or miss.

### 3. **Deciding against an event-driven architecture.**

This is minor, but I initially ruled out an
[event-driven architecture](https://en.wikipedia.org/wiki/Event-driven_architecture)
for fear that it would be too heavy. But, as I slowly eroded the quality of my
codebase to shave bytes, I began to realize that such a structure would have
likely been more resistant to tangling and similar in terms of byteweight. I'd
recommend this to anyone attempting JS13K now.

That said, going forward in my own work I will likely continue to
[lean heavily on a core loop](https://github.com/cutout-studios/toolbox/tree/main/jsx),
so I at least gave myself a preview of that.

### Honorable Mention: **Committing to limited platform support.**

I'm flagging this not necessarily as a regret but moreso a conscious choice I
would not have taken had my goal been to "go for the win" (where maximizing
accessibility is much more important).

Committing to WebGPU and a 2-button mouse meant that fewer people could play the
game as intended - but I was determined to see the best core I could make.

This tradeoff has already been reflected in initial reviews, and while yes, it
is mildly frustrating, I successfully proved to myself what's possible.

## Synthesis

### JS13k first-timer lessons

TODO

<!--
your job isn't done once you submit - review other people's games to increase your chances of being reviewed back
DC isn't your only outlet, you can flag your biggest issues in your project description at any time.
the js13k iframe doesn't support certain things, like system alerts. i had to cut at the last second.
yes proceduralize all the things but you can't proceduralize explaining things. an exercise i'd try next time - write out your entire game's full, in-depth explanation (enough that someone else can read and understand it) and see how big that is first (documentation-driven development)
  does explanation + fw leave enough space to actually write the logic?
-->

### 3D Rotation Bestiary

TODO

<!--
- Euler Angles and why they Gimbal Lock
- Quaternions and their impenetrability
- Rodriguez Matrix and why you need it regardless
- Rotors, Axis-angle - seems ideal
-->

### `mk_code_sml`

There are two layers to making your code small, and JS13k forces you to be
intimately familiar with each:

- `minification` (...)
- `compression` (...)

TODO

<!--
> Two layers - minification (i.e. intra-code compaction) and compression (inter-code). which are you targeting with what technique?
> Pipeline is half the battle

minification (most techniques target this)
> small =/= fast (stars). usually it does because of network time + JIT, but not at this level
  > rough heuristic - 1 line ~= 5 bytes
> ideal: concise systems - 3D lathe + concat, quantization and bitpacking
> leaning on browser apis whereever possible (css/html for ui and gradient effects, etc)
  > however, certain things don't work in the iframe environment...
> actual “code golfing” - tuples+property mangling, bitwise operations, inlining things (…intentional
   spaghetti code 😭), dirty JS tricks (double equals)

compression
> brotli vs. rr+deflate
> Imperfect Abstractions - “forced” DRYness and messy side effects in pursuit
   of forcing consistency (doTimes, ship code)
-->

## What's Next?

### Director's Cut

TODO

<!--
 maybe directors cut - but probably not. CB is too messy and I have bigger
   games to make next.

   if it wins/becomes hugely popular? sure. but otherwise i frankly have no further strategic need

- Refactoring first: this codebase was actively driving me insane. Origami.

gameplay
- continuous mode i dropped somewhat erroneously in the final moments

accessibility
- Map WASD controls to virtual stick, support controllers
- Highlight dropped items in the field with #ff0 pyramids = rank
- lock on? would require re-balancing. the children yearn for certainty

graphics
- properly handling transparency - depth occlusion breaks it, needs multiple
  passes.
- Particle effects: ship thrusters, explosion effects
- Add VFX (chromatic abberation) to background stars

content
- Music
- ♾️
-->

### Community Contributions

TODO

<!--
1. W3C proposal for console append-only `%g` “live group” to make debugging loops in the browser easier (doesn’t exist!)
2. open deno proposal or PR for mangling props (doesn’t exist!)
3. MIT-license local agent harness, as previously mentioned
-->

## In Closing

TODO

<!-- try the game, follow on bluesky, apply to join discord, sponsor us so i can qualify for SNAP -->
