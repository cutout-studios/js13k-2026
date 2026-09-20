# <mark>\[WIP\]</mark> Retrospective

- [Personal Context](#personal-context)
- [Overall Process](#overall-process)
- [Regrets](#regrets)
  - [Regret #1](#1-taking-on-a-bit-more-than-my-current-body-could-handle)
  - [Regret #2](#2-not-writing-more-devtools-more-sooner)
  - [Regret #3](#3-deciding-against-an-event-driven-architecture)
  - [Honorable Mention](#honorable-mention-committing-to-limited-platform-support)
- [Synthesis](#synthesis)
  - [JS13k first-timer lessons](#js13k-first-timer-lessons)
  - [`mk_code_sml`](#mk_code_sml)
  - [3D Rotation Bestiary](#3d-rotation-bestiary)
- [What's Next?](#whats-next)
  - [Director's Cut](#directors-cut)
  - [Community Contributions](#community-contributions)
- [In Closing](#in-closing)

### Personal Context

<details>

<summary>
I include this mainly as a <mark><b>"if you're like me, this will be maximally useful to
you"</b></mark> - it's relatively brief.
</summary>

- After obtaining a
  [particularly inscrutable degree in college](https://www.youtube.com/watch?v=2VYRjHPmZdQ)
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
  > **shift from "replayability" to "immediate gratification" (the former is kinda where i lean)**
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
fooled - <mark><b>JS13k is just as much about energy and time management as it
is byte management.</b></mark>

### 2. **Not writing more devtools more sooner.**

I admittedly over-focused on the things that were relatively new to me - the 3D
programming and the golfing.

It is difficult, though, to justify tests or tools for things you're not even
sure you can fit. This led to a lot of "running ahead" with imperfect logic to
get a rough idea of how much code it would be or compress to. <mark><b>I also
found that one line of sketch code ultimately averaged to ~5 bytes in the
bundle,</b></mark> but YMMV (the final ratio was 1 line:3 bytes).

I also didn't realize how painful debugging that same "sketch logic" would be.
Logging from the game loop crashes Safari, and debugging is too tedious. Do we
really need a separate widget to confirm our games work? A previous boss of mine
[worked with internet standards bodies](https://datatracker.ietf.org/doc/rfc9460/) -
unless I'm missing something, it's so bad I am in fact planning on
[proposing a `console.log` extension](#community-contributions) of my own.

Overall JS13K kinda forces you to choose small software over your own developer
experience and I <mark><b>got stuck a bit too long in the mindset that I
couldn't have ANYTHING nice</b></mark>, to my detriment.

When I did break that mentality, the lion's share of my total LLM use was in
service of [spitting out crappy devtools](./devtools/) to make it easier to work
with my custom formats in the final days. At time of writing they're decent at
that, pretty much everything else was hit or miss.

### 3. **Deciding against an event-driven architecture.**

This is minor, but I initially ruled out an
[event-driven architecture](https://en.wikipedia.org/wiki/Event-driven_architecture)
for fear that it would be too heavy. But, as I slowly eroded the quality of my
codebase to shave bytes, I began to realize that such a structure would have
likely been more resistant to tangling,
[easier to debug](https://github.com/whatwg/console/issues/255), and similar in
terms of byteweight. I'd recommend this to anyone attempting JS13K now.

That said, in my own work I will likely continue to
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

<!-- TODO: I did just think of a single-click model. Ah, well. -->

## Synthesis

### JS13k first-timer lessons

1. I came into JS13K thinking "hell yeah, I can proceduralize whatever I want" -
   <mark><b>The one thing you <em>can't</em> proceduralize is explaining your
   game.</b></mark>

This makes innovation particularly tricky in this format - per
[Jakob's Law](https://lawsofux.com/jakobs-law/):

> Users spend most of their time on other \[games\]. This means that users
> prefer your \[game\] to work the same way as all the other \[games\] they
> already know.

Anything novel incurs "explanation debt" - debt you cannot proceduralize away.

I'd now recommend the following exercise to my past self: embrace
"[documentation driven development](https://gist.github.com/zsup/9434452)" here.
Write out the entire design of your game in **full detail** to the degree that
someone else can completely visualize your intent by reading it, and reserve
space for that text in your bundle until it's time to tutorialize. Leaving the
buffer to fully explain your game will ensure that you always can, and if you
need to cut something, you can cut it from your explanation as well.

2. At time of writing, the JS13K frame allows only the following browser APIs:

```
accelerometer
autoplay
camera
display-capture
fullscreen
gamepad
geolocation
gyroscope
magnetometer
microphone
midi
picture-in-picture
usb
web-share
xr-spatial-tracking
```

Meaning, I had to scramble to cut enough to replace a couple `alert()` calls I'd
used to save space at the last minute. I'd hesitated uploading an early draft to
the JS13K platform for fear of accidentally submitting, but now having used the
site I understand that wouldn't have been possible.

Do yourself a favor and develop your game _inside_ a frame that
[`allow`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement/allow)s
the features that the JS13K platform is okay with.

3. <mark><b>You can push updates to your project description at any time
   throughout the review period.</b></mark> - Director's Cut is not your only
   recourse for catching issues - consider
   [syncing your description to feedback](https://github.com/js13kGames/mission-darkwhite/pull/3)
   as it comes in so each players' experience is better than the last!

4. Lastly, I'm a bit embarrassed to admit, but for some selfish reason I
   initially thought that, once I'd finally submitted I was done. My exhaustion
   was partially to blame - but! _During_ the review period you _definitely_
   need to _pay it forward_. The JS13K platform is specifically designed to push
   you to leave feedback on the games of those who have left feedback on yours,
   and that was not clear to me until I'd actually received my first feedback.

### 3D Rotation Bestiary

The most intimidating aspect of 3D programming that held me back for so many
years was rotations, and after all this, admittedly I still don't feel like I
fully understand them.

To get the player's ship to both roll and aim in the way that it currently does
I had to maintain a separate "roll" parameter, and I'm not entirely sure I get
why, but...

My sense is that it's akin to same deal that limits the most naïve rotation
approach: **Euler Angles**.

When you represent a rotation as three separate rotations around the X, Y, and Z
axes - each of these rotations removes a degree of freedom from the system.

This is because when you rotate your model around the X-axis, you inadvertently
rotate Y -into- Z, dampening that option for yourself. And again each time you
rotate that coordinate system.

This is why **Quaternions** exist - they effectively add an extra, "fake" fourth
degree-of-freedom-buffer that ensures you never run out. However, they are
impossible to visualize. The best I can picture in my mind is like, a shadow on
the wall in Plato's cave of the cube being rotated. This isn't really accurate
though.

In fact, that visualization is more akin to the **Rodrigues Matrix**, which, I
learned, is basically necessary no matter what rotation representation you
expose to the developer. Rodrigues' rotation formula works by
[decomposing the rotation down to its 2D elements](https://github.com/cutout-studios/js13k-2026/blob/main/libraries/3D/coordinates.ts#L24-L39) -
its "shadows". Quaternions are more performant, sure, but they really only shine
if you have hundreds of IKs to collapse, because they need to be
"Rodriguezified" before the final draw regardless.

Because of this, I've come to find <mark><b>the "axis-angle" representation the
more natural interface</mark></b>. In axis-angle, you define the XYZ components
of the rotation axis (like the earth's!) and then the angle of how much around
that axis you're rotating.

Come to think of it, each "Euler Angle" is an axis-angle rotation, one around
each of the X, Y and Z axes. Which means - while a single axis-angle rotation is
not at risk of lock like the three cumulative "Euler Angles" are, multiple
axis-angle rotations I believe still can be.

This comes back to the player ship. I had one axis-angle rotation for aiming,
another for the ship roll - but no more. Mostly safe.

This brings me to the final rotation representation I didn't really get to
explore: if you can compose multiple Quaternions with out risk of lock, is there
a similar such representation that conceptually follows from Axis-Angle? The
answer is yes - they're called **Rotors**.

[Rotors are sort of underrated in game development.](https://marctenbosch.com/quaternions/)
Like Axis-Angle, with a Rotor you're representing the 2D cross-section you're
rotating your object within (that the axis in your Axis-Angle is simply normal
to). The main difference is that a Rotor is stored as three shadows (called a
"bivector") - the shadows that cross-section would make were a light to shine on
it from each of the X, Y and Z directions.

Because Rotors are represented this way, they don't collapse. You combine them
by composing these "shadows", which runs no risk of rotating one axis into
another. Better yet, they're just as cheap as Quaternions computationally.

So why don't we use Rotors everywhere? Unclear. I think it just got there first.

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

I've thought a lot about this, and I'll do a Director's Cut only if MISSION
DARKWHITE somehow becomes noteworthy (so, no). The codebase is a (necessary)
mess and I would have to mostly rewrite it before proceeding.

Don't get me wrong, I like this game and wouldn't mind developing it further,
but currently I believe there to be more
[strategic use of my time](#community-contributions).

For posterity though, here's the priority list of what I'd change in rough
[impact/effort](https://www.projectmanager.com/blog/impact-effort-matrix/)
order:

#### Minor Correctness Improvements

- Restore the "continuous" mode I accidentally cut in the final moments when
  replacing the `alert()` calls.
- Restructure the graphics pipeline to properly handle transparency and
  instancing. This means breaking up instance groups by size, depth, and
  material data.

#### Accessibility

- Highlight dropped items. I'd planned this from the beginning and it was at the
  top of the list of things that I cut.
- Map the WASD controls to a virtualized stick. This should make the ship
  steering even smoother and allow for controller support.
- Some sort of lock-on or auto-aim mechanism. This would make way for supporting
  coarser control setups, like trackpads or maybe mobile.
  <!-- TODO: and/or background items, and/or single-click model -->

#### Graphics

- Additional particle effects: ship thrusters, explosions.
- A bit of narrative color: I'd envisioned this sector of space to take place in
  a vast crystalline structure. I'd love to enhance the background to this
  effect.

#### Content

- I've actually been
  [writing music for ages](https://soundcloud.com/daniellacosse/piano-deconstruction)
  and was bummed I couldn't fit anything.
- ∞

### Community Contributions

Given the difficulties I encountered in developing MISSION DARKWHITE, I have
begun a couple contributions in pursuit of improving the ecosystem as a whole:

1. I'm [proposing an improvement](https://github.com/whatwg/console/issues/255)
   to the [WHATWG console](https://whatwg.org/stages#process), `%t`:

```js
console.log("%tFailed to load map asset: %s", "Network Error", assetId);
// => [[Network Error]] Failed to load map asset: 123
```

It's an alternative to `console.context()`. That was a
[2021 WHATWG proposal](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/ContextualLoggingWithConsoleContext/explainer.md)
for dynamic, grouped logging, something that would be critical for tracking
multiple complex states across a game loop (without having to write a widget of
some sort). It died mainly because it added too much complexity to existing
systems, but `%t` preserves `console.log`s append-only nature.

2. MISSION DARKWHITE's [bundling pipeline](./scripts/bundle.tsx) is written in
   [Deno](https://deno.com).
   [`Deno.bundle`](https://docs.deno.com/runtime/reference/cli/bundle/) doesn't
   actually expose
   [property mangling](https://github.com/evanw/esbuild/issues/218), and I can
   find no record of it being attempted, so I'm working on a
   [small PR here](https://github.com/denoland/deno/blob/main/ext/bundle/bundle.ts)
   to expose that feature.

## In Closing

If you made it to the end, thank you very much for reading and I hope you
learned something!

You should certainly at least try
[`MISSION: DARKWHITE`](https://js13kgames.com/games/mission-darkwhite) if you
haven't already.

If you'd like to support future endeavors, I encourage you do any of the
following:

1. [Follow on Bluesky](https://bsky.app/profile/cutoutstudios.com), though I'm
   unclear what form this social media approach will ultimately take. Just
   starting out here.
2. [Apply to join our small Discord!](https://discord.gg/DW5pyrjsYm) It's easy,
   just a bot-prevention measure. Would love to have you - we have weekly
   progress check-ins.
3. [Sponsoring the GitHub](https://github.com/sponsors/cutout-studios) would
   genuinely help me
   [qualify for food stamps](https://www.fna.usda.gov/snap/work-requirements) so
   I can keep doing these sorts of things 😭

Thanks again, and until next time! ✌️

- Daniel
