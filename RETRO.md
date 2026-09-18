# <mark>\[WIP\]</mark> Retrospective, `MISSION: DARKWHITE`

<details>
<summary>

### Table of Contents

</summary>

- [Personal Context](#personal-context)
- [Process](#process)
- [Regrets](#regrets)
  - [Regret #1](#1-taking-on-a-bit-more-than-my-current-body-could-handle)
  - [Regret #2](#2-not-writing-more-devtools-more-sooner)
  - [Regret #3](#3-deciding-against-an-event-driven-architecture)
  - [Honorary Mention](#honorary-mention-sticking-to-the-mouse)
- [Synthesis](#synthesis)
  - [`mk_code_sml`](#mk_code_sml)
  - [3D Rotation Bestiary](#3d-rotation-bestiary)
- [What's Next?](#whats-next)
  - [Director's Cut](#directors-cut)
  - [Community Contributions](#community-contributions)
- [In Closing](#in-closing)

</details>

## Personal Context

I include this mainly as a "if you're like me, this will be maximally useful to
you" - I'll keep it brief:

- After obtaining a
  [particularly inscrutible degree in college](https://www.youtube.com/watch?v=2VYRjHPmZdQ)
  I got caught up in the "learn to code" movement and chose it as my preferred
  survival method. ~12 years of experience, now, depending how you count it.
- Having a game design minor, I'd focused mostly on board games until now. For a
  few years before COVID I ran a
  [design workshop](https://metromage.games/2020/03/29/build-a-game-in-under-2-hours-no-really/).
- All LLM use was in accordance with my
  [current policy](https://github.com/cutout-studios/.github/blob/main/profile/LLM_USE.md),
  though I currently don't have a means of collecting logs so it's a bit of a
  "trust me, bro" situation. My next project is to develop a
  [local harness](https://github.com/cutout-studios/toolbox/tree/main/experimental/agent)
  that solves this problem.
- My goals this year were simple: learn to build a 3D web game as concisely as
  possible and get to know the community a little bit.

## Process

TODO

<!--
> i spent a few days learning 3D b4 the competition
> similar to workshop
  > initial brainstorming/ideation (pictures)
  > paper prototype - 'it's fun'
> things mostly came together at the last moment (ai sprint)
> final hours
-->

## Regrets

### 1. **Taking on a bit more than my current body could handle.**

TODO

<!--
> my own energy
> Degredation of the CB at the end. didn't have time to reorg as i realized how
   thing shoulda been set up so i was just... in pain the whole final week
-->

### 2. **Not writing more devtools more sooner.**

TODO

<!--
‘running ahead’ - intentionally coding imperfect logic to see if things fit,
   then going back to fix it - and debugging game loops in the browser is super
   annoying
> [!WARNING]
> WebGPU can crash!!
> not having a headless environment, or tests
-->

### 3. **Deciding against an event-driven architecture.**

TODO

<!--
- not going event driven... I thought it'd save space but in retrospect idk, and
  things woulda been a bit easier (incl. debugging)

- however going forward i might acutally want to stick to a heavy gameloop (see: JSX), so...
-->

### Honorary Mention: **Sticking to the mouse.**

TODO

## Synthesis

### `mk_code_sml`

There are two layers to making your code small, and JS13k forces you to be
intimately familiar with each:

- `minification` (...)
- `compression` (...)

TODO

<!--
> Two layers - minification (e.g. intra-code) and compression (inter-code). which are you targeting?
> Pipeline
> ideal: actually concise systems - 3D lathe + concat, quantization and data tables
   (TBI)
> Imperfect Abstractions - “forced” DRYness and messy side effects in pursuit
   of forcing consistency (doTimes)
> “code golfing” - tuples+property mangling, inlining things (…intentional
   spaghetti code 😭), dirty JS tricks
-->

### 3D Rotation Bestiary

TODO

<!--
- Euler Angles and Gimbal Lock
- Quaternions
- Rodriguez Matrix
- Rotors, Axis-angle
-->

## What's Next?

### Director's Cut

TODO

<!--
 maybe directors cut - but probably not. CB is too messy and I have bigger
   games to make next. maybe if like there's a bug or two I missed, i didn't
   have time to play the game exhaustively
- Major refactoring, this codebase was actively driving me insane. Origami.

accessibility
- Map WASD controls to virtual stick, support controllers
- Highlight dropped items in the field with #ff0 pyramids = rank

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
3. MIT-license local agent harness
-->

## In Closing

TODO

<!-- try the game, follow on bluesky, apply to join discord, sponsor us so i can qualify for SNAP -->
