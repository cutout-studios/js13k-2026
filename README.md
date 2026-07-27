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

#### Graphics

- [x] things I don't quite understand yet and should spell out better in code
  - [x] why 'invert' needs be 'clamped' to the inner 3x3
  - [x] how the perspective transform works
- [x] rigid transforms are 3x4; projections are 4x4. xyzw is
      projection/rendertime-only.
- [x] rename `compose` to something else? pipe, concat, sequence?
- [x] clean up cameraUpdate function

#### Misc.

- [x] canvas + dom:
  - [x] apply canvas resize dynamically, avoiding aspect ratio distortion on
        resize
  - [x] single-element dom projection, I think. remove spurious code there.

- [ ] get roadroller working again

### Important follow-up features

- [x] audio/source: master bus - lowpass + compression
- [ ] audio/musicLoop: rests
- [ ] graphics: color-assignment (faces, probably)

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
