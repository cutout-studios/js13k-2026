# TODOs

- Fill stubbed audio (~1kB)
- Fill stubbed behaviors (~1kB)
- Fix portrait

## Likely to land in a "director's cut", if any

### Aesthetics

- Add thrusters: main + direction-based, explosion effects
- Add FX (chromatic abberation) to background stars, nebula.
- Music
- More expressive spin-counter animation: directional, over-spin

### Gameplay

- Map WASD controls to virtual stick, support controllers

### UX

- Short wiki explaining how the game works (external link to this repo)

## Misc. Compression Ideas - considered but probably not worth it

- Remove destructuring in favor of repeated individual index access
- Quantize all values (out of 256)... then...
  - **Convert all game data (e.g. content definitions) into CSVs.** Then write a
    small compiler that bitepacks each CSV by column into an ASCII string.
- Audio 'connect' and GPU enum aliai
- "winding" or "gray" iterator that goes xx, xy, yy, yx
