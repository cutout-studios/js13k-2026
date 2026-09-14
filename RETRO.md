# Retrospective \[TODO\]

> [!WARNING]
> The following is currently a collection of raw notes, will turn into prose
> when I have time.

## disclaimers:

- dev with ~12y exp. and a game design degree, but this is my first game build
  and I learned a TON.
- I believe AI is okay in very narrow circumstances that weren't possible
  before. I used it to learn the ropes of 3D programming specifically in the
  novel area of WebGPU+size-coding. Also last-minute devtools and fighting
  through my own tech debt at the end :/. (see
  [wip policy](https://github.com/cutout-studios/.github/blob/main/profile/LLM_USE.md))

## largest bottlenecks (_not_ directly the size!)

1. my own energy
2. ‘running ahead’ - intentionally coding imperfect logic to see if things fit,
   then going back to fix it - and debugging game loops in the browser is super
   annoying
3. Degredation of the CB at the end. didn't have time to reorg as i realized how
   thing shoulda been set up so i was just... in pain the whole final week

## categories of techniques i noticed

1. “code golfing” - tuples+property mangling, inlining things (…intentional
   spaghetti code 😭), dirty JS tricks
2. Imperfect Abstractions - “forced” DRYness and messy side effects in pursuit
   of forcing consistency (doTimes)
3. actually concise systems - 3D lathe + concat, quantization and data tables
   (TBI)

> [!WARNING]
> WebGPU can crash!!

## Regrets

- not going event driven... I thought it'd save space but in retrospect idk, and
  things woulda been a bit easier

## post competition action items

1. I still don’t fully understand rotation lmao but maybe i don’t have to
2. open deno proposal or PR for mangling props (doesn’t exist!)
3. W3C proposal for console append-only “live group” to make debugging loops in
   the browser easier (doesn’t exist!)
4. maybe directors cut - but probably not. CB is too messy and I have bigger
   games to make next. maybe if like there's a bug or two I missed, i didn't
   have time to play the game exhaustively

## other things I'd do next:

- Major refactoring, this codebase was actively driving me insane.
- properly handling transparency - depth occlusion breaks it, needs multiple
  passes.
- Particle effects: ship thrusters, explosion effects
- Highlight dropped items in the field with #ff0 pyramids = rank
- Map WASD controls to virtual stick, support controllers
- Add VFX (chromatic abberation) to background stars
- Music

[sponsorship link](https://github.com/sponsors/cutout-studios)
