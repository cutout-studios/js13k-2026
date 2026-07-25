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

### Important follow-up features

- [ ] audio/source: master bus
- [ ] audio/musicLoop: rests
- [ ] graphics: color-assigned verticies

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

### Compression Tricks

- [ ] Explore `ect` as final compressor - likely a bit better, but have to
      manually compile the package
- [ ] jsx-ify template strings: shaders, css, scores - should make them
      minifiable and buy back kB at some threshold
- [ ] Make jsx/dom a bit more concise
