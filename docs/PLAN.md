# <mark>\[DRAFT\]</mark> DARKWHITE Postmortem: Post-competition plan

## Community Contributions

Given the difficulties I encountered in developing MISSION DARKWHITE, I have
begun thinking about how to improve ecosystem as a whole.

1. Something that irked me - there's no real good way to debug your game loop
   without writing something custom. Given the roll out of WebGPU, one would
   hope that the standards community is taking the game development use case
   more seriously. And maybe they are, but just... slowly.

   It's small, but I'm
   [proposing an improvement](https://github.com/whatwg/console/issues/255) to
   the [WHATWG console](https://whatwg.org/stages#process) that should make
   debugging _slightly_ better, `%t`:

```js
console.log("%tFailed to load map asset: %s", "Network Error", assetId);
// => [[Network Error]] Failed to load map asset: 123
```

Logs are expensive in the browser due to the IPC and UI calls they make, so
having a hook to short-circuit them by topic would ameliorate - but not
completely solve - the issue. Run this in your inspector to see for yourself:

```ts
(() => {
  const stringformattingstuff = (i) =>
    `Entity #${i}: x=${(Math.random() * 100).toFixed(2)}, y=${
      (Math.random() * 100).toFixed(2)
    }`;
  const thing = {};

  let now = performance.now();
  for (let i = 0; i < 1000; i++) {
    thing.ref = `[Telemetry] ${stringformattingstuff(i)}`;
  }
  const formattingTime = performance.now() - now;

  now = performance.now();
  for (let i = 0; i < 1000; i++) {
    console.log(`[Telemetry] ${stringformattingstuff(i)}`);
  }
  const logTime = performance.now() - now;

  console.clear();
  console.log({ formattingTime, logTime });
  // => formattingTime: ~<1ms, logTime: 10-20ms
  console.log(thing.ref);
})();
```

This solution is related in part to the
[2021 `console.context()` proposal](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/ContextualLoggingWithConsoleContext/explainer.md),
which died mainly because it added too much complexity to existing systems; `%t`
shouldn't.

Regardless, it's a small gesture. I plan to get in touch with my old boss to see
if he can't help me strategize further.

2. I found out that
   [`Deno.bundle`](https://docs.deno.com/runtime/reference/cli/bundle/) doesn't
   actually expose
   [property mangling](https://github.com/evanw/esbuild/issues/218), and I can
   find no record of it being attempted, so I'll be working on a (hopefully)
   small PR to expose that feature from esbuild.

## Director's Cut

I've thought a lot about this, and I'll do a Director's Cut only if MISSION
DARKWHITE somehow becomes noteworthy (so, no). The codebase is a (necessary)
mess and I would have to mostly rewrite it before proceeding.

Don't get me wrong, I like this game and wouldn't mind developing it further,
but currently have other priorities.

For posterity though, here's the priority list of what I'd change in rough
[impact/effort](https://www.projectmanager.com/blog/impact-effort-matrix/)
order:

### Minor Correctness Improvements

- Restore the "continuous" mode I accidentally cut in the final moments when
  replacing the `alert()` calls.
- Restructure the graphics pipeline to properly handle transparency and
  instancing. This means breaking up instance groups by size, depth, and
  material data.

### Accessibility

- Add in the visual cues that were top of the list of things I cut:
  - Visual indicator for when the player took damage. Could have simply reused
    the enemy code, in hindsight.
  - Highlighting dropped items. I'd wanted to have items pause and float in the
    player's plane for a moment, little arrows pointing to them based on the
    rank of the item (e.g. rank 2 = 2 arrows).
  - Bullet "glow" and illumination/shadow to make it extremely clear where in
    the world those bullets were relative to the enemies, with additional
    landmarks to boot.
- Map the WASD controls to a virtualized stick. This should make the ship
  steering even smoother and allow for controller support.
- Some sort of lock-on or auto-aim mechanism. This would make way for supporting
  coarser control setups, like trackpads or maybe mobile.

### Graphics

- Additional particle effects: ship thrusters, explosions.
- A bit of narrative color: I'd envisioned this sector of space to take place in
  a vast crystalline structure. I'd love to enhance the background to this
  effect.
- Glow effects. Not only nice to look at, would help distinguish various
  entities from one another further.

### Content

- I've actually been
  [writing music for ages](https://soundcloud.com/daniellacosse/piano-deconstruction)
  and was bummed I couldn't fit anything.
- ∞
