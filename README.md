# js13k 2026

Latest size: 4.9 kB

```
deno task setup
deno task bundle
deno task open
```

---

## TODOs

### Basics

- [x] Research the parts of the basic WebGPU API I don't remember.
- [x] Render function.
- [x] Basic Geometery builder.
- [x] UI layer
- [x] Audio
  - [x] Music
  - [x] Directional
- [x] Camera + controls.

### Cleanup

- [ ] canvas + dom:
  - [ ] apply canvas resize dynamically, avoiding aspect ratio distortion
  - [ ] single-element dom projection, I think. remove spurious code there.
- [ ] camera update function
- [ ] clean up xyz/xzyw distinction. which is when? xyzw is probably
      transform-only
- [ ] fix reversed `compose` order?
- [ ] things I don't quite understand yet and should spell out better in code
  - [ ] why 'invert' needs be 'clamped' to the inner 3x3
  - [ ] how the perspective transform works
- [ ] get roadroller working again

### Important follow-up features

- [ ] audio/source: master bus
- [ ] audio/musicLoop: rests
- [ ] graphics: color-assigment (faces, probably)

### Nice-to-have features

- [ ] audio/source: waveform builders; overtones, noise
- [ ] envelope primitive - modulate a value (audio/input) over a series of timed
      breakpoints

### Dependent on game type

- [ ] Instanced rendering (for voxels)
- [ ] "Scene" JSX Projection + Store.
- [ ] Physics.

### DX

- [x] types + tests
- [ ] Deno watch loop

### Later Compression Tricks

- [ ] Explore `ect` as final compressor - likely a bit better, but have to
      manually compile the package
- [ ] jsx-ify template strings: shaders, css, scores - should make them
      minifiable and buy back kB at some threshold
