# js13k 2026

Latest engine size: 4.24 kB

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
- [x] get roadroller working again _(removed it for now, actually)_
- [x] Constantize Geometry Buffer walk

### Important follow-up features

- [x] audio/source: master bus - lowpass + compression
- [x] audio/musicLoop: rests
- [x] graphics: color-assignment

### Dependent on game type

- [ ] Instanced rendering (for voxels)
  - [x] Better handling of GPU buffers
  - [ ] `drawIndexed` will break `vertex_index`
- [ ] "Scene" JSX Projection + Store.
- [ ] Physics.

### Nice-to-have features

- [ ] audio/source: waveform builders; overtones, noise
- [ ] envelope primitive - modulate a value (audio/input) over a series of timed
      breakpoints
- [ ] "Clock" concept, for handling different timescales (render vs. audio,
      etc).

### DX

- [x] types + tests
- [x] Deno watch loop

### Later Compression Tricks

- [ ] jsx-ify template strings: shaders, css, scores - should make them
      minifiable and buy back kB at some threshold

- Restore roadroller - doesn't support certain apis like private fields and
  top-level await and isn't in active support, but a final swing if we need one.

- Add `ect` to the build stack. Saves a few extra bytes.

```
git clone --recursive https://github.com/fhanau/Efficient-Compression-Tool.git .output/ect
mkdir .output/ect/build && cd .output/etc/build
brew install cmake
cmake ../src
make
```

```
./.output/ect/build/ect -zip -9 ./.output/index.html.zip
```
