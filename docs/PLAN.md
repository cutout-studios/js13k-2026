# DARKWHITE: Post-JS13K Plan

<p align="center">
  <a href="./POSTMORTEM.md">Postmortem</a> |
  <a href="./WALKTHROUGH.md">Technical Walkthrough</a> |
  <b>Post-JS13K Plan</b>
</p>

---

## Community Contributions

The difficulties I hit developing MISSION DARKWHITE got me thinking about
improving the ecosystem as a whole.

1. Something that irked me - there's no good way to debug your game loop without
   writing something custom. Given the rollout of WebGPU, one would hope the
   standards community is taking the game development use case more seriously.
   And maybe they are, but slowly.

   It's small, but I've
   [proposed an improvement](https://github.com/whatwg/console/issues/255) to
   the [WHATWG](https://whatwg.org/stages#process) console that should make
   debugging _slightly_ better, `%t`:

```js
console.log("%tFailed to load map asset: %s", "Network Error", assetId);
// => [[Network Error]] Failed to load map asset: 123
```

Logs are expensive in the browser due to the IPC and UI calls they make, so
having a hook to short-circuit them by topic would assist this use case.

<details>

<summary><b>[As proof, run this in your inspector]</b></summary>

```ts
(() => {
  const formatting = (i) =>
    `Entity #${i}: x=${(Math.random() * 100).toFixed(2)}, y=${
      (Math.random() * 100).toFixed(2)
    }`;
  const thing = {};

  let now = performance.now();
  for (let i = 0; i < 1000; i++) {
    thing.ref = `[Telemetry] ${formatting(i)}`;
  }
  const formattingTime = performance.now() - now;

  now = performance.now();
  for (let i = 0; i < 1000; i++) {
    console.log(`[Telemetry] ${formatting(i)}`);
  }
  const logTime = performance.now() - now;

  console.clear();
  console.log({ formattingTime, logTime });
  // => formattingTime: ~<1ms, logTime: 10-20ms
  console.log(thing.ref);
})();
```

</details>
<br />

This idea is related to the
[2021 `console.context()` proposal](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/ContextualLoggingWithConsoleContext/explainer.md),
which died because it added too much complexity to existing systems; `%t`
shouldn't.

2. I found out that
   [`Deno.bundle`](https://docs.deno.com/runtime/reference/cli/bundle/) doesn't
   expose [property mangling](https://github.com/evanw/esbuild/issues/218), and
   I can find no record of it being attempted, so I'll be working on a
   ([hopefully](https://github.com/denoland/deno/issues/36978)) small PR to expose that feature from esbuild.
## Director's Cut

I've thought about this, and I'll do a Director's Cut only if MISSION DARKWHITE
somehow becomes noteworthy (so, no). The codebase is a (necessary) mess and I
would have to mostly rewrite it before proceeding.

Don't get me wrong, I like this game and wouldn't mind developing it further,
but currently have other priorities.

For posterity, a priority list of what I'd change in rough
[impact/effort](https://www.projectmanager.com/blog/impact-effort-matrix/)
order:

### Minor Correctness Improvements

- Fix full-screen glitching, full inventory and audio overload bugs.
- Restore the "continuous" mode I accidentally cut in the final moments when
  replacing the `alert()` calls.
- Restructure the graphics pipeline to handle transparency and instancing. This
  means breaking up instance groups by size, depth, and material data.

### Accessibility

- Add the visual cues that were top of list before I ran out of space:
  - Indicator for when the player took damage. Could have reused the enemy code,
    in hindsight.
  - Highlighting dropped items. I'd wanted to have items pause and float in the
    player's plane for a moment, little arrows pointing to them based on the
    rank of the item (e.g. rank 2 = 2 arrows).
  - Bullet "glow" and illumination/shadow to make distinct in the world where
    bullets were relative to enemies
  - Landmarks of some form to further orient the player.
- Map the WASD controls to a virtualized stick. This would make the ship
  steering even smoother and allow for controller support.
- Some lock-on or auto-aim mechanism. This allow for coarser control setups,
  like trackpads or even mobile.

### Graphics

- Additional particle effects: ship thrusters, explosions.
- Narrative color: I'd envisioned this sector of space to take place in a vast
  crystalline structure. I'd love to enhance the background to this effect.
  Maybe a short story intro as well.

### Content

- I've been
  [writing music for ages](https://soundcloud.com/daniellacosse/unfinished-demo-ill-be)
  and was bummed I couldn't fit anything.
- ∞

---

<p align="center">
  <a href="./POSTMORTEM.md">Postmortem</a> |
  <a href="./WALKTHROUGH.md">Technical Walkthrough</a> |
  <b>Post-JS13K Plan</b>
</p>
