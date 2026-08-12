# Possible TODOs

Some things that may need to get done, depending on the game.

## Dependent on game type

- [ ] Instanced rendering (for voxels/particle effects)
  - NOTE: `drawIndexed` will break `vertex_index`
- [ ] "Scene" JSX Projection + Store.
- [ ] Physics.

## Nice-to-have features

- [ ] audio/source: waveform builders; overtones, noise
- [ ] envelope primitive - modulate a value (audio/input) over a series of timed
      breakpoints
- [ ] support different clock timescales

## Later Compression Tricks

- alias file for repeated browser API calls
- Restore roadroller - doesn't support certain apis like private fields and
  top-level await and isn't in active support, but a final swing if we need one.
- Add `ect` to the build stack. Saves a few extra bytes:

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
