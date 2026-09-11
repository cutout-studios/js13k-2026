# Retrospective \[TODO\]

> [!WARNING]
> The following is currently a collection of raw notes, will turn into prose
> when I have time.

## disclaimers:

- former senior google dev (which i say only to establish baseline credibility)
  with a game design degree, but this is my first game build and I learned a
  TON.
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

## post competition action items

1. I still don’t fully understand rotation lmao but maybe i don’t have to
2. open deno proposal or PR for mangling props (doesn’t exist!)
3. W3C proposal for console append-only “live group” to make debugging loops in
   the browser easier (doesn’t exist!)
4. maybe directors cut - would want to keep it very close to size limit still

[sponsorship link](https://github.com/sponsors/cutout-studios)
